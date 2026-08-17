from flask import Flask, request, jsonify
import cv2
import numpy as np
from deepface import DeepFace
import sys
import os
import base64
import json

# ======================
# IMPORT SILENT FACE REPO
# ======================
sys.path.append("./SilentFaceAntiSpoofing")
from SilentFaceAntiSpoofing.src.anti_spoof_predict import AntiSpoofPredict
from SilentFaceAntiSpoofing.src.generate_patches import CropImage
from SilentFaceAntiSpoofing.src.utility import parse_model_name

app = Flask(__name__)

# ======================
# DEVICE / MODEL INIT
# ======================
model = AntiSpoofPredict(device_id=0)
image_cropper = CropImage()
MODEL_DIR = "./SilentFaceAntiSpoofing/resources/anti_spoof_models"

# ======================
# COSINE SIMILARITY
# ======================
def cosine(a, b):
    a = np.array(a)
    b = np.array(b)
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-8)

# ======================
# DRAW FACE BOX + ENCODE IMAGE
# ======================
def draw_face_box(img, label="FACE", color=(0, 255, 0)):
    bbox = model.get_bbox(img)
    if bbox is None:
        return None
    x, y, w, h = bbox
    cv2.rectangle(img, (x, y), (x + w, y + h), color, 3)
    cv2.putText(img, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    _, buffer = cv2.imencode(".jpg", img)
    return base64.b64encode(buffer).decode("utf-8")

# ======================
# FACE DETECTION & CROP
# ======================
def extract_face(img):
    bbox = model.get_bbox(img)
    if bbox is None:
        print("❌ No face detected")
        return None
    x, y, w, h = bbox
    pad = 10
    return img[max(0, y - pad):y + h + pad, max(0, x - pad):x + w + pad]

# ======================
# EMBEDDING (DeepFace)
# ======================
def get_embedding(img):
    result = DeepFace.represent(
        img_path=img,
        model_name="Facenet",
        detector_backend="opencv",
        enforce_detection=False
    )
    return result[0]["embedding"]

# ======================
# AI SPOOF SCORE
# ======================
def ai_spoof_score(img):
    try:
        if model is None:
            return 0.5
        bbox = model.get_bbox(img)
        if bbox is None:
            return 0.0
        prediction = np.zeros((1, 3))
        for model_name in os.listdir(MODEL_DIR):
            h_input, w_input, model_type, scale = parse_model_name(model_name)
            param = {"org_img": img, "bbox": bbox, "scale": scale, "out_w": w_input, "out_h": h_input, "crop": True}
            if scale is None:
                param["crop"] = False
            cropped = image_cropper.crop(**param)
            prediction += model.predict(cropped, os.path.join(MODEL_DIR, model_name))
        label = np.argmax(prediction)
        score = prediction[0][label]
        return float(score) if label == 1 else float(score) * -1
    except Exception as e:
        print("spoof error:", e)
        return 0.0

# ======================
# LIVENESS ENGINE
# ======================
def liveness(img):
    spoof = ai_spoof_score(img)
    if spoof < 0:
        return False, f"spoof ({spoof:.2f})", spoof
    return True, "live", spoof

# ======================
# RECOGNITION
# ======================
def recognize(vector, img):
    emb = get_embedding(img)
    score = cosine(emb, vector)
    best_name = "unknown"
    best_score = score
    return best_name, best_score

# ======================
# PROCESS PIPELINE
# ======================
def process(img, vector, need_match=False):
    ok, reason, spoof_score = liveness(img)

    if not ok:
        boxed_image = draw_face_box(img.copy(), "SPOOF", (0, 0, 255))
        return {"success": False, "type": "spoof", "message": reason, "score": float(spoof_score), "image": boxed_image}

    if not need_match:
        boxed_image = draw_face_box(img.copy(), "LIVE", (0, 255, 0))
        return {"success": True, "type": "live", "score": float(spoof_score), "image": boxed_image}

    name, match_score = recognize(vector, img)
    if match_score > 0.75:
        boxed_image = draw_face_box(img.copy(), f"{name} ({match_score:.2f})", (0, 255, 0))
        return {"success": True, "type": "verified",  "message": "Face verification completed", "score": float(match_score), "image": boxed_image}

    boxed_image = draw_face_box(img.copy(), "UNKNOWN", (0, 165, 255))
    return {"success": False, "type": "unknown", "message": "Face not recognized", "score": float(match_score), "image": boxed_image}

# ======================
# VERIFY ENDPOINT
# ======================
@app.route("/verify", methods=["POST"])
def verify():
    try:
        # Parse vector JSON string into numpy array
        vector_str = request.form["vectorFaceUserDatabase"]
        vector = np.array(json.loads(vector_str), dtype=np.float32)

        file = request.files["image"]
        img_array = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"success": False, "error": "Invalid image"})

        return jsonify(process(img, vector, need_match=True))
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# ======================
# REGISTER ENDPOINT
# ======================
@app.route("/register", methods=["POST"])
def register():
    try:
        file = request.files["image"]
        img_array = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({"success": False, "error": "Invalid image"})

        ok, reason, _ = liveness(img)
        if not ok:
            return jsonify({"success": False, "message": f"Rejected spoof: {reason}"})

        embedding = get_embedding(img)
        boxed_image = draw_face_box(img.copy(), "REGISTERED", (255, 0, 0))
        return jsonify({"success": True, "embedding": embedding, "image": boxed_image})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

# ======================
# RUN SERVER
# ======================
if __name__ == "__main__":
    app.run(port=8000, debug=True)
import dotenv from "dotenv";
import axios from "axios";
import multer from "multer";
import fs from "fs";
import path from "path";
import FormData from "form-data";
import sharp from "sharp";
import jwt from "jsonwebtoken";
import {
    randomUUID
} from "crypto";
import VectorFace from "../../models/vector_face.model.js";

dotenv.config();

const URL_PYTHON_SERVER = process.env.URL_PYTHON_SERVER
export const registerFaceRecognition = async (req, res) => {
    try {
        // ======================
        // VALIDATION
        // ======================
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image required",
            });
        }

        console.log("Request Body:", req.body);

        const user_id = req.body.userId;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user_id required",
            });
        }

        // ======================
        // SEND IMAGE TO AI SERVER
        // ======================
        const formData = new FormData();

        formData.append(
            "image",
            fs.createReadStream(req.file.path)
        );

        const response = await axios.post(
            `${URL_PYTHON_SERVER}/register`,
            formData, {
                headers: formData.getHeaders(),
            }
        );

        const embedding = response?.data?.embedding;

        if (!embedding) {
            throw new Error(
                "Embedding not returned from AI server"
            );
        }

        // ======================
        // SAVE IMAGE
        // ======================
        const year = String(
            new Date().getFullYear()
        );

        const month = String(
            new Date().getMonth() + 1
        ).padStart(2, "0");

        const resultDir = path.join(
            process.cwd(),
            "private",
            "face_register",
            year,
            month
        );

        if (!fs.existsSync(resultDir)) {
            fs.mkdirSync(resultDir, {
                recursive: true,
            });
        }

        const filename = `${randomUUID()}.png`;

        const filepath = path.join(
            resultDir,
            filename
        );

        // convert image ke png dan simpan
        await sharp(req.file.path)
            .png()
            .toFile(filepath);

        const imageUrl =
            `/private/face_register/${year}/${month}/${filename}`;

        // ======================
        // SAVE VECTOR TO DATABASE
        // ======================
        const result = await VectorFace.create({
            user_id,
            vector: embedding,
            image: imageUrl,
        });

        // ======================
        // REMOVE TEMP FILE
        // ======================
        if (
            req.file &&
            fs.existsSync(req.file.path)
        ) {
            fs.unlinkSync(req.file.path);
        }

        // ======================
        // SUCCESS RESPONSE
        // ======================
        return res.status(201).json({
            success: true,
            message: "Face registered successfully",
        });
    } catch (err) {
        console.error(
            "Register Error:",
            err.response?.data || err.message
        );

        return res.status(500).json({
            success: false,
            message: err.response?.data?.message ||
                err.message ||
                "Internal server error",
        });
    } finally {
        // cleanup temp upload
        if (
            req.file &&
            fs.existsSync(req.file.path)
        ) {
            fs.unlinkSync(req.file.path);
        }
    }
};

export const verifyFaceRecognition = async (req, res) => {
    try {
        // ======================
        // VALIDATION
        // ======================
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image required",
            });
        }

        const user_id = req.body.userId;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "user_id required",
            });
        }
        // ======================
        // GET USER VECTOR
        // ======================
        const user = await VectorFace.findOne({
            where: {
                user_id,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User vector not found",
            });
        }

        // ======================
        // SEND TO AI SERVER
        // ======================
        const formData = new FormData();

        formData.append("user_id", user_id);

        formData.append(
            "image",
            fs.createReadStream(req.file.path)
        );

        formData.append(
            "vectorFaceUserDatabase",
            JSON.stringify(user.vector)
        );

        const aiResponse = await axios.post(
            `${URL_PYTHON_SERVER}/verify`,
            formData, {
                headers: formData.getHeaders(),
                timeout: 30000,
            }
        );

        // ======================
        // REMOVE TEMP FILE
        // ======================
        if (
            req.file &&
            fs.existsSync(req.file.path)
        ) {
            fs.unlinkSync(req.file.path);
        }

        const imageBase64 =
            aiResponse.data?.image;

        let imageUrl = null;

        // ======================
        // SAVE RESULT IMAGE
        // ======================
        if (imageBase64) {
            const year = String(
                new Date().getFullYear()
            );

            const month = String(
                new Date().getMonth() + 1
            ).padStart(2, "0");

            const resultDir = path.join(
                process.cwd(),
                "private",
                "face_recognition",
                year,
                month
            );

            // create folder if not exists
            if (!fs.existsSync(resultDir)) {
                fs.mkdirSync(resultDir, {
                    recursive: true,
                });
            }

            const filename = `${randomUUID()}.png`;

            const filepath = path.join(
                resultDir,
                filename
            );

            // save image
            await sharp(
                    Buffer.from(
                        imageBase64,
                        "base64"
                    )
                )
                .png()
                .toFile(filepath);

            imageUrl =
                `/private/face_recognition/${year}/${month}/${filename}`;
        }

        // ======================
        // RESULT
        // ======================
        const result = {
            success: aiResponse.data?.success ||
                false,

            name: aiResponse.data?.name ||
                "unknown",

            score: aiResponse.data?.score || 0,

            message: aiResponse.data?.message ||
                null,

            type: aiResponse.data?.type ||
                null,

            image: imageUrl,
        };

        // ======================
        // GENERATE TOKEN
        // ======================
        const token = jwt.sign({
                ...result,
            },
            process.env.JWT_SECRET, {
                expiresIn: "1h",
            }
        );

        // ======================
        // SUCCESS RESPONSE
        // ======================
        return res.status(200).json({
            success: true,
            data: result,
            token,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message ||
                "Internal server error",
        });
    } finally {
        // cleanup temp upload
        if (
            req.file &&
            fs.existsSync(req.file.path)
        ) {
            fs.unlinkSync(req.file.path);
        }
    }
};
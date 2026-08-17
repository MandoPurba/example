import express from 'express';
import fs from 'fs';
import {
    fileURLToPath
} from 'url';
import path, {
    dirname,
    join
} from 'path';

const router = express.Router();

// buat __dirname di ESM
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = dirname(__filename);


router.get("/private/face_register/:year/:month/:filename", (req, res) => {
    const {
        year,
        month,
        filename
    } = req.params;

    const filePath = join(__dirname, "..", "..", "private", "face_register", year, month, filename);
    console.log("filePath", filePath)
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: "File not found"
        });
    }

    // kirim file
    res.sendFile(filePath);
});

router.get("/private/face_recognition/:year/:month/:filename", (req, res) => {
    const {
        year,
        month,
        filename
    } = req.params;

    const filePath = join(__dirname, "..", "..", "private", "face_recognition", year, month, filename);
    console.log("filePath", filePath)
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            error: "File not found"
        });
    }

    // kirim file
    res.sendFile(filePath);
});

export default router;
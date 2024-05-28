import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path, { join } from 'node:path';
import { fileURLToPath } from 'url';
import { addFile, getAllFiles } from '../db/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const upload = multer({ dest: 'storage/' });

const fileSizes = {};

router.post('/upload-chunk', upload.single('chunk'), async (req, res) => {
    try {
        const { chunkNumber, totalChunks, fileName } = req.body;
        const { path, size } = req.file;

        const targetFilePath = join('storage', fileName);

        // Initialize or update the total size of the file being uploaded
        if (!fileSizes[fileName]) {
            fileSizes[fileName] = 0;
        }
        fileSizes[fileName] += size;

        // Append the chunk to the target file
        fs.appendFileSync(targetFilePath, fs.readFileSync(path));
        fs.unlinkSync(path); // Remove the chunk file

        if (parseInt(chunkNumber, 10) === parseInt(totalChunks, 10)) {
            // All chunks have been received
            // Add job to the queue for processing
            console.log('All chunks received and file assembled.');

            const cleanName = fileName.split('.')[0];
            const totalFileSize = fileSizes[fileName];

            try {
                await addFile(cleanName, 'csv', totalFileSize, 'uploaded');
            } catch (error) {
                // Handle error maybe we can retry a few times here
                console.error('Error adding file:', error.message);
            }

            // Clean up the in-memory size tracking
            delete fileSizes[fileName];
        }

        res.json({ message: `Chunk ${chunkNumber} of ${totalChunks} uploaded.` });
    } catch (error) {
        console.error('Error uploading chunk:', error.message);
        // Tricky error handling here since we are failing on a single chunk we can retry also
        res.status(500).json({ message: 'Error uploading chunk.' });
    }
});


router.get('/download', (req, res) => {
    const { file_id } = req.query;
    const filePath = path.join(__dirname, '..', 'storage', '.gitignore');
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const fileStream = fs.createReadStream(filePath);

    res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Length': fileSize,
        'Content-Disposition': 'attachment; filename=large_file.csv'
    });

    fileStream.pipe(res);
});

router.get('/get-available-files', async (req, res) => {
    try {
        const files = await getAllFiles();
        res.json({ files });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving files.' });
    }
});

export default router;
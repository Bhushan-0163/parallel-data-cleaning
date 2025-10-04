const express = require('express');
const multer = require('multer');
const csv = require('fast-csv');
const { Readable } = require('stream');

const app = express();

// ✅ Use Render's PORT or fallback to 3000 locally
const PORT = process.env.PORT || 3000;

// Multer setup (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Serve static files from 'public'
app.use(express.static('public'));

// Upload and clean CSV
app.post('/upload', upload.single('csvfile'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded');

    const results = [];
    const bufferStream = Readable.from(req.file.buffer);

    bufferStream
        .pipe(csv.parse({ headers: true }))
        .on('error', err => {
            console.error('CSV parse error:', err);
            return res.status(500).send('Error parsing CSV');
        })
        .on('data', row => {
            const cleaned = {};
            for (const key in row) {
                if (!row.hasOwnProperty(key)) continue;
                let value = row[key];
                if (value === null || value === undefined) value = '';
                else value = value.toString().trim();
                cleaned[key] = value;
            }
            results.push(cleaned);
        })
        .on('end', () => {
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="cleaned.csv"`);
            csv.write(results, { headers: true }).pipe(res);
        });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

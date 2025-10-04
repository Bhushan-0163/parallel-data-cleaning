const { workerData, parentPort } = require('worker_threads');

function cleanRow(row) {
    const cleaned = {};
    for (const key in row) {
        // skip prototype keys
        if (!row.hasOwnProperty(key)) continue;
        let value = row[key];
        // handle null/undefined
        if (value === null || value === undefined) value = '';
        else value = value.toString().trim();
        cleaned[key] = value;
    }
    return cleaned;
}

try {
    const cleanedChunk = workerData.map(cleanRow);
    parentPort.postMessage(cleanedChunk);
} catch (err) {
    parentPort.postMessage({ error: err.message });
}

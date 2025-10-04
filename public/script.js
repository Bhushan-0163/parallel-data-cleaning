let csvChart = null; // global variable for chart

const form = document.getElementById('uploadForm');
const progressBar = document.getElementById('progressBar');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const downloadBtn = document.getElementById('downloadBtn');
const chartCanvas = document.getElementById('dataChart');
let csvBlob;

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = form.querySelector('input[type="file"]');
    if (!fileInput.files.length) {
        alert('Please select a CSV file');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('csvfile', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload', true);
    xhr.responseType = 'blob';

    xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            progressBar.style.width = percent + '%';
            progressBar.textContent = percent + '%';
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            csvBlob = xhr.response;

            // Enable download button
            downloadBtn.style.display = 'inline-block';
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(csvBlob);
                link.download = 'cleaned-' + file.name;
                link.click();
            };

            progressBar.style.width = '100%';
            progressBar.textContent = 'Completed';

            // Clear previous table and chart
            tableHead.innerHTML = '';
            tableBody.innerHTML = '';
            if (csvChart) {
                csvChart.destroy();
                csvChart = null;
            }

            // Read CSV and display
            const reader = new FileReader();
            reader.onload = function(e) {
                const text = e.target.result;
                displayTableAndChart(text);
            };
            reader.readAsText(csvBlob);

        } else {
            console.error('Server returned status:', xhr.status);
            alert('Error cleaning CSV');
        }
    };

    xhr.onerror = function() {
        alert('Upload failed. Check console for details.');
    };

    xhr.send(formData);
});

function displayTableAndChart(csvText) {
    const rows = csvText.split('\n').filter(r => r.trim() !== '');
    if (rows.length === 0) return;

    const headers = rows[0].split(',');
    
    // Table headers
    const trHead = document.createElement('tr');
    headers.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        trHead.appendChild(th);
    });
    tableHead.appendChild(trHead);

    // Table body
    const dataRows = rows.slice(1);
    dataRows.forEach(r => {
        const tr = document.createElement('tr');
        r.split(',').forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });

    // Chart: visualize numeric columns clearly
    const numericColumns = headers.filter((h, idx) => {
        return dataRows.every(row => !isNaN(parseFloat(row.split(',')[idx])));
    });

    if (numericColumns.length === 0) return;

    const labels = dataRows.map(r => r.split(',')[0] || 'Row'); // first column as labels
    const datasets = numericColumns.map(col => {
        const idx = headers.indexOf(col);
        return {
            label: col,
            data: dataRows.map(r => parseFloat(r.split(',')[idx] || 0)),
            backgroundColor: getRandomColor()
        };
    });

    const ctx = chartCanvas.getContext('2d');
    csvChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Numeric Data Visualization' }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Values' } },
                x: { title: { display: true, text: headers[0] } }
            }
        }
    });
}

function getRandomColor() {
    const r = Math.floor(Math.random()*200)+30;
    const g = Math.floor(Math.random()*200)+30;
    const b = Math.floor(Math.random()*200)+30;
    return `rgba(${r},${g},${b},0.6)`;
}

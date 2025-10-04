🚀 Parallel Data Cleaning Pipeline

A Node.js-based ETL (Extract, Transform, Load) pipeline that allows users to upload CSV files through a web interface, clean the data in parallel using worker threads, and download the cleaned file. The project is designed to speed up ETL processes for large datasets by leveraging parallelism.

Project Url :- https://parallel-data-cleaning-f6vf.onrender.com/
📌 Features

✅ Upload a CSV file via a simple HTML interface

✅ Clean data (trim spaces, replace null/undefined, remove duplicates)

✅ Parallel data cleaning using Node.js worker_threads

✅ Visualize cleaned dataset in a styled HTML table

✅ Graphical summary of dataset using Chart.js

✅ Download the cleaned CSV file

🛠️ Tech Stack

Backend: Node.js (Express, worker_threads, fast-csv, multer)

Frontend: HTML, CSS, JavaScript

Visualization: Chart.js

Parallel Processing: Node.js worker threads

📂 Project Structure
parallel-data-cleaning/
│
├── server.js        # Main Express server
├── worker.js        # Worker thread for parallel cleaning
├── public/          # Frontend files
│   ├── index.html   # Upload UI + table + chart
│   ├── script.js    # Handles file upload, progress, rendering data
│   ├── style.css    # Styling for UI, table, buttons, etc.
│
├── uploads/         # Stores uploaded CSV files
├── cleaned/         # Stores cleaned CSV files
├── package.json     # Dependencies
└── README.md        # Project documentation

⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/Bhushan-0163/parallel-data-cleaning.git
cd parallel-data-cleaning


Install dependencies:

npm install express multer fast-csv


⚠️ Note: worker_threads is built-in, no need to install separately.

Start the server:

node server.js


Open in browser:

http://localhost:3000

🚀 How It Works

•	User uploads a CSV file from the web UI.

•	Server splits CSV rows into chunks.

•	Each chunk is processed in parallel workers (worker.js).

•	Workers clean rows:

•	Trim spaces

•	Replace null/undefined values

•	Normalize records

•	Main thread collects results and saves the cleaned file.

•	User can view data & download the cleaned CSV.

📊 Example Workflow

Upload file: dirty_data.csv

Cleaning process removes empty cells, trims spaces, and removes duplicates

View cleaned dataset in a styled table + visualization chart

Download final file: cleaned_data.csv


👨‍💻 Author

Developed by Bhushan Devidas Kamadi
Final Year Computer Engineering Student 



import createDb from 'sqlite3';

const sqlite3 = createDb.verbose();

// Connect to the database. If the file does not exist, it will be created.
const db = new sqlite3.Database('./my-database.db', (err) => {
    if (err) {
        throw new Error(`Error opening database: ${err.message}`);
    }

    console.log('Connected to the SQLite database.');

    db.run(`CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            extension TEXT NOT NULL,
            size INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT NOT NULL CHECK(status IN ('uploading', 'failed', 'uploaded')) DEFAULT 'uploading'
    )`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            // Add a file for testing
            // addFile('example', 'txt', 1024, 'uploaded');

            // // Retrieve all files and log them
            // getAllFiles((files) => {
            //     console.log('Files in the database:', files);
            // });
        }
    });

    // Create jobs table
    db.run(`CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        file_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('inprogress', 'finished', 'failed')) DEFAULT 'inprogress',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE CASCADE
    )`, (err) => {
        if (err) {
            console.error('Error creating jobs table:', err.message);
        } else {
            // Add a file and a job for testing
            // addJob('1', 'inprogress');


            // // Retrieve all jobs and log them
            // getAllJobs((jobs) => {
            //     console.log('Jobs in the database:', jobs);
            // });
        }
    });

});


function addJob(file_id, name, status = 'inprogress') {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO jobs (file_id, name, status) VALUES (?,?,?)`,
            [file_id, name, status],
            function (err) {
                if (err) {
                    reject(err.message);
                    console.error('Error adding job:', err.message);
                } else {
                    resolve('Success!')
                }
            });
    });
}

function getAllJobs() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT jobs.created_at, jobs.status, files.name as file_name, jobs.name as job_name, jobs.id, files.extension FROM jobs 
                INNER JOIN files 
                ON files.id = jobs.file_id 
                WHERE jobs.status = 'inprogress'
                ORDER BY jobs.created_at DESC
                `, [], (err, rows) => {
            if (err) {
                console.error('Error retrieving jobs:', err.message);
                return reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function addFile(name, extension, size, status = 'uploading') {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO files (name, extension, size, status) VALUES (?, ?, ?, ?)`,
            [name, extension, size, status],
            function (err) {
                if (err) {
                    reject(err.message);
                } else {
                    resolve('Success!')
                }
            });
    });
}

function getAllFiles() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM files
                WHERE status = 'uploaded'
                `, [], (err, rows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(rows);
            }
        });
    });
}


export { addFile, getAllFiles, addJob, getAllJobs };

export default db;
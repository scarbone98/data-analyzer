import express from 'express';
import { getAllJobs, addJob } from '../db/db.js';

const router = express.Router();
let runningJobs = {};

// updateRunningJobsInfo();

// define the home page route
router.get('/all', async (req, res) => {
    const allJobs = await getAllJobs();
    res.json({ jobs: allJobs });
});


router.get('/running', () => {
    return runningJobs;
});

router.post('/schedule', async (req, res) => {
    const { file, name } = req.body;
    // Add job to the queue for processing
    console.log('Job scheduled:', file);
    await addJob(file, name, 'inprogress');
    // fetch('http://localhost:5000/process', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ fileName }),
    // });

    res.json({ message: 'Job scheduled.' });
});


async function updateRunningJobsInfo() {
    try {
        const data = await fetch('http://localhost:5000/processes').then(res => res.json());
        runningJobs = data;
    } catch (error) {
        console.error('Error scheduling job:', error.message);
    }
}

// setInterval(updateRunningJobsInfo, 3000);

export default router;
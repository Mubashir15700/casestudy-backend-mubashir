import { processJobs } from "./job.processor";

const POLL_INTERVAL_MS = 5000;

async function startWorker() {
    console.log("Worker started");

    setInterval(async () => {
        try {
            await processJobs();
        } catch (error) {
            console.error(
                "Worker loop error",
                error
            );
        }
    }, POLL_INTERVAL_MS);
}

startWorker();

const router = require('express').Router();
const {
    getjobs,
    newJob,
    getjobsInRadius,
    updateJob,
    deleteJob,
    getjob,
    getStats
} = require('../controllers/jobsController');

router.post("/", newJob);
router.get("/", getjobs);
router.get("/stats/:topic", getStats);
router.get("/:id/:slug", getjob);
router.get("/jobs/:zipcode/:distance", getjobsInRadius);
router.put("/:id/update-job", updateJob);
router.delete("/:id/delete", deleteJob);

module.exports = router
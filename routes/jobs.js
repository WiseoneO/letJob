const router = require('express').Router();
const {isAuthenticated,authorizeRoles} = require('../middlewares/auth');
const {
    getjobs,
    newJob,
    getjobsInRadius,
    updateJob,
    deleteJob,
    getjob,
    getStats
} = require('../controllers/jobsController');

router.post("/",isAuthenticated,authorizeRoles('employer','admin'),newJob);
router.get("/", getjobs);
router.get("/stats/:topic", getStats);
router.get("/:id/:slug", getjob);
router.get("/jobs/:zipcode/:distance", getjobsInRadius);
router.put("/:id/update-job",isAuthenticated,authorizeRoles('employer','admin'), updateJob);
router.delete("/:id/delete",isAuthenticated,authorizeRoles('employer','admin'), deleteJob);

module.exports = router
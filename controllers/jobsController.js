const jobModel = require('../models/jobs');
const geoCoder = require('../utils/geoCoder')
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFILTERS = require('../utils/apiFilters');

// Create a new Job => /api/v1/job/new
exports.newJob = catchAsyncErrors(async (req, res, next)=>{
    const job = await jobModel.create(req.body);

    res.status(201).json({
        success: true,
        data:job,
        message: 'Job created successfully'
    });
});

// Get all jobs => /api/v1/job/jobs
exports.getjobs = catchAsyncErrors(async (req, res, next)=>{

    const apiFilters = new APIFILTERS(jobModel.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .searchByQuery()
    .pagination()

    const jobs = await apiFilters.query;

    res.status(200).json({
        success: true,
        results: jobs.length,
        data: jobs
    });
});

// Get Single job => /api/v1/job/:slug
exports.getjob = catchAsyncErrors(async(req, res, next)=>{
    const job = await jobModel.find({$and:[{_id: req.params.id},{slug: req.params.slug}]});

    if(!job || job.length === 0){
        return next(new ErrorHandler('Job not found', 404))
    }

    res.status(200).json({
        success: true,
        data: job
    })
});

// Search jobs within radius =>/api/v1/job/:zipcode/:distance
exports.getjobsInRadius = catchAsyncErrors(async (req, res, next)=>{
    const{zipcode, distance} = req.params;

    // Getting latitude and longitude from geoCoder
    const loc = await geoCoder.geocode(zipcode);
    const latitude = loc[0].latitude;
    const longitude = loc[0].longitude;

    const radius = distance / 3963

    const jobs = await jobModel.find({
        location: {$geoWithin: {$centerSphere:[[longitude, latitude], radius]}}
    });


    res.status(200).json({
        success: true,
        results: jobs.length,
        data:jobs,
    });

});

// Updating a job =>/api/v1/job/:id/update-job
exports.updateJob = catchAsyncErrors(async(req, res, next)=>{
    let job = await jobModel.findById(req.params.id);

    if(!job){
        return next(new ErrorHandler('Job not found', 404));
    }

    job = await jobModel.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        {new :true}
    );

    res.status(204).json({
        success: true,
        message: 'Data updated!'
    })
});

// Get stats about a job =>/api/v1/stats/:topic
exports.getStats = catchAsyncErrors(async(req, res, next)=>{
    const stats = await jobModel.aggregate([
        {
            $match: {$text: {$search: "\""+req.params.topic + "\""}}
        },{
            $group:{
                _id:{$toUpper:'$experience'},
                totalJobs: {$sum:1},
                avgPositions:{$avg: '$positions'},
                minSalary: {$min:'$salary'},
                maxSalary:{$max:'$salary'},
                avgSalary:{$avg: '$salary'},
            }
        }
    ]);
    
    if(stats.length === 0) {
        return next(new ErrorHandler(`No stats foundd for - ${req.params.topic}`, 404));
    } 

    res.status(200).json({
        success : true,
        data: stats
    });
});

// Delete a job =>/api/v1/job/delete
exports.deleteJob = catchAsyncErrors(async(req, res, next)=>{
    let job =  await jobModel.findById(req.params.id);

    if(!job){
        return next(new ErrorHandler('Job not found', 404))
    }

    job = await jobModel.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        
    })
});

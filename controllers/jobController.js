const Job = require('../model/job')

module.exports.createJob_get = (req, res) =>{
    res.render('createJob')
}

module.exports.createJob_post = async (req, res) =>{
    const { jobTitle, company, website, name, email, phone, address, origin, status, comment } = req.body
    const userID = req.user.id
    console.log(userID, req.body)

    try {
        const job = await Job.create({ userID, jobTitle, company, website, name, email, phone, address, origin, status, comment })
        res.status(201).json(job)
    } 
    catch(err) {
        res.status(400).json(err)
    }
}

module.exports.job_delete = async (req, res) => {
    try {
        const jobID = req.params.id;

        const deletedJob = await Job.findByIdAndDelete(jobID);

        if (!deletedJob) {
        return res.status(404).send('Job not found');
    }

        res.status(200).send('Job deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting job');
    }
};

module.exports.job_update = async (req, res) => {
    try {
        const jobID = req.params.id;

        const updatedJobData = req.body;

        const updatedJob = await Job.findByIdAndUpdate(jobID, updatedJobData, { new: true });

        if (!updatedJob) {
        return res.status(404).send('Job not found');
        }

        res.status(200).send({message:'Job updated successfully'});
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating job');
    }
};


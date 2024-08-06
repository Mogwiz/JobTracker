const Job = require('../model/job')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')

module.exports.createJob_get = (req, res) =>{
    res.render('createJob')
}

module.exports.createJob_post = requireAuth, checkUser, async (req, res) =>{
    const { jobTitle, company, website, name, email, phone, address, origin, status, comment } = req.body
    const userID = req.user._id
    console.log(req.body)

    try {
        const job = await Job.create({ userID, jobTitle, company, website, name, email, phone, address, origin, status, comment })
        res.status(201).json(job)
    } 
    catch(err) {
        res.status(400).json(err)
    }
}
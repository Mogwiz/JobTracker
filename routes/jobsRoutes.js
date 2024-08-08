const { Router } = require('express')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const jobController = require('../controllers/jobController')



const jobsRouter = Router()

// Jobs routes
//Render the form to add a job
jobsRouter.get('/createJob', jobController.createJob_get)

//Add the infos we posted to the collection
jobsRouter.post('/createJob', requireAuth, checkUser, jobController.createJob_post)

//Update the infos we put in this update form
jobsRouter.put('/update/:id', requireAuth, jobController.job_update)

//Delete one job
jobsRouter.delete('/job/:id', requireAuth, jobController.job_delete)


module.exports = jobsRouter
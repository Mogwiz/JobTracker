const { Router } = require('express')
const { requireAuth, checkUser } = require('../middleware/authMiddleware')
const jobController = require('../controllers/jobController')



const jobsRouter = Router()

// Jobs routes
jobsRouter.get('/createJob', jobController.createJob_get)

jobsRouter.post('/createJob', requireAuth, checkUser, jobController.createJob_post)


module.exports = jobsRouter
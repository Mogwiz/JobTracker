const express = require('express')
const mongoose = require('mongoose')
const port = 3000
const authRoutes = require('./routes/authRoutes')
const jobsRoutes = require('./routes/jobsRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const Job = require('./model/job')


// Init app & middlewares
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended:false }))
app.use(express.static('public'))
app.use(cookieParser())

// View engine
app.set('view engine', 'ejs')

// DB connection
const dbURI = "mongodb+srv://lbentbagdad:Z4vwdJwMYLv4LJ7h@cluster0.nb71b4f.mongodb.net/JobTracker?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(dbURI)
    .then((result) => {
        app.listen(port)
        console.log(`You're listening to port ${port}`)
    })
    .catch((err) => console.log(err))

// Routes
app.get('*', checkUser)

app.get('/', async (req, res) =>{
    try {
        const userID = req.user.id;
        const jobs = await Job.find({ userID })
        .populate( 'userID' )
        res.render('home', { jobs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des jobs');
    }
})

app.get('/login', (req, res) =>{
    res.render('login')
})

app.get('/signup', (req, res) =>{
    res.render('signup')
})

app.get('/profile', requireAuth, (req, res) =>{
    res.render('profile')
})

app.get('/createJob', requireAuth, (req, res) =>{
    res.render('createJob')
})

app.get('/update/:id', requireAuth, async (req, res) =>{
    try {
        const jobID = req.params.id;
        const job = await Job.findById( jobID )
        res.render('update', { job });
        console.log(job);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération du job');
    }
})

app.put('/update/:id', requireAuth, async (req, res) => {
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
});

app.get('/job/:id', requireAuth, async (req, res) =>{
    try {
        const jobID = req.params.id;
        const job = await Job.findById( jobID )
        res.render('job', { job });
        console.log(job);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération du job');
    }
})

// Delete one job
app.delete('/job/:id', requireAuth, async (req, res) => {
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
});

// Delete every jobs by user
app.delete('/jobs/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const deletedJobsCount = await Job.deleteMany({ userId });

        if (deletedJobsCount === 0) {
        return res.status(204).send('No jobs found for this user');
        } else {
        return res.status(200).send(`${deletedJobsCount} jobs deleted successfully`);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting jobs');
    }
});


app.use(authRoutes)
app.use(jobsRoutes)
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
        console.log(jobs);
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

app.use(authRoutes)
app.use(jobsRoutes)
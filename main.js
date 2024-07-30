const express = require('express')
const mongoose = require('mongoose')
const port = 3000
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')
const User = require('./model/user')
const Job = require('./model/job')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')

// Init app & middlewares
const app = express()

app.use(express.json())
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

app.get('/', (req, res) =>{
    res.render('home')
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

app.get('/job', requireAuth, (req, res) =>{
    res.render('job')
})

app.use(authRoutes)
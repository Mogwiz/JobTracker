const express = require('express')
const port = 3000
const { connectToDb, getDb } = require('./db')

// Init app & middleware
const app = express()
app.use(express.json())
app.use(express.static('public'))

// View engine
app.set('view engine', 'ejs')

// DB Connection
let db

connectToDb((err) =>{
    if (!err) {
        app.listen(port, () =>{
            console.log(`You're listening to port ${port}`);
        })
        db = getDb()
    }
})

// Routes
app.get('/', (req, res) =>{
    res.render('home')
})

app.get('/job', (req, res) =>{
    res.render('job')
})

app.get('/login', (req, res) =>{
    res.render('login')
})

app.get('/signup', (req, res) =>{
    res.render('signup')
})

app.get('/profile', (req, res) =>{
    res.render('profile')
})

app.get('/createJob', (req, res) =>{
    res.render('createJob')
})

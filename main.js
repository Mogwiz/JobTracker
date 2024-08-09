require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const port = 3000
const authRoutes = require('./routes/authRoutes')
const jobsRoutes = require('./routes/jobsRoutes')
const cookieParser = require('cookie-parser')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const Job = require('./model/job')
const multer = require('multer');
const { uploadImage, uploadTempPDF, uploadPDF } = require('./uploadImagesPDF');
const fs = require('fs');
const User = require('./model/user');
const upload = multer({ dest: 'uploads/' });


// Init app & middlewares
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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

//Render the homepage and get every jobs based on the user connected
app.get('/', async (req, res) => {
    try {
        let jobs;

        if (req.user) {
        const userID = req.user.id;
        jobs = await Job.find({ userID }).populate('userID');
        } else {
        jobs = await Job.find({});
        }

        res.render('home', { jobs });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des jobs');
    }
});

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

//Render this update page (based on the job we clicked in the job page)
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

//Render the job page based on the job we clicked on in the dashboard
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


//Upload a profile picture, when you upload a second time, it changes in the database too
app.post('/upload', checkUser, upload.single('profileImage'), async (req, res) => {
    try {
        const imagePath = req.file.path;
        const imageUrl = await uploadImage(imagePath);

        const user = await User.findById(req.user.id);
        user.profileImage = imageUrl;
        await user.save();

        fs.unlinkSync(imagePath);

        res.status(200).redirect('/profile');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/upload-pdf', checkUser, uploadTempPDF.single('profilePDF'), async (req, res) => {
    try {
        const pdfPath = req.file.path;
        const pdfUrl = await uploadPDF(pdfPath);

        const user = await User.findById(req.user.id);
        user.profilePDF = pdfUrl;
        await user.save();

        fs.unlinkSync(pdfPath);

        res.status(200).redirect('/profile');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.use(authRoutes)
app.use(jobsRoutes)
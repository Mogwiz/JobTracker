const mongoose = require('mongoose')
const { isEmail } = require('validator')
const User = require('../model/user')

const jobSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    jobTitle: {
        type: String,
        required: [true, 'Please enter the job title'],
    },
    company: {
        type: String,
        required: [true, 'Please enter the company name'],
    },
    website: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    phone: {
        type: Number,
        maxlength: 10,
    },
    address: {
        type: String,
    },
    origin: {
        type: String,
    },
    status: {
        type: String,
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },
    updatedAt: {
        type: Date,
        default: () => Date.now(),
    },
})

module.exports = mongoose.model("Job", jobSchema)
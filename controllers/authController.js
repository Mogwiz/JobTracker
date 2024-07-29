const User = require('../model/user')

// Handle errors
const handleErrors = (err) =>{
    console.log(err.message, err.code)
    let errors = {firstName: '', lastName: '', email: '', password: '', github: ''}

    // Duplicate error code
    if(err.code === 11000) {
        errors.email = 'That email is already registered'
        return errors
    }

    // Validation errors
    if (err.message.includes('User validation failed')) {
        Object.values(err.errors).forEach(({properties}) =>{
            errors[properties.path] = properties.message
        })
    }

    return errors
}

module.exports.signup_get = (req, res) =>{
    res.render('signup')
}

module.exports.login_get = (req, res) =>{
    res.render('signup')
}

module.exports.signup_post = async (req, res) =>{
    const { firstName, lastName, email, password, github } = req.body

    try {
        const user = await User.create({ firstName, lastName, email, password, github })
        res.status(201).json(user)
    } 
    catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
}

module.exports.login_post = async (req, res) =>{
    const { email, password} = req.body

    console.log(email, password)
    res.send('User logged in !')
}
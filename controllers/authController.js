module.exports.signup_get = (req, res) =>{
    res.render('signup')
}

module.exports.login_get = (req, res) =>{
    res.render('signup')
}

module.exports.signup_post = (req, res) =>{
    const { email, password} = req.body

    console.log(email, password)
    res.send('User logged in !')
}

module.exports.login_post = (req, res) =>{
    const { email, password} = req.body

    console.log(email, password)
    res.send('User logged in !')
}
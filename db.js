const { MongoClient } = require('mongodb')

let dbConnection
const uri = "mongodb+srv://lbentbagdad:Z4vwdJwMYLv4LJ7h@cluster0.nb71b4f.mongodb.net/JobTracker?retryWrites=true&w=majority&appName=Cluster0"

module.exports = {
    connectToDb: (cb) =>{
        MongoClient.connect(uri)
            .then((client) =>{
                dbConnection = client.db()
                return cb()
            })
            .catch(err =>{
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => dbConnection
}
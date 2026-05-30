const mongoose = require("mongoose")
async function startDB(){
    console.log(process.env.UserDatabase)
    await mongoose.connect(`mongodb+srv://${process.env.UserDatabase}:${process.env.PasswordDatabase}@cluster.d4dhzxz.mongodb.net/`)
    .then(()=>console.log("Banco conectado"))
    .catch((error)=>console.log(error))
}
module.exports = startDB
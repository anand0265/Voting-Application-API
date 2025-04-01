const mongoose = require('mongoose')


const connectDB= async() =>{
    try{
await mongoose.connect(process.env.MONGODB)
console.log(`Connected to Database ${mongoose.connection.host}`)
    }catch(error){
        console.log('DB error')
    }
}
module.exports = connectDB;


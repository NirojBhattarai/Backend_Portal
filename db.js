const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://Neeraj_Bhattarai:optdata@optimizerhub.mvneol6.mongodb.net/User_Data?retryWrites=true&w=majority"

function connectToMongo(){
    mongoose.set('strictQuery', false);
    mongoose.connect(mongoURI, ()=>{
       console.log("Connected to mongo successfully");
    })
}

module.exports = connectToMongo;
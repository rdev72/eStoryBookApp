const mongoose = require('mongoose')

// when working with mongoose working on promises,mongoose.connect returns promise and we not using .then
const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{ // MONGO_URI is in config file
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify : false
        }) // returns promise

        console.log(`MongoDB Connected : ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1)    // exit faliure code :1 
    }
}
module.exports = connectDB  
const path = require('path')
const express = require ('express')
const mongoose = require('mongoose');
const dotenv = require('dotenv')// for config variables
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db')

const Story = require('./models/Story')

//Load config 
dotenv.config({path:'./config/config.env'}) // to store all global varaiables

//passport config
require('./config/passport')(passport)

connectDB()
  
const app = express()

//Body Parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())


//Logging
if (process.env.NODE_ENV == 'development') {
    // Add Morgan middleWare
    app.use(morgan('dev'))
}

// HandleBar helpers
const {formatDate , stripTags,truncate,editIcon} = require ('./helpers/hbs')

//HandleBars
app.engine('.hbs',exphbs({helpers:{formatDate,stripTags,truncate,editIcon},defaultLayout:'main',extname:'.hbs'}))
app.set('view engine','.hbs')


//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false, //not create a session unitil something is stored
    store: new MongoStore({mongooseConnection:mongoose.connection})  //save session into mongodb to jumpover server restart
}))


//passport Middleware
app.use(passport.initialize())
app.use(passport.session())

//Set global Variable
app.use(function(req,res,next){
    res.locals.user = req.user || null
    next()
})

//Static folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
// app.use('/api',require('./routes'));

app.use((req, res, next)=>{
    const oldSending = res.send;
    res.send = function (data) {
        datas = {};
        data = JSON.parse(data);
        for (let key in data) {
            const prevKey = key;
            key = key.split('_');
            key = key.map((k,i) => {
                if (i != 0) {
                    return k.slice(0,1).toUpperCase() + k.slice(1)
                } else {
                    return k;
                }
            })
            key = key.join('');
            datas[key] = data[prevKey];
        }
        res.send = oldSending;
        return res.send(datas);
    }
    next();
})



app.post('/',(req,res)=>{
    res.json(req.body);
})


const PORT = process.env.PORT || 3000

app.listen(PORT,console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))
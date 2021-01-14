const express = require('express')
const router = express.Router() 
const {ensureAuth,ensureGuest} = require('../middleWare/auth')
const Story = require('../models/Story')
// description Login /Landing Page
//route  GET /
router.get('/',ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login'
    })
})

router.get('/dashboard',ensureAuth,async(req,res)=>{
   try {
       const stories = await Story.find({user:req.user.id}).lean()
        res.render('dashboard',{
         name:req.user.firstName,
         stories
         })
   } catch (err) {
       console.log(err);
       res.render('/error/500')
   }
    
})
router.use('/auth',require('./auth'))
router.use('/stories',require('./stories'))

module.exports = router
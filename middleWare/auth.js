module.exports = {
    ensureAuth: function (req,res,next){
        if(req.isAuthenticated()){
            console.log("User here");
            next()
        }else{
            res.redirect('/')
        }
    },
    ensureGuest: function(req,res,next){
        if(req.isAuthenticated()){
            console.log("Guest here");
            res.redirect('/dashboard')
        }else{
            return next()
        }
    }
}
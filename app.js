var express               = require("express"), 
	mongoose              = require("mongoose"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	User 				  = require("./models/user"); 





mongoose.connect("mongodb://localhost/auth_demo_app");




var app = express();

app.use(require("express-session")({
	secret: "Rusty is the bst and cutest dog in the world",
	resave: false,
	saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use (new LocalStrategy (User.authenticate ()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==============================
// ROUTES
// ==============================

app.get("/", function(req, res){
	res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
	res.render("secret");
});

// AUTH ROUTES
// show sign up form
app.get("/register", function(req, res){
	res.render("register");
});
//handling user sign up
app.post("/register", function(req, res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render('register');
			}
				passport.authenticate("local")(req, res, function(){
					res.redirect('/secret');
				});
			
		}
	);
});

//LOGIN ROUTES
// RENDER LOGIN FORM
app.get("/login", function(req, res){
	res.render('login');
});
//LOGIN LOGIC
// middleware
app.post('/login', passport.authenticate("local",{
	successRedirect: "/secret",
	failureRedirect: "/login"
}), function(req, res){

});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}


//LOGOUT ROUTE
app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.listen(3000, function(){
	console.log("server running");
});







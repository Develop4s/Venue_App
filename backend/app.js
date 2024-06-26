const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const http = require('http');
//const https = require('https');
const config=require('./Auth/config/authConfig');
const cors=require('cors');
const path = require('path');

const routerRegister = require('./Auth/routes/authRegisterRoutes');
const routerGoogle=require('./Auth/routes/authGoogleRoutes');
const routerProtected=require('./Auth/routes/protectedRoute');
const routerLogout = require('./Auth/routes/authlogoutRoutes');
const routerSimpleLogin=require('./Auth/routes/authSimpleLoginRoutes');
const {routerVendorRegister, routerBranch}=require('./Auth/routes/vendorRegisterRoutes');
const routerVendorLogin=require('./Auth/routes/vendorSimpleLoginRoutes');
const routerVenueRegister = require('./Auth/routes/venueRegisterRoutes');
const routerVenueLogin = require('./Auth/routes/venueSimpleLoginRoutes');
const routerLocation = require('./location/routes/locationSearchRoutes');
const routerPackage = require('./Packages/routes/packageRoute');
const routerVenueDetailes = require('./venueDetails/routes/venueDetailsRoutes');
const {routerItem,routerItemDisplay} = require('./items/routes/itemRoutes');
const {routerNoofHalls,routerHallDetails} = require('./venueDetails/routes/venueDetailsRoutes');
const routerVenueSearchVendor = require('./location/routes/venueSearchVendorRoutes');
const {routerSendOtp,routerChangePassword,routerValidateOtp} = require('./Auth/routes/resetPassRoutes');
const {routerEditProfile,routerDisplayProfile} = require('./EditProfile/routes/editProfileRoutes');
const app = express();

app.use(cors());


app.use(bodyParser.json({ limit: '50mb' }));

// Parse incoming requests with URL-encoded payloads
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use(cookieParser());
app.use(session({ secret: 'dogs', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    done(null, user);
  });
// Connect to MongoDB
mongoose.connect(config.db.dbUrl)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use(express.static(path.join(__dirname, 'frontend')));   

// Route Middleware
app.use('/register', routerRegister);
//app.use('/', routerGoogle);
app.use('/logout',routerLogout);
app.use('/login',routerSimpleLogin);
app.use('/vendor/register', routerVendorRegister);
app.use('/vendor/login',routerVendorLogin);
app.use('/venue/register',routerVenueRegister);
app.use('/venue/login',routerVenueLogin);
app.use('/location',routerLocation);
app.use('/packages',routerPackage);
app.use('/branch',routerBranch);
app.use('/item',routerItem);
app.use('/vendor/images',routerItemDisplay);
app.use('/venue/home/screen',routerNoofHalls);
app.use('/venue/hallDetails',routerHallDetails);
app.use('/search/location/',routerLocation);
app.use('/venue/search/vendor',routerVenueSearchVendor);
app.use('/sendOtp',routerSendOtp),
app.use('/validateOtp',routerValidateOtp),
app.use('/changePassword',routerChangePassword),
app.use('/editProfile',routerEditProfile);
app.use('/displayProfile',routerEditProfile);


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


app.get('/', async (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  });

 
const port = config.port || 443;

const server = http.createServer( app);

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
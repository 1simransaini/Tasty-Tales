const express = require('express');

// Express layout is helpful when different layouts are created for different scenarios
const expressLayouts = require('express-ejs-layouts');

// For submit button
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo'); // For storing sessions in MongoDB

const app = express();
const port = process.env.PORT || 3000;

require('dotenv').config()

// MongoDB connection
const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Recipes';

mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Database connected!'))
    .catch(err => console.error('Database connection error:', err));

app.use(express.urlencoded({ extended: true }));
// Static is used so that we don't have to mess with the path if we ever need to insert an image
app.use(express.static('public'));
app.use(expressLayouts);

// Creating middlewares for the submit button to work
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
    secret: 'CookingBlogSecretSession',
    saveUninitialized: true,
    resave: true,
    store: MongoStore.create({
        mongoUrl: mongodbUri,
        collectionName: 'sessions'
    }),
    cookie: { secure: false } // Set to true if using HTTPS
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/recipeRoutes.js');
app.use('/', routes);

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});

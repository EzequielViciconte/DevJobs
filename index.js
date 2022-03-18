const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const BodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passports');

require('dotenv').config({ path: 'variables.env' });

const app = express();

// Validar Campos
app.use(expressValidator());

// Habilitar Body parser
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }))



//Habilitar Template Engine
app.engine('handlebars',
    exphbs.engine({
        defaultLayout: 'layout',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        },
        helpers: require('./helpers/handlebars')
    })
);

app.set('view engine', 'handlebars')

// Static Files
app.use(express.static(path.join(__dirname, 'public')));


app.use(cookieParser());

app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ mongoUrl: process.env.DATABASE })
}));

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// alerta  y flash message
app.use(flash());

// Crear nuestro Meddleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
})


app.use('/', router());



app.listen(process.env.PUERTO);
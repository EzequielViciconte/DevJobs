const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuario');

passport.use(new LocalStrategy({
    usernameField: 'Email',
    passwordField: 'Contraseña'
}, async(Email, Contraseña, done) => {
    const Usuario = await Usuarios.findOne({ Email });
    if (!Usuario) return done(null, false, {
        message: 'Usuario no Encontrado'
    });

    // El usuario existe verificar
    const verificarPass = Usuario.compararContraseña(Contraseña)
    if (!verificarPass) return done(null, false, {
        message: 'Contraseña invalida'
    });

    // Usuario y contraseña Correctos
    return done(null, Usuario)
}));

passport.serializeUser((Usuario, done) => done(null, Usuario._id));
passport.deserializeUser(async(id, done) => {
    const Usuario = await Usuarios.findById(id);
    return done(null, Usuario);
});

module.exports = passport;
const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.AutenticarUsuario = passport.authenticate('local', {
    successRedirect: '/Administracion',
    failureRedirect: '/iniciar-secion',
    failureFlash: true,
    badRequestMessage: 'Ambos  campos son Obligatorios'
});

// Revisar si el usuario esta autenticado o no
exports.verificarUsuario = (req, res, next) => {
    // Revisar Usuario 
    if (req.isAuthenticated()) {
        return next(); // Esta autenticado
    }

    // Redireccionar
    res.redirect('/iniciar-secion');



};

exports.MostrarPanel = async(req, res) => {

    // Consultar el usuario autenticado
    const vacantes = await Vacante.find({ Autor: req.user._id });

    res.render('Administracion', {
        NombrePagina: 'Panel de Administracion',
        tagline: 'Crea y Administra tus vacantes desde Aqui',
        cerrarSecion: true,
        Nombre: req.user.Nombre,
        Imagen: req.user.Imagen,
        vacantes
    });
};

exports.cerrarSesion = (req,res)=> {

    req.logout();

    return res.redirect('/iniciar-secion');

};
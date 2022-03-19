const mongoose = require('mongoose');
const Vacantes = require('../Models/Vacantes');
const Vacante = mongoose.model('Vacante');


exports.MostrarTrabajos = async(req, res, next) => {

    const vacantes = await Vacante.find();


    if (!vacantes) return next();
    res.render('home', {
        NombrePagina: 'DebJovs',
        tagline: 'Encuentra y Publica Trabajos para Desarroladores Web',
        barra: true,
        boton: true,
        vacantes
    });
}
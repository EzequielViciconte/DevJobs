const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuario = mongoose.model('Usuario');
const Crypto = require('crypto');
const enviarEmail = require('../handlers/email');

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

// Formulario para Restablecer password
exports.formRestPassword = (req,res,next)=> {
    res.render('restablecer-password',{
        NombrePagina:'Restablece tu Contraseña',
        tagline: 'Si tenes cuenta pero olvidaste tu contraseña Coloca tu Email'
    })

};

exports.EnviarToken = async (req,res,next)=>{
    const usuario = await Usuario.findOne({Email:req.body.Email});
    if(!usuario)
    {
        req.flash('error','Usuario No existente');
        return res.redirect('/iniciar-secion');
    }

    // Usuario Existe,Generar Token

    usuario.Token = Crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    // Guardar en BD
    usuario.save();
    const ResetUrl = `http://${req.headers.host}/restablecer-password/${usuario.Token}`;

    console.log(ResetUrl);

    // Enviar Notificaion Por Emial

    await enviarEmail.Enviar({
        usuario,
        subject:'Resetear Contraseña',
        ResetUrl,
        archivo:'Restablecer'
    });

    // Todo Correcto yo que me alegro
    req.flash('correcto','Revisa tu casilla De Email');
    res.redirect('/iniciar-secion');
    
};

// Validar si el token es valido y si el usuario existe.
exports.RestablecerContraseña = async (req,res)=>{
    const usuario = await Usuario.findOne({
        Token:req.params.Token,
        expira:{
            $gt :Date.now()
        }
    });
    if(!usuario) {
        req.flash('error','El formulario no es valido,intenta de nuevo');
        return res.redirect('/restablecer-password'); 
    }

    res.render('nuevo-password',{
        NombrePagina: 'Nueva Contraseña'
    })
};

// Almacena el nuevo password en BD
exports.GuardarPassword = async (req,res) => {
    const usuario = await Usuario.findOne({
        Token:req.params.Token,
        expira:{
            $gt :Date.now()
        }
    });

    // Si no existe el usuario o el token es invalido
    if(!usuario) {
        req.flash('error','El formulario no es valido,intenta de nuevo');
        return res.redirect('/restablecer-password'); 
    }

    // Asignar Nueva contraseña y borrar campos
    usuario.Contraseña = req.body.Contraseña;
    usuario.Token = undefined;
    usuario.expira = undefined;

    // Agregar y eliminar valores
    await usuario.save();

    req.flash('correcto','Contraseña modificada correctamente');
    res.redirect('/iniciar-secion');


};
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuario');
const multer = require('multer');
const shortid = require('shortid');



exports.FormCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        NombrePagina: 'Crear tu Cuenta en DebJobs',
        tagline: 'Comienza a publicar tus vacantes gratis,solo debes crear una cuenta'
    });
};

exports.ValidarRegistro = (req, res, next) => {
    // Sanitizar
    req.sanitizeBody('Nombre').escape();
    req.sanitizeBody('Email').escape();
    req.sanitizeBody('Contraseña').escape();
    req.sanitizeBody('Confirmar').escape();

    // Validar
    req.checkBody('Nombre', 'El Nombre es Obligatorio').notEmpty();
    req.checkBody('Email', 'El Email debe ser Valido').isEmail();
    req.checkBody('Contraseña', 'La Contraseña es Obligatorio').notEmpty();
    req.checkBody('Confirmar', 'La Confirmacion es Obligatorio').notEmpty();
    req.checkBody('Confirmar', 'La Contraseña es Diferente').equals(req.body.Contraseña);

    const errores = req.validationErrors();

    if (errores) {
        // Si hay errores
        req.flash('error', errores.map(error => error.msg))

        res.render('crear-cuenta', {
            NombrePagina: 'Crear tu Cuenta en DebJobs',
            tagline: 'Comienza a publicar tus vacantes gratis,solo debes crear una cuenta',
            mensajes: req.flash(),
            Imagen: req.user.Imagen,
        });
        return;
    }
    // Si toda la validacion es correcta
    next();
};

exports.CrearCuenta = async(req, res, next) => {
    const usuario = new Usuario(req.body);

    // Almacenar en Bases de Datos

    try {
        await usuario.save();
        res.redirect(`/iniciar-secion`);

    } catch (error) {
        req.flash('error', error)
        res.redirect(`/crear-cuenta`);
    }
}

exports.FormIniciarSecion = async(req, res, next) => {
    res.render('iniciar-secion', {
        NombrePagina: 'Inicia  Secion con tu Usuario'
    });
};



exports.FormEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        NombrePagina: 'Edita tu Perfil en DebJobs',
        cerrarSecion: true,
        Nombre: req.user.Nombre,
        Imagen: req.user.Imagen,
        Usuario: req.user
    });
}

// Guardas cambios al Editar Perfil
exports.EditarPerfil = async(req, res) => {
    const usuario = await Usuario.findById(req.user._id);

    usuario.Nombre = req.body.Nombre;
    usuario.Email = req.body.Email;

    if (req.body.Contraseña) {
        usuario.Contraseña = req.body.Contraseña;
    };


    if(req.file){
        usuario.Imagen = req.file.filename ; 
    }   
    await usuario.save();

    // Notificacion
    req.flash('correcto', 'Cambios Guardados Correctamente');
    // Redirect
    res.redirect('/administracion');
};

exports.SubirImagen = (req,res,next) =>{
    upload(req,res, function(error){
        if(error){
            console.log(error)
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El Archivo es Muy grande,Maximo 100Kb   ')
                }else{
                    req.flash('error', error.message);
                }
            }else{
                req.flash('error', error.message)
            }
            res.redirect('/administracion');
            return;
    }
    next();
    });
    
};

// Opciones del Multer
const configuracionMulter = {
    limits: {fileSize: 100000},
    storage: fileStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,__dirname+'../../public/uploads/perfiles');
        },
        filename: (req,file,cb) =>{
            const extencion = file.mimetype.split('/')[1];
            const NombreImg = `${shortid.generate()}.${extencion}`;
            cb(null,NombreImg);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            // El callback se ejecuta en true
            cb(null,true);
        }
        else{
            // Callback se ejecuta en false
            cb(new Error('Formato No Valido'),false);
        }
    }
    
}

const upload = multer(configuracionMulter).single('Imagen');
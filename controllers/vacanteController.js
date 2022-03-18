const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const multer = require('multer');
const shortid = require('shortid');


exports.FormularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante', {
        NombrePagina: 'Nueva Vacante',
        cerrarSecion: true,
        Nombre: req.user.Nombre,
        Imagen: req.user.Imagen,
        tagline: 'Llena el formulario y crea tu vacante'
        
    })
};

exports.AgregarVacante = async(req, res) => {
    const vacante = new Vacante(req.body);

    // Usuario autor de la vacante
    vacante.Autor = req.user._id;

    // Crear arreglo de Skills
    vacante.Skills = req.body.Skills.split(',');

    // Almacenar en Base de Datos
    const NuevaVacante = await vacante.save();

    //Redireccionar 
    res.redirect(`/vacantes/${NuevaVacante.Url}`)
};

exports.VacanteNueva = async(req, res, next) => {

    const vacante = await Vacante.findOne({ Url: req.params.Url }).populate('Autor');

    if (!vacante) return next();

    res.render('vacante', {
        NombrePagina: vacante.Titulo,
        vacante, 
    })
};




// Subir Archivos en PDF
exports.SubirCv = (req,res,next)=> {
    upload(req,res, function(error){
        if(error){
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error', 'El Archivo es Muy grande,Maximo 100Kb')
                }else{
                    req.flash('error', error.message);
                }
            }else{
                req.flash('error', error.message)
            }
            res.redirect('back');
            return;
    }
    next();
    });
};


// Opciones del Multer
const configuracionMulter = {
    limits: {fileSize: 1000000},
    storage: fileStorage = multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,__dirname+'../../public/uploads/Cv');
        },
        filename: (req,file,cb) =>{
            const extencion = file.mimetype.split('/')[1];
            const NombreCv = `${shortid.generate()}.${extencion}`;
            cb(null,NombreCv);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'application/pdf'){
            // El callback se ejecuta en true
            cb(null,true);
        }
        else{
            // Callback se ejecuta en false
            cb(new Error('Formato No Valido'),false);
        }
    }
    
}

const upload = multer(configuracionMulter).single('cv');

// Agregar Candidatos en BD
exports.Contactar = async (req,res,next)=> {
    const vacante = await Vacante.findOne({Url: req.params.Url});

    if(!vacante)return next();

    // Construir El Objeto
    const NuevoCandidato = {
    Nombre:req.body.Nombre,
    Email:req.body.Email,
    cv:req.file.filename
    };

    // Almacenar la vacante
    vacante.Candidatos.push(NuevoCandidato);
    await vacante.save();
    // Redirect y Mensaje de flash
    req.flash('correcto','Se Envio Correctamente');
    res.redirect('/')
};


exports.mostrarCandidatos = async (req,res,next) => {
    const vacante = await Vacante.findById(req.params.id);


    if(!vacante) return next();
    if(vacante.Autor != req.user._id.toString()){
        return next();
    }

    res.render('Candidatos',{
    NombrePagina :  `Candidatos Vacante - ${vacante.Titulo}`,
    cerrarSecion: true,
    Nombre: req.user.Nombre,
    Imagen: req.user.Imagen,
    tagline: 'Conoce a Los candidatos Interesados en  tu Puesto',
    Candidatos: vacante.Candidatos
    })
 
    

};


exports.FormActualizarVacante = async(req, res, next) => {
    const vacante = await Vacante.findOne({ url: req.params.Url });
    
    if (!vacante) return next();

    res.render('editar-vacante', {
        vacante,
        cerrarSecion: true,
        Nombre: req.user.Nombre,
        NombrePagina: `Editar - ${vacante.Titulo}`,
        Imagen: req.user.Imagen,
    });
};

exports.ActualizarVacante = async(req, res) => {
    const vacanteActualizada = req.body;

    // Crear arreglo de Skills
    vacanteActualizada.Skills = req.body.Skills.split(',');

    // Almacenar en Base de Datos
    const vacante = await Vacante.findOneAndUpdate({ Url: req.params.Url },
        vacanteActualizada, {
            new: true,
            runValidators: true
        });

    //Redireccionar 
    res.redirect(`/vacantes/${vacante.Url}`)

};


exports.EliminarVacante = async (req,res) =>{
    const {id} = req.params;

    const vacante = await Vacante.findById(id);

    if(ValidarAutor(vacante,req.user)){
        // Todo Bien,Eliminalo
        vacante.remove();
        res.status(200).send('Eliminado Correctamente');

    }else{
        // No permitido
        res.status(403).send('Error');

    }
     
};

const ValidarAutor = (vacante = {} , Usuario = {})=>{
    if(!vacante.Autor.equals(Usuario._id))
    {
        return false;
    }
    return true;
};


exports.ValidarVacante = (req, res, next) => {
    // Sanitizar los Campos
    req.sanitizeBody('Titulo').escape();
    req.sanitizeBody('Empresa').escape();
    req.sanitizeBody('Ubicacion').escape();
    req.sanitizeBody('Salario').escape();
    req.sanitizeBody('Contrato').escape();
    req.sanitizeBody('Skills').escape();

    // Validar Campos
    req.checkBody('Titulo', 'Agrege un Titulo y una Vacante').notEmpty();
    req.checkBody('Empresa', 'Agrege un Empresa').notEmpty();
    req.checkBody('Ubicacion', 'Agrege una Ubicacion').notEmpty();
    req.checkBody('Contrato', 'Selecciona un tipo de contrato').notEmpty();
    req.checkBody('Skills', 'Agrega al menos una Habilidad').notEmpty();

    const errores = req.validationErrors();

    if (errores) {
        // Si hay errores
        req.flash('error', errores.map(error => error.msg))

        res.render('nueva-vacante', {
            NombrePagina: 'Crear tu Cuenta en DebJobs',
            tagline: 'Comienza a publicar tus vacantes gratis,solo debes crear una cuenta',
            mensajes: req.flash(),
            Imagen: req.user.Imagen 
        });
        return;
    }
    // Si todo esta Correcto
    next();

};
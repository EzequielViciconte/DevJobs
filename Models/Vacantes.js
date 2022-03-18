const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Slug = require('slug');
const shortId = require('shortid');


const VacantesSchema = new mongoose.Schema({
    Titulo: {
        type: String,
        require: 'El nombre de la Vacante es Obligatorio',
        trim: true
    },
    Empresa: {
        type: String,
        trim: true
    },
    Ubicacion: {
        type: String,
        trim: true,
        require: 'La ubicacion es Obligatoria'
    },
    Salario: {
        type: String,
        default: 0
    },
    Contrato: {
        type: String,
        trim: true
    },
    Descripcion: {
        type: String,
        trim: true
    },
    Url: {
        type: String,
        lowercase: true
    },
    Skills: [String],
    Candidatos: [{
        Nombre: String,
        Email: String,
        cv: String
    }],
    Autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuario',
        required: 'El autor es Obligatorio'
    }
});

VacantesSchema.pre('save', function(next) {

    // Crear la Url
    const Url = Slug(this.Titulo);
    this.Url = `${Url}-${shortId.generate()}`

    next();
});

// Crear un indice
VacantesSchema.index({Titulo: 'text'});

module.exports = mongoose.model('Vacante', VacantesSchema)
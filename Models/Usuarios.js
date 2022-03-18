const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');

const UsuariosSchema = new mongoose.Schema({
    Email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    },
    Nombre: {
        type: String,
        require: 'Agrega tu Nombre'
    },
    Contraseña: {
        type: String,
        required: true,
        trim: true
    },
    Token: String,
    expira: Date,
    Imagen:String
});

// Metodo para hashear los password
UsuariosSchema.pre('save', async function(next) {
    //SI ya esta hasheado
    if (!this.isModified('Contraseña')) {
        return next();
    }

    // Si no esta hasheado
    const hash = await bcrypt.hash(this.Contraseña, 12)
    this.Contraseña = hash;
    next();

});

// Enviar alerta Cuando el Usuario ya este registrado
UsuariosSchema.post('save', function(error, doc, next) {
    if(error.code === 11000) {
        next('Ese Correo ya esta registrado');
    } else {
        next(error);
    }
})

// Autenticar Usuario
UsuariosSchema.methods = {
    compararContraseña: function(Contraseña) {
        return bcrypt.compareSync(Contraseña, this.Contraseña)
    }
};

module.exports = mongoose.model('Usuario', UsuariosSchema)
const EmailConfig = require('../config/emai');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const util = require('util');
const { send } = require('process');


let Transport = nodemailer.createTransport({
    host:EmailConfig.host,
    port:EmailConfig.port,
    auth:{
        user:EmailConfig.user,
        pass:EmailConfig.pass
    } 
});

// UtilizAR template de handlebars 
Transport.use('compile',hbs({
    viewEngine:{
        extname:".handlebars",
        defaultLayout:false
    },
    viewPath: __dirname+'/../views/emails',
    extName:'.handlebars'
}));

exports.Enviar = async (opciones) =>{
    const opcionesEmail = {
        from:'devJobs <noresponder@devJobs.com',
        to:opciones.usuario.Email,
        subject:opciones.subject,
        template:opciones.archivo,
        context:{
            ResetUrl:opciones.ResetUrl
        }
    }

    const sendMail = util.promisify(Transport.sendMail, Transport);
    return sendMail.call(Transport,opcionesEmail)

}
const express = require('express');
const router = express.Router();

// Importar Controladores
const homeController = require('../controllers/homeController');
const vacanteController = require('../controllers/vacanteController');
const UsuariosController = require('../controllers/UsuarioController');
const AuthController = require('../controllers/AuthController');
const { route } = require('express/lib/application');

module.exports = () => {
    router.get('/', homeController.MostrarTrabajos);

    // Crear Vacantes
    router.get('/vacantes/nueva',
        AuthController.verificarUsuario,
        vacanteController.FormularioNuevaVacante
    );
    router.post('/vacantes/nueva',
        AuthController.verificarUsuario,
        vacanteController.ValidarVacante,
        vacanteController.AgregarVacante
    );

    

    // Mostrar Vacante
    router.get('/vacantes/:Url',
        vacanteController.VacanteNueva
    );

    
    // Recibir  Mensajes de Candidatos
    router.post('/vacantes/:Url',
    vacanteController.SubirCv,
    vacanteController.Contactar
    )


    // Mostrar los Candidatos de la vacante
    router.get('/candidatos/:id',
    AuthController.verificarUsuario,
    vacanteController.mostrarCandidatos
    )


    // Actualizar Vacante
    router.get('/vacantes/editar/:Url',
        AuthController.verificarUsuario,
        vacanteController.FormActualizarVacante
    );
    router.post('/vacantes/editar/:Url',
        AuthController.verificarUsuario,
        vacanteController.ValidarVacante,
        vacanteController.ActualizarVacante
    );

    // Eliminar Vacantes
    router.delete('/vacantes/eliminar/:id',vacanteController.EliminarVacante)


    // Crear-Cuenta
    router.get('/crear-cuenta', UsuariosController.FormCrearCuenta)
    router.post('/crear-cuenta',
        UsuariosController.ValidarRegistro,
        UsuariosController.CrearCuenta
    );


    // Autenticar  Usuario
    router.get('/iniciar-secion', UsuariosController.FormIniciarSecion);
    router.post('/iniciar-secion', AuthController.AutenticarUsuario);

    // Restablecer Contraseña
    router.get('/restablecer-password', AuthController.formRestPassword);
    router.post('/restablecer-password', AuthController.EnviarToken);

    // Resetear Contraseña Almacenar en BD
    router.get('/restablecer-password/:Token',AuthController.RestablecerContraseña)
    router.post('/restablecer-password/:Token', AuthController.GuardarPassword);


    // Cerrar Sesion
    router.get('/cerrar-sesion', 
    AuthController.verificarUsuario,
    AuthController.cerrarSesion
    )

    // Panel de Administracion
    router.get('/Administracion',
        AuthController.verificarUsuario,
        AuthController.MostrarPanel
    );

    // Editar Perfil
    router.get('/editar-perfil',
        AuthController.verificarUsuario,
        UsuariosController.FormEditarPerfil
    );
    router.post('/editar-perfil',
        AuthController.verificarUsuario,
        UsuariosController.SubirImagen,
        UsuariosController.EditarPerfil
    );



    return router;
}
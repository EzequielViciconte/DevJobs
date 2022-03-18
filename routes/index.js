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
        AuthController.verificarUsuario,
        vacanteController.VacanteNueva
    );

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
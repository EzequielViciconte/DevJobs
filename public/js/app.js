import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const Skills = document.querySelector('.lista-conocimientos');


        LimpiarAlertas();
    
    if (Skills) {
        Skills.addEventListener('click', agregarSkills);
        // Una ves que estemos en editar ,llamar Funcion
        skillsSeleccionadas();
    }
    
    const vacantesListado = document.querySelector('.panel-administracion');
    if(vacantesListado){
        vacantesListado.addEventListener('click',accionesListado)
    }



})

// Funciones
const Skills = new Set();

const agregarSkills = e => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) {
            Skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            Skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }
    }

    const SkillsArray = [...Skills];
    document.querySelector('#Skills').value = SkillsArray;
}

const skillsSeleccionadas = () => {
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));


    seleccionadas.forEach(seleccionada => {
        Skills.add(seleccionada.textContent);
    })


    const SkillsArray = [...Skills];
    document.querySelector('#Skills').value = SkillsArray;
}


const LimpiarAlertas = () => {
    const Alertas = document.querySelector('.alertas');
    const interval = setInterval(() => {
        if (Alertas.children.length > 0) {
            Alertas.removeChild(Alertas.children[0]);
        } else if (Alertas.children.length === 0) {
            Alertas.parentElement.removeChild(Alertas);
            clearInterval(interval)
        }
    }, 2000)
}

// Eliminar Vacante+
const accionesListado = e => {
    e.preventDefault();
    if(e.target.dataset.eliminar){
        // Eliminar por Axios
        Swal.fire({
            title: '¿Confirmar Eliminacion?',
            text: "Una ves Eliminada,No se puede Restaurar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminalo!'
          }).then((result) => {
            if (result.isConfirmed) {
                // Enviar peticion con AXIOS
                const Url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                // Axios para Eliminar el registro
                axios.delete(Url,{params:{Url}})
                    .then(function(respuesta){
                        if(respuesta.status === 200){
                            Swal.fire(
                                'Eliminado!',
                                respuesta.data,
                                'success'
                              );

                            // Todo: Eliminar del DOM
                            e.target.parentElement.parentElement.remove();
                        }
                    }).catch(() =>{
                        Swal.fire({
                            type:'error',
                            title:'Hubo un Error',
                            text:'No se pudo Eliminar'
                        });
                    })
      
           
            }
          })
    }
    else if(e.target.tagName === 'A'){
        window.location.href = e.target.href;
    }
}
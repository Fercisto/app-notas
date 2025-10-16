// Selectores
const fomulario = document.querySelector('#formulario');
const notasDiv = document.querySelector('#notas');
const inputMensaje = document.querySelector('#mensaje');
const inputSubmit = document.querySelector('#submit');
let idEditando = null; 

document.addEventListener('DOMContentLoaded', () => {
    fomulario.addEventListener('submit', agregarNota);
    mostarNotas();
});

class Nota {
    constructor() {
        this.id = '';
        this.msg = '';
    }

    agregar(msg) {
        this.id = Date.now();
        this.msg = msg;
    }
}

function agregarNota(e) {
    e.preventDefault();

    const mensaje = inputMensaje.value.trim();

    if(mensaje === '') {
        mostrarAlerta('El Campo no Puede ir Vacío', 'error');
        return;
    } 

    let notas = JSON.parse(localStorage.getItem('notas')) ?? [];

    if(idEditando) {
        const notasActualizadas = notas.map(nota => {
            if(nota.id === idEditando) {
                // retornar una nueva copia del objeto con el mensaje actualizado
                return { ...nota, msg: inputMensaje.value.trim() };
            }
            return nota;
        });

        localStorage.setItem('notas', JSON.stringify(notasActualizadas));
        idEditando = null; // Reinicia modo edición
        inputSubmit.value = 'Agregar Nota';
    } else {
        const notaObj = new Nota();
        notaObj.agregar(mensaje);
        
        notas = [...notas, notaObj];

        localStorage.setItem('notas', JSON.stringify(notas));
    }

    fomulario.reset();
    mostarNotas();

}

function mostarNotas() {
    limpiarHTML();

    const notas = JSON.parse(localStorage.getItem('notas')) ?? [];

    if(notas.length > 0) {
        notas.forEach(nota => {
                
            const notaDiv = document.createElement('DIV');

            const notaMensaje = document.createElement('P');
            notaMensaje.textContent = nota.msg;

            const btnAcutalizar = document.createElement('BUTTON');
            btnAcutalizar.textContent = 'Actualizar';

            btnAcutalizar.onclick = () => {
                inputMensaje.value = nota.msg;
                idEditando = nota.id;
                inputSubmit.value = 'Editar Nota';
            }

            const btnEliminar = document.createElement('BUTTON');
            btnEliminar.textContent = 'Eliminar';

            btnEliminar.onclick = () => {
                eliminarNota(nota.id);
            }

            notaDiv.append(notaMensaje, btnAcutalizar, btnEliminar);

            notasDiv.appendChild(notaDiv);
        });
    } else {

        const noHayNotasTexto = document.createElement('P');
        noHayNotasTexto.textContent = 'Aún no Tienes Notas - Agrega una Nota';
        noHayNotasTexto.classList.add('notas-vacias');
        notasDiv.appendChild(noHayNotasTexto);

    }
}

function eliminarNota(id) {

    const notas = JSON.parse(localStorage.getItem('notas')) ?? [];
    const notasActualizadas = notas.filter(nota => nota.id !== id);
    localStorage.setItem('notas', JSON.stringify(notasActualizadas));

    mostarNotas();
}

function mostrarAlerta(msg, tipo) {

    const alertaPrevia = document.querySelector('.alerta') ?? '';

    if(!alertaPrevia) {
        const alerta = document.createElement('DIV');
        alerta.textContent = msg;
        alerta.classList.add('alerta');

        if(tipo == 'error') {
            // Agrega calses de alerta con error
            alerta.classList.add('error');
        } else {
            // Agrega clases de alerta con exito
            alerta.classList.add('exito');
        }

        fomulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }

    
}

function limpiarHTML() {
    while(notasDiv.firstChild) {
        notasDiv.removeChild(notasDiv.firstChild);
    }
}
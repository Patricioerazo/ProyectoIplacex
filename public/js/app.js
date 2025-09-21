// Variables
const carrito = document.querySelector('#carrito');
document.querySelectorAll('#productos').forEach(lista => {
    lista.addEventListener('click', agregarCurso);
});
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito'); 

let articulosCarrito = [];


// Listeners

cargarEventListeners();

function cargarEventListeners() {
    // Cuando se elimina un curso del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Al Vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    // NUEVO: Contenido cargado
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });
}
//funcion para borrar el carro completo DOM
function vaciarCarritoDOM() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// Función que añade el curso al carrito
function agregarCurso(e) {
     e.preventDefault();
     // Delegation para agregar-carrito
     if(e.target.classList.contains('agregar-carrito')) {
          const curso = e.target.parentElement.parentElement;
          // Enviamos el curso seleccionado para tomar sus datos
          leerDatosCurso(curso);
          mostrarAlerta();
     }
     
}

// Lee los datos del producto/curso
function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio-final').textContent, // siempre un único precio válido
        id: parseInt(curso.querySelector('a').getAttribute('data-id')),
        cantidad: 1
    };

    if (articulosCarrito.some(curso => curso.id === infoCurso.id)) {
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
            }
            return curso;
        });
        articulosCarrito = [...cursos];
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();
}


// Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = parseInt(e.target.getAttribute('data-id')); 
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        carritoHTML();
    }
}

//funcino para mostrar mensaje al agregar al carrito

function mostrarAlerta(){
     Swal.fire({
     title: 'Bien',
     text: 'Agregado con Exito!',
     icon: 'success',
     showConfirmButton: false,
     timer: 2500
})};

//paso de finalizar la compra
document.querySelector('#finalizar-compra').addEventListener('click', finalizarCompra);

function finalizarCompra(e) {
    e.preventDefault();

    // Enviar carrito al backend
    fetch('/api/pedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ carrito: articulosCarrito })
    })
    .then(res => res.json())
    .then(data => {
        Swal.fire('Pedido realizado', 'Tu compra fue registrada con éxito, te contactaremos a la brevedad', 'success');
        console.log(data);
        // limpiar carrito
        articulosCarrito = [];
        carritoHTML();
    })
    .catch(err => {
        console.error('Error:', err);
        Swal.fire('Error', 'No se pudo registrar el pedido', 'error');
    });
}



// Muestra el curso seleccionado en el Carrito
function carritoHTML() {
    vaciarCarritoDOM(); // solo limpia las filas, no el array

    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${curso.imagen}" width=100></td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>${curso.cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
        `;
        contenedorCarrito.appendChild(row);
    });

    sincronizarStorage();
}


// NUEVO: 
function sincronizarStorage() {
     localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
    articulosCarrito = [];       // limpia array
    sincronizarStorage();        // limpia localStorage
    vaciarCarritoDOM();          // limpia DOM
}


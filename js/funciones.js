let consultaRegistrada = 'Consulta registrada correctamente.';
let datoBorrado = 'Consulta eliminada correctamente.';
let historialBorrado = 'Va a borrar el historial!';
// selecciona la moneda
let seleccionar = document.getElementById('dedivisa');
let tipocambio = document.getElementById('tipocambio');
// muestra el resultado final de la operacion
let myResult = document.getElementById('result')
// realiza la operacion
let buttonCalcular = document.getElementById('calcular');
let buttonLimpiar = document.getElementById('limpiar');
let buttonBorrarStorage = document.getElementById('borrarStorage')
// array en el que se van a guardar todos los datos de conversion con push
let listaConsultas = [];
let nroConsulta = 0;
let historialConsultas = document.getElementById("historialConsultas")
buttonCalcular.addEventListener('click', calcularCotizacion);
buttonLimpiar.addEventListener('click', borrarDatos);
buttonBorrarStorage.addEventListener('click', borrarHistorial)

// cargo las monedas
window.addEventListener('load', establecerMonedaDestino);
window.addEventListener('load', cargarCotizacion);

// obtengo la moneda seleccionada
seleccionar.addEventListener('change', establecerMonedaDestino);
tipocambio.addEventListener('change', establecerCotizacion);

cargarConsultasFromStorage();
render(listaConsultas);

function establecerCotizacion() {
  document.getElementById('cotizacion').value = parseInt(tipocambio.value)
}

function establecerMonedaDestino() {
  let eleccion = seleccionar.value;
}

// carga las cotizaciones desde la pagina dolar si, se filtran solo
// aquellas que tengan valores de compra
async function cargarCotizacion() {
  await fetch('https://www.dolarsi.com/api/api.php?type=valoresprincipales')
    .then(response => response.json())
    .then(data => {
      for (const resultado of data) {
        let cotizacionValida = true;
        if (resultado.casa.nombre == 'Dolar Blue') {
          document.getElementById('cotizacion').value = parseInt(resultado.casa.compra)
        }
        if (resultado.casa.compra == 'No Cotiza' || resultado.casa.nombre == 'Argentina' || resultado.casa.nombre == 'Bitcoin') {
          cotizacionValida = false
        }
        if (cotizacionValida){
          let opcion = document.createElement('option')
          opcion.value = parseInt(resultado.casa.compra)
          opcion.text = resultado.casa.nombre
          tipocambio.add(opcion)
        }
      }
    });
  establecerCotizacion()
}

// funcion que realiza la conversion y asigna variables
function consulta(numConsulta, monedaOrigen, monto, cotizacion) {
  this.numConsulta = numConsulta;
  this.monedaOrigen = monedaOrigen;
  this.monto = monto;
  this.cotizacion = cotizacion || 0;
  this.resultado;
  this.cotizado = 0;
  this.cotizar = function (numConsulta, monedaOrigen, monto, cotizacion) {
    if (monedaOrigen == "2") {
      this.cotizado = monto * cotizacion;
    } else {
      this.cotizado = monto / cotizacion;
    }
    this.resultado = this.cotizado.toFixed(2)
    return this.resultado

  }
}

// funcion principal de la aplicacion, calcula cotizacion, llama al guardado
// en el storage, pushea en el array y muestra los mensajes
function calcularCotizacion() {
  let montoOrigen = document.getElementById('montoOrigen').value;
  let eleccion = seleccionar.value;
  let cotizacion = document.getElementById('cotizacion').value;
  if (montoOrigen == 0 || cotizacion == 0) {
    return myResult.innerHTML = `<h2>Error en los montos, verifique por favor</h2>`
  } else {
    nroConsulta += 1;
    let nuevaConsulta = new consulta(nroConsulta, eleccion, montoOrigen, cotizacion);
    listaConsultas.push(nuevaConsulta);
    myResult.innerHTML = `<h2>Su monto cotizado es: ${nuevaConsulta.cotizar(nroConsulta, eleccion, montoOrigen, cotizacion)}`;
    guardarConsultaToStorage();
    render(listaConsultas);
    mostrarMensaje(consultaRegistrada);
    return myResult;
  }
}

// reinicia el html para el ingreso de datos
function borrarDatos() {
  document.getElementById('montoOrigen').value = 0;
  document.getElementById('cotizacion').value = 0;
  myResult.innerHTML = "";
}

// guarda las consultas en el local storage
function guardarConsultaToStorage() {
  localStorage.setItem('consulta', JSON.stringify(listaConsultas))
}

// carga los datos almacenados en el local storage
function cargarConsultasFromStorage() {
  if (localStorage.getItem('consulta') !== null) {
    listaConsultas = JSON.parse(localStorage.getItem('consulta'));
    // obtengo el ultimo id para que no se pisen si agrego otra consulta
    let ultimaConsulta = listaConsultas[listaConsultas.length - 1];
    nroConsulta = ultimaConsulta.numConsulta;
  }
}

// renderiza en el html todo el contenido de las consultas realizadas
function render(lista) {
  historialConsultas.innerHTML = ""
  let moneda;
  for (const consultas of lista) {

    let card = document.createElement("div")

    card.className = "card"
    if (consultas.monedaOrigen == "2") {
      moneda = 'U$S'
    } else {
      moneda = '$'
    }
    card.innerHTML = `<h5 class="card-title">Moneda Origen: ${moneda}</h5>
                          <p class="card-text">Monto: ${consultas.monto}</p>
                          <p class="card-text">Cotizacion: ${consultas.cotizacion}</p>
                          <p class="card-text">Monto Cotizado: ${consultas.resultado}</p>
                          <p>Consulta nro: ${consultas.numConsulta}</p>`

    historialConsultas.append(card)

    let buttonDelete = document.createElement('button')
    buttonDelete.classList.add('btn', 'btn-danger')
    buttonDelete.innerText = 'X'
    buttonDelete.dataset.item = consultas.numConsulta
    buttonDelete.addEventListener('click', deleteConsulta)
    historialConsultas.append(buttonDelete)
  }
}

// borra una consulta realizada
function deleteConsulta(event) {
  let id = event.target.dataset.item
  let filtroActual = listaConsultas = listaConsultas.filter((listaConsultas) => listaConsultas.numConsulta != id)
  guardarConsultaToStorage();
  mostrarMensaje(datoBorrado)
  render(filtroActual)
}

// muestra mensaje debajo a la derecha indicando la accion recibida
async function mostrarMensaje(mensaje) {
  await Toastify({
    text: mensaje,
    className: "info",
    duration: 5000,
    gravity: 'bottom'
  }).showToast();

}

// borra el historial en storage y array
function borrarHistorial() {
  Swal.fire({
    title: 'Esta seguro',
    text: historialBorrado,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, borrar!'
  }).then((result) => {
    if (result.isConfirmed) {
      if (localStorage.getItem('consulta') !== null) {
        localStorage.removeItem('consulta');
      }
      listaConsultas = [];
      render(listaConsultas);
      borrarDatos();
      Swal.fire(
        'Borrado!',
        'Historial eliminado correctamente.',
        'success'
      )
    }
  })
}
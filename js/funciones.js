// selecciona la moneda
let seleccionar = document.querySelector('select');
// muestra el resultado final de la operacion
let myResult = document.getElementById('result')
// realiza la operacion
let buttonCalcular = document.getElementById('calcular');
let buttonLimpiar = document.getElementById('limpiar');
let buttonBorrarStorage = document.getElementById('borrarStorage')
// array en el que se van a guardar todos los datos de conversion con push
let listaConsultas = [];
let nroConsulta = 0;
let catalogo = document.getElementById("catalogo")
buttonCalcular.addEventListener('click', calcularCotizacion);
buttonLimpiar.addEventListener('click', borrarDatos);
buttonBorrarStorage.addEventListener('click', removerStorage)

// cargo las monedas
window.addEventListener('load', establecerMonedaDestino);

// obtengo la moneda seleccionada
seleccionar.addEventListener('change', establecerMonedaDestino);

cargarConsultasFromStorage();
render(listaConsultas);

function establecerMonedaDestino() {
  let eleccion = seleccionar.value;
}

// funcion que realiza la conversion y asigna variables
function consulta(numConsulta, monedaOrigen, monto, cotizacion){
  this.numConsulta = numConsulta;
  this.monedaOrigen = monedaOrigen;
  this.monto = monto;
  this.cotizacion = cotizacion || 0;
  this.resultado;
  this.cotizado = 0;
  this.cotizar = function(numConsulta, monedaOrigen, monto, cotizacion){
     if(monedaOrigen == "2"){
        this.cotizado = monto * cotizacion;
     }else{
        this.cotizado = monto / cotizacion;
     }
     this.resultado = this.cotizado.toFixed(2)
     return this.resultado
     
  }
}

function calcularCotizacion(){
  let montoOrigen = document.getElementById('montoOrigen').value;
  let eleccion = seleccionar.value;
  let cotizacion  = document.getElementById('cotizacion').value;
  if (montoOrigen == 0 || cotizacion == 0){
    return myResult.innerHTML = `<h2>Error en los montos, verifique por favor</h2>`
  }else{
    nroConsulta += 1;
    let nuevaConsulta = new consulta (nroConsulta, eleccion, montoOrigen, cotizacion);
    listaConsultas.push(nuevaConsulta);
    myResult.innerHTML = `<h2>Su monto cotizado es: ${nuevaConsulta.cotizar(nroConsulta, eleccion, montoOrigen, cotizacion)}`;
    guardarConsultaToStorage();
    render(listaConsultas);
    return myResult;
  }

}

function borrarDatos(){
  document.getElementById('montoOrigen').value = 0;
  document.getElementById('cotizacion').value = 0;
  myResult.innerHTML = "";
}

function guardarConsultaToStorage(){
  localStorage.setItem('consulta', JSON.stringify(listaConsultas))
}

function cargarConsultasFromStorage(){
  if(localStorage.getItem('consulta') !== null){
    listaConsultas = JSON.parse(localStorage.getItem('consulta'));
    // obtengo el ultimo id para que no se pisen si agrego otra consulta
    let ultimaConsulta = listaConsultas[listaConsultas.length - 1];
    nroConsulta = ultimaConsulta.numConsulta;
  }
}

function removerStorage(){
  if(localStorage.getItem('consulta') !== null){
    localStorage.removeItem('consulta');
  }
  listaConsultas = [];
  render(listaConsultas);
}

function render(lista) {
    catalogo.innerHTML = ""
    let moneda;
    for(const consultas of lista){

        let card = document.createElement("div")

        card.className = "card"
        if(consultas.monedaOrigen == "2" ){
          moneda = 'U$S'
        }else{
          moneda = '$'
        }
        card.innerHTML = `<h5 class="card-title">Moneda Origen: ${moneda}</h5>
                          <p class="card-text">Monto: ${consultas.monto}</p>
                          <p class="card-text">Cotizacion: ${consultas.cotizacion}</p>
                          <p class="card-text">Monto Cotizado: ${consultas.resultado}</p>
                          <p>Consulta nro: ${consultas.numConsulta}</p>`

        catalogo.append(card)

        let buttonDelete = document.createElement('button')
        buttonDelete.classList.add('btn', 'btn-danger')
        buttonDelete.innerText = 'X'
        buttonDelete.dataset.item = consultas.numConsulta
        buttonDelete.addEventListener('click', deleteProduct)
        catalogo.append(buttonDelete)
    }
}

function deleteProduct(event){
  let id = event.target.dataset.item
  let filtroActual = listaConsultas = listaConsultas.filter((listaConsultas)=>listaConsultas.numConsulta != id)
  guardarConsultaToStorage();
  render(filtroActual)
}
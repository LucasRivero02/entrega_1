// aplique el uso de:

const menuProceso = "Ingrese la moneda origen\n1-Dolar\n2-Pesos\nESC-Salir";
const menuConsulta = "Ingrese la opcion que desea consultar\n1-Dolares\n2-Pesos\nESC-SALIR"
const menuPrincipal = "Ingrese la opcion que desea\n1-Cotizar\n2-Consultar\nESC-SALIR";

// array en el que se van a guardar todos los datos de conversion con push
let listaConsultas = [];

// funcion que realiza la conversion y asigna variables
function conversion(monedaOrigen, monto, cotizacion){
   this.monedaOrigen = monedaOrigen;
   this.monto = monto;
   this.cotizacion = cotizacion || 0;
   this.resultado;
   this.cotizar = function(monedaOrigen, monto, cotizacion){
      if(monedaOrigen == "1"){
         return this.resultado = monto * cotizacion;
      }else{
         return this.resultado = monto / cotizacion;
      }
   }
}

// proces en el que se ingresan la moneda y montos para convertir
function proceso(){
   let monedaOrigen = prompt(menuProceso);
   while(monedaOrigen != "ESC" ){
      let monedaCorrecta = false;
      let monedaSimbolo;
      let monedaSimboloSalida;
      switch(monedaOrigen) {
         case "1":
            monedaCorrecta = true;
            monedaSimbolo = 'U$S';
            monedaSimboloSalida = '$';
            break
         case "2":
            monedaCorrecta = true;
            monedaSimbolo = '$';
            monedaSimboloSalida = 'U$S';
            break
         default:
            break;
      }
      if (monedaCorrecta){
         let montoOrigen = parseInt(prompt('Ingrese monto en ' +  monedaSimbolo + ':'));
         let cotizacion = parseInt(prompt('Ingrese cotizacion: '));
         let nuevaConsulta = new conversion(monedaOrigen, montoOrigen, cotizacion);
         listaConsultas.push(nuevaConsulta);
         alert('Su monto cotizado es de: ' + monedaSimboloSalida + nuevaConsulta.cotizar(monedaOrigen, montoOrigen, cotizacion ));
      }else{
         alert("Hay un error con la MONEDA ingresada");
      }
      monedaOrigen = prompt(menuProceso);
   }
}

// menu en el que se ingresa el valor por el que se va a realizar el filtro
function consulta(){
   let filtroConsulta = prompt(menuConsulta);
   while(filtroConsulta != "ESC" ){
      if (filtroConsulta == '1' || filtroConsulta == '2'){
         filtrado(filtroConsulta)
      }else{
         alert('Valor invalido')
      }
      filtroConsulta = prompt(menuConsulta);
   }
}

// funcion para aplicar el filtro de lo que se quiere consultar
function filtrado(filtro){
   let filtroActual = listaConsultas.filter((listConsultas)=>listConsultas.monedaOrigen == filtro)
   if(filtroActual.length == 0){
       alert("Ese filtro no existe")
   }else{
      menuPrincipal(filtroActual)
   }
}

// menu principal
function menu(){
   let opcion = prompt(menuPrincipal);
   console.log('opcion: ', opcion);
   while(opcion != "ESC" ){
      switch(opcion) {
         case "1":
            proceso();
            break;
         case "2":
            consulta();
            break;
         default:
            break;
      }
      opcion = prompt(menuPrincipal);
   }
}

// muestro el resultado del nuevo array filtrado
function mostrarConsulta(lista) {
   let consultasRealizadas = ''
   for(const prod of lista){
      if(prod.monedaOrigen == '1'){
         moneda = 'U$S'
         monedaSalida = '$'
      }else{
         moneda = '$'
         monedaSalida = 'U$S'
      }
      consultasRealizadas += 'MON. ORIG: ' + moneda + ' - MONTO: ' + prod.monto + ' - COTIZACION: ' + prod.cotizacion + ' - RESULTADO: ' + monedaSalida + prod.resultado + '\n'
   }
   alert(consultasRealizadas)

}

menu()
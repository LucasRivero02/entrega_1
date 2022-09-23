// aplique el uso de:
// - declaracion de variables
// - alert - prompt
// - while
// - if - switch
// - funciones
// - ademas adjunto el avance del html

function proceso(){
   let monedaOrigen = prompt("Ingrese la moneda origen\n1-Dolar\n2-Pesos\nESC-Salir");
   while(monedaOrigen != "ESC" ){
      var monedaCorrecta = false;
      var monedaSimbolo;
      var monedaSimboloSalida;
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
         alert('Su monto cotizado es de: ' + monedaSimboloSalida + conversorMoneda(montoOrigen, cotizacion, monedaOrigen));
      }else{
         alert("Hay un error con la MONEDA ingresada");
      }
      monedaOrigen = prompt("Ingrese la moneda origen\n1-Dolar\n2-Pesos\nESC-Salir");
   }
   
   function conversorMoneda(numero1, numero2, monedaOrigen) {
      if(monedaOrigen === "1"){
         return numero1 * numero2;
      }else{
         return numero1 / numero2;
      }
   }
}

proceso()
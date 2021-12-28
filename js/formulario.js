// Genero en el DOM todas las opciones para la entrada tomando los valores de los arrays de fechas y objetos literales de ubicaciones
let valorCotizacionDolar = 0;
const fechasRecital = ['15/02/2022', '18/02/2022', '21/02/2022', '24/02/2022'];

const ubicaciones = [{ id: 1, nombre: 'General', precio: 15 },
{ id: 2, nombre: 'Campo', precio: 35 },
{ id: 3, nombre: 'Platea Oeste', precio: 50 },
{ id: 4, nombre: 'Platea Este', precio: 50 },
{ id: 5, nombre: 'Campo VIP', precio: 100 }
];

const fechasRetiro = ['15/01/2022', '18/01/2022', '21/01/2022'];

$(document).ready(function () {

    cotizacionDolar();

    fechasRecital.forEach((fecha, indice) => {
        $("#opcionesFechaRecital").append(`<option value="${indice}">${fecha}</option>`);
    });

    ubicaciones.forEach((ubicacion, indice) => {
        $("#opcionesUbicacion").append(`<option value="${indice}">${ubicacion.nombre} - US$${ubicacion.precio}</option>`);
    });

    fechasRetiro.forEach((fecha, indice) => {
        $("#opcionesFechaRetiro").append(`<option value="${indice}">${fecha}</option>`);
    });


});

function cotizacionDolar() {
    const URL_COTIZACION = "https://cors-anywhere.herokuapp.com/https://api-dolar-argentina.herokuapp.com/api/dolaroficial";

    $.ajax({
        method: "GET",
        url: URL_COTIZACION,
        success: function (cotizacion) {
            $("#valorCotizacion").prepend(`<p class="text-light text-center">Cotizacion US$: $${cotizacion.venta}</p>`);
            valorCotizacionDolar = cotizacion.venta;
        }
    })
}
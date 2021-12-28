let entradas = [];
let idInicial = 0;

if (JSON.parse(localStorage.getItem("Entradas")) != null) {
    localStorage.clear();
}

// Reseteo el formulario si el usuario hace click en Cancelar
$("#botonCancelar").click(resetearFormulario);

// Valido formulario al clickear Confirmar en el form
$("#formularioCompra").submit(validarFormulario);

// Genero tabla en el DOM para resumen de compra con una animacion de Fade In
$("#compra").hide();
$("#compra").append(`<h4 class="text-light">Tu compra:</h4>`);

$("#compra").append(`<table id="tabla" class="table table-striped table-dark">
                        <thead class="bg-dark">
                            <th>ID</th>
                            <th>Fecha Del Recital</th>
                            <th>Ubicacion</th>
                            <th>Fecha De Entrega</th>
                            <th>Cantidad</th>
                            <th>Sub-Total US$</th>
                            <th>Sub-Total $</th>
                            <th>Accion</th>
                        </thead>
                        <tbody>
                            
                        </tbody>
                    </table>`);
$("#compra").fadeIn(2000);

// Funcion para validar el formulario y pasarle los valores validados a los objetos
function validarFormulario(e) {

    e.preventDefault();

    let cantidadDeEntradas = parseInt($("#cantidadEntradas").val());
    let opcionFechaRecital = $("#opcionesFechaRecital").val();
    let opcionUbicacion = $("#opcionesUbicacion").val();
    let opcionFechaRetiro = $("#opcionesFechaRetiro").val();

    if (!(cantidadDeEntradas > 0)) {
        $("#errorCantidadEntradas").text("Por favor ingresa un valor numerico mayor a 0");
    } else {
        $("#errorCantidadEntradas").text("");
    }

    if (opcionFechaRecital == "-1") {
        $("#errorFechaRecitalVacia").text("Por favor selecciona una fecha para el recital");
    } else {
        $("#errorFechaRecitalVacia").text("");
    }

    if (opcionUbicacion == "-1") {
        $("#errorUbicacionVacia").text("Por favor selecciona una ubicacion");
    } else {
        $("#errorUbicacionVacia").text("");
    }

    if (opcionFechaRetiro == "-1") {
        $("#errorFechaRetiroVacia").text("Por favor selecciona una fecha para retirar tu entrada");
    } else {
        $("#errorFechaRetiroVacia").text("");
    }

    if (cantidadDeEntradas > 0 && opcionFechaRecital != "-1" && opcionUbicacion != "-1" && opcionFechaRetiro != "-1") {
        let fechaRecitalSeleccionada = $("#opcionesFechaRecital option:selected").text();
        let ubicacionSeleccionada;
        ubicaciones.forEach((ubicacion) => {
            if ((ubicacion.nombre + ' - US$' + ubicacion.precio) == $("#opcionesUbicacion option:selected").text()) {
                ubicacionSeleccionada = ubicacion;
            }
        });
        let fechaRetiroSeleccionada = $("#opcionesFechaRetiro option:selected").text();

        // Reseteo formulario y cierro el modal
        resetearFormulario();
        $('#modalEntradas').modal('hide');

        // Verifico si el local storage esta vacio, genero objeto entrada y lo pusheo al array
        if (JSON.parse(localStorage.getItem("Entradas")) != null) {
            entradas = JSON.parse(localStorage.getItem("Entradas"));
            idInicial++;
            let nuevaEntrada = new Entrada(idInicial, fechaRecitalSeleccionada, ubicacionSeleccionada, fechaRetiroSeleccionada, cantidadDeEntradas);
            entradas.push(nuevaEntrada);
            localStorage.setItem("Entradas", JSON.stringify(entradas));
            generarFilasCompra(nuevaEntrada);

        } else {
            idInicial++;
            let nuevaEntrada = new Entrada(idInicial, fechaRecitalSeleccionada, ubicacionSeleccionada, fechaRetiroSeleccionada, cantidadDeEntradas);
            entradas.push(nuevaEntrada);
            localStorage.setItem("Entradas", JSON.stringify(entradas));
            generarFilasCompra(nuevaEntrada);
        }

        return true;
    } else {
        return false;
    }
}

// Funcion para generar dinamicamente las filas en la tabla de compra en el DOM
function generarFilasCompra(entrada) {

    $("tbody").append(`<tr id="fila${entrada.id}">
                            <td class="align-middle">${entrada.id}</td>                            
                            <td class="align-middle">${entrada.fechaRecital}</td>
                            <td class="align-middle">${entrada.ubicacion.nombre + ' - US$' + entrada.ubicacion.precio}</td>
                            <td class="align-middle">${entrada.fechaRetiro}</td>
                            <td class="align-middle">${entrada.cantidad}</td>
                            <td class="align-middle">US$${entrada.cantidad * entrada.ubicacion.precio}</td>
                            <td class="align-middle">$${entrada.cantidad * entrada.ubicacion.precio * valorCotizacionDolar}</td>
                            <td> <button id="eliminarEntrada${entrada.id}" class="btn btn-danger">Borrar</button></td>
                        </tr>`)

    calcularTotal();
    // Toast message confirmando que se agregaron las entradas al carrito
    Swal.fire({
        toast: true,
        icon: 'success',
        title: 'Entradas agregadas con exito',
        position: 'top-right',
        iconColor: 'white',
        color: '#f8f9fa',
        background: '#a5dc86',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
    });

    // Para eliminar entradas del carrito
    $(`#eliminarEntrada${entrada.id}`).click(function () {
        let entradaEliminar = entradas.findIndex(e => e.id == entrada.id);
        entradas.splice(entradaEliminar, 1);
        $(`#fila${entrada.id}`).fadeOut();

        // Toast message confirmando que se eliminaron las entradas del carrito
        Swal.fire({
            toast: true,
            icon: 'error',
            title: 'Entradas removidas con exito',
            position: 'top-right',
            iconColor: 'white',
            color: '#f8f9fa',
            background: '#dc3545',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
        });

        localStorage.setItem("Entradas", JSON.stringify(entradas));
        calcularTotal();
    });

}
// Funcion para calcular el total de la compra
function calcularTotal() {
    let total = 0;
    let imprimirValores = JSON.parse(localStorage.getItem("Entradas"));

    imprimirValores.forEach(element => {
        total = total + element.cantidad * element.ubicacion.precio;
    })
    // Si es la primera entrada creo el Total, sino actualizo el Total
    if ($("#totalCompra").text() == "") {
        $("#totalCompra").append(`<p>Total US$: ${total}</p> 
                                  <p>Total $: ${total * valorCotizacionDolar}</p>`);
    } else {
        $("#totalCompra").html(`<p>Total US$: ${total}</p> 
                                <p>Total $: ${total * valorCotizacionDolar}</p>`);
    }
}

// Funcion para resetear el formulario
function resetearFormulario() {
    $("#errorCantidadEntradas").text("");
    $("#errorFechaRecitalVacia").text("");
    $("#errorUbicacionVacia").text("");
    $("#errorFechaRetiroVacia").text("");
    formularioCompra.reset();
}
//JQUERY
let carrito = [];
let productosJSON = [];
let dolarCompra;

$(document).ready(function() {
    $("#fila_prueba").css({ background: "red", color: "white" });
    $("#boton").prepend("<button class='btn btn-warning' id='btnSuscrip'>Suscribete al Newsletter</button>");
    $("#btnSuscrip").click(suscribir);
    obtenerValorDolar();
    //selector y evento change
    $("#miSeleccion option[value='pordefecto']").attr("selected", true);
    $("#miSeleccion").on("change", ordenar);
});





function renderizarProductos() {
    //renderizamos los productos 
    console.log(productosJSON)
    for (const prod of productosJSON) {
        $(".milista").append(`<li class="col-sm-3 list-group-item">
        <h3>ID: ${prod.id}</h3>
        <img src="${prod.foto}" width="250px" height="250px">
        <p>Producto: ${prod.nombre}</p>
        <p>Precio $ ${prod.precio}</p>
        <p>Precio U$ ${(prod.precio/dolarCompra).toFixed(1)}</p>
        <button class="btn btn-danger" id='btn${prod.id}'>COMPRAR</button>
    </li>`);

        //Evento para cada boton
        $(`#btn${prod.id}`).on('click', function() {
            agregarACarrito(prod);
        });
    }
}

class ProductoCarrito {
    constructor(objProd) {
        this.id = objProd.id;
        this.foto = objProd.foto;
        this.nombre = objProd.nombre;
        this.precio = objProd.precio;
        this.cantidad = 1;
    }
}

function agregarACarrito(productoNuevo) {
    let encontrado = carrito.find(p => p.id == productoNuevo.id);
    console.log(encontrado);
    if (encontrado == undefined) {
        let prodACarrito = new ProductoCarrito(productoNuevo);
        carrito.push(prodACarrito);
        console.log(carrito);
        Swal.fire(
            'Nuevo producto agregado al carro',
            productoNuevo.nombre,
            'success'
        );
        //agregamos una nueva fila a la tabla de carrito
        $("#tablabody").append(`
            <tr id='fila${prodACarrito.id}'>
            <td> ${prodACarrito.id} </td>
            <td> ${prodACarrito.nombre}</td>
            <td id='${prodACarrito.id}'> ${prodACarrito.cantidad}</td>
            <td> ${prodACarrito.precio}</td>
            <td> <button class='btn btn-light'>🗑️</button>`);
    } else {
        //pido al carro la posicion del producto 
        let posicion = carrito.findIndex(p => p.id == productoNuevo.id);
        console.log(posicion);
        carrito[posicion].cantidad += 1;
        $(`#${productoNuevo.id}`).html(carrito[posicion].cantidad);
    }
    $("#gastoTotal").html(`Total: $ ${calcularTotal()}`);

}

function calcularTotal() {
    let suma = 0;
    for (const elemento of carrito) {
        suma = suma + (elemento.precio * elemento.cantidad);
    }
    return suma;
}

function ordenar() {
    let seleccion = $("#miSeleccion").val();
    if (seleccion == "menor") {
        productosJSON.sort(function(a, b) {
            return a.precio - b.precio
        });
    } else if (seleccion == "mayor") {
        productosJSON.sort(function(a, b) {
            return b.precio - a.precio
        });
    } else if (seleccion == "alfabetico") {
        productosJSON.sort(function(a, b) {
            return a.nombre.localeCompare(b.nombre);
        });
    }
    $("li").remove();
    renderizarProductos();
}

//SUSCRIPCION
function suscribir() {
    $("#suscripcion").append(`
    <h4>Suscribete a nuestro newsletter mensual</h4>
    <form id="miFormulario">
    <input type="text" id="email" placeholder="Ingresa aqui tu email">
    <button type="submit" class="btn btn-warning">Suscribete ahora</button>
    </form>`);
    //EVENTO
    $("#miFormulario").submit(function(e) {
        //prevenir default
        e.preventDefault();
        //aca hay que realizar una validacion del campo
        Swal.fire(
            'Nueva suscripcion realizada:',
            $("#email").val(),
            'success'
        );
        $("#suscripcion").empty();
    });
}

//GETJSON de productos.json
function obtenerJSON() {
    $.getJSON("productos.json", function(respuesta, estado) {
        if (estado == "success") {
            productosJSON = respuesta;
            renderizarProductos();
        }
    });
}

//function para obtener el valor del dolar blue en tiempo real
function obtenerValorDolar() {
    const URLDOLAR = "https://api-dolar-argentina.herokuapp.com/api/dolarblue";
    $.ajax({
        method: "GET",
        url: URLDOLAR,
        success: function(data) {
            $("#fila_prueba").append(`<p align="center">Dolar compra: $ ${data.compra}  Dolar venta: $ ${data.venta}</p>`);
            dolarCompra = data.compra;
            obtenerJSON();
        }
    })
}
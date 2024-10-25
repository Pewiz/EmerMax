// Variable global para almacenar los datos personales
let datosPersonales = [];
const backendUrl = 'https://emermaxbackend.onrender.com';

// Función para capturar los datos del formulario y guardarlos en un arreglo
function guardarDatosPersonales() {
    const nombre = document.querySelector('input[name="user_name"]').value;
    const rut = document.querySelector('input[name="user_rut"]').value;
    const telefono = document.querySelector('input[name="user_phone"]').value;
    const email = document.querySelector('input[name="user_email"]').value;
    const direccion = document.querySelector('input[name="user_address"]').value;
    const ciudad = document.querySelector('input[name="user_ciudad"]').value;

    // Verificar si todos los campos están llenos
    if (nombre && rut && telefono && email && direccion && ciudad) {
        datosPersonales = [nombre, rut, telefono, email, direccion, ciudad]; // Guardar en el arreglo
    }
}

// Función para renderizar el resumen del carrito en la página de pago
function renderCheckoutCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.products');
    const resumenPago = document.querySelector('.card.checkout');

    // Limpiamos el contenedor de productos
    cartContainer.innerHTML = '';

    let subtotal = 0;

    // Iteramos sobre cada producto en el carrito
    cart.forEach((product) => {
        const imageUrl = product.attributes.productoImagen?.data?.attributes?.url
        ? `${product.attributes.productoImagen.data.attributes.url}` // Ajusta la URL base si es necesario
        : `${backendUrl}/default-image.jpg`; // Imagen por defecto si no hay imagen disponible
        const cartItem = document.createElement('div');
        cartItem.classList.add('product');
        cartItem.innerHTML = `
            <img class="imgProduct" src="${imageUrl}" alt="${product.attributes.productoNombre}">
            <div>
                <span>${product.attributes.productoNombre}</span>
                <p>${product.attributes.productoDescripcion}</p>
                <span>${product.attributes.productoPrecio} CLP</span>
            </div>
            <div class="quantity"><label>${product.quantity}</label></div>
            <label class="price small">${(product.attributes.productoPrecio * product.quantity).toFixed(0)} CLP</label> 
        `;
        cartContainer.appendChild(cartItem);
        subtotal += product.attributes.productoPrecio * product.quantity;
    });

    function envioGratis(){
        if(subtotal>=100000){
            return `<span>Envio GRATIS</span>`
        }else{
            return `<span>Se le va a contactar para coordinar</span>`
        }
    }

    if (resumenPago) {
        resumenPago.innerHTML = `
            <label class="title">Pagar</label>
            <div class="details">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(0)} CLP</span>
                <span>Envio:</span>
                ${envioGratis()}
                
            </div>
            <div id="checkout--footer" class="checkout--footer">
                <label class="price"><sup>CLP</sup>${subtotal.toFixed(0)}</label>
                <button id="checkout-btn" class="checkout-btn">Comprar</button>
            </div>
        `;

        // Asignamos el evento de click al botón de checkout
        const checkoutButton = document.getElementById('checkout-btn');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {

                // Verificar si los datos personales están vacíos
                if (datosPersonales.length === 0) {
                    checkoutButton.disabled = true;
                    pedidoEnviado(1, 3)
                } else {
                    enviarFormulario(); 
                    checkoutButton.disabled = true;
                }

            });

            if (cart.length === 0) {
                checkoutButton.disabled = true;
            } else {
                checkoutButton.disabled = false;
            }
            checkoutButton.disabled=false;
        }
        
    } else {
        console.error('No se encontró el contenedor de pago');
    }
}

// Llamamos a la función para renderizar el carrito cuando el DOM esté completamente cargado
window.addEventListener('DOMContentLoaded', renderCheckoutCart);

// Función para calcular el total del carrito
function calcularTotalCarrito() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    cart.forEach(item => {
        total += item.attributes.productoPrecio * item.quantity;
    });
    return total.toFixed(1);
}

// Función para enviar el formulario de pago
function enviarFormulario() {
    const total = calcularTotalCarrito();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Crear los parámetros del formulario con los datos del carrito y del usuario
    const templateParams = {
        user_name: datosPersonales[0], // Usamos los datos guardados en el arreglo
        user_rut: datosPersonales[1],
        user_address: datosPersonales[4],
        user_ciudad: datosPersonales[5],
        user_phone: datosPersonales[2],
        user_email: datosPersonales[3],
        total: total,
        productos: cart.map(item => 
            `Producto: ${item.attributes.productoNombre} \n Cantidad: ${item.quantity} \n Precio Unitario: $${item.attributes.productoPrecio} \n Total: $${(item.quantity * item.attributes.productoPrecio).toFixed(1)}`
        ).join('\n\n')
    };

    const btn = document.getElementById('checkout-btn');
    btn.value = 'Sending...';

    const serviceID = 'service_5yi1qhp';
    const templateID = 'template_wb268mq';
    console.log(templateParams);

    // Enviamos los datos con emailjs
    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            btn.value = 'Send Email';
            //alert(`Pedido enviado! Total del carrito: ${total}`);
            pedidoEnviado(total, 1);

            // Limpiar el carrito de compras y datos del cliente
            localStorage.removeItem('cart'); // Vaciamos el carrito del localStorage
            document.querySelector('form').reset(); // Limpiamos los campos del formulario

            // Deshabilitar los campos y el botón de envío
            document.querySelectorAll('.input_field').forEach(field => {
                field.disabled = true;
            });
            document.querySelector('.verif-datos-btn').disabled = true;

            // Volver a renderizar el carrito vacío
            renderCheckoutCart();

        }, (err) => {
            btn.value = 'Send Email';
            alert(JSON.stringify(err));
        });
}

// Evento para verificar y guardar los datos personales
document.querySelector('.verif-datos-btn').addEventListener('click', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe y la página se recargue

    // Obtener los valores del formulario
    const userName = document.querySelector('input[name="user_name"]').value;
    const userRut = document.querySelector('input[name="user_rut"]').value;
    const userPhone = document.querySelector('input[name="user_phone"]').value;
    const userEmail = document.querySelector('input[name="user_email"]').value;
    const userAddress = document.querySelector('input[name="user_address"]').value;
    const userCiudad = document.querySelector('input[name="user_ciudad"]').value;

    // Validar si todos los campos están completos
    if (userName && userRut && userPhone && userEmail && userAddress && userCiudad) {
        pedidoEnviado(1, 2);

        // Deshabilitar los campos después de guardar los datos
        document.querySelectorAll('.input_field').forEach(field => {
            field.disabled = true;
        });

        // Deshabilitar el botón de verificación de datos
        document.querySelector('.verif-datos-btn').disabled = true;

        // Guardar los datos personales
        guardarDatosPersonales();

    } else {
        pedidoEnviado(1, 4)
    }
});

// Evento para guardar los datos personales al hacer click en el botón "verif-datos-btn"
document.getElementById('button').addEventListener('click', function(event) {
    guardarDatosPersonales(); // Guardamos los datos personales al hacer click
});

function pedidoEnviado(total, tipo) {
    // Crear el div del mensaje si no existe
    let mensaje = document.querySelector('.pedidoCompletado');
    let contenedor= document.querySelector('.containerPedidoCompletado');
    if (!mensaje) {
        contenedor = document.createElement('div');
        contenedor.classList.add('containerPedidoCompletado')
        document.body.appendChild(contenedor);

        mensaje = document.createElement('div');
        mensaje.classList.add('pedidoCompletado');
        document.body.appendChild(mensaje);
    }

    if(tipo == 1){
            mensaje.innerHTML = `
            <span class="title">🎉 Pedido Solicitado</span>
            <p class="description">Ha realizado un pedido de <strong> $${total}</strong>. Le va a llegar un <strong>correo con la informacion del pedido</strong> y pronto nos pondremos en contacto con usted</p>
            <div class="actions">
                <button id="accept" class="accept"> Aceptar </button>
            </div>

        `;
    }else if(tipo == 2){
        mensaje.innerHTML = `
        <span class="title">✅ Datos guardados</span>
        <p class="description">Se han guardado correctamente sus datos. Al momento de hacer el pedido se le contactará mediante el correo y el telefono registrado</p>
        <div class="actions">
            <button id="accept" class="accept"> Aceptar </button>
        </div>

    `;
    }else if(tipo == 3){
        mensaje.innerHTML = `
        <span class="title">⚠️ Guarde sus datos</span>
        <p class="description">Por favor, guarde sus datos personales antes de proceder al pago.</p>
        <div class="actions">
            <button id="accept" class="accept"> Aceptar </button>
        </div>

    `;
    } else if(tipo == 4){
        mensaje.innerHTML = `
        <span class="title">⛔ Complete TODOS los Campos</span>
        <p class="description">Por favor, complete todos los campos antes de continuar.</p>
        <div class="actions">
            <button id="accept" class="accept"> Aceptar </button>
        </div>

    `;
    } 

    
    contenedor.style.display = 'block';
    mensaje.style.display = 'block';

    const checkoutButton = document.getElementById('checkout-btn');
    document.getElementById('accept').addEventListener('click', function(event) {
        mensaje.style.display = 'none';
        contenedor.style.display = 'none';
        checkoutButton.disabled=false;
    });

}

// Ejemplo de uso:
// pedidoEnviado(50);

// Inicializa el carrito con los datos guardados en localStorage o un arreglo vacío
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const backendUrl = 'https://emermaxbackend.onrender.com';

import {getProductosTactico} from '../api/obtenerProductosEquipoTactico.js';
import { getProductosMedico } from '../api/obtenerProductosEquipoMedico.js';

let getProductos = () => {
    if(document.getElementById('product-list-m') !== null){
        return getProductosMedico();
    }else if(document.getElementById('product-list') !== null){
        return getProductosTactico();
    }
}

export function displayFeaturedProducts() {
    

  getProductos().then(products => {
    if (products) {
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';

      products.forEach(product => {
        const imageUrl = product.attributes.productoImagen?.data?.attributes?.url
        ? `${product.attributes.productoImagen.data.attributes.url}` // Ajusta la URL base si es necesario
        : `${backendUrl}/default-image.jpg`; // Imagen por defecto si no hay imagen disponible


        // Crear el contenedor principal del producto
        const productCard = document.createElement('div');
        productCard.classList.add('card-productos');

        // Crear la sección de imagen
        const productImage = document.createElement('div');
        productImage.classList.add('card-productos-img');
        productImage.innerHTML = `<img class="img" src="${imageUrl}" alt="${product.attributes.productoNombre}">`;

        // Crear la sección de información
        const productInfo = document.createElement('div');
        productInfo.classList.add('card-info');

        const productTitle = document.createElement('p');
        productTitle.classList.add('text-title');
        productTitle.textContent = product.attributes.productoNombre;

        const productDescription = document.createElement('p');
        productDescription.classList.add('text-body');
        productDescription.textContent = product.attributes.productoDescripcion;

        productInfo.appendChild(productTitle);
        productInfo.appendChild(productDescription);

        // Crear el pie de la tarjeta
        const productFooter = document.createElement('div');
        productFooter.classList.add('card-footer');

        const productPrice = document.createElement('span');
        productPrice.classList.add('text-title');
        if(product.attributes.productoPrecio == 0 ){
            productPrice.innerHTML = card
        }else{
            productPrice.innerHTML = `$${product.attributes.productoPrecio}`
        }

        const productButton = document.createElement('div');
        productButton.classList.add('card-button');
        productButton.innerHTML = '<i class="fa-solid fa-cart-shopping" style="color: #f5f5f5;"></i><p>Agregar al carrito</p>';

        if(product.attributes.productoDisponible){
            productButton.innerHTML = '<i class="fa-solid fa-cart-shopping" style="color: #f5f5f5;"></i><p>Agregar al carrito</p>';
        }else{
            productButton.classList.add('sinStock');
            productButton.innerHTML = '<i class="fa-solid fa-x" style="color: #f5f5f5;"></i><p>Sin Stock</p>';
            productButton.style.pointerEvents = 'none';
        }
        
        // Evento para añadir al carrito
        productButton.addEventListener('click', () => {
          addToCart(product);
          productButton.innerHTML = '<i class="fa-solid fa-check" style="color: #f5f5f5;"></i><p>Producto Agregado</p>';
          productButton.style.pointerEvents = 'none';
        
          console.log(product)
          // Después de 2 segundos, restablecer el contenido original
          setTimeout(() => {
            productButton.innerHTML = '<i class="fa-solid fa-cart-shopping" style="color: #f5f5f5;"></i><p>Agregar al carrito</p>';
            productButton.style.pointerEvents = 'auto'; 
          }, 2000);
        });

        productFooter.appendChild(productPrice);
        productFooter.appendChild(productButton);

        // Agregar los elementos al contenedor principal
        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        productCard.appendChild(productFooter);

        // Agregar la tarjeta al contenedor de la lista de productos
        productList.appendChild(productCard);


      });
    } else {
      console.error('No se pudieron cargar los productos.');
    }
  });
}



// Función para calcular el total de productos en el carrito
 function updateCartCount() {
    const totalCount = cart.reduce((total, product) => total + product.quantity, 0);
    const cartCountElement = document.querySelector('.carrito-top p');
    const cartCountElementIcon = document.querySelector('.cartBtn .text');
    cartCountElement.innerHTML = `🛒 Tu carrito (${totalCount})`;
    cartCountElementIcon.innerHTML = `<i class="fa-solid fa-cart-shopping" style="color: #ffffff;"></i>(${totalCount})`;
}

// Función para añadir un producto al carrito (modificada para actualizar el total)
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Actualiza el carrito en el DOM
    updateCartCount(); // Actualiza la cantidad total de productos
}

// Función para renderizar el carrito
function renderCart() {
    const cartContainer = document.querySelector('.carrito-productos');
    cartContainer.innerHTML = ''; // Limpiamos el carrito actual

    const emptyMessage = document.querySelector('.empty-message');
    
    // Si el carrito está vacío, mostramos el mensaje "Carrito vacío"
    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';

        // Recorremos los productos en el carrito y los mostramos
        cart.forEach((product, index) => {
            const imageUrl = product.attributes.productoImagen?.data?.attributes?.url
            ? `${product.attributes.productoImagen.data.attributes.url}` // Ajusta la URL base si es necesario
            : `${backendUrl}/default-image.jpg`; // Imagen por defecto si no hay imagen disponible

            const cartItem = document.createElement('div');
            cartItem.classList.add('cardP');
            cartItem.innerHTML = `
                <div class="card-image"><img class="img" src="${imageUrl}" alt="${product.attributes.productoNombre}"></div>
                <div class="category">$${product.attributes.productoPrecio}</div>
                <div class="heading">${product.attributes.productoNombre}</div>
                <div class="author">Cantidad: ${product.quantity}</div>
                <div class="buttonsItem">
                    <button class="add-item-btn" data-index="${index}">Agregar</button>
                    <button class="remove-all-item-btn" data-index="${index}">Eliminar Todo</button>
                    <button class="remove-one-item-btn" data-index="${index}">Eliminar</button>
                </div>
            `;

            cartItem.querySelector('.add-item-btn').addEventListener('click', (e) => {
                addOneToCart(e.target.dataset.index);
            });

            cartItem.querySelector('.remove-one-item-btn').addEventListener('click', (e) => {
                removeOneFromCart(e.target.dataset.index);
            });

            cartItem.querySelector('.remove-all-item-btn').addEventListener('click', (e) => {
                removeFromCart(e.target.dataset.index);
            });

            cartContainer.appendChild(cartItem);
        });

        // Añadimos botones de "Pagar" y "Vaciar Carrito"
        const actionButtons = document.createElement('div');
        actionButtons.classList.add('cart-actions');
        actionButtons.innerHTML = `
            <button class="checkout-btn">
                <span class="empty-cart-btn__text">Comprar</span>
                <span class="empty-cart-btn__icon"><i class="fa-regular fa-credit-card" style="color: #ffffff;"></i></span>
            </button>

            <button class="empty-cart-btn">
                <span class="empty-cart-btn__text">Vaciar Carrito</span>
                <span class="empty-cart-btn__icon"><i class="fa-regular fa-trash-can" style="color: #ffffff;"></i></span>
            </button>
            
        `;

        // Botón para vaciar el carrito
        actionButtons.querySelector('.empty-cart-btn').addEventListener('click', () => {
            emptyCart();
        });

        // Botón para ir a pagar.html
        actionButtons.querySelector('.checkout-btn').addEventListener('click', () => {
            window.location.href = 'pagar.html';
        });

        cartContainer.appendChild(actionButtons);
    }

    updateCartCount(); // Actualizamos el total de productos
}

// Función para vaciar el carrito
function emptyCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart)); // Actualizamos localStorage
    renderCart(); // Actualizamos el carrito en el DOM
}

// Función para agregar una unidad al carrito
function addOneToCart(index) {
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Actualizamos el carrito
}

// Función para eliminar todas las unidades de un producto del carrito (ya implementada)
function removeFromCart(index) {
    cart.splice(index, 1); // Eliminamos el producto del arreglo
    localStorage.setItem('cart', JSON.stringify(cart)); // Actualizamos localStorage
    renderCart(); // Actualizamos el DOM
}

// Función para eliminar una sola unidad del carrito
function removeOneFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1); // Si solo queda una unidad, eliminamos el producto
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); // Actualizamos el carrito
}





const closeCarrito = document.querySelector('.closeCarrito')
const openCarrito = document.querySelector('.cartBtn')
const todoElCarrito = document.querySelector('.carrito')
const bloqueadorPag = document.querySelector('.bloqueoContenidoMain')
const body = document.querySelector('body')

closeCarrito.onclick = function(){
    todoElCarrito.classList.remove('close')
    openCarrito.classList.remove('close')
    bloqueadorPag.classList.remove('close')
    body.style.overflow = ''; 
}

bloqueadorPag.onclick = function(){
    todoElCarrito.classList.remove('close')
    openCarrito.classList.remove('close')
    bloqueadorPag.classList.remove('close')
    body.style.overflow = ''; 
}

openCarrito.onclick = function(){
    todoElCarrito.classList.toggle('close')
    openCarrito.classList.toggle('close')
    bloqueadorPag.classList.toggle('close')
    body.style.overflow = 'hidden';
}

// Añade el evento de clic para llevar al usuario a la parte superior
buttonIrHaciaArriba.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Añade una animación suave al desplazamiento
    });
});


// Llamamos a la función para cargar los productos cuando se cargue la página
window.addEventListener('DOMContentLoaded', () => {
    displayFeaturedProducts();
    renderCart();
    updateCartCount(); // Actualizamos la cantidad de productos al cargar la página
});
import { getProductos } from '../api/obtenerProductosEquipoTactico.js';

export function displayFeaturedProducts() {
  getProductos().then(products => {
    if (products) {
      const productList = document.getElementById('product-list');
      productList.innerHTML = '';

      products.forEach(product => {
        const imageUrl = product.productoImagen[0]?.url
          ? `http://localhost:1337/${product.productoImagen[0].url}` // Ajusta la URL base si es necesario
          : 'http://localhost:1337/default-image.jpg'; // Imagen por defecto si no hay imagen disponible

        const productItem = document.createElement('div');
        productItem.innerHTML = `
          <h2>${product.productoNombre}</h2>
          <img src="${imageUrl}" alt="${product.productoNombre}" />
          <p>${product.productoDescripcion}</p>
          <p>Precio: ${product.productoPrecio}</p>
          <p>Stock: ${product.productoStock}</p>
          <p>Disponible: ${product.productoDisponible ? 'Sí' : 'No'}</p>
          <p>Categoría: ${product.categoria.categoriaNombre}</p>
        `;
        productList.appendChild(productItem);
      });
    } else {
      console.error('No se pudieron cargar los productos.');
    }
  });
}

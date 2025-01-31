const backendUrl = 'https://emermaxbackend.onrender.com';
// api/productos.js
export async function getProductosTactico() {
    const url = `${backendUrl}/api/productos?filters[categoria][slug][$eq]=equipamiento-tactico&populate=*`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.data; // Devolver solo la lista de productos
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      return null;
    }
  }
const express = require('express');
const fs = require('fs');
const ProductManager = require('./index2.js');

const app = express();
const port = 3000;
const productManager = new ProductManager('productos.json');

app.get('/productos', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit); // Obtener el valor de 'limit' de los parámetros de consulta
    await productManager.getProducts();
    let products = productManager.products;

    if (!isNaN(limit)) {
      products = products.slice(0, limit); // Limitar la cantidad de productos según el límite especificado
    }

    res.json(products);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener los productos.' });
  }
});

app.get('/productos/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid); // Obtener el valor del parámetro dinámico :pid
    await productManager.getProducts();
    const product = productManager.getProductById(productId);

    if (!product) {
      res.status(404).json({ error: 'No se encontró un producto con el ID proporcionado.' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error('Error al leer el archivo JSON:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener el producto.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
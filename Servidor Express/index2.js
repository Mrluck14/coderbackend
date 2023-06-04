const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.products = [];
    this.idCounter = 1;
    this.path = path;
  }

  async newProduct(product) {
    // Validar campos obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.stock || !product.code) {
      console.error('Error: Todos los campos son obligatorios.');
      return;
    }

    product.id = this.idCounter;
    this.idCounter++;

    // Validar ID único
    const existingProduct = this.products.find(p => p.id === product.id);
    if (existingProduct) {
      console.error('Error: Ya existe un producto con el mismo ID.');
      return;
    }

    this.products.push(product);

    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products));
      console.log('Producto guardado correctamente.');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }

  async updateProduct(id, updatedFields) {
    await this.getProducts();
    const product = this.products.find(p => p.id === id);
    if (product) {
      Object.assign(product, updatedFields);
      await this.saveProductsToFile();
      console.log(`Producto con ID ${id} actualizado.`);
    } else {
      console.log(`No se encontró ningún producto con el ID ${id}.`);
    }
  }

  async saveProductsToFile() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile(this.path, data);
      console.log('Productos guardados en el archivo products.json');
    } catch (error) {
      console.error('Error al guardar los productos:', error);
    }
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf8');
      this.products = JSON.parse(data);
      console.log('Productos cargados desde el archivo productos.json');
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  async getProductById(id) {
    try {
      await this.getProducts();
      const product = this.products.find(product => product.id === id);
  
      if (!product) {
        console.error('Error: No se encontró un producto con el ID proporcionado.');
        return null;
      }
  
      return product;
    } catch (error) {
      console.error('Error al buscar el producto:', error);
      return null;
    }
  }

  async deleteProduct(id) {
    await this.getProducts();
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProductsToFile();
      console.log(`Producto con ID ${id} eliminado.`);
    } else {
      console.log(`No se encontró ningún producto con el ID ${id}.`);
    }
  }
}

module.exports = ProductManager;

// Ejemplo de uso
const manager = new ProductManager('productos.json');

async function mostrarProductos() {
  await manager.getProducts();
  console.log(manager.products);
}

mostrarProductos();

/*(async () => {
  await manager.deleteProduct(1);
})();

(async () => {
  await manager.updateProduct(2, { price: 25 });
})();*/

manager.newProduct({title: 'Remera Oversize', description: 'Negra mangas cortas', price: 2000, thumbnail: 'Sin foto', stock: 20, code: 1});
manager.newProduct({title: 'Pantalon', description: 'Corte chino color negro', price: 2500, thumbnail: 'Sin foto', stock: 20, code: 2})


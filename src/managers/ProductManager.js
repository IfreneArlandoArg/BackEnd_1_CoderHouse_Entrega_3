import fs from 'fs/promises';

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async #readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async #writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async getProducts() {
    return await this.#readFile();
  }

  async getProductById(id) {
    const products = await this.#readFile();
    return products.find(p => p.id === id);
  }

  async addProduct(product) {
    const products = await this.#readFile();
    const newProduct = {
      id: crypto.randomUUID(),
      status: true,
      thumbnails: [],
      ...product
    };
    products.push(newProduct);
    await this.#writeFile(products);
    return newProduct;
  }

  async updateProduct(id, fields) {
    const products = await this.#readFile();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return { error: 'Producto no encontrado' };

    const { id: _, ...safeFields } = fields;
    products[index] = { ...products[index], ...safeFields };
    await this.#writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    let products = await this.#readFile();
    const exists = products.some(p => p.id === id);
    if (!exists) return { error: 'Producto no encontrado' };

    products = products.filter(p => p.id !== id);
    await this.#writeFile(products);
    return { success: true };
  }
}

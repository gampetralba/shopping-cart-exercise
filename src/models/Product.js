/**
 * Represents a product in the shopping cart system.
 * @class
 */
export class Product {
  /**
   * Creates a new Product instance.
   * @param {string} code - Unique product identifier
   * @param {string} name - Human-readable product name
   * @param {number} price - Product price in dollars
   */
  constructor(code, name, price) {
    this.code = code;
    this.name = name;
    this.price = price;
  }
}

/**
 * Represents an item in the shopping cart with a product and quantity.
 * @class
 */
export class CartItem {
  /**
   * Creates a new CartItem instance.
   * @param {Product} product - The product being purchased
   * @param {number} [quantity=1] - The quantity of the product
   */
  constructor(product, quantity = 1) {
    /** @type {Product} */
    this.product = product;
    /** @type {number} */
    this.quantity = quantity;
  }
}

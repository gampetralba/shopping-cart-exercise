import { CartItem } from "../models/CartItem.js";
import { PricingRulesEngine } from "../pricing/PricingRulesEngine.js";

/**
 * Shopping cart implementation with flexible pricing rules support.
 * Supports adding items, applying promo codes, and calculating totals with various promotional rules.
 * @class
 */
export class ShoppingCart {
  /**
   * Creates a new ShoppingCart instance.
   * @param {Array<import('../pricing/PricingRule.js').PricingRule>} [pricingRules=[]] - Array of pricing rules to apply
   * @throws {TypeError} When pricingRules is not an array or contains invalid rules
   */
  constructor(pricingRules = []) {
    if (pricingRules !== null && !Array.isArray(pricingRules)) {
      throw new TypeError('Pricing rules must be an array');
    }

    if (pricingRules && pricingRules.some(rule => typeof rule.apply !== 'function')) {
      throw new TypeError('All pricing rules must have an apply method');
    }

    /** @type {Array<import('../models/CartItem.js').CartItem>} */
    this._items = [];
    /** @type {string|null} */
    this._promoCode = null;
    /** @type {import('../pricing/PricingRulesEngine.js').PricingRulesEngine} */
    this.pricingEngine = new PricingRulesEngine(pricingRules);
  }

  /**
   * Adds an item to the cart and optionally applies a promo code.
   * This method follows the required interface from the specification.
   * @param {import('../models/Product.js').Product} item - Product to add to cart
   * @param {string} [promoCode] - Optional promo code to apply
   * @throws {TypeError|RangeError} When item is invalid or promo code is invalid
   */
  add(item, promoCode) {
    this.addItem(item);

    if (promoCode) {
      this.applyPromoCode(promoCode);
    }
  }

  /**
   * Adds a product to the cart (internal method).
   * If the product already exists, increments the quantity.
   * @param {import('../models/Product.js').Product} product - Product to add
   * @throws {TypeError|RangeError} When product is invalid
   */
  addItem(product) {
    this._validateProduct(product);

    const existingItem = this._items.find(
      (cartItem) => cartItem.product.code === product.code,
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this._items.push(new CartItem(product, 1));
    }
  }

  /**
   * Applies a promo code to the cart.
   * @param {string} code - Promo code to apply
   * @throws {TypeError} When code is not a string or is null
   */
  applyPromoCode(code) {
    if (code === null) {
      throw new TypeError('Promo code cannot be null');
    }
    if (code !== undefined && typeof code !== 'string') {
      throw new TypeError('Promo code must be a string');
    }
    this._promoCode = code;
  }

  /**
   * Gets all items in the cart after applying pricing rules.
   * @returns {Array<import('../models/CartItem.js').CartItem>} Array of cart items with quantities
   */
  get items() {
    const result = this.pricingEngine.calculateTotal(this._items, this._promoCode);
    return result.items;
  }

  /**
   * Calculates the total price after applying all pricing rules and promotions.
   * @returns {number} Total cart value in dollars
   */
  get total() {
    const result = this.pricingEngine.calculateTotal(this._items, this._promoCode);
    return result.total;
  }

  /**
   * Validates a product object for required properties and valid values.
   * @private
   * @param {Object} product - Product object to validate
   * @throws {TypeError|RangeError} When product is invalid
   */
  _validateProduct(product) {
    if (!product || typeof product !== 'object') {
      throw new TypeError('Product must be a valid object');
    }

    if (!product.code || typeof product.code !== 'string' || product.code.trim() === '') {
      throw new RangeError('Product must have a non-empty code');
    }

    if (!product.name || typeof product.name !== 'string' || product.name.trim() === '') {
      throw new RangeError('Product must have a non-empty name');
    }

    if (typeof product.price !== 'number' || isNaN(product.price)) {
      throw new TypeError('Product price must be a valid number');
    }

    if (product.price < 0) {
      throw new RangeError('Product price cannot be negative');
    }
  }
}

/**
 * Factory method to create a new ShoppingCart instance.
 * @static
 * @param {Array<import('../pricing/PricingRule.js').PricingRule>} [pricingRules=[]] - Array of pricing rules
 * @returns {ShoppingCart} New ShoppingCart instance
 */
ShoppingCart.new = function (pricingRules = []) {
  return new ShoppingCart(pricingRules);
};

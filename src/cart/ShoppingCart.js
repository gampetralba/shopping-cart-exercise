import { CartItem } from "../models/CartItem.js";
import { PricingRulesEngine } from "../pricing/PricingRulesEngine.js";

export class ShoppingCart {
  constructor(pricingRules = []) {
    if (pricingRules !== null && !Array.isArray(pricingRules)) {
      throw new TypeError('Pricing rules must be an array');
    }

    if (pricingRules && pricingRules.some(rule => typeof rule.apply !== 'function')) {
      throw new TypeError('All pricing rules must have an apply method');
    }

    this._items = [];
    this._promoCode = null;
    this.pricingEngine = new PricingRulesEngine(pricingRules);
  }

  add(item, promoCode) {
    this.addItem(item);

    if (promoCode) {
      this.applyPromoCode(promoCode);
    }
  }

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

  applyPromoCode(code) {
    if (code === null) {
      throw new TypeError('Promo code cannot be null');
    }
    if (code !== undefined && typeof code !== 'string') {
      throw new TypeError('Promo code must be a string');
    }
    this._promoCode = code;
  }

  get items() {
    const result = this.pricingEngine.calculateTotal(this._items, this._promoCode);
    return result.items;
  }

  get total() {
    const result = this.pricingEngine.calculateTotal(this._items, this._promoCode);
    return result.total;
  }

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

ShoppingCart.new = function (pricingRules = []) {
  return new ShoppingCart(pricingRules);
};

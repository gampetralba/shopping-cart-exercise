import { CartItem } from "../models/CartItem.js";
import { PricingRulesEngine } from "../pricing/PricingRulesEngine.js";

export class ShoppingCart {
  constructor(pricingRules = []) {
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
}

ShoppingCart.new = function (pricingRules = []) {
  return new ShoppingCart(pricingRules);
};

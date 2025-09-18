import { CartItem } from "../models/CartItem.js";

export class ShoppingCart {
  constructor() {
    this._items = [];
    this._promoCode = null;
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
    return this._items;
  }

  get total() {
    return 0;
  }
}

ShoppingCart.new = function () {
  return new ShoppingCart();
};

import { test, describe } from "node:test";
import assert from "node:assert";
import { ShoppingCart } from "../src/cart/ShoppingCart.js";
import { products } from "../src/catalog/products.js";

describe("Pricing Architecture", () => {
  test("cart without rules uses base pricing", () => {
    const cart = ShoppingCart.new();
    cart.add(products.ult_small);
    cart.add(products.ult_large);
    assert.strictEqual(cart.total, 69.8);
  });

  test("empty rules defaults to base pricing", () => {
    const cart = new ShoppingCart([]);
    cart.add(products.ult_medium);
    cart.add(products["1gb"]);
    assert.strictEqual(cart.total, 39.8);
  });
});

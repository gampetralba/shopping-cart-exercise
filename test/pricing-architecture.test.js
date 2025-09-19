import { test } from "node:test";
import assert from "node:assert";
import { ShoppingCart } from "../src/cart/ShoppingCart.js";
import { products } from "../src/catalog/products.js";

test("Pricing architecture: base pricing still works", () => {
  const cart = ShoppingCart.new();
  cart.add(products.ult_small);
  cart.add(products.ult_large);
  assert.strictEqual(cart.total, 69.8);
});

test("Pricing architecture: empty rules defaults to base pricing", () => {
  const cart = new ShoppingCart([]);
  cart.add(products.ult_medium);
  cart.add(products["1gb"]);
  assert.strictEqual(cart.total, 39.8);
});

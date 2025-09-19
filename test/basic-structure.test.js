import { test, describe } from "node:test";
import assert from "node:assert";
import { Product } from "../src/models/Product.js";
import { CartItem } from "../src/models/CartItem.js";
import { ShoppingCart } from "../src/cart/ShoppingCart.js";
import { products, getProduct } from "../src/catalog/products.js";

describe("Basic Structure", () => {
  describe("Product model", () => {
    test("creates instances correctly", () => {
      const product = new Product("test_code", "Test Product", 9.99);
      assert.strictEqual(product.code, "test_code");
      assert.strictEqual(product.name, "Test Product");
      assert.strictEqual(product.price, 9.99);
    });
  });

  describe("CartItem model", () => {
    test("creates instances correctly", () => {
      const product = new Product("test_code", "Test Product", 9.99);
      const cartItem = new CartItem(product, 2);
      assert.strictEqual(cartItem.product, product);
      assert.strictEqual(cartItem.quantity, 2);
    });
  });

  describe("ShoppingCart", () => {
    test("can be instantiated", () => {
      const cart = ShoppingCart.new();
      assert(cart instanceof ShoppingCart);
      assert(Array.isArray(cart.items));
      assert.strictEqual(cart.items.length, 0);
      assert.strictEqual(cart.total, 0);
    });

    test("can add items", () => {
      const cart = ShoppingCart.new();
      const product = products.ult_small;
      cart.add(product);
      assert.strictEqual(cart.items.length, 1);
      assert.strictEqual(cart.items[0].product.code, "ult_small");
      assert.strictEqual(cart.items[0].quantity, 1);
    });

    test("increments quantity for duplicate items", () => {
      const cart = ShoppingCart.new();
      const product = products.ult_small;
      cart.add(product);
      cart.add(product);
      assert.strictEqual(cart.items.length, 1);
      assert.strictEqual(cart.items[0].quantity, 2);
    });
  });

  describe("Product catalog", () => {
    test("has all required products", () => {
      assert(products.ult_small);
      assert.strictEqual(products.ult_small.name, "Unlimited 1GB");
      assert.strictEqual(products.ult_small.price, 24.9);

      assert(products.ult_medium);
      assert.strictEqual(products.ult_medium.name, "Unlimited 2GB");
      assert.strictEqual(products.ult_medium.price, 29.9);

      assert(products.ult_large);
      assert.strictEqual(products.ult_large.name, "Unlimited 5GB");
      assert.strictEqual(products.ult_large.price, 44.9);

      assert(products["1gb"]);
      assert.strictEqual(products["1gb"].name, "1 GB Data-pack");
      assert.strictEqual(products["1gb"].price, 9.9);
    });

    test("getProduct function returns correct products", () => {
      const product = getProduct("ult_small");
      assert.strictEqual(product.code, "ult_small");
      assert.strictEqual(product.name, "Unlimited 1GB");
    });
  });
});

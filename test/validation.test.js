import { test, describe } from "node:test";
import assert from "node:assert";
import { ShoppingCart } from "../src/cart/ShoppingCart.js";
import { products } from "../src/catalog/products.js";
import { ThreeForTwoRule } from "../src/pricing/rules/ThreeForTwoRule.js";
import { PromoCodeRule } from "../src/pricing/rules/PromoCodeRule.js";

const pricingRules = [
  new ThreeForTwoRule("ult_small"),
  new PromoCodeRule("I<3AMAYSIM", 10),
];

describe("Input Validation", () => {
  describe("Product validation", () => {
    test("adding null product throws error", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.add(null);
      }, TypeError);
    });

    test("adding undefined product throws error", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.add(undefined);
      }, TypeError);
    });

    test("adding object without required properties throws error", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.add({ name: "Invalid Product" });
      }, RangeError);
    });

    test("adding product with invalid price throws error", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.add({ code: "test", name: "Test", price: "invalid" });
      }, TypeError);
    });

    test("adding product with negative price throws error", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.add({ code: "test", name: "Test", price: -10 });
      }, RangeError);
    });

    test("product with empty code throws error", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.add({ code: "", name: "Test", price: 10 });
      }, RangeError);
    });

    test("product with empty name throws error", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.add({ code: "test", name: "", price: 10 });
      }, RangeError);
    });
  });

  describe("Promo code validation", () => {
    test("promo code must be string", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.applyPromoCode(123);
      }, TypeError);
    });

    test("empty string promo code is allowed", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_small);
      cart.applyPromoCode("");
      // Should not throw, should just not apply discount
      assert.strictEqual(cart.total, 24.9);
    });

    test("null promo code throws error", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.throws(() => {
        cart.applyPromoCode(null);
      }, TypeError);
    });
  });

  describe("Constructor validation", () => {
    test("ShoppingCart constructor with invalid pricing rules", () => {
      assert.throws(() => {
        new ShoppingCart(["invalid"]);
      }, TypeError);
    });

    test("ShoppingCart constructor with null pricing rules", () => {
      assert.throws(() => {
        new ShoppingCart(null);
      }, TypeError);
    });
  });
});

import { test, describe } from "node:test";
import assert from "node:assert";
import { ShoppingCart } from "../src/cart/ShoppingCart.js";
import { products } from "../src/catalog/products.js";
import { ThreeForTwoRule } from "../src/pricing/rules/ThreeForTwoRule.js";
import { BulkDiscountRule } from "../src/pricing/rules/BulkDiscountRule.js";
import { BundleRule } from "../src/pricing/rules/BundleRule.js";
import { PromoCodeRule } from "../src/pricing/rules/PromoCodeRule.js";

const pricingRules = [
  new ThreeForTwoRule("ult_small"),
  new BulkDiscountRule("ult_large", 4, 39.9),
  new BundleRule("ult_medium", products["1gb"]),
  new PromoCodeRule("I<3AMAYSIM", 10),
];

describe("Edge Cases", () => {
  describe("Empty cart", () => {
    test("has zero total", () => {
      const cart = ShoppingCart.new(pricingRules);
      assert.strictEqual(cart.total, 0);
      assert.strictEqual(cart.items.length, 0);
    });

    test("with promo code still has zero total", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.applyPromoCode("I<3AMAYSIM");
      assert.strictEqual(cart.total, 0);
      assert.strictEqual(cart.items.length, 0);
    });
  });

  describe("3-for-2 deal (ult_small)", () => {
    test("single item doesn't trigger deal", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_small);
      assert.strictEqual(cart.total, 24.9);
    });

    test("two items don't trigger deal", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_small);
      cart.add(products.ult_small);
      assert.strictEqual(cart.total, 49.8);
    });

    test("four items: one set of 3-for-2 plus one regular", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_small);
      cart.add(products.ult_small);
      cart.add(products.ult_small);
      cart.add(products.ult_small);
      assert.strictEqual(cart.total, 74.7); // Pay for 3 items
    });

    test("six items: two sets of 3-for-2", () => {
      const cart = ShoppingCart.new(pricingRules);
      for (let i = 0; i < 6; i++) {
        cart.add(products.ult_small);
      }
      assert.strictEqual(cart.total, 99.6); // Pay for 4 items
    });
  });

  describe("Bulk discount (ult_large)", () => {
    test("three items don't trigger bulk discount", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_large);
      cart.add(products.ult_large);
      cart.add(products.ult_large);
      assert.strictEqual(cart.total, 134.7); // Regular price
    });

    test("exactly four items trigger bulk discount", () => {
      const cart = ShoppingCart.new(pricingRules);
      for (let i = 0; i < 4; i++) {
        cart.add(products.ult_large);
      }
      assert.strictEqual(cart.total, 159.6); // 4 * 39.90
    });

    test("five items maintain bulk discount", () => {
      const cart = ShoppingCart.new(pricingRules);
      for (let i = 0; i < 5; i++) {
        cart.add(products.ult_large);
      }
      assert.strictEqual(cart.total, 199.5); // 5 * 39.90
    });
  });

  describe("Bundle deal (ult_medium)", () => {
    test("single ult_medium gets one free data-pack", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_medium);

      assert.strictEqual(cart.total, 29.9);
      assert.strictEqual(cart.items.length, 2);

      const freeDataPack = cart.items.find(
        (item) => item.product.code === "1gb" && item.product.price === 0,
      );
      assert(freeDataPack);
      assert.strictEqual(freeDataPack.quantity, 1);
    });
  });

  describe("Promo code", () => {
    test("invalid promo code has no effect", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_small);
      cart.add(products["1gb"], "INVALID_CODE");

      const expectedTotal = 24.9 + 9.9;
      assert.strictEqual(cart.total, expectedTotal);
    });

    test("applies to single item", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_small, "I<3AMAYSIM");

      const expectedTotal = 24.9 * 0.9; // 10% off
      assert.strictEqual(cart.total, 22.41);
    });

    test("with bundle: free item not discounted separately", () => {
      const cart = ShoppingCart.new(pricingRules);
      cart.add(products.ult_medium, "I<3AMAYSIM");

      const expectedTotal = 29.9 * 0.9; // Only the paid item gets discount
      assert.strictEqual(cart.total, 26.91);
    });
  });

  describe("Floating point precision", () => {
    test("multiple small amounts maintain precision", () => {
      const cart = ShoppingCart.new(pricingRules);
      for (let i = 0; i < 11; i++) {
        cart.add(products["1gb"]);
      }
      assert.strictEqual(cart.total, 108.9);
    });
  });

  describe("Complex combinations", () => {
    test("all promotions work together correctly", () => {
      const cart = ShoppingCart.new(pricingRules);
      // 3 ult_small (3-for-2)
      cart.add(products.ult_small);
      cart.add(products.ult_small);
      cart.add(products.ult_small);
      // 4 ult_large (bulk discount)
      cart.add(products.ult_large);
      cart.add(products.ult_large);
      cart.add(products.ult_large);
      cart.add(products.ult_large);
      // 1 ult_medium (free bundle)
      cart.add(products.ult_medium);
      // Add promo code
      cart.applyPromoCode("I<3AMAYSIM");

      // Expected: (2*24.90 + 4*39.90 + 29.90) * 0.9
      const expectedTotal = (49.8 + 159.6 + 29.9) * 0.9;
      assert.strictEqual(cart.total, 215.37);
    });
  });
});

import { test } from "node:test";
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

// Empty cart tests
test("Edge case: Empty cart has zero total", () => {
  const cart = ShoppingCart.new(pricingRules);
  assert.strictEqual(cart.total, 0);
  assert.strictEqual(cart.items.length, 0);
});

test("Edge case: Empty cart with promo code still zero", () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.applyPromoCode("I<3AMAYSIM");
  assert.strictEqual(cart.total, 0);
  assert.strictEqual(cart.items.length, 0);
});

// Single item edge cases
test("Edge case: Single ult_small (no 3-for-2)", () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small);
  assert.strictEqual(cart.total, 24.9);
});

test("Edge case: Two ult_small (no 3-for-2)", () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small);
  cart.add(products.ult_small);
  assert.strictEqual(cart.total, 49.8);
});

test("Edge case: Four ult_small (3-for-2 + 1 regular)", () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small);
  cart.add(products.ult_small);
  cart.add(products.ult_small);
  cart.add(products.ult_small);
  assert.strictEqual(cart.total, 74.7); // Pay for 3 items
});

test("Edge case: Six ult_small (3-for-2 twice)", () => {
  const cart = ShoppingCart.new(pricingRules);
  for (let i = 0; i < 6; i++) {
    cart.add(products.ult_small);
  }
  assert.strictEqual(cart.total, 99.6); // Pay for 4 items
});

// Bulk discount edge cases
test("Edge case: Three ult_large (no bulk discount)", () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_large);
  cart.add(products.ult_large);
  cart.add(products.ult_large);
  assert.strictEqual(cart.total, 134.7); // Regular price
});

test("Edge case: Exactly four ult_large (bulk discount)", () => {
  const cart = ShoppingCart.new(pricingRules);
  for (let i = 0; i < 4; i++) {
    cart.add(products.ult_large);
  }
  assert.strictEqual(cart.total, 159.6); // 4 * 39.90
});

test("Edge case: Five ult_large (bulk discount)", () => {
  const cart = ShoppingCart.new(pricingRules);
  for (let i = 0; i < 5; i++) {
    cart.add(products.ult_large);
  }
  assert.strictEqual(cart.total, 199.5); // 5 * 39.90
});

// Bundle edge cases
test("Edge case: Single ult_medium gets one free data-pack", () => {
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

// Promo code edge cases
test("Edge case: Invalid promo code has no effect", () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small);
  cart.add(products["1gb"], "INVALID_CODE");

  const expectedTotal = 24.9 + 9.9;
  assert.strictEqual(cart.total, expectedTotal);
});

test("Edge case: Promo code on single item", () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_small, "I<3AMAYSIM");

  const expectedTotal = 24.9 * 0.9; // 10% off
  assert.strictEqual(cart.total, 22.41);
});

test("Edge case: Promo code with bundle (free item not discounted separately)", () => {
  const cart = ShoppingCart.new(pricingRules);
  cart.add(products.ult_medium, "I<3AMAYSIM");

  const expectedTotal = 29.9 * 0.9; // Only the paid item gets discount
  assert.strictEqual(cart.total, 26.91);
});

// Floating point precision
test("Edge case: Multiple small amounts for precision", () => {
  const cart = ShoppingCart.new(pricingRules);
  for (let i = 0; i < 11; i++) {
    cart.add(products["1gb"]);
  }
  assert.strictEqual(cart.total, 108.9);
});

// Complex combinations
test("Edge case: All promotions together", () => {
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

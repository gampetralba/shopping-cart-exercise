import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ShoppingCart } from "../src/index.js";
import { products } from "../src/index.js";
import {
  ThreeForTwoRule,
  BulkDiscountRule,
  BundleRule,
  PromoCodeRule,
} from "../src/index.js";

describe("Rule Order Independence", () => {
  const threeForTwo = new ThreeForTwoRule("ult_small");
  const bulkDiscount = new BulkDiscountRule("ult_large", 4, 39.9);
  const bundle = new BundleRule("ult_medium", products["1gb"]);
  const promoCode = new PromoCodeRule("I<3AMAYSIM", 10);

  test("same total regardless of rule order - scenario 1", () => {
    // Original order
    const cart1 = new ShoppingCart([
      threeForTwo,
      bulkDiscount,
      bundle,
      promoCode,
    ]);
    cart1.add(products.ult_small);
    cart1.add(products.ult_small);
    cart1.add(products.ult_small);
    cart1.add(products.ult_large);

    // Reversed order
    const cart2 = new ShoppingCart([
      promoCode,
      bundle,
      bulkDiscount,
      threeForTwo,
    ]);
    cart2.add(products.ult_small);
    cart2.add(products.ult_small);
    cart2.add(products.ult_small);
    cart2.add(products.ult_large);

    assert.equal(cart1.total, cart2.total);
    assert.equal(cart1.total, 94.7);
  });

  test("same total regardless of rule order - scenario with promo", () => {
    // Original order
    const cart1 = new ShoppingCart([
      threeForTwo,
      bulkDiscount,
      bundle,
      promoCode,
    ]);
    cart1.add(products.ult_small, "I<3AMAYSIM");
    cart1.add(products["1gb"]);

    // Different order
    const cart2 = new ShoppingCart([
      bulkDiscount,
      promoCode,
      threeForTwo,
      bundle,
    ]);
    cart2.add(products.ult_small, "I<3AMAYSIM");
    cart2.add(products["1gb"]);

    assert.equal(cart1.total, cart2.total);
    assert.equal(cart1.total, 31.32);
  });

  test("same total with complex scenario and different rule orders", () => {
    // Order 1
    const cart1 = new ShoppingCart([
      threeForTwo,
      bulkDiscount,
      bundle,
      promoCode,
    ]);
    cart1.add(products.ult_small);
    cart1.add(products.ult_small);
    cart1.add(products.ult_small);
    cart1.add(products.ult_large);
    cart1.add(products.ult_large);
    cart1.add(products.ult_large);
    cart1.add(products.ult_large);
    cart1.add(products.ult_medium);
    cart1.add(products.ult_medium, "I<3AMAYSIM");

    // Order 2
    const cart2 = new ShoppingCart([
      bundle,
      threeForTwo,
      promoCode,
      bulkDiscount,
    ]);
    cart2.add(products.ult_small);
    cart2.add(products.ult_small);
    cart2.add(products.ult_small);
    cart2.add(products.ult_large);
    cart2.add(products.ult_large);
    cart2.add(products.ult_large);
    cart2.add(products.ult_large);
    cart2.add(products.ult_medium);
    cart2.add(products.ult_medium, "I<3AMAYSIM");

    // Order 3
    const cart3 = new ShoppingCart([
      promoCode,
      bulkDiscount,
      bundle,
      threeForTwo,
    ]);
    cart3.add(products.ult_small);
    cart3.add(products.ult_small);
    cart3.add(products.ult_small);
    cart3.add(products.ult_large);
    cart3.add(products.ult_large);
    cart3.add(products.ult_large);
    cart3.add(products.ult_large);
    cart3.add(products.ult_medium);
    cart3.add(products.ult_medium, "I<3AMAYSIM");

    assert.equal(cart1.total, cart2.total);
    assert.equal(cart2.total, cart3.total);
  });

  test("bundle rule adds free items correctly regardless of rule order", () => {
    const cart1 = new ShoppingCart([threeForTwo, bundle]);
    cart1.add(products.ult_medium);

    const cart2 = new ShoppingCart([bundle, threeForTwo]);
    cart2.add(products.ult_medium);

    assert.equal(cart1.items.length, cart2.items.length);
    assert.equal(cart1.items.length, 2);

    // Both should have the medium plan and the free data pack
    const cart1HasMedium = cart1.items.some(
      (item) => item.product.code === "ult_medium",
    );
    const cart1HasDataPack = cart1.items.some(
      (item) => item.product.code === "1gb" && item.product.price === 0,
    );
    const cart2HasMedium = cart2.items.some(
      (item) => item.product.code === "ult_medium",
    );
    const cart2HasDataPack = cart2.items.some(
      (item) => item.product.code === "1gb" && item.product.price === 0,
    );

    assert.equal(cart1HasMedium, true);
    assert.equal(cart1HasDataPack, true);
    assert.equal(cart2HasMedium, true);
    assert.equal(cart2HasDataPack, true);
  });
});

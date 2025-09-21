import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { ShoppingCart } from "../src/index.js";
import { products } from "../src/index.js";
import { PricingRule } from "../src/pricing/PricingRule.js";

// Mock rules for testing edge cases
class NegativeDiscountRule extends PricingRule {
  apply(_items) {
    return {
      discount: -10, // Invalid negative discount
      additionalItems: [],
    };
  }
}

class ExcessiveDiscountRule extends PricingRule {
  apply(items) {
    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
    return {
      discount: total * 2, // Discount exceeds total
      additionalItems: [],
    };
  }
}

class InvalidPromoRule extends PricingRule {
  constructor(percentage) {
    super();
    this.percentage = percentage;
  }

  apply(_items, promoCode) {
    if (promoCode === "INVALID") {
      return {
        discount: 0,
        additionalItems: [],
        promoCodeDiscount: this.percentage,
      };
    }
    return { discount: 0, additionalItems: [] };
  }
}

describe("Pricing Validation", () => {
  test("rejects negative discount amounts", () => {
    const cart = new ShoppingCart([new NegativeDiscountRule()]);
    cart.add(products.ult_small);

    assert.throws(() => cart.total, {
      name: "RangeError",
      message: /Invalid discount amount.*Discounts cannot be negative/,
    });
  });

  test("rejects discounts that exceed subtotal", () => {
    const cart = new ShoppingCart([new ExcessiveDiscountRule()]);
    cart.add(products.ult_small);

    assert.throws(() => cart.total, {
      name: "RangeError",
      message: /Total discount.*exceeds subtotal/,
    });
  });

  test("rejects promo code discount below 0%", () => {
    const cart = new ShoppingCart([new InvalidPromoRule(-0.1)]);
    cart.add(products.ult_small, "INVALID");

    assert.throws(() => cart.total, {
      name: "RangeError",
      message: /Invalid promo code discount.*Must be between 0 and 1/,
    });
  });

  test("rejects promo code discount above 100%", () => {
    const cart = new ShoppingCart([new InvalidPromoRule(1.5)]);
    cart.add(products.ult_small, "INVALID");

    assert.throws(() => cart.total, {
      name: "RangeError",
      message: /Invalid promo code discount.*Must be between 0 and 1/,
    });
  });

  test("accepts valid discount at boundary (0%)", () => {
    const cart = new ShoppingCart([new InvalidPromoRule(0)]);
    cart.add(products.ult_small, "INVALID");

    assert.doesNotThrow(() => cart.total);
    assert.equal(cart.total, 24.9);
  });

  test("accepts valid discount at boundary (100%)", () => {
    const cart = new ShoppingCart([new InvalidPromoRule(1)]);
    cart.add(products.ult_small, "INVALID");

    assert.doesNotThrow(() => cart.total);
    assert.equal(cart.total, 0);
  });

  test("handles edge case of exactly 100% discount from rules", () => {
    // Create a rule that discounts exactly the item price
    class ExactDiscountRule extends PricingRule {
      apply(items) {
        const total = items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
        return {
          discount: total, // Exactly 100% discount
          additionalItems: [],
        };
      }
    }

    const cart = new ShoppingCart([new ExactDiscountRule()]);
    cart.add(products.ult_small);

    assert.doesNotThrow(() => cart.total);
    assert.equal(cart.total, 0);
  });
});

import { BasePricingRule } from "./rules/BasePricingRule.js";

/**
 * Engine that applies pricing rules to calculate cart totals.
 * Orchestrates multiple pricing rules and combines their results.
 */
export class PricingRulesEngine {
  /**
   * Creates a new PricingRulesEngine instance.
   * @param {Array<PricingRule>} [rules=[]] - Array of pricing rules to apply
   */
  constructor(rules = []) {
    this.rules = rules.length > 0 ? rules : [new BasePricingRule()];
  }

  /**
   * Calculates the total price after applying all pricing rules.
   * Rules are applied independently to ensure order doesn't affect the result.
   * @param {Array<CartItem>} items - Cart items to process
   * @param {string|null} promoCode - Optional promo code to apply
   * @returns {{total: number, items: Array<CartItem>}} Final total and processed items
   */
  calculateTotal(items, promoCode) {
    const originalItems = [...items];
    let totalDiscount = 0;
    let additionalItems = [];
    let promoCodeDiscount = 0;

    // Apply each rule independently to the original items
    for (const rule of this.rules) {
      const result = rule.apply(originalItems, promoCode);

      if (result.discount) {
        totalDiscount += result.discount;
      }

      if (result.additionalItems) {
        additionalItems = additionalItems.concat(result.additionalItems);
      }

      if (result.promoCodeDiscount) {
        promoCodeDiscount = result.promoCodeDiscount;
      }
    }

    let subtotal = 0;

    for (const item of originalItems) {
      subtotal += item.product.price * item.quantity;
    }

    // Apply absolute discounts first
    const totalAfterDiscounts = subtotal - totalDiscount;

    // Apply percentage discount (promo code) to the discounted total
    const finalTotal =
      totalAfterDiscounts - totalAfterDiscounts * promoCodeDiscount;

    return {
      total: Number(finalTotal.toFixed(2)),
      items: originalItems.concat(additionalItems),
    };
  }
}

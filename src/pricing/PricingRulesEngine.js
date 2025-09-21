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
    this.rules = this.#initializeRules(rules);
  }

  /**
   * Initializes pricing rules, using base pricing as fallback when no rules provided.
   * @private
   * @param {Array<PricingRule>} rules - Array of pricing rules
   * @returns {Array<PricingRule>} Initialized rules array
   */
  #initializeRules(rules) {
    // When no rules are provided, use base pricing (no discounts)
    if (!rules || rules.length === 0) {
      return [new BasePricingRule()];
    }

    return rules;
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
        // Validate discount is not negative
        if (result.discount < 0) {
          throw new RangeError(
            `Invalid discount amount: ${result.discount}. Discounts cannot be negative.`,
          );
        }

        totalDiscount += result.discount;
      }

      if (result.additionalItems) {
        additionalItems = additionalItems.concat(result.additionalItems);
      }

      if (result.promoCodeDiscount) {
        // Validate promo code discount percentage
        if (result.promoCodeDiscount < 0 || result.promoCodeDiscount > 1) {
          throw new RangeError(
            `Invalid promo code discount: ${result.promoCodeDiscount}. Must be between 0 and 1.`,
          );
        }

        promoCodeDiscount = result.promoCodeDiscount;
      }
    }

    let subtotal = 0;

    for (const item of originalItems) {
      subtotal += item.product.price * item.quantity;
    }

    // Apply absolute discounts first
    const totalAfterDiscounts = subtotal - totalDiscount;

    // Ensure discounts don't exceed the subtotal
    if (totalAfterDiscounts < 0) {
      throw new RangeError(
        `Total discount ($${totalDiscount}) exceeds subtotal ($${subtotal}).`,
      );
    }

    // Apply percentage discount (promo code) to the discounted total
    const finalTotal =
      totalAfterDiscounts - totalAfterDiscounts * promoCodeDiscount;

    // Final validation - ensure total is not negative
    if (finalTotal < 0) {
      throw new RangeError(
        `Invalid final total: $${finalTotal}. Total cannot be negative.`,
      );
    }

    return {
      total: Number(finalTotal.toFixed(2)),
      items: originalItems.concat(additionalItems),
    };
  }
}

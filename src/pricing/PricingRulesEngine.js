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
    const ruleResults = this.#applyAllRules(originalItems, promoCode);
    const subtotal = this.#calculateSubtotal(originalItems);
    const finalTotal = this.#applyDiscounts(subtotal, ruleResults);

    return {
      total: Number(finalTotal.toFixed(2)),
      items: originalItems.concat(ruleResults.additionalItems),
    };
  }

  /**
   * Applies all pricing rules and collects their results.
   * @private
   * @param {Array<CartItem>} items - Cart items to process
   * @param {string|null} promoCode - Optional promo code
   * @returns {Object} Aggregated rule results
   */
  #applyAllRules(items, promoCode) {
    let totalDiscount = 0;
    let additionalItems = [];
    let promoCodeDiscount = 0;

    for (const rule of this.rules) {
      const result = rule.apply(items, promoCode);

      if (result.discount) {
        this.#validateDiscount(result.discount);
        totalDiscount += result.discount;
      }

      if (result.additionalItems) {
        additionalItems = additionalItems.concat(result.additionalItems);
      }

      if (result.promoCodeDiscount) {
        this.#validatePromoCodeDiscount(result.promoCodeDiscount);
        promoCodeDiscount = result.promoCodeDiscount;
      }
    }

    return { totalDiscount, additionalItems, promoCodeDiscount };
  }

  /**
   * Validates that a discount amount is non-negative.
   * @private
   * @param {number} discount - Discount amount to validate
   * @throws {RangeError} When discount is negative
   */
  #validateDiscount(discount) {
    if (discount < 0) {
      throw new RangeError(
        `Invalid discount amount: ${discount}. Discounts cannot be negative.`,
      );
    }
  }

  /**
   * Validates that a promo code discount percentage is within valid range.
   * @private
   * @param {number} promoDiscount - Promo discount percentage (0-1)
   * @throws {RangeError} When discount is outside 0-1 range
   */
  #validatePromoCodeDiscount(promoDiscount) {
    if (promoDiscount < 0 || promoDiscount > 1) {
      throw new RangeError(
        `Invalid promo code discount: ${promoDiscount}. Must be between 0 and 1.`,
      );
    }
  }

  /**
   * Calculates the subtotal from cart items.
   * @private
   * @param {Array<CartItem>} items - Cart items
   * @returns {number} Subtotal before discounts
   */
  #calculateSubtotal(items) {
    let subtotal = 0;

    for (const item of items) {
      subtotal += item.product.price * item.quantity;
    }

    return subtotal;
  }

  /**
   * Applies discounts to the subtotal with validation.
   * @private
   * @param {number} subtotal - Original subtotal
   * @param {Object} ruleResults - Aggregated rule results
   * @returns {number} Final total after all discounts
   * @throws {RangeError} When discounts exceed subtotal or result in negative total
   */
  #applyDiscounts(subtotal, ruleResults) {
    const { totalDiscount, promoCodeDiscount } = ruleResults;

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

    return finalTotal;
  }
}

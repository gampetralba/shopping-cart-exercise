/**
 * Abstract base class for all pricing rules.
 * Implements the Strategy pattern for flexible pricing calculations.
 * @abstract
 * @class
 */
export class PricingRule {
  /**
   * Applies the pricing rule to the given items and promo code.
   * Rules are applied independently and should not modify the items array.
   * @abstract
   * @param {Array<CartItem>} items - Cart items to process (read-only)
   * @param {string|null} promoCode - Applied promo code
   * @returns {Object} Result object with discount, additionalItems, and optional promoCodeDiscount
   * @throws {Error} When not implemented by subclass
   */
  apply(items, promoCode) {
    throw new Error("PricingRule.apply() must be implemented by subclass");
  }
}

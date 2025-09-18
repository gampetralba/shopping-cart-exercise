/**
 * Abstract base class for all pricing rules.
 * Implements the Strategy pattern for flexible pricing calculations.
 * @abstract
 * @class
 */
export class PricingRule {
  /**
   * Applies the pricing rule to the given items and promo code.
   * @abstract
   * @param {Array<CartItem>} items - Cart items to process
   * @param {string|null} promoCode - Applied promo code
   * @returns {Object} Result object with processedItems, discount, additionalItems, and optional promoCodeDiscount
   * @throws {Error} When not implemented by subclass
   */
  apply(items, promoCode) {
    throw new Error('PricingRule.apply() must be implemented by subclass');
  }
}
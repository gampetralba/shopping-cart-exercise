import { PricingRule } from '../PricingRule.js';

/**
 * Default pricing rule that applies no discounts or modifications.
 * Used as a fallback when no other pricing rules are configured.
 * @extends PricingRule
 */
export class BasePricingRule extends PricingRule {
  /**
   * Returns items unchanged with no discounts applied.
   * @param {Array<CartItem>} items - Cart items to process
   * @param {string|null} promoCode - Applied promo code (not used by this rule)
   * @returns {Object} Result with no modifications
   */
  apply(items, promoCode) {
    return {
      processedItems: items,
      discount: 0,
      additionalItems: []
    };
  }
}
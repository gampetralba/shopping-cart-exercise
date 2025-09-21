import { PricingRule } from "../PricingRule.js";

/**
 * Default pricing rule that applies no discounts or modifications.
 * Used as a fallback when no other pricing rules are configured.
 * @extends PricingRule
 */
export class BasePricingRule extends PricingRule {
  /**
   * Returns items unchanged with no discounts applied.
   * @param {Array<CartItem>} _items - Cart items to process (not used by this rule)
   * @param {string|null} _promoCode - Applied promo code (not used by this rule)
   * @returns {Object} Result with no modifications
   */
  apply(_items, _promoCode) {
    return {
      discount: 0,
      additionalItems: [],
    };
  }
}

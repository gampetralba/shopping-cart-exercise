import { PricingRule } from "../PricingRule.js";

/**
 * Pricing rule that applies a percentage discount with a valid promo code.
 * The discount is applied to the final total after all other promotions.
 * @extends PricingRule
 */
export class PromoCodeRule extends PricingRule {
  /**
   * Creates a new PromoCodeRule instance.
   * @param {string} validCode - The promo code that triggers the discount
   * @param {number} discountPercentage - Discount percentage (e.g., 10 for 10% off)
   */
  constructor(validCode, discountPercentage) {
    super();
    this.validCode = validCode;
    this.discountPercentage = discountPercentage;
  }

  /**
   * Applies percentage discount if the promo code matches.
   * @param {Array<CartItem>} _items - Cart items to process (not used by this rule)
   * @param {string|null} promoCode - Applied promo code to validate
   * @returns {Object} Result with promo code discount percentage
   */
  apply(_items, promoCode) {
    if (promoCode !== this.validCode) {
      return { discount: 0, additionalItems: [] };
    }

    return {
      discount: 0,
      additionalItems: [],
      promoCodeDiscount: this.discountPercentage / 100,
    };
  }
}

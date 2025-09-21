import { PricingRule } from "../PricingRule.js";

/**
 * Pricing rule that implements bulk discount pricing.
 * When buying a minimum quantity or more, all units get a discounted price.
 * @extends PricingRule
 */
export class BulkDiscountRule extends PricingRule {
  /**
   * Creates a new BulkDiscountRule instance.
   * @param {string} productCode - Product code to apply bulk discount to
   * @param {number} minQuantity - Minimum quantity required for discount
   * @param {number} discountedPrice - Price per unit when bulk discount applies
   */
  constructor(productCode, minQuantity, discountedPrice) {
    super();
    this.productCode = productCode;
    this.minQuantity = minQuantity;
    this.discountedPrice = discountedPrice;
  }

  /**
   * Applies bulk discount when quantity meets minimum threshold.
   * @param {Array<CartItem>} items - Cart items to process
   * @param {string|null} _promoCode - Applied promo code (not used by this rule)
   * @returns {Object} Result with discount for bulk pricing
   */
  apply(items, _promoCode) {
    const targetItem = items.find(
      (item) => item.product.code === this.productCode,
    );

    if (!targetItem || targetItem.quantity < this.minQuantity) {
      return { discount: 0, additionalItems: [] };
    }

    const originalTotal = targetItem.product.price * targetItem.quantity;
    const discountedTotal = this.discountedPrice * targetItem.quantity;
    const discount = originalTotal - discountedTotal;

    return {
      discount: discount,
      additionalItems: [],
    };
  }
}

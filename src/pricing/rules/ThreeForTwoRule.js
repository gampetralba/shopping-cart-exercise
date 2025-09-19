import { PricingRule } from '../PricingRule.js';

/**
 * Pricing rule that implements a "3 for 2" promotion.
 * For every 3 units of the specified product, customer pays for only 2.
 * @extends PricingRule
 */
export class ThreeForTwoRule extends PricingRule {
  /**
   * Creates a new ThreeForTwoRule instance.
   * @param {string} productCode - Product code to apply the 3-for-2 deal to
   */
  constructor(productCode) {
    super();
    this.productCode = productCode;
  }

  /**
   * Applies the 3-for-2 discount to matching products.
   * @param {Array<CartItem>} items - Cart items to process
   * @param {string|null} promoCode - Applied promo code (not used by this rule)
   * @returns {Object} Result with discount applied for every 3rd item
   */
  apply(items, promoCode) {
    const targetItem = items.find(item => item.product.code === this.productCode);

    if (!targetItem) {
      return { processedItems: items, discount: 0, additionalItems: [] };
    }

    const freeUnits = Math.floor(targetItem.quantity / 3);
    const discount = freeUnits * targetItem.product.price;

    return {
      processedItems: items,
      discount: discount,
      additionalItems: []
    };
  }
}
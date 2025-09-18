import { PricingRule } from '../PricingRule.js';

export class ThreeForTwoRule extends PricingRule {
  constructor(productCode) {
    super();
    this.productCode = productCode;
  }

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
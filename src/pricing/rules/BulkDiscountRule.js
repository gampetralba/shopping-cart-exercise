import { PricingRule } from '../PricingRule.js';

export class BulkDiscountRule extends PricingRule {
  constructor(productCode, minQuantity, discountedPrice) {
    super();
    this.productCode = productCode;
    this.minQuantity = minQuantity;
    this.discountedPrice = discountedPrice;
  }

  apply(items, promoCode) {
    const targetItem = items.find(item => item.product.code === this.productCode);

    if (!targetItem || targetItem.quantity < this.minQuantity) {
      return { processedItems: items, discount: 0, additionalItems: [] };
    }

    const originalTotal = targetItem.product.price * targetItem.quantity;
    const discountedTotal = this.discountedPrice * targetItem.quantity;
    const discount = originalTotal - discountedTotal;

    return {
      processedItems: items,
      discount: discount,
      additionalItems: []
    };
  }
}
import { PricingRule } from '../PricingRule.js';
import { CartItem } from '../../models/CartItem.js';

export class BundleRule extends PricingRule {
  constructor(triggerProductCode, bundledProduct) {
    super();
    this.triggerProductCode = triggerProductCode;
    this.bundledProduct = bundledProduct;
  }

  apply(items, promoCode) {
    const triggerItem = items.find(item => item.product.code === this.triggerProductCode);

    if (!triggerItem) {
      return { processedItems: items, discount: 0, additionalItems: [] };
    }

    const freeBundleItem = new CartItem(
      { ...this.bundledProduct, price: 0 },
      triggerItem.quantity
    );

    return {
      processedItems: items,
      discount: 0,
      additionalItems: [freeBundleItem]
    };
  }
}
import { PricingRule } from '../PricingRule.js';

export class PromoCodeRule extends PricingRule {
  constructor(validCode, discountPercentage) {
    super();
    this.validCode = validCode;
    this.discountPercentage = discountPercentage;
  }

  apply(items, promoCode) {
    if (promoCode !== this.validCode) {
      return { processedItems: items, discount: 0, additionalItems: [] };
    }

    return {
      processedItems: items,
      discount: 0,
      additionalItems: [],
      promoCodeDiscount: this.discountPercentage / 100
    };
  }
}
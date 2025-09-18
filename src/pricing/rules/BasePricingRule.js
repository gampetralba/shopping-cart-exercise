import { PricingRule } from '../PricingRule.js';

export class BasePricingRule extends PricingRule {
  apply(items, promoCode) {
    return {
      processedItems: items,
      discount: 0,
      additionalItems: []
    };
  }
}
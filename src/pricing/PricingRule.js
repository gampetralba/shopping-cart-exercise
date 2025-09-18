export class PricingRule {
  apply(items, promoCode) {
    throw new Error('PricingRule.apply() must be implemented by subclass');
  }
}
import { BasePricingRule } from "./rules/BasePricingRule.js";

export class PricingRulesEngine {
  constructor(rules = []) {
    this.rules = rules.length > 0 ? rules : [new BasePricingRule()];
  }

  calculateTotal(items, promoCode) {
    let processedItems = [...items];
    let discount = 0;
    let additionalItems = [];

    for (const rule of this.rules) {
      const result = rule.apply(processedItems, promoCode);

      if (result.discount) {
        discount += result.discount;
      }

      if (result.additionalItems) {
        additionalItems = additionalItems.concat(result.additionalItems);
      }

      if (result.processedItems) {
        processedItems = result.processedItems;
      }
    }

    let subtotal = 0;

    for (const item of processedItems) {
      subtotal += item.product.price * item.quantity;
    }

    const total = subtotal - discount;

    return {
      total: Number(total.toFixed(2)),
      items: processedItems.concat(additionalItems),
    };
  }
}

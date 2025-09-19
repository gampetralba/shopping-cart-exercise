import { BasePricingRule } from "./rules/BasePricingRule.js";

/**
 * Engine that applies pricing rules to calculate cart totals.
 * Orchestrates multiple pricing rules and combines their results.
 */
export class PricingRulesEngine {
  /**
   * Creates a new PricingRulesEngine instance.
   * @param {Array<PricingRule>} [rules=[]] - Array of pricing rules to apply
   */
  constructor(rules = []) {
    /** @type {Array<PricingRule>} */
    this.rules = rules.length > 0 ? rules : [new BasePricingRule()];
  }

  /**
   * Calculates the total price after applying all pricing rules.
   * @param {Array<CartItem>} items - Cart items to process
   * @param {string|null} promoCode - Optional promo code to apply
   * @returns {{total: number, items: Array<CartItem>}} Final total and processed items
   */
  calculateTotal(items, promoCode) {
    let processedItems = [...items];
    let discount = 0;
    let additionalItems = [];
    let promoCodeDiscount = 0;

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

      if (result.promoCodeDiscount) {
        promoCodeDiscount = result.promoCodeDiscount;
      }
    }

    let subtotal = 0;

    for (const item of processedItems) {
      subtotal += item.product.price * item.quantity;
    }

    const totalAfterDiscounts = subtotal - discount;

    const finalTotal =
      totalAfterDiscounts - totalAfterDiscounts * promoCodeDiscount;

    return {
      total: Number(finalTotal.toFixed(2)),
      items: processedItems.concat(additionalItems),
    };
  }
}

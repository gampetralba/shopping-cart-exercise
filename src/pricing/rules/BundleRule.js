import { PricingRule } from "../PricingRule.js";
import { CartItem } from "../../models/CartItem.js";

/**
 * Pricing rule that bundles a free product with another product.
 * For each unit of the trigger product, a free bundled product is added.
 * @extends PricingRule
 */
export class BundleRule extends PricingRule {
  /**
   * Creates a new BundleRule instance.
   * @param {string} triggerProductCode - Product code that triggers the free bundle
   * @param {Product} bundledProduct - Product to bundle for free
   */
  constructor(triggerProductCode, bundledProduct) {
    super();
    this.triggerProductCode = triggerProductCode;
    this.bundledProduct = bundledProduct;
  }

  /**
   * Adds free bundled products based on trigger product quantity.
   * @param {Array<CartItem>} items - Cart items to process
   * @param {string|null} promoCode - Applied promo code (not used by this rule)
   * @returns {Object} Result with free bundled items added
   */
  apply(items, promoCode) {
    const triggerItem = items.find(
      (item) => item.product.code === this.triggerProductCode,
    );

    if (!triggerItem) {
      return { processedItems: items, discount: 0, additionalItems: [] };
    }

    const freeBundleItem = new CartItem(
      { ...this.bundledProduct, price: 0 },
      triggerItem.quantity,
    );

    return {
      processedItems: items,
      discount: 0,
      additionalItems: [freeBundleItem],
    };
  }
}

import {
  ShoppingCart,
  products,
  ThreeForTwoRule,
  BulkDiscountRule,
  PromoCodeRule,
} from "../src/index.js";

/**
 * Examples showing how to create custom rule combinations
 */

console.log("🔧 Custom Rules Configuration Examples\n");

// Example 1: Only 3-for-2 deals (no other promotions)
console.log("📋 Example 1: Only 3-for-2 promotion");
const cart1 = new ShoppingCart([new ThreeForTwoRule("ult_small")]);
cart1.add(products.ult_small);
cart1.add(products.ult_small);
cart1.add(products.ult_small);
cart1.add(products.ult_large);
console.log(`   Total: $${cart1.total}`);
console.log(`   Items in cart:`);
cart1.items.forEach((item) => {
  console.log(`     - ${item.quantity}x ${item.product.name}`);
});
console.log("   Only 3-for-2 rule applied, no bulk discount on ult_large\n");

// Example 2: Different bulk discount threshold
console.log("📋 Example 2: Custom bulk discount (3+ items at $42.00)");
const cart2 = new ShoppingCart([
  new BulkDiscountRule("ult_large", 3, 42.0), // Lower threshold, higher price
]);
cart2.add(products.ult_large);
cart2.add(products.ult_large);
cart2.add(products.ult_large);
console.log(`   Total: $${cart2.total}`);
console.log(`   Items in cart:`);
cart2.items.forEach((item) => {
  console.log(`     - ${item.quantity}x ${item.product.name}`);
});
console.log("   Custom bulk discount: 3+ items at $42.00 each\n");

// Example 3: Different promo code
console.log("📋 Example 3: Custom promo code (15% discount)");
const cart3 = new ShoppingCart([new PromoCodeRule("SAVE15", 15)]);
cart3.add(products.ult_small);
cart3.add(products.ult_medium);
cart3.applyPromoCode("SAVE15");
console.log(`   Total: $${cart3.total}`);
console.log(`   Items in cart:`);
cart3.items.forEach((item) => {
  console.log(`     - ${item.quantity}x ${item.product.name}`);
});
console.log('   15% discount applied with "SAVE15" code\n');

// Example 4: No rules (base pricing only)
console.log("📋 Example 4: Base pricing (no promotions)");
const cart4 = new ShoppingCart(); // No rules
cart4.add(products.ult_small);
cart4.add(products.ult_small);
cart4.add(products.ult_small);
console.log(`   Total: $${cart4.total}`);
console.log(`   Items in cart:`);
cart4.items.forEach((item) => {
  console.log(`     - ${item.quantity}x ${item.product.name}`);
});
console.log("   Standard pricing: $24.90 × 3 = $74.70\n");

// Example 5: Multiple 3-for-2 deals
console.log("📋 Example 5: 3-for-2 on multiple products");
const cart5 = new ShoppingCart([
  new ThreeForTwoRule("ult_small"),
  new ThreeForTwoRule("ult_medium"),
]);
cart5.add(products.ult_small);
cart5.add(products.ult_small);
cart5.add(products.ult_small);
cart5.add(products.ult_medium);
cart5.add(products.ult_medium);
cart5.add(products.ult_medium);
console.log(`   Total: $${cart5.total}`);
console.log(`   Items in cart:`);
cart5.items.forEach((item) => {
  console.log(`     - ${item.quantity}x ${item.product.name}`);
});
console.log("   3-for-2 applied to both Unlimited 1GB and Unlimited 2GB\n");

console.log("✅ Custom rules examples completed!");

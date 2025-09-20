import {
  ShoppingCart,
  products,
  ThreeForTwoRule,
  BulkDiscountRule,
  BundleRule,
  PromoCodeRule,
} from "../src/index.js";

/**
 * Demo script showing all 4 scenarios from the requirements
 */

// Setup the pricing rules
const pricingRules = [
  new ThreeForTwoRule("ult_small"), // 3-for-2 deal on Unlimited 1GB
  new BulkDiscountRule("ult_large", 4, 39.9), // Bulk discount on Unlimited 5GB
  new BundleRule("ult_medium", products["1gb"]), // Free 1GB with Unlimited 2GB
  new PromoCodeRule("I<3AMAYSIM", 10), // 10% discount promo code
];

console.log("🛒 Amaysim Shopping Cart Demo\n");

// Scenario 1: 3 x ult_small, 1 x ult_large
console.log("📋 Scenario 1: 3 x Unlimited 1GB, 1 x Unlimited 5GB");
const cart1 = new ShoppingCart(pricingRules);
cart1.add(products.ult_small);
cart1.add(products.ult_small);
cart1.add(products.ult_small);
cart1.add(products.ult_large);
console.log(`   Total: $${cart1.total} (Expected: $94.70)`);
console.log(`   Items in cart:`);
cart1.items.forEach((item) => {
  console.log(
    `     - ${item.quantity}x ${item.product.name}`,
  );
});
console.log(
  "   Promotion: 3-for-2 deal applied (pay for 2 out of 3 Unlimited 1GB)\n",
);

// Scenario 2: 2 x ult_small, 4 x ult_large
console.log("📋 Scenario 2: 2 x Unlimited 1GB, 4 x Unlimited 5GB");
const cart2 = new ShoppingCart(pricingRules);
cart2.add(products.ult_small);
cart2.add(products.ult_small);
cart2.add(products.ult_large);
cart2.add(products.ult_large);
cart2.add(products.ult_large);
cart2.add(products.ult_large);
console.log(`   Total: $${cart2.total} (Expected: $209.40)`);
console.log(`   Items in cart:`);
cart2.items.forEach((item) => {
  console.log(
    `     - ${item.quantity}x ${item.product.name}`,
  );
});
console.log(
  "   Promotion: Bulk discount applied (4+ Unlimited 5GB at $39.90 each)\n",
);

// Scenario 3: 1 x ult_small, 2 x ult_medium
console.log("📋 Scenario 3: 1 x Unlimited 1GB, 2 x Unlimited 2GB");
const cart3 = new ShoppingCart(pricingRules);
cart3.add(products.ult_small);
cart3.add(products.ult_medium);
cart3.add(products.ult_medium);
console.log(`   Total: $${cart3.total} (Expected: $84.70)`);
console.log(`   Items in cart:`);
cart3.items.forEach((item) => {
  console.log(
    `     - ${item.quantity}x ${item.product.name}`,
  );
});
console.log("   Promotion: Free 1GB Data-pack with each Unlimited 2GB\n");

// Scenario 4: 1 x ult_small, 1 x 1gb + promo code
console.log(
  "📋 Scenario 4: 1 x Unlimited 1GB, 1 x 1GB Data-pack with promo code",
);
const cart4 = new ShoppingCart(pricingRules);
cart4.add(products.ult_small);
cart4.add(products["1gb"], "I<3AMAYSIM");
console.log(`   Total: $${cart4.total} (Expected: $31.32)`);
console.log(`   Items in cart:`);
cart4.items.forEach((item) => {
  console.log(
    `     - ${item.quantity}x ${item.product.name}`,
  );
});
console.log(
  '   Promotion: 10% discount applied with promo code "I<3AMAYSIM"\n',
);

console.log("✅ All scenarios completed!");

import { ShoppingCart } from "./cart/ShoppingCart.js";
import { createDefaultPricingRules } from "./rules/index.js";
import { catalog } from "./catalog/products.js";

// Example usage - will be expanded later
const pricingRules = createDefaultPricingRules();
const cart = new ShoppingCart(pricingRules);

export { ShoppingCart, catalog, createDefaultPricingRules };

import { Product } from "../models/Product.js";

/**
 * Product catalog containing all available SIM card products and data packs.
 * @type {Object<string, Product>}
 */
export const products = {
  ult_small: new Product("ult_small", "Unlimited 1GB", 24.9),
  ult_medium: new Product("ult_medium", "Unlimited 2GB", 29.9),
  ult_large: new Product("ult_large", "Unlimited 5GB", 44.9),
  "1gb": new Product("1gb", "1 GB Data-pack", 9.9),
};

/**
 * Retrieves a product by its code.
 * @param {string} code - Product code to look up
 * @returns {Product|undefined} Product if found, undefined otherwise
 */
export function getProduct(code) {
  return products[code];
}

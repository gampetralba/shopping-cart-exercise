# Shopping Cart Exercise

A flexible shopping cart implementation for Amaysim's SIM card pricing system.

## Installation

### Prerequisites

- **Node.js** (version 18 or higher)
  - Download from [nodejs.org](https://nodejs.org/) if not installed
  - Verify installation: `node --version`

### Setup Steps

1. **Clone or download this repository**

   ```bash
   git clone https://github.com/gampetralba/shopping-cart-exercise.git
   cd shopping-cart-exercise
   ```

2. **Verify installation**

   ```bash
   npm test
   ```

   If all tests pass, the setup is successful!

   _Note: No `npm install` needed - this project has no external dependencies._

## Quick Start

```bash
# Run the demo (shows all 4 required scenarios)
npm run demo

# Run all tests
npm test

# Run just the 4 required scenarios
npm run test:scenarios

# See custom examples
npm run examples:custom-rules
```

## Requirements

✅ All 4 test scenarios implemented:

1. 3 x ult_small, 1 x ult_large → $94.70
2. 2 x ult_small, 4 x ult_large → $209.40
3. 1 x ult_small, 2 x ult_medium → $84.70
4. 1 x ult_small, 1 x 1gb + promo → $31.32

## Usage

```javascript
import {
  ShoppingCart,
  products,
  ThreeForTwoRule,
  BulkDiscountRule,
  BundleRule,
  PromoCodeRule,
} from "./src/index.js";

// Set up pricing rules
const pricingRules = [
  new ThreeForTwoRule("ult_small"),
  new BulkDiscountRule("ult_large", 4, 39.9),
  new BundleRule("ult_medium", products["1gb"]),
  new PromoCodeRule("I<3AMAYSIM", 10),
];

// Create cart and add items
const cart = ShoppingCart.new(pricingRules);
cart.add(products.ult_small);
cart.add(products.ult_large, "I<3AMAYSIM");

console.log(cart.total); // 62.82 (with 10% discount)
console.log(cart.items); // Array of cart items
```

## Architecture

Uses **Strategy Pattern** for flexible pricing rules:

- Easy to add new promotions
- Each rule is independently testable
- Rules can be combined or used separately

## Structure

```
src/
├── cart/ShoppingCart.js     # Main cart implementation
├── models/                  # Product and CartItem models
├── pricing/rules/           # Individual promotion rules
└── index.js                # Main exports

test/                       # Comprehensive test suite (50+ tests)
examples/                   # Demo and usage examples
```

## Testing

- **50+ tests** covering all scenarios, edge cases, and validation
- **100% requirement coverage** - all scenarios pass
- Run with `npm test`

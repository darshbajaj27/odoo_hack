# Velocity Threshold Monitoring Implementation

## Overview
Implemented an automated error prevention system that flags mandatory warnings when staff members attempt to move quantities significantly outside a product's historical average velocity.

## Changes Made

### 1. **components/stock-master-app.tsx** 🔗 Modified
- **Added historical product data structure** containing average monthly velocity for each product
- **Data includes**: Product ID, SKU, Name, Average Monthly Velocity, Category
- **Passed historical data to ProductManagement component** via `historicalData` prop

Historical data sample:
```typescript
const historicalProductData = [
  { id: 1, sku: "SKU-001", name: "Steel Rods 12mm", avgMonthlyVelocity: 120, category: "Raw Materials" },
  { id: 2, sku: "SKU-002", name: "Concrete Mix 40kg", avgMonthlyVelocity: 80, category: "Raw Materials" },
  // ... more products
]
```

### 2. **components/views/product-management.tsx** 🆕 Primary Logic Changes

#### Added Velocity Threshold Monitoring Function:
- `checkVelocityDeviation(productId: number, quantity: number)` 
- **Calculates daily average** from monthly velocity (avgMonthly / 30)
- **Deviation thresholds**:
  - Flags if quantity > 150% of daily average
  - Flags if quantity < 50% of daily average
- **Returns deviation details** (product name, quantity, avg velocity, deviation percentage)

#### Added State Management:
- `showQuantityInput`: Track which product's quantity input is visible
- `inputQuantity`: Store user's quantity input
- `deviationAlert`: Store deviation alert data when triggered

#### Enhanced UI with:
- **Grid View**: Added "Move Quantity" input field in product cards with Submit button
- **Table View**: Added "Move" action button to trigger quantity input
- **Quantity Input Field**: Number input with inline submission

#### Deviation Alert Dialog:
- **Mandatory warning modal** triggered when deviation detected
- **Displays**:
  - Alert title with icon (AlertTriangle)
  - Product name
  - User's input quantity
  - Historical daily velocity
  - Deviation percentage (with color coding: red for over, orange for under)
- **Actions**:
  - **Cancel**: Dismiss alert and clear input
  - **Proceed Anyway**: Acknowledge warning and proceed with the move

### 3. **components/ui/alert-dialog.tsx** ✅ Already Implemented
- Alert dialog components were already available in the UI library
- Used for the mandatory warning system
- Features smooth animations, backdrop overlay, and accessible button states

## How It Works

### User Flow:
1. User navigates to Products view
2. User clicks "Move" button (table) or menu button (grid) on a product
3. Quantity input field appears
4. User enters quantity and clicks Submit
5. System checks quantity against historical velocity:
   - ✅ **If within range**: Quantity recorded successfully
   - ⚠️ **If outside range**: Mandatory deviation alert displayed
6. User can either:
   - Cancel the operation
   - Proceed anyway (acknowledging the deviation)

## Example Scenario

**Product**: "Steel Rods 12mm"
- **Historical Monthly Velocity**: 120 units
- **Daily Average**: 4 units/day
- **Deviation Thresholds**: 2-6 units (50-150%)

**User Actions**:
- Attempts to move **15 units** → **Above threshold (250%)** → Alert shown
- Attempts to move **1 unit** → **Below threshold (25%)** → Alert shown
- Attempts to move **5 units** → **Within threshold** → Recorded successfully

## Technical Details

### Deviation Calculation:
```
deviationPercentage = ((quantity - dailyAverage) / dailyAverage) * 100
```

### Threshold Logic:
```
Flag if: quantity > (dailyAverage * 1.5) OR quantity < (dailyAverage * 0.5)
```

## Features

✅ Automatic velocity deviation detection
✅ Mandatory warning dialog (cannot be bypassed silently)
✅ Detailed deviation information displayed
✅ Graceful fallback for products without historical data
✅ Works in both grid and table views
✅ Color-coded deviation indicators (red/orange)
✅ Clear user feedback and action options

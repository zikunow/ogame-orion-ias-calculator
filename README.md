# OGame Orion IAS Calculator

A small static calculator for **OGame Project Orion** and the **Interstellar Anomaly Scanner (IAS)**.

Enter your number of planets, current IAS level and target IAS level. The calculator shows:

- MSU cost of each next IAS level across all selected planets
- cumulative MSU investment
- total IAS
- lithium/hour per planet and across all planets
- output gain versus the previous level
- output gain versus your selected starting level
- MSU spent per +1% of lithium output

## Formulas

### IAS level cost

Base level 1 cost per planet:

- Metal: 84
- Crystal: 42
- Deuterium: 14

Each next level uses a factor of 1.4:

```
resourceCost(L) = round(baseCost × 1.4^(L - 1))
```

### Lithium conversion

Observed in-game values match:

```
lithiumPerHour(L) = floor(220 × L × 1.1^(L - 1))
```

### MSU

The default ratio is **3:2:1**:

```
MSU = Metal + 1.5 × Crystal + 3 × Deuterium
```

The ratio can be changed in the calculator.

## Notes

“Output gain” means the gain in IAS lithium/hour conversion. It should not be treated as a confirmed Orion loot formula unless reward scaling is confirmed to be directly proportional to this value.

This is an unofficial community tool. Project Orion mechanics may change during testing.

## GitHub Pages

The site is plain HTML/CSS/JavaScript and is deployed through GitHub Pages.

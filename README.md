# OGame Orion IAS Calculator

Compare Interstellar Anomaly Scanner upgrade costs, lithium production and relative gains across multiple planets.

**Website:** https://zikunow.github.io/ogame-orion-ias-calculator/

Enter the number of planets, starting IAS level and target IAS level. Every selected planet is assumed to have the same IAS level and to receive every upgrade in the selected path.

The interface is available in English and Russian. Use the EN / RU buttons next to GitHub to switch languages. The selection is remembered in this browser, and share links include a `lang` parameter. An explicit link language takes precedence over the remembered preference.

## Features

- Upgrade costs in Metal, Crystal, Deuterium and Metal Standard Units (MSU).
- Editable Metal:Crystal:Deuterium trade ratio, defaulting to 3:2:1.
- Total investment from the selected start, plus cumulative investment from IAS 0 to each row's level.
- Total IAS, lithium/hour per planet and across all selected planets.
- Output gains against the previous level and selected start.
- Marginal MSU per +1 percentage point of output gain versus the previous level.
- Shareable calculator settings encoded in the URL.
- Responsive controls and a horizontally scrollable comparison table.

Supported inputs: 1–50 planets, starting level 0–79 and target level 1–80, with target greater than start. These are calculator limits, not claimed game limits. Trade ratios must be positive finite numbers.

## Output gain charts

Two interactive charts above the upgrade table compare gain against the previous level and the selected starting level. X is the resulting IAS level; Y is lithium output gain in percent. The cumulative chart includes the starting level at 0%. Step gains cover only upgrades within the selected range. Both charts use linear Y axes starting at zero, with separate scales. Hover, focus or tap a point for its exact percentage. Gains relative to zero output are undefined and omitted.

These are output comparisons, not confirmed loot scaling or payback estimates.

## Calculation

For level `L >= 1`, base resource costs are 84 Metal, 42 Crystal and 14 Deuterium:

```text
resourceCost(L) = round(baseCost × 1.4^(L − 1))
upgradeCost(start, target) = sum(resourceCost(L), L = start + 1 … target)
```

The calculator retains the original nearest-whole-unit resource rounding convention. Rounding occurs per resource per planet before multiplying by planet count. It uses exact rational arithmetic for the 1.4 multiplier to avoid floating point errors at rounding boundaries. No account-specific discounts or bonuses are applied.

```text
lithium/hour(L) = floor(220 × L × 1.1^(L − 1))
total lithium/hour = lithium/hour(L) × planets
total IAS = L × planets
```

IAS 0 has zero cost and output. Exact rational arithmetic is also used before flooring lithium output. The supplied in-game checkpoints are 26,909 at level 20, 31,081 at 21, 35,817 at 22, 153,286 at 33 and 173,724 at 34.

For a Metal:Crystal:Deuterium ratio `M:C:D`:

```text
MSU = Metal + Crystal × M/C + Deuterium × M/D
```

At 3:2:1 this is `Metal + 1.5 × Crystal + 3 × Deuterium`. MSU conversion does not round each level upward. Displayed MSU values use up to two decimal places; compact table values are abbreviated for readability. Exact resource totals are shown above the table and for each upgrade.

```text
gain versus previous = output(L) / output(L − 1) − 1
gain versus start = output(L) / output(start) − 1
MSU per +1% output = this upgrade's MSU / (gain versus previous × 100)
```

Percentages and efficiency from zero output are undefined and displayed as `N/A`. This efficiency measure compares upgrade cost to relative output gain; it is not a payback period.

Example: 18 planets at IAS 55 have Total IAS 990. At IAS 60, Total IAS is 1,080 and lithium/hour increases by approximately 75.69%.

**Output gain refers only to lithium/hour. The Orion loot formula is unconfirmed, so this calculator does not claim equivalent loot gains.** This is an unofficial community tool, and Project Orion mechanics may change.

## Development and checks

This is a dependency-free static HTML/CSS/JavaScript site. Serve the repository with any static server, for example:

```sh
python3 -m http.server 8000
```

Run the regression checks with Node.js 18 or later:

```sh
node --test tests/calculator.test.cjs
```

Checks cover supplied lithium values, cost scaling, cumulative totals, custom MSU ratios, the 55→60 example, invalid inputs and zero-output behavior.

## Deployment

GitHub Pages uses the workflow in `.github/workflows/pages.yml`. It runs checks and uploads only `index.html`, `styles.css`, `app.js` and `.nojekyll`, then deploys on pushes to `main` or manual dispatch.

Pages must first be enabled in **Settings → Pages → Build and deployment → Source: GitHub Actions**. The regular workflow `GITHUB_TOKEN` can deploy an enabled site but cannot perform its initial enablement. The previous failure at Configure Pages was caused by trying to enable the site using that token.

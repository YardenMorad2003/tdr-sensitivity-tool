# CovenantLab TDR v4.7 Sensitivity Engine

Interactive underwriting gap calculator for a 22-borrower SRLN leveraged loan portfolio. Built on the CovenantLab Total Discount Rate framework (CDR v1 × TDR v4.7).

**Live:** [https://yardenmorad2003.github.io/tdr-sensitivity-tool/](https://yardenmorad2003.github.io/tdr-sensitivity-tool/)

## The Master Formula

```
TDR*(t) = rf(t) + λ(t)·LGD(t) + MSP(t) + Π(t)·OAS(t)
```

| Term | What It Prices | Provenance |
|------|---------------|------------|
| `rf(t)` | Time value of money | SOFR swap curve |
| `λ(t)·LGD(t)` | Default risk | Duffie–Singleton (1999, 2003) |
| `MSP(t)` | Market sentiment premium | Altman credit cycle; BDC P/NAV |
| `Π(t)·OAS(t)` | Path-adjusted covenant optionality | CovenantLab original |

## What's New in v2.0 (TDR v4.7)

### Model Alignment
- **MSP replaces LS** — Market Sentiment Premium with exposed formula: `MSP = β_MSP × (1 − P/NAV)`, showing P/NAV as observed input and β_MSP as working assumption
- **Offered Spread moves with rf** — `Offered = rf + credit spread`, so changing the risk-free rate correctly shifts both sides
- **LME zone Ψ = 1.40** — was incorrectly mapped to DISTRESS (1.25) in v1

### Per-Borrower Differentiation
- **Per-borrower λ** — hazard rates range 2.0–4.5% across the portfolio (was flat 3.1%)
- **Per-borrower Entelechy scores** — individual Sk for each of the 5 families per borrower
- **Per-borrower CtrlScore** — `0.35·S_MT + 0.35·S_GV + 0.30·S_EN` computed from actual scores (was hardcoded 0.63)
- **Seniority-driven LGD** — 1L (0.35) vs 2L (0.50) from each borrower's lien position
- **Score-weighted zone weights** — `wk = Sk × Mk,Z / Σ` per the v4.4 clean formula

### New Analytical Views
- **OAS three-step decomposition** — Intrinsic OAS → × Π → = Realized Π·OAS
- **Borrower Exercise Log** — full path showing each exercise, its dj coefficient, and cumulative Π
- **UG decomposition** — which TDR term is driving the underwriting gap for each borrower
- **Observed vs. Working tags** — every parameter tagged by calibration status

### UX Improvements
- Status labels renamed: HEAVY → UNDERPAID, LIGHT → ADEQUATE
- Lien and λ columns added to portfolio table
- Full CtrlScore/LGD chain visible in detail panel

## Architecture

```
src/
  data.js    — All model data, constants, and computation logic
  App.jsx    — UI components and layout
  main.jsx   — React entry point
  index.css  — Global styles
```

The computation layer (`data.js`) is fully separated from the UI layer (`App.jsx`). The `computeTDR()` function implements the complete v4.7 formula and returns all intermediate values for decomposition display.

## Development

```bash
npm install
npm run dev
```

Deploys to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

## Parameter Status

| Parameter | Value | Status | Calibration Target |
|-----------|-------|--------|-------------------|
| `rf` | SOFR swap | OBSERVED | Bloomberg daily |
| `P/NAV` | BDC Index | OBSERVED | Cliffwater quarterly |
| `β_MSP` | 1.50 | WORKING | Cliffwater regression Q3 2026 |
| `φ` | 0.30 | WORKING | Covenant Review LME regression |
| `Δr_max` | Family ranges | WORKING | LSTA/LCD matched-pair OAS |
| `λ` | Per-borrower | WORKING | Kamakura KRIS trial Q2 2026 |
| `dj` | Exercise coefficients | RESEARCH | Covenant Review exercise sequences |

## References

- CovenantLab TDR Methodology Bible v4.7 (March 2026)
- Covenant Classification Bible v2 — CDR v1 × TDR v4.7
- CDR Covenant Working Map v1

---

CovenantLab Analytics · Confidential — For Research and Advisory Use Only

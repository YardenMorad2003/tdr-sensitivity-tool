# CovenantLab TDR Sensitivity Tool

Interactive assumption sensitivity calculator for the CovenantLab Total Discount Rate (TDR) framework, applied to 22 SRLN leveraged loan borrowers.

## What It Does

Answers one question: **Is this loan fairly priced given its covenant quality?**

The tool computes the Underwriting Gap (UG) in real time as you adjust model assumptions:

```
TDR = rf + λ·LGD + LS + Π·OAS
UG  = TDR − Offered Spread
```

- **UG < 0** → Market overcompensates the lender (good deal)
- **UG > 0** → Lender is underpaid for the risk

## Adjustable Assumptions

| Parameter | What It Is | Default |
|-----------|-----------|---------|
| **rf** | Risk-free rate (SOFR swap curve) | 455 bps |
| **LS** | Lender sentiment (BDC P/NAV friction) | 85 bps |
| **LGD Base** | Loss given default (seniority baseline) | 0.35 |
| **φ (phi)** | Covenant-recovery sensitivity | 0.30 |
| **Zone** | Borrower credit state (SAFE → DEFAULT) | ALERT |
| **Δr_max** | Max enforcement gain per family (CFP/EX/MT/GV/EN) | Midpoints |

## Data

- 22 public borrowers from the SPDR Blackstone Senior Loan ETF (SRLN)
- Path degradation Π values classified from SEC EDGAR 8-K amendment filings
- Zone weights from the Classification Bible Mk,Z matrix (v2)

## Framework

Built on:
- **CDR v1** — Covenant Discount Rate Working Map (legal taxonomy)
- **TDR v4.6** — Total Discount Rate Methodology Bible (pricing model)
- **Classification Bible v2** — Option family architecture and path degradation

## Tech Stack

- React 18 + Vite 5
- Zero dependencies beyond React
- Deployed to GitHub Pages via Actions

## Local Development

```bash
npm install
npm run dev
```

## Deploy

Push to `main` — GitHub Actions builds and deploys to Pages automatically.

Or build manually:

```bash
npm run build
# Output in dist/
```

## Configuration

To change the GitHub Pages base path (e.g., if your repo is named differently):

1. Edit `vite.config.js` → change `base: '/your-repo-name/'`
2. Push to main

---

**CovenantLab Analytics** | CDR v1 × TDR v4.6 | March 2026 | Confidential

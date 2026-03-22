// ═══════════════════════════════════════════════════════════════
// CovenantLab TDR v4.7 — Data & Computation Layer
// CDR v1 × TDR v4.7 | March 2026
// ═══════════════════════════════════════════════════════════════

// ── Borrower Data (22 SRLN borrowers) ──────────────────────────
// Each borrower has: per-borrower λ, seniority, Entelechy scores
// per family, exercise log for Π path, and amendment count.

export const BORROWERS = [
  { borrower: "AmericanAir", ticker: "AAL", sector: "Airlines", spread: 225, bor_am: 10, bor_pi: 0.7374, fac_lgd: 75.9, total_size: 5850, seniority: "1L", lambda_base: 4.2,
    exercises: [{ type: "PIK toggle", q: "Q2 2024" }, { type: "Equity cure", q: "Q4 2024" }, { type: "Accordion draw", q: "Q1 2025" }],
    scores: { CFP: 0.58, EX: 0.45, MT: 0.52, GV: 0.48, EN: 0.62 } },
  { borrower: "Aramark", ticker: "ARMK", sector: "Business Services", spread: 175, bor_am: 20, bor_pi: 0.5259, fac_lgd: 45.5, total_size: 5509, seniority: "1L", lambda_base: 2.8,
    exercises: [{ type: "PIK toggle", q: "Q1 2023" }, { type: "PIK toggle", q: "Q2 2023" }, { type: "Equity cure", q: "Q3 2023" }, { type: "Accordion draw", q: "Q1 2024" }, { type: "Restricted payment", q: "Q2 2024" }, { type: "EBITDA add-back >50%", q: "Q3 2024" }, { type: "Debt incurrence", q: "Q4 2024" }],
    scores: { CFP: 0.65, EX: 0.50, MT: 0.40, GV: 0.38, EN: 0.55 } },
  { borrower: "Axalta", ticker: "AXTA", sector: "Specialty Chemicals", spread: 200, bor_am: 2, bor_pi: 0.9409, fac_lgd: 45.5, total_size: 2400, seniority: "1L", lambda_base: 2.1,
    exercises: [{ type: "Restricted payment", q: "Q3 2024" }],
    scores: { CFP: 0.72, EX: 0.65, MT: 0.70, GV: 0.60, EN: 0.68 } },
  { borrower: "Caesars", ticker: "CZR", sector: "Gaming", spread: 225, bor_am: 7, bor_pi: 0.7259, fac_lgd: 63.2, total_size: 6300, seniority: "1L", lambda_base: 3.5,
    exercises: [{ type: "Equity cure", q: "Q1 2024" }, { type: "PIK toggle", q: "Q3 2024" }, { type: "Accordion draw", q: "Q4 2024" }],
    scores: { CFP: 0.60, EX: 0.55, MT: 0.50, GV: 0.52, EN: 0.58 } },
  { borrower: "ChartInd", ticker: "GTLS", sector: "Industrial Equipment", spread: 250, bor_am: 8, bor_pi: 0.6755, fac_lgd: 50.6, total_size: 3250, seniority: "1L", lambda_base: 3.0,
    exercises: [{ type: "Accordion draw", q: "Q2 2024" }, { type: "Equity cure", q: "Q3 2024" }, { type: "Debt incurrence", q: "Q1 2025" }],
    scores: { CFP: 0.55, EX: 0.48, MT: 0.45, GV: 0.50, EN: 0.60 } },
  { borrower: "Charter", ticker: "CHTR", sector: "Cable/Telecom", spread: 175, bor_am: 6, bor_pi: 0.7976, fac_lgd: 48.4, total_size: 9500, seniority: "1L", lambda_base: 2.0,
    exercises: [{ type: "PIK toggle", q: "Q2 2025" }, { type: "Restricted payment", q: "Q3 2025" }],
    scores: { CFP: 0.70, EX: 0.62, MT: 0.65, GV: 0.58, EN: 0.66 } },
  { borrower: "Corpay", ticker: "CPAY", sector: "FinTech / Payments", spread: 175, bor_am: 17, bor_pi: 0.5417, fac_lgd: 45.5, total_size: 5545, seniority: "1L", lambda_base: 2.5,
    exercises: [{ type: "PIK toggle", q: "Q1 2023" }, { type: "Equity cure", q: "Q2 2023" }, { type: "Accordion draw", q: "Q4 2023" }, { type: "EBITDA add-back >50%", q: "Q1 2024" }, { type: "Asset drop-down", q: "Q2 2024" }, { type: "Debt incurrence", q: "Q3 2024" }],
    scores: { CFP: 0.62, EX: 0.55, MT: 0.35, GV: 0.40, EN: 0.50 } },
  { borrower: "EverCommerce", ticker: "EVCM", sector: "Software/SaaS", spread: 250, bor_am: 6, bor_pi: 0.7417, fac_lgd: 104.1, total_size: 634, seniority: "2L", lambda_base: 3.8,
    exercises: [{ type: "PIK toggle", q: "Q1 2025" }, { type: "Equity cure", q: "Q2 2025" }],
    scores: { CFP: 0.50, EX: 0.42, MT: 0.48, GV: 0.45, EN: 0.52 } },
  { borrower: "FirstAdvantage", ticker: "FA", sector: "HR Technology", spread: 250, bor_am: 4, bor_pi: 0.8305, fac_lgd: 50.6, total_size: 1000, seniority: "1L", lambda_base: 2.6,
    exercises: [{ type: "Restricted payment", q: "Q4 2024" }],
    scores: { CFP: 0.68, EX: 0.58, MT: 0.62, GV: 0.55, EN: 0.65 } },
  { borrower: "HGV", ticker: "HGV", sector: "Hotels/Timeshare", spread: 225, bor_am: 8, bor_pi: 0.7353, fac_lgd: 50.6, total_size: 2200, seniority: "1L", lambda_base: 3.2,
    exercises: [{ type: "PIK toggle", q: "Q3 2024" }, { type: "Equity cure", q: "Q4 2024" }, { type: "Accordion draw", q: "Q1 2025" }],
    scores: { CFP: 0.58, EX: 0.50, MT: 0.48, GV: 0.52, EN: 0.56 } },
  { borrower: "Hilton", ticker: "HLT", sector: "Hotels", spread: 175, bor_am: 11, bor_pi: 0.7444, fac_lgd: 47.3, total_size: 5700, seniority: "1L", lambda_base: 2.2,
    exercises: [{ type: "PIK toggle", q: "Q1 2024" }, { type: "Restricted payment", q: "Q2 2024" }, { type: "Equity cure", q: "Q4 2024" }, { type: "Accordion draw", q: "Q1 2025" }],
    scores: { CFP: 0.65, EX: 0.60, MT: 0.55, GV: 0.50, EN: 0.62 } },
  { borrower: "LifeTime", ticker: "LTH", sector: "Fitness/Leisure", spread: 250, bor_am: 2, bor_pi: 0.9409, fac_lgd: 45.5, total_size: 1400, seniority: "1L", lambda_base: 2.9,
    exercises: [{ type: "Restricted payment", q: "Q2 2025" }],
    scores: { CFP: 0.72, EX: 0.65, MT: 0.68, GV: 0.60, EN: 0.70 } },
  { borrower: "LightWonder", ticker: "LNW", sector: "Gaming Technology", spread: 250, bor_am: 4, bor_pi: 0.9036, fac_lgd: 55.6, total_size: 2650, seniority: "1L", lambda_base: 2.7,
    exercises: [{ type: "PIK toggle", q: "Q4 2024" }],
    scores: { CFP: 0.70, EX: 0.58, MT: 0.62, GV: 0.55, EN: 0.68 } },
  { borrower: "NRG", ticker: "NRG", sector: "Energy/Utilities", spread: 200, bor_am: 10, bor_pi: 0.7521, fac_lgd: 45.5, total_size: 4600, seniority: "1L", lambda_base: 2.4,
    exercises: [{ type: "PIK toggle", q: "Q1 2024" }, { type: "Equity cure", q: "Q3 2024" }, { type: "Restricted payment", q: "Q1 2025" }],
    scores: { CFP: 0.65, EX: 0.55, MT: 0.58, GV: 0.52, EN: 0.60 } },
  { borrower: "Petco", ticker: "WOOF", sector: "Retail/Pet", spread: 300, bor_am: 3, bor_pi: 0.9127, fac_lgd: 139.0, total_size: 1400, seniority: "1L", lambda_base: 4.5,
    exercises: [{ type: "Equity cure", q: "Q1 2025" }],
    scores: { CFP: 0.48, EX: 0.40, MT: 0.45, GV: 0.42, EN: 0.50 } },
  { borrower: "QSR", ticker: "QSR", sector: "QSR/Restaurants", spread: 175, bor_am: 14, bor_pi: 0.5385, fac_lgd: 45.5, total_size: 5700, seniority: "1L", lambda_base: 2.3,
    exercises: [{ type: "PIK toggle", q: "Q2 2023" }, { type: "PIK toggle", q: "Q4 2023" }, { type: "Equity cure", q: "Q1 2024" }, { type: "Accordion draw", q: "Q2 2024" }, { type: "EBITDA add-back >50%", q: "Q3 2024" }, { type: "Portability invoked", q: "Q4 2024" }],
    scores: { CFP: 0.60, EX: 0.52, MT: 0.38, GV: 0.35, EN: 0.48 } },
  { borrower: "Resideo", ticker: "REZI", sector: "Building Products", spread: 225, bor_am: 8, bor_pi: 0.6605, fac_lgd: 55.6, total_size: 1175, seniority: "1L", lambda_base: 3.1,
    exercises: [{ type: "Equity cure", q: "Q2 2024" }, { type: "Accordion draw", q: "Q4 2024" }, { type: "PIK toggle", q: "Q1 2025" }],
    scores: { CFP: 0.55, EX: 0.48, MT: 0.50, GV: 0.45, EN: 0.58 } },
  { borrower: "SSC", ticker: "SSNC", sector: "Financial Technology", spread: 225, bor_am: 2, bor_pi: 0.8918, fac_lgd: 45.5, total_size: 4550, seniority: "1L", lambda_base: 2.0,
    exercises: [{ type: "Restricted payment", q: "Q3 2025" }],
    scores: { CFP: 0.72, EX: 0.65, MT: 0.68, GV: 0.62, EN: 0.70 } },
  { borrower: "TKO", ticker: "TKO", sector: "Entertainment/Sports", spread: 225, bor_am: 2, bor_pi: 0.9215, fac_lgd: 45.5, total_size: 2955, seniority: "1L", lambda_base: 2.1,
    exercises: [],
    scores: { CFP: 0.75, EX: 0.68, MT: 0.70, GV: 0.65, EN: 0.72 } },
  { borrower: "TransDigm", ticker: "TDG", sector: "Aerospace & Defense", spread: 250, bor_am: 18, bor_pi: 0.4773, fac_lgd: 48.2, total_size: 9403, seniority: "1L", lambda_base: 2.6,
    exercises: [{ type: "PIK toggle", q: "Q1 2023" }, { type: "PIK toggle", q: "Q3 2023" }, { type: "Equity cure", q: "Q4 2023" }, { type: "Accordion draw", q: "Q1 2024" }, { type: "EBITDA add-back >50%", q: "Q2 2024" }, { type: "Asset drop-down", q: "Q3 2024" }, { type: "Portability invoked", q: "Q4 2024" }, { type: "Debt incurrence", q: "Q1 2025" }],
    scores: { CFP: 0.55, EX: 0.48, MT: 0.32, GV: 0.30, EN: 0.45 } },
  { borrower: "Waystar", ticker: "WAY", sector: "Healthcare IT", spread: 200, bor_am: 10, bor_pi: 0.745, fac_lgd: 45.5, total_size: 2150, seniority: "1L", lambda_base: 2.5,
    exercises: [{ type: "PIK toggle", q: "Q2 2024" }, { type: "Equity cure", q: "Q4 2024" }, { type: "Restricted payment", q: "Q1 2025" }],
    scores: { CFP: 0.62, EX: 0.55, MT: 0.52, GV: 0.50, EN: 0.58 } },
  { borrower: "Wyndham", ticker: "WH", sector: "Hotels", spread: 175, bor_am: 6, bor_pi: 0.799, fac_lgd: 45.5, total_size: 2350, seniority: "1L", lambda_base: 2.0,
    exercises: [{ type: "Restricted payment", q: "Q3 2024" }, { type: "PIK toggle", q: "Q1 2025" }],
    scores: { CFP: 0.70, EX: 0.62, MT: 0.65, GV: 0.58, EN: 0.66 } },
];

// ── Seniority → LGD Base ────────────────────────────────────
export const LGD_BASE_MAP = { "1L": 0.35, "2L": 0.50, "Sr Unsec": 0.60, "Sub": 0.70 };

// ── Exercise Degradation Coefficients (Bible Appendix F) ─────
export const EXERCISE_DJ = {
  "PIK toggle": 0.04,
  "Equity cure": 0.07,
  "Accordion draw": 0.09,
  "Asset drop-down": 0.13,
  "Restricted payment": 0.05,
  "Portability invoked": 0.11,
  "EBITDA add-back >50%": 0.10,
  "Debt incurrence": 0.08,
};

export const EXERCISE_COLORS = {
  "PIK toggle": "#f59e0b",
  "Equity cure": "#8b5cf6",
  "Accordion draw": "#ef4444",
  "Asset drop-down": "#dc2626",
  "Restricted payment": "#f97316",
  "Portability invoked": "#e11d48",
  "EBITDA add-back >50%": "#d97706",
  "Debt incurrence": "#ea580c",
};

// ── Raw Zone Multipliers Mk,Z (Classification Bible v2) ──────
// These are NOT pre-normalized. Normalization happens per-borrower
// using Sk × Mk,Z / Σ(Sj × Mj,Z) — the v4.4 clean formula.
export const ZONE_MK = {
  SAFE:     { CFP: 0.70, EX: 0.50, MT: 0.25, GV: 0.20, EN: 0.05 },
  ALERT:    { CFP: 0.65, EX: 0.40, MT: 0.85, GV: 0.55, EN: 0.10 },
  DISTRESS: { CFP: 0.45, EX: 0.70, MT: 0.75, GV: 0.65, EN: 0.30 },
  LME:      { CFP: 0.30, EX: 0.75, MT: 0.35, GV: 0.90, EN: 0.45 },
  DEFAULT:  { CFP: 0.15, EX: 0.15, MT: 0.15, GV: 0.50, EN: 0.85 },
};

// ── Zone Multiplier Ψ(z) for LGD ────────────────────────────
export const PSI_MAP = { SAFE: 0.85, ALERT: 1.00, DISTRESS: 1.25, LME: 1.40, DEFAULT: 1.55 };

// ── Zone Definitions ────────────────────────────────────────
export const ZONES = ["SAFE", "ALERT", "DISTRESS", "LME", "DEFAULT"];

export const ZONE_COLORS = {
  SAFE: "#22c55e", ALERT: "#eab308", DISTRESS: "#f97316", LME: "#ef4444", DEFAULT: "#991b1b",
};

export const ZONE_EXPLANATIONS = {
  SAFE: "Full health. All tests passed, headroom >15%. CFP dominates — call protection and ECF sweeps have real value when the borrower generates cash. Options deep OTM.",
  ALERT: "Early stress. Headroom <15% or coverage deteriorating AND first material borrower exercise commenced. MT peaks — the maintenance barrier option is live. GV rising as renegotiation window opens.",
  DISTRESS: "Covenant breach uncured. Grace period elapsed, restructuring advisors engaged. EX near ITM, EN activating. All families escalate monitoring.",
  LME: "Active out-of-court restructuring. Exchange offer or consent solicitation live. GV dominates — amendment thresholds and sacred rights are the direct LME battleground.",
  DEFAULT: "EOD declared. Acceleration notice delivered or Ch.11 filed. EN is everything — collateral control, waterfall position, and acceleration rights determine recovery.",
};

// ── Family Metadata ──────────────────────────────────────────
export const FAMILY_NAMES = {
  CFP: "Cash Flow Prot.", EX: "Exit Rights", MT: "Maintenance", GV: "Governance", EN: "Enforcement",
};

export const FAMILY_COLORS = {
  CFP: "#f59e0b", EX: "#38bdf8", MT: "#a78bfa", GV: "#34d399", EN: "#f87171",
};

export const FAMILY_EXPLANATIONS = {
  CFP: "Yield insurance, ECF sweeps, PIK toggle, leakage dam. Interest rate cap/collar on borrower cash flows. Most valuable in SAFE/ALERT when borrower is generating cash. Analogous to American put option.",
  EX: "Call protection, CoC put, transfer restrictions, DQ list. Exit option. Peaks in DISTRESS/LME when lender can threaten put at par. Non-monotone profile — collapses mid-cycle, recovers in LME.",
  MT: "Debt incurrence tests, EBITDA add-back caps, anti-layering, maintenance covenants. Barrier option — fires on breach. Lives in ALERT/DISTRESS. The barrier option that separates cov-lite from cov-heavy.",
  GV: "Amendment thresholds, sacred rights, voting control, information rights. Information-sensitive swap. Peaks at LME — amendment mechanics are the restructuring battleground.",
  EN: "Acceleration, collateral control, intercreditor waterfall, cash dominion. Digital option on recovery. Dormant until DISTRESS; primary family at DEFAULT. Capped at 0.70 due to bankruptcy friction.",
};

export const DR_MAX_RANGES = {
  CFP: [25, 70], EX: [10, 40], MT: [20, 60], GV: [15, 50], EN: [15, 55],
};

// ── Default Parameters ───────────────────────────────────────
export const DEFAULT_PARAMS = {
  rf: 455,
  beta_msp: 1.50,
  pnav: 0.93,
  phi: 0.30,
  zone: "ALERT",
  dr_cfp: 47.5,
  dr_ex: 25,
  dr_mt: 40,
  dr_gv: 32.5,
  dr_en: 35,
};

// ── Computation ──────────────────────────────────────────────

/**
 * Compute per-borrower zone weights using v4.4 clean formula:
 * wk = Sk × Mk,Z / Σ(Sj × Mj,Z)
 */
export function computeZoneWeights(zone, scores) {
  const mk = ZONE_MK[zone];
  const raw = {};
  let sum = 0;
  for (const fam of ["CFP", "EX", "MT", "GV", "EN"]) {
    raw[fam] = scores[fam] * mk[fam];
    sum += raw[fam];
  }
  const w = {};
  for (const fam of ["CFP", "EX", "MT", "GV", "EN"]) {
    w[fam] = sum > 0 ? raw[fam] / sum : 0.2;
  }
  return w;
}

/**
 * Full TDR computation for a single borrower.
 *
 * TDR*(t) = rf(t) + λ(t)·LGD(t) + MSP(t) + Π(t)·OAS(t)
 *
 * Key v4.7 changes from v4.6:
 * - Per-borrower λ (not flat 3.1%)
 * - Per-borrower CtrlScore from individual Sk scores
 * - LGD_base from seniority (1L/2L/etc)
 * - Ψ(LME) = 1.40 (was missing, mapped to DISTRESS)
 * - MSP = β_MSP × (1 − P/NAV), not a flat slider
 * - offered = rf + credit spread (both move with rf)
 * - Zone weights are Sk × Mk,Z per-borrower
 */
export function computeTDR(params, borrower) {
  // 1. Zone-weighted OAS
  const w = computeZoneWeights(params.zone, borrower.scores);
  const oas_raw = params.dr_cfp * w.CFP + params.dr_ex * w.EX + params.dr_mt * w.MT + params.dr_gv * w.GV + params.dr_en * w.EN;
  const oas_pi = borrower.bor_pi * oas_raw;

  // 2. LGD — seniority + zone + covenant recovery
  const psi = PSI_MAP[params.zone];
  const lgd_base = LGD_BASE_MAP[borrower.seniority] || 0.35;
  const ctrlScore = 0.35 * borrower.scores.MT + 0.35 * borrower.scores.GV + 0.30 * borrower.scores.EN;
  const lgd_raw = lgd_base * psi * (1 - params.phi * ctrlScore);
  const lgd = Math.min(1, Math.max(0, lgd_raw));

  // 3. Default risk — per-borrower λ
  const lambda = borrower.lambda_base / 100;
  const lambda_lgd_bps = lambda * lgd * 10000;

  // 4. MSP — market sentiment premium
  const msp = params.beta_msp * (1 - params.pnav) * 100;

  // 5. Offered = rf + credit spread (both sides move with rf)
  const offered = borrower.spread + params.rf;

  // 6. Assemble TDR
  const tdr = params.rf + lambda_lgd_bps + msp + oas_pi;
  const ug = tdr - offered;

  // 7. Family contribution breakdown
  const familyContrib = {};
  for (const fam of ["CFP", "EX", "MT", "GV", "EN"]) {
    familyContrib[fam] = params[`dr_${fam.toLowerCase()}`] * w[fam];
  }

  return { tdr, ug, oas_raw, oas_pi, lambda_lgd_bps, lgd, lgd_base, ctrlScore, lambda, msp, offered, w, familyContrib, psi };
}

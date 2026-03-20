export const BORROWERS = [
  { borrower: "AmericanAir", ticker: "AAL", sector: "Airlines", spread: 225, offered: 680, bor_am: 10, bor_pi: 0.7374, fac_lgd: 75.9, status: "MODERATE", total_size: 5850 },
  { borrower: "Aramark", ticker: "ARMK", sector: "Business Services", spread: 175, offered: 630, bor_am: 20, bor_pi: 0.5259, fac_lgd: 45.5, status: "HEAVY", total_size: 5509 },
  { borrower: "Axalta", ticker: "AXTA", sector: "Specialty Chemicals", spread: 200, offered: 655, bor_am: 2, bor_pi: 0.9409, fac_lgd: 45.5, status: "LIGHT", total_size: 2400 },
  { borrower: "Caesars", ticker: "CZR", sector: "Gaming", spread: 225, offered: 680, bor_am: 7, bor_pi: 0.7259, fac_lgd: 63.2, status: "MODERATE", total_size: 6300 },
  { borrower: "ChartInd", ticker: "GTLS", sector: "Industrial Equipment", spread: 250, offered: 705, bor_am: 8, bor_pi: 0.6755, fac_lgd: 50.6, status: "MODERATE", total_size: 3250 },
  { borrower: "Charter", ticker: "CHTR", sector: "Cable/Telecom", spread: 175, offered: 630, bor_am: 6, bor_pi: 0.7976, fac_lgd: 48.4, status: "LIGHT", total_size: 9500 },
  { borrower: "Corpay", ticker: "CPAY", sector: "FinTech / Payments", spread: 175, offered: 630, bor_am: 17, bor_pi: 0.5417, fac_lgd: 45.5, status: "HEAVY", total_size: 5545 },
  { borrower: "EverCommerce", ticker: "EVCM", sector: "Software/SaaS", spread: 250, offered: 705, bor_am: 6, bor_pi: 0.7417, fac_lgd: 104.1, status: "MODERATE", total_size: 634 },
  { borrower: "FirstAdvantage", ticker: "FA", sector: "HR Technology", spread: 250, offered: 705, bor_am: 4, bor_pi: 0.8305, fac_lgd: 50.6, status: "LIGHT", total_size: 1000 },
  { borrower: "HGV", ticker: "HGV", sector: "Hotels/Timeshare", spread: 225, offered: 680, bor_am: 8, bor_pi: 0.7353, fac_lgd: 50.6, status: "MODERATE", total_size: 2200 },
  { borrower: "Hilton", ticker: "HLT", sector: "Hotels", spread: 175, offered: 630, bor_am: 11, bor_pi: 0.7444, fac_lgd: 47.3, status: "MODERATE", total_size: 5700 },
  { borrower: "LifeTime", ticker: "LTH", sector: "Fitness/Leisure", spread: 250, offered: 705, bor_am: 2, bor_pi: 0.9409, fac_lgd: 45.5, status: "LIGHT", total_size: 1400 },
  { borrower: "LightWonder", ticker: "LNW", sector: "Gaming Technology", spread: 250, offered: 705, bor_am: 4, bor_pi: 0.9036, fac_lgd: 55.6, status: "LIGHT", total_size: 2650 },
  { borrower: "NRG", ticker: "NRG", sector: "Energy/Utilities", spread: 200, offered: 655, bor_am: 10, bor_pi: 0.7521, fac_lgd: 45.5, status: "LIGHT", total_size: 4600 },
  { borrower: "Petco", ticker: "WOOF", sector: "Retail/Pet", spread: 300, offered: 755, bor_am: 3, bor_pi: 0.9127, fac_lgd: 139.0, status: "LIGHT", total_size: 1400 },
  { borrower: "QSR", ticker: "QSR", sector: "QSR/Restaurants", spread: 175, offered: 630, bor_am: 14, bor_pi: 0.5385, fac_lgd: 45.5, status: "HEAVY", total_size: 5700 },
  { borrower: "Resideo", ticker: "REZI", sector: "Building Products", spread: 225, offered: 680, bor_am: 8, bor_pi: 0.6605, fac_lgd: 55.6, status: "MODERATE", total_size: 1175 },
  { borrower: "SSC", ticker: "SSNC", sector: "Financial Technology", spread: 225, offered: 680, bor_am: 2, bor_pi: 0.8918, fac_lgd: 45.5, status: "LIGHT", total_size: 4550 },
  { borrower: "TKO", ticker: "TKO", sector: "Entertainment/Sports", spread: 225, offered: 680, bor_am: 2, bor_pi: 0.9215, fac_lgd: 45.5, status: "LIGHT", total_size: 2955 },
  { borrower: "TransDigm", ticker: "TDG", sector: "Aerospace & Defense", spread: 250, offered: 705, bor_am: 18, bor_pi: 0.4773, fac_lgd: 48.2, status: "HEAVY", total_size: 9403 },
  { borrower: "Waystar", ticker: "WAY", sector: "Healthcare IT", spread: 200, offered: 655, bor_am: 10, bor_pi: 0.745, fac_lgd: 45.5, status: "MODERATE", total_size: 2150 },
  { borrower: "Wyndham", ticker: "WH", sector: "Hotels", spread: 175, offered: 630, bor_am: 6, bor_pi: 0.799, fac_lgd: 45.5, status: "LIGHT", total_size: 2350 },
];

export const DEFAULT_PARAMS = {
  rf: 455, ls: 85, phi: 0.30, lgd_base: 0.35,
  psi_safe: 0.85, psi_alert: 1.00, psi_distress: 1.25, psi_default: 1.55,
  zone: "ALERT",
  dr_cfp: 47.5, dr_ex: 25, dr_mt: 40, dr_gv: 32.5, dr_en: 35,
};

export const ZONE_WEIGHTS = {
  SAFE:     { CFP: 0.412, EX: 0.294, MT: 0.147, GV: 0.118, EN: 0.029 },
  ALERT:    { CFP: 0.255, EX: 0.157, MT: 0.333, GV: 0.216, EN: 0.039 },
  DISTRESS: { CFP: 0.158, EX: 0.246, MT: 0.263, GV: 0.228, EN: 0.105 },
  LME:      { CFP: 0.109, EX: 0.273, MT: 0.127, GV: 0.327, EN: 0.164 },
  DEFAULT:  { CFP: 0.083, EX: 0.083, MT: 0.083, GV: 0.278, EN: 0.472 },
};

export const ZONES = ["SAFE", "ALERT", "DISTRESS", "LME", "DEFAULT"];

export const ZONE_EXPLANATIONS = {
  SAFE: "Full health. Covenants dormant, options deep out-of-the-money. All tests passed with headroom >15%. CFP and EX dominate because call protection and ECF sweeps have real value when the borrower is generating cash.",
  ALERT: "Early stress. Headroom <15%, PIK toggle elected, or equity cure contemplated. MT peaks here because the maintenance barrier option is live and near trigger. GV rising as renegotiation window opens.",
  DISTRESS: "Covenant breach uncured. Grace period elapsed. Restructuring advisors engaged. EX options near in-the-money (lender can threaten put). EN activating as enforcement becomes credible.",
  LME: "Liability Management Exercise in progress. Active out-of-court restructuring. GV dominates (32.7%) because amendment thresholds and sacred rights are the direct LME battleground. EX peaks for exit rights.",
  DEFAULT: "Event of default declared. Acceleration notice delivered or Ch.11 filed. EN is everything (47.2%) — collateral control, waterfall, and acceleration rights determine recovery.",
};

export const FAMILY_NAMES = {
  CFP: "Cash Flow Protection",
  EX: "Exit Rights",
  MT: "Maintenance Testing",
  GV: "Governance",
  EN: "Enforcement",
};

export const FAMILY_COLORS = {
  CFP: "#f59e0b",
  EX: "#38bdf8",
  MT: "#a78bfa",
  GV: "#34d399",
  EN: "#f87171",
};

export const FAMILY_EXPLANATIONS = {
  CFP: "Yield protection, ECF sweeps, PIK toggle, leakage restrictions. Cap/collar on borrower cash flows. Most valuable when borrower is generating cash (SAFE/ALERT).",
  EX: "Call protection, CoC put, transfer restrictions, DQ list. American put option on exit. Peaks in DISTRESS/LME when lender can threaten to put the loan at par.",
  MT: "Debt incurrence tests, EBITDA add-back caps, anti-layering, maintenance covenants. Barrier option that fires on breach. Lives in ALERT/DISTRESS.",
  GV: "Amendment thresholds, sacred rights, voting control, information rights. Information-sensitive swap. Peaks at LME — the amendment mechanics are the restructuring battleground.",
  EN: "Acceleration, collateral control, intercreditor waterfall, cash dominion. Digital option on recovery. Dormant until DISTRESS; primary family at DEFAULT.",
};

export const SLIDER_TIPS = {
  rf: "The time value of money — what you'd earn with zero credit risk. Sourced from the 5-year SOFR swap curve (not Treasuries, because SOFR is the actual hedging rate for credit instruments). Moving this up simulates a rate hike: all loans become worth less because future cash flows are discounted more heavily.",
  ls: "The institutional friction premium (Shleifer-Vishny 1997). BDC managers, CLO mandates, and insurance portfolios face constraints (NAV triggers, mandate limits, rating requirements) that create a wedge between what an unconstrained lender would demand and what the market actually offers. Calibrated from BDC P/NAV: when BDCs trade at a discount, it signals lenders accepted tighter terms than warranted. This is a market-wide term — it doesn't vary by deal.",
  lgd_base: "Loss Given Default — how many cents on the dollar you lose when a borrower defaults. 0.35 means 35% loss (65% recovery), which is the Moody's long-run average for senior secured first lien loans. Second lien is ~0.50, unsecured ~0.60, subordinated ~0.70. This is the baseline before zone and covenant adjustments are applied.",
  phi: "How much stronger covenants reduce your loss in default. From Hart-Moore (1988): tighter covenants expand the creditor's threat point in renegotiation, meaning the borrower can't extract as many concessions, so the lender recovers more. At φ=0.30 with a CtrlScore of 0.63, you get ~19% LGD reduction. At φ=0, covenants don't help recovery at all. This is the key empirical parameter to calibrate.",
  zone: "The zone is the borrower's credit state — it determines which covenant families are 'live' (in-the-money) and which are dormant. All covenants always exist, but the zone determines which ones the lender should be actively monitoring. Changing the zone shifts the weight matrix for ALL borrowers simultaneously.",
  zone_weights: "These are the normalized Mk,Z weights from the Classification Bible. They determine what percentage of total OAS each covenant family contributes in this zone. The weights reflect option moneyness: families whose options are near in-the-money get higher weight. Click a family below to see what it covers.",
  dr_max: "Maximum enforcement gain — the spread contribution (in bps) if every covenant in this family were at institutional best practice (Entelechy=1.0) and fully activated. This is the ceiling. The actual OAS contribution is: Δr_max × zone_weight × Entelechy × Π. These ranges are working assumptions pending calibration.",
  dr_cfp: "Cash Flow Protection ceiling (Bible range: 25–70 bps). Driven by call protection quality, make-whole depth, ECF sweep percentage, and distribution lock-up. A deal with 3yr NC + 103/102/101 step-down + 75% ECF sweep + tight restricted payments = near the top.",
  dr_ex: "Exit Rights ceiling (Bible range: 10–40 bps). Driven by transfer restriction quality, DQ list scope, eligible assignee breadth, and yank-a-bank provisions. Controls who can hold the paper and whether the lender can exit in secondary.",
  dr_mt: "Maintenance Testing ceiling (Bible range: 20–60 bps). Driven by debt incurrence tests, EBITDA add-back caps, anti-layering clauses, and the maintenance covenant itself. This is the barrier option — it fires when the borrower breaches a ratio test.",
  dr_gv: "Governance ceiling (Bible range: 15–50 bps). Driven by amendment thresholds (50.1% vs 66.7% required lenders), sacred rights scope (what requires unanimity), board observer rights, and information reporting cadence.",
  dr_en: "Enforcement ceiling (Bible range: 15–55 bps). Driven by acceleration rights, collateral control (UCC perfection!), intercreditor waterfall position, and cash dominion triggers. Even the best EN deal has a DEFAULT multiplier capped at 0.70 because bankruptcy court introduces friction.",
};

export function computeTDR(params, borrower) {
  const w = ZONE_WEIGHTS[params.zone];
  const oas_raw = params.dr_cfp * w.CFP + params.dr_ex * w.EX + params.dr_mt * w.MT + params.dr_gv * w.GV + params.dr_en * w.EN;
  const oas_pi = borrower.bor_pi * oas_raw;
  const psiMap = { SAFE: params.psi_safe, ALERT: params.psi_alert, DISTRESS: params.psi_distress, LME: params.psi_distress, DEFAULT: params.psi_default };
  const psi = psiMap[params.zone];
  const lgd = params.lgd_base * psi * (1 - params.phi * 0.63);
  const lambda_lgd = 0.031 * lgd * 10000;
  const tdr = params.rf + lambda_lgd + params.ls + oas_pi;
  const ug = tdr - borrower.offered;
  return { tdr, ug, oas_raw, oas_pi, lambda_lgd, lgd };
}

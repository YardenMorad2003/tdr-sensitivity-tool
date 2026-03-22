import { useState, useMemo, useCallback } from "react";
import {
  BORROWERS, DEFAULT_PARAMS, ZONES, ZONE_COLORS, ZONE_EXPLANATIONS,
  FAMILY_NAMES, FAMILY_COLORS, FAMILY_EXPLANATIONS, DR_MAX_RANGES,
  PSI_MAP, LGD_BASE_MAP, EXERCISE_DJ, EXERCISE_COLORS,
  computeTDR, computeZoneWeights,
} from "./data.js";


// ═══════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Tip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", marginLeft: 6, cursor: "help" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(99,179,237,0.12)", border: "1px solid rgba(99,179,237,0.25)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#63b3ed" }}>?</span>
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", width: 300, padding: "12px 14px", background: "#1a2332", border: "1px solid #2d3f54", borderRadius: 8, fontSize: 11, lineHeight: 1.6, color: "#b0bec5", zIndex: 200, boxShadow: "0 16px 48px rgba(0,0,0,0.7)", pointerEvents: "none" }}>
          {text}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "#1a2332", borderRight: "1px solid #2d3f54", borderBottom: "1px solid #2d3f54" }} />
        </div>
      )}
    </span>
  );
}

function StatusBadge({ status }) {
  const m = { LIGHT: { bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.25)", color: "#22c55e" }, MODERATE: { bg: "rgba(234,179,8,0.10)", border: "rgba(234,179,8,0.25)", color: "#eab308" }, HEAVY: { bg: "rgba(239,68,68,0.10)", border: "rgba(239,68,68,0.25)", color: "#ef4444" } }[status];
  return <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.06em", padding: "2px 7px", borderRadius: 3, background: m?.bg, border: `1px solid ${m?.border}`, color: m?.color }}>{status}</span>;
}

function Slider({ label, value, onChange, min, max, step, unit, tip, color, tag }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#8899aa", display: "flex", alignItems: "center" }}>
          {color && <span style={{ width: 6, height: 6, borderRadius: 2, background: color, marginRight: 6, flexShrink: 0 }} />}
          {label}{tip && <Tip text={tip} />}
          {tag && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.06em", marginLeft: 6, padding: "1px 5px", borderRadius: 3, background: tag === "OBSERVED" ? "rgba(34,197,94,0.1)" : tag === "WORKING" ? "rgba(234,179,8,0.1)" : "rgba(99,179,237,0.1)", color: tag === "OBSERVED" ? "#22c55e" : tag === "WORKING" ? "#eab308" : "#63b3ed", border: `1px solid ${tag === "OBSERVED" ? "rgba(34,197,94,0.2)" : tag === "WORKING" ? "rgba(234,179,8,0.2)" : "rgba(99,179,237,0.2)"}` }}>{tag}</span>}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e8edf2", fontFamily: "'JetBrains Mono', 'SF Mono', monospace" }}>
          {step < 1 ? value.toFixed(2) : value}{unit || ""}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: color || "#63b3ed", height: 3, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#4a5568", marginTop: 1 }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function SectionHeader({ children, num }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", color: "#63b3ed", marginBottom: 8, marginTop: 18, paddingBottom: 4, borderBottom: "1px solid rgba(99,179,237,0.12)", display: "flex", alignItems: "center", gap: 6 }}>
      {num && <span style={{ width: 16, height: 16, borderRadius: 3, background: "rgba(99,179,237,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800 }}>{num}</span>}
      {children}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function TDRv47() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [sortKey, setSortKey] = useState("ug");
  const [sortAsc, setSortAsc] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [expandedFamily, setExpandedFamily] = useState(null);

  const setP = useCallback((k, v) => setParams(p => ({ ...p, [k]: v })), []);

  const results = useMemo(() => BORROWERS.map(b => {
    const r = computeTDR(params, b);
    return { ...b, ...r, computedStatus: b.bor_pi >= 0.75 ? "LIGHT" : b.bor_pi >= 0.60 ? "MODERATE" : "HEAVY" };
  }), [params]);

  const filtered = useMemo(() => {
    let arr = filterStatus === "ALL" ? [...results] : results.filter(r => r.computedStatus === filterStatus);
    arr.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number") return sortAsc ? av - bv : bv - av;
      return sortAsc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [results, sortKey, sortAsc, filterStatus]);

  const avg = useMemo(() => {
    const n = results.length;
    return {
      tdr: results.reduce((s, r) => s + r.tdr, 0) / n,
      ug: results.reduce((s, r) => s + r.ug, 0) / n,
      pi: results.reduce((s, r) => s + r.bor_pi, 0) / n,
      heavy: results.filter(r => r.computedStatus === "HEAVY").length,
      mod: results.filter(r => r.computedStatus === "MODERATE").length,
      light: results.filter(r => r.computedStatus === "LIGHT").length,
    };
  }, [results]);

  const detail = selectedBorrower ? results.find(r => r.ticker === selectedBorrower) : null;
  const msp_bps = (params.beta_msp * (1 - params.pnav) * 100);

  const mono = "'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace";
  const sans = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif";

  return (
    <div style={{ fontFamily: sans, background: "#080c14", color: "#e0e6ed", minHeight: "100vh", "--accent": "#63b3ed", "--red": "#ef4444", "--green": "#22c55e", "--yellow": "#eab308" }}>

      {/* ═══════ HEADER ═══════ */}
      <div style={{ background: "linear-gradient(135deg, #0c1220 0%, #141e30 50%, #0c1220 100%)", borderBottom: "1px solid #1c2a3a", padding: "18px 24px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#63b3ed", marginBottom: 3, opacity: 0.8 }}>COVENANTLAB ANALYTICS</div>
            <div style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.01em", color: "#f0f4f8" }}>TDR Sensitivity Engine</div>
            <div style={{ fontSize: 11, color: "#5a6b7d", marginTop: 3 }}>22 SRLN Borrowers · CDR v1 × TDR v4.7 · MSP Market Sentiment Premium · Per-borrower λ + Entelechy</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 9, color: "#5a6b7d", letterSpacing: "0.06em" }}>PORTFOLIO AVG UG</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: mono, color: avg.ug > 0 ? "#ef4444" : "#22c55e" }}>
              {avg.ug > 0 ? "+" : ""}{avg.ug.toFixed(0)} bps
            </div>
            <div style={{ fontSize: 9, color: "#5a6b7d", marginTop: 2 }}>
              {avg.ug > 0 ? "UNDERPAID — model requires wider spread" : "OVERCOMPENSATED — spread exceeds model requirement"}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          {[
            { l: "AVG TDR", v: `${avg.tdr.toFixed(0)} bps`, c: "#e0e6ed" },
            { l: "AVG Π", v: avg.pi.toFixed(3), c: avg.pi < 0.70 ? "#ef4444" : "#eab308" },
            { l: "MSP", v: `${msp_bps.toFixed(0)} bps`, c: "#a78bfa" },
            { l: "UNDERPAID", v: avg.heavy, c: "#ef4444" },
            { l: "WATCH", v: avg.mod, c: "#eab308" },
            { l: "ADEQUATE", v: avg.light, c: "#22c55e" },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: 8, color: "#5a6b7d", letterSpacing: "0.12em", fontWeight: 700 }}>{s.l}</div>
              <div style={{ fontSize: 15, fontWeight: 700, fontFamily: mono, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 130px)" }}>

        {/* ═══════ LEFT PANEL ═══════ */}
        <div style={{ width: 330, minWidth: 330, background: "#0d1219", borderRight: "1px solid #1c2a3a", padding: "10px 16px", overflowY: "auto", maxHeight: "calc(100vh - 130px)" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: "#63b3ed" }}>MODEL ASSUMPTIONS</span>
            <button onClick={() => setParams(DEFAULT_PARAMS)} style={{ fontSize: 9, background: "rgba(99,179,237,0.08)", border: "1px solid rgba(99,179,237,0.15)", color: "#63b3ed", padding: "2px 8px", borderRadius: 3, cursor: "pointer", fontWeight: 700 }}>RESET</button>
          </div>

          <div style={{ fontSize: 9, color: "#5a6b7d", lineHeight: 1.5, marginBottom: 12, padding: "5px 8px", background: "rgba(99,179,237,0.03)", borderRadius: 4, border: "1px solid rgba(99,179,237,0.06)" }}>
            Parameters tagged <span style={{ color: "#22c55e", fontWeight: 700 }}>OBSERVED</span> are market inputs. <span style={{ color: "#eab308", fontWeight: 700 }}>WORKING</span> are calibration-pending assumptions. Both TDR and Offered Spread move with r<sub>f</sub>.
          </div>

          {/* I. Risk-Free */}
          <SectionHeader num="I">RISK-FREE RATE</SectionHeader>
          <Slider label="rf (SOFR swap)" value={params.rf} onChange={v => setP("rf", v)} min={300} max={600} step={5} unit=" bps" color="#64748b" tag="OBSERVED"
            tip="5-year SOFR swap rate. This is the time value of money — what you'd earn at zero credit risk. Changing rf moves BOTH TDR and Offered Spread, because offered = SOFR + credit spread." />

          {/* II. Default Risk */}
          <SectionHeader num="II">DEFAULT RISK (λ · LGD)</SectionHeader>
          <div style={{ padding: "6px 8px", background: "rgba(245,158,11,0.04)", borderRadius: 4, border: "1px solid rgba(245,158,11,0.08)", marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: "#b08d3e", lineHeight: 1.5 }}>
              λ varies per borrower (1.8–4.5%). LGD uses each borrower's seniority ({BORROWERS.filter(b => b.seniority === "2L").length > 0 ? "mix of 1L and 2L" : "all 1L"}) with zone multiplier Ψ and covenant recovery adjustment via CtrlScore.
            </div>
          </div>
          <Slider label="φ (Covenant → Recovery)" value={params.phi} onChange={v => setP("phi", v)} min={0} max={0.60} step={0.01} unit="" color="#f59e0b" tag="WORKING"
            tip="How much covenant quality reduces loss-given-default. Hart-Moore (1988): tighter covenants expand the creditor's threat point in renegotiation. At φ=0.30, a CtrlScore of 0.60 gives ~18% LGD reduction. At φ=0, covenants don't help recovery at all. KEY EMPIRICAL PARAMETER — calibration target: Covenant Review LME database, regress recovery haircut on CtrlScore." />
          <div style={{ padding: "6px 8px", background: "rgba(99,179,237,0.03)", borderRadius: 4, marginBottom: 8, fontSize: 9, color: "#6b7d8f", lineHeight: 1.5 }}>
            <strong style={{ color: "#8899aa" }}>CtrlScore</strong> = 0.35 × S<sub>MT</sub> + 0.35 × S<sub>GV</sub> + 0.30 × S<sub>EN</sub><br/>
            <strong style={{ color: "#8899aa" }}>LGD</strong> = min(1, LGD<sub>base</sub> × Ψ(zone) × (1 − φ × CtrlScore))<br/>
            <strong style={{ color: "#8899aa" }}>Ψ({params.zone})</strong> = {PSI_MAP[params.zone]} · <strong style={{ color: "#8899aa" }}>LGD<sub>base</sub></strong>: 1L = 0.35, 2L = 0.50
          </div>

          {/* III. MSP */}
          <SectionHeader num="III">MARKET SENTIMENT PREMIUM</SectionHeader>
          <Slider label="P/NAV (BDC Index)" value={params.pnav} onChange={v => setP("pnav", v)} min={0.70} max={1.10} step={0.01} unit="" color="#a78bfa" tag="OBSERVED"
            tip="Cliffwater BDC Index price-to-NAV. When BDCs trade below book, the market is saying reported NAVs overstate true value. This is the real-time expression of Altman's credit cycle sentiment in private credit." />
          <Slider label="β_MSP" value={params.beta_msp} onChange={v => setP("beta_msp", v)} min={0.50} max={3.00} step={0.05} unit="" color="#a78bfa" tag="WORKING"
            tip="Sensitivity of MSP to the BDC discount. Working range [0.80, 2.50]. At β=1.50 and P/NAV=0.93, MSP = 1.50 × 7% = 10.5 bps. When P/NAV = 1.00, MSP = 0 (boundary condition — the market trusts book values)." />
          <div style={{ padding: "6px 8px", background: "rgba(167,139,250,0.04)", borderRadius: 4, marginBottom: 8, fontSize: 10, color: "#8b7ec8", lineHeight: 1.6 }}>
            MSP = β<sub>MSP</sub> × (1 − P/NAV) = {params.beta_msp.toFixed(2)} × {(1 - params.pnav).toFixed(2)} = <strong style={{ color: "#a78bfa" }}>{msp_bps.toFixed(1)} bps</strong>
            <br/><span style={{ fontSize: 9, color: "#6b5f9e" }}>Stage 1 (current). Stage 2 conditions on LGD per-deal.</span>
          </div>

          {/* IV. Zone & OAS */}
          <SectionHeader num="IV">ZONE & COVENANT OAS</SectionHeader>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#8899aa", marginBottom: 5, display: "flex", alignItems: "center" }}>
              Borrower Zone<Tip text="The zone is the borrower's credit state — it drives which covenant families are 'live' and which are dormant. All covenants always exist; the zone determines which are in-the-money. Zone changes shift weights for ALL borrowers." />
            </div>
            <div style={{ display: "flex", gap: 3 }}>
              {ZONES.map(z => (
                <button key={z} onClick={() => setP("zone", z)} style={{
                  flex: 1, fontSize: 9, fontWeight: 800, letterSpacing: "0.03em", padding: "5px 2px", borderRadius: 3, cursor: "pointer", transition: "all 0.15s",
                  border: params.zone === z ? `1.5px solid ${ZONE_COLORS[z]}` : "1px solid #1c2a3a",
                  background: params.zone === z ? `${ZONE_COLORS[z]}18` : "#111822",
                  color: params.zone === z ? ZONE_COLORS[z] : "#4a5568",
                }}>{z}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: "7px 9px", background: "#111822", borderRadius: 5, border: "1px solid #1c2a3a", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: ZONE_COLORS[params.zone], marginBottom: 3 }}>{params.zone}</div>
            <div style={{ fontSize: 9, color: "#6b7d8f", lineHeight: 1.5 }}>{ZONE_EXPLANATIONS[params.zone]}</div>
          </div>

          {/* Zone weights display */}
          <div style={{ padding: "8px 9px", background: "#111822", borderRadius: 5, border: "1px solid #1c2a3a", marginBottom: 12 }}>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#4a5568", marginBottom: 6 }}>
              M<sub>k,Z</sub> WEIGHT ALLOCATION (score-weighted)
              <Tip text="Weights are computed per-borrower from Sk × Mk,Z / Σ. The bars below show averages. Individual borrowers with different Entelechy scores get different weight distributions — this is the v4.4 clean formula." />
            </div>
            {["CFP", "EX", "MT", "GV", "EN"].map(fam => {
              const avgW = results.reduce((s, r) => s + r.w[fam], 0) / results.length;
              return (
                <div key={fam} style={{ marginBottom: 4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "1px 0" }}
                    onClick={() => setExpandedFamily(expandedFamily === fam ? null : fam)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 2, background: FAMILY_COLORS[fam], flexShrink: 0 }} />
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#8899aa", width: 26 }}>{fam}</span>
                      <span style={{ fontSize: 8, color: "#4a5568" }}>{FAMILY_NAMES[fam]}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 60, height: 4, background: "#1c2a3a", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${avgW * 100}%`, background: FAMILY_COLORS[fam], borderRadius: 2, transition: "width 0.3s" }} />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: mono, color: "#e0e6ed", width: 36, textAlign: "right", fontWeight: 600 }}>{(avgW * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  {expandedFamily === fam && (
                    <div style={{ fontSize: 9, color: "#5a6b7d", lineHeight: 1.5, margin: "3px 0 3px 12px", paddingLeft: 7, borderLeft: `2px solid ${FAMILY_COLORS[fam]}30` }}>
                      {FAMILY_EXPLANATIONS[fam]}
                      <div style={{ marginTop: 3, color: "#4a5568" }}>Bible range: {DR_MAX_RANGES[fam][0]}–{DR_MAX_RANGES[fam][1]} bps</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Δr_max sliders */}
          <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#4a5568", marginBottom: 6, display: "flex", alignItems: "center" }}>
            Δr<sup>max</sup> BY FAMILY
            <Tip text="Maximum enforcement gain per family — the spread ceiling if every covenant were at institutional best practice (Eki=1.0) and fully activated. APT factor risk price. Actual contribution = Δr_max × weight. Ranges from Classification Bible v2." />
          </div>
          {["CFP", "EX", "MT", "GV", "EN"].map(fam => (
            <Slider key={fam} label={fam} value={params[`dr_${fam.toLowerCase()}`]}
              onChange={v => setP(`dr_${fam.toLowerCase()}`, v)}
              min={DR_MAX_RANGES[fam][0] * 0.5} max={DR_MAX_RANGES[fam][1] * 1.5} step={0.5} unit=" bps"
              color={FAMILY_COLORS[fam]} tag="WORKING" />
          ))}

          {/* Formula */}
          <div style={{ marginTop: 14, padding: "9px 11px", background: "rgba(99,179,237,0.03)", borderRadius: 5, border: "1px solid rgba(99,179,237,0.08)" }}>
            <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: "#63b3ed", marginBottom: 5 }}>TDR v4.7 MASTER FORMULA</div>
            <div style={{ fontSize: 11, fontFamily: mono, color: "#e0e6ed", lineHeight: 2 }}>
              TDR* = r<sub>f</sub> + λ·LGD + MSP + Π·OAS
            </div>
            <div style={{ fontSize: 10, fontFamily: mono, color: "#8899aa", lineHeight: 1.8 }}>
              Offered = r<sub>f</sub> + Credit Spread
            </div>
            <div style={{ fontSize: 10, fontFamily: mono, color: "#8899aa", lineHeight: 1.8 }}>
              UG = TDR* − Offered
            </div>
            <div style={{ fontSize: 9, color: "#4a5568", marginTop: 6, lineHeight: 1.6, borderTop: "1px solid rgba(99,179,237,0.06)", paddingTop: 5 }}>
              <strong style={{ color: "#ef4444" }}>UG &gt; 0 → UNDERPAID</strong> — you need more spread<br />
              <strong style={{ color: "#22c55e" }}>UG &lt; 0 → ADEQUATE</strong> — spread covers risk
            </div>
          </div>
        </div>

        {/* ═══════ MAIN TABLE ═══════ */}
        <div style={{ flex: 1, padding: "14px 18px", overflowX: "auto", overflowY: "auto", maxHeight: "calc(100vh - 130px)" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["ALL", "HEAVY", "MODERATE", "LIGHT"].map(f => {
                const ct = f === "HEAVY" ? avg.heavy : f === "MODERATE" ? avg.mod : f === "LIGHT" ? avg.light : results.length;
                const lab = f === "HEAVY" ? "UNDERPAID" : f === "MODERATE" ? "WATCH" : f === "LIGHT" ? "ADEQUATE" : "ALL";
                return (
                  <button key={f} onClick={() => setFilterStatus(f)} style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", padding: "3px 10px", borderRadius: 3, cursor: "pointer",
                    border: filterStatus === f ? "1px solid #63b3ed" : "1px solid #1c2a3a",
                    background: filterStatus === f ? "rgba(99,179,237,0.08)" : "transparent",
                    color: filterStatus === f ? "#63b3ed" : "#4a5568",
                  }}>{lab} ({ct})</button>
                );
              })}
            </div>
            <span style={{ fontSize: 9, color: "#4a5568" }}>{filtered.length} borrowers · Click row for detail</span>
          </div>

          <div style={{ borderRadius: 6, border: "1px solid #1c2a3a", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#0d1219" }}>
                  {[
                    { key: "ticker", label: "Ticker", w: 52 }, { key: "borrower", label: "Borrower", w: 100 }, { key: "sector", label: "Sector", w: 110 },
                    { key: "seniority", label: "Lien", w: 32 }, { key: "lambda_base", label: "λ %", w: 38 },
                    { key: "bor_am", label: "#Am", w: 32 }, { key: "bor_pi", label: "Π", w: 48 },
                    { key: "tdr", label: "TDR*", w: 50 }, { key: "offered", label: "Offered", w: 50 },
                    { key: "ug", label: "UG", w: 55 }, { key: "ug_bar", label: "", w: 80 }, { key: "computedStatus", label: "", w: 70 },
                  ].map(col => (
                    <th key={col.key} onClick={() => col.key !== "ug_bar" && (sortKey === col.key ? setSortAsc(!sortAsc) : (setSortKey(col.key), setSortAsc(col.key === "borrower" || col.key === "ticker")))}
                      style={{ padding: "6px 5px", textAlign: "left", fontSize: 8, fontWeight: 800, letterSpacing: "0.08em", color: "#4a5568", cursor: col.key !== "ug_bar" ? "pointer" : "default", width: col.w, borderBottom: "1px solid #1c2a3a", userSelect: "none" }}>
                      {col.label} {sortKey === col.key && (sortAsc ? "↑" : "↓")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.ticker} onClick={() => setSelectedBorrower(selectedBorrower === r.ticker ? null : r.ticker)}
                    style={{ background: selectedBorrower === r.ticker ? "rgba(99,179,237,0.06)" : i % 2 === 0 ? "transparent" : "rgba(28,42,58,0.3)", cursor: "pointer", transition: "background 0.12s" }}
                    onMouseEnter={e => { if (selectedBorrower !== r.ticker) e.currentTarget.style.background = "rgba(99,179,237,0.03)"; }}
                    onMouseLeave={e => { if (selectedBorrower !== r.ticker) e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "rgba(28,42,58,0.3)"; }}>
                    <td style={{ padding: "6px 5px", fontWeight: 700, fontFamily: mono, fontSize: 10, color: "#63b3ed" }}>{r.ticker}</td>
                    <td style={{ padding: "6px 5px", fontWeight: 500, fontSize: 11 }}>{r.borrower}</td>
                    <td style={{ padding: "6px 5px", fontSize: 10, color: "#6b7d8f" }}>{r.sector}</td>
                    <td style={{ padding: "6px 5px", fontSize: 9, fontWeight: 700, fontFamily: mono, color: r.seniority === "2L" ? "#eab308" : "#6b7d8f" }}>{r.seniority}</td>
                    <td style={{ padding: "6px 5px", fontSize: 10, fontFamily: mono, color: r.lambda_base > 3.5 ? "#ef4444" : r.lambda_base > 2.5 ? "#eab308" : "#6b7d8f" }}>{r.lambda_base.toFixed(1)}</td>
                    <td style={{ padding: "6px 5px", fontFamily: mono, textAlign: "center", fontSize: 10, color: r.bor_am > 12 ? "#ef4444" : "#8899aa" }}>{r.bor_am}</td>
                    <td style={{ padding: "6px 5px", fontFamily: mono, fontSize: 10, color: r.bor_pi < 0.60 ? "#ef4444" : r.bor_pi < 0.75 ? "#eab308" : "#22c55e" }}>{r.bor_pi.toFixed(3)}</td>
                    <td style={{ padding: "6px 5px", fontFamily: mono, fontSize: 10, fontWeight: 600 }}>{r.tdr.toFixed(0)}</td>
                    <td style={{ padding: "6px 5px", fontFamily: mono, fontSize: 10, color: "#6b7d8f" }}>{r.offered.toFixed(0)}</td>
                    <td style={{ padding: "6px 5px", fontFamily: mono, fontSize: 10, fontWeight: 700, color: r.ug > 0 ? "#ef4444" : "#22c55e" }}>{r.ug > 0 ? "+" : ""}{r.ug.toFixed(0)}</td>
                    <td style={{ padding: "6px 5px" }}>
                      <div style={{ width: "100%", height: 6, background: "#1c2a3a", borderRadius: 3, position: "relative", overflow: "hidden" }}>
                        {r.ug > 0 ? (
                          <div style={{ position: "absolute", left: "50%", top: 0, height: "100%", width: `${Math.min(Math.abs(r.ug) / 150 * 50, 50)}%`, background: "linear-gradient(90deg, #ef4444, #dc2626)", borderRadius: 3 }} />
                        ) : (
                          <div style={{ position: "absolute", right: "50%", top: 0, height: "100%", width: `${Math.min(Math.abs(r.ug) / 150 * 50, 50)}%`, background: "linear-gradient(90deg, #22c55e, #16a34a)", borderRadius: 3 }} />
                        )}
                        <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: "#2d3f54" }} />
                      </div>
                    </td>
                    <td style={{ padding: "6px 5px" }}><StatusBadge status={r.computedStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ═══════ DETAIL PANEL ═══════ */}
          {detail && (
            <div style={{ marginTop: 14, padding: 14, background: "#0d1219", borderRadius: 6, border: "1px solid #1c2a3a" }}>

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: "#63b3ed", marginBottom: 2 }}>BORROWER DETAIL</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#f0f4f8" }}>{detail.borrower} <span style={{ color: "#4a5568", fontWeight: 500 }}>({detail.ticker})</span></div>
                  <div style={{ fontSize: 10, color: "#5a6b7d" }}>
                    {detail.sector} · {detail.seniority} · ${(detail.total_size / 1000).toFixed(1)}bn · λ={detail.lambda_base.toFixed(1)}% · {detail.bor_am} amendments · Π={detail.bor_pi.toFixed(4)}
                  </div>
                </div>
                <StatusBadge status={detail.computedStatus} />
              </div>

              {/* TDR component cards — 4-term decomposition */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
                {[
                  { label: "I. rf", value: `${params.rf}`, unit: "bps", color: "#64748b", desc: `SOFR swap · Observed`, sub: "Moves both TDR and Offered" },
                  { label: "II. λ · LGD", value: detail.lambda_lgd_bps.toFixed(1), unit: "bps", color: "#f59e0b", desc: `λ=${(detail.lambda * 100).toFixed(1)}% · LGD=${(detail.lgd * 100).toFixed(1)}%`, sub: `CtrlScore=${detail.ctrlScore.toFixed(2)} · Ψ=${detail.psi} · ${detail.seniority}` },
                  { label: "III. MSP", value: msp_bps.toFixed(1), unit: "bps", color: "#a78bfa", desc: `${params.beta_msp.toFixed(2)} × (1−${params.pnav.toFixed(2)})`, sub: "BDC P/NAV signal · Market-wide" },
                  { label: "IV. Π × OAS", value: detail.oas_pi.toFixed(1), unit: "bps", color: "#63b3ed", desc: `${detail.bor_pi.toFixed(3)} × ${detail.oas_raw.toFixed(1)} raw`, sub: `OAS intrinsic → path-adjusted` },
                ].map(item => (
                  <div key={item.label} style={{ padding: "9px 10px", background: "#111822", borderRadius: 5, border: "1px solid #1c2a3a", borderTop: `3px solid ${item.color}` }}>
                    <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.06em", color: "#4a5568" }}>{item.label}</div>
                    <div style={{ fontSize: 19, fontWeight: 700, fontFamily: mono, marginTop: 2, color: "#e0e6ed" }}>{item.value}<span style={{ fontSize: 10, color: "#4a5568", fontWeight: 500 }}> {item.unit}</span></div>
                    <div style={{ fontSize: 9, color: "#5a6b7d", marginTop: 2 }}>{item.desc}</div>
                    <div style={{ fontSize: 8, color: "#3d4f63", marginTop: 1 }}>{item.sub}</div>
                  </div>
                ))}
              </div>

              {/* Waterfall */}
              <div style={{ padding: 10, background: "#111822", borderRadius: 5, border: "1px solid #1c2a3a", marginBottom: 10 }}>
                <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#4a5568", marginBottom: 6 }}>TDR WATERFALL</div>
                <div style={{ display: "flex", alignItems: "center", gap: 2, height: 32, borderRadius: 4, overflow: "hidden" }}>
                  {[{ l: "rf", v: params.rf, c: "#64748b" }, { l: "λ·LGD", v: detail.lambda_lgd_bps, c: "#f59e0b" }, { l: "MSP", v: msp_bps, c: "#a78bfa" }, { l: "Π·OAS", v: detail.oas_pi, c: "#63b3ed" }].map(seg => {
                    const pct = detail.tdr > 0 ? (seg.v / detail.tdr) * 100 : 0;
                    return <div key={seg.l} style={{ width: `${pct}%`, height: "100%", background: seg.c, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontSize: 8, fontWeight: 700, color: "#fff", overflow: "hidden", minWidth: pct > 3 ? 0 : 0 }}>
                      {pct > 8 && <span>{seg.l}</span>}{pct > 8 && <span style={{ fontSize: 9 }}>{seg.v.toFixed(0)}</span>}
                    </div>;
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid #1c2a3a" }}>
                  <div><span style={{ fontSize: 10, color: "#5a6b7d" }}>TDR* = </span><span style={{ fontSize: 15, fontWeight: 700, fontFamily: mono }}>{detail.tdr.toFixed(1)} bps</span></div>
                  <div><span style={{ fontSize: 10, color: "#5a6b7d" }}>Offered = </span><span style={{ fontSize: 15, fontWeight: 700, fontFamily: mono, color: "#6b7d8f" }}>{detail.offered.toFixed(0)} bps</span></div>
                  <div><span style={{ fontSize: 10, color: "#5a6b7d" }}>UG = </span><span style={{ fontSize: 15, fontWeight: 700, fontFamily: mono, color: detail.ug > 0 ? "#ef4444" : "#22c55e" }}>{detail.ug > 0 ? "+" : ""}{detail.ug.toFixed(1)} bps</span></div>
                </div>
                <div style={{ fontSize: 9, color: detail.ug > 0 ? "#ef4444" : "#22c55e", marginTop: 6, padding: "5px 7px", background: detail.ug > 0 ? "rgba(239,68,68,0.05)" : "rgba(34,197,94,0.05)", borderRadius: 3, lineHeight: 1.5 }}>
                  {detail.ug > 0
                    ? `UNDERPAID: Model requires ${detail.ug.toFixed(0)} bps more than offered. Negotiate wider spread or tighter covenants.`
                    : `ADEQUATE: Spread exceeds model requirement by ${Math.abs(detail.ug).toFixed(0)} bps. Overcompensated for risk given these assumptions.`}
                </div>
              </div>

              {/* UG Decomposition — WHAT DRIVES THE GAP */}
              <div style={{ padding: 10, background: "#111822", borderRadius: 5, border: "1px solid #1c2a3a", marginBottom: 10 }}>
                <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#4a5568", marginBottom: 6 }}>UG DECOMPOSITION — WHAT DRIVES THE GAP</div>
                {(() => {
                  const baseline_rf = 455;
                  const baseline_msp = 10.5;
                  const baseline_lambda_lgd = 0.031 * 0.35 * 1.0 * (1 - 0.30 * 0.55) * 10000;
                  const baseline_oas = 38;
                  const rf_contrib = params.rf - baseline_rf;
                  const lambda_contrib = detail.lambda_lgd_bps - baseline_lambda_lgd;
                  const msp_contrib = msp_bps - baseline_msp;
                  const oas_contrib = detail.oas_pi - baseline_oas;
                  const items = [
                    { l: "rf shift", v: rf_contrib, c: "#64748b" },
                    { l: "λ·LGD (borrower-specific)", v: lambda_contrib, c: "#f59e0b" },
                    { l: "MSP (market)", v: msp_contrib, c: "#a78bfa" },
                    { l: "Π·OAS (covenant + path)", v: oas_contrib, c: "#63b3ed" },
                  ];
                  return items.map(item => (
                    <div key={item.l} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: "#5a6b7d", width: 170 }}>{item.l}</span>
                      <div style={{ flex: 1, height: 5, background: "#1c2a3a", borderRadius: 3, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", left: item.v >= 0 ? "50%" : undefined, right: item.v < 0 ? "50%" : undefined, top: 0, height: "100%", width: `${Math.min(Math.abs(item.v) / 80 * 50, 50)}%`, background: item.c, borderRadius: 3, opacity: 0.7 }} />
                        <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: "#2d3f54" }} />
                      </div>
                      <span style={{ fontSize: 10, fontFamily: mono, fontWeight: 600, color: item.v > 0 ? "#ef4444" : "#22c55e", width: 50, textAlign: "right" }}>{item.v > 0 ? "+" : ""}{item.v.toFixed(1)}</span>
                    </div>
                  ));
                })()}
              </div>

              {/* OAS 3-step: Intrinsic → Π → Realized */}
              <div style={{ padding: 10, background: "#111822", borderRadius: 5, border: "1px solid #1c2a3a", marginBottom: 10 }}>
                <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#4a5568", marginBottom: 8 }}>OAS: INTRINSIC → PATH-ADJUSTED</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", background: "rgba(99,179,237,0.06)", borderRadius: 4, border: "1px solid rgba(99,179,237,0.12)" }}>
                    <div style={{ fontSize: 8, color: "#4a5568", fontWeight: 700 }}>INTRINSIC OAS</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: mono, color: "#63b3ed" }}>{detail.oas_raw.toFixed(1)}</div>
                    <div style={{ fontSize: 8, color: "#4a5568" }}>Full covenant hand</div>
                  </div>
                  <div style={{ fontSize: 16, color: "#2d3f54", fontWeight: 700 }}>×</div>
                  <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", background: detail.bor_pi < 0.60 ? "rgba(239,68,68,0.06)" : detail.bor_pi < 0.75 ? "rgba(234,179,8,0.06)" : "rgba(34,197,94,0.06)", borderRadius: 4, border: `1px solid ${detail.bor_pi < 0.60 ? "rgba(239,68,68,0.12)" : detail.bor_pi < 0.75 ? "rgba(234,179,8,0.12)" : "rgba(34,197,94,0.12)"}` }}>
                    <div style={{ fontSize: 8, color: "#4a5568", fontWeight: 700 }}>Π (PATH)</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: mono, color: detail.bor_pi < 0.60 ? "#ef4444" : detail.bor_pi < 0.75 ? "#eab308" : "#22c55e" }}>{detail.bor_pi.toFixed(3)}</div>
                    <div style={{ fontSize: 8, color: "#4a5568" }}>{detail.bor_am} exercises recorded</div>
                  </div>
                  <div style={{ fontSize: 16, color: "#2d3f54", fontWeight: 700 }}>=</div>
                  <div style={{ flex: 1, textAlign: "center", padding: "8px 4px", background: "rgba(99,179,237,0.08)", borderRadius: 4, border: "1px solid rgba(99,179,237,0.15)" }}>
                    <div style={{ fontSize: 8, color: "#4a5568", fontWeight: 700 }}>REALIZED Π·OAS</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: mono, color: "#e0e6ed" }}>{detail.oas_pi.toFixed(1)}</div>
                    <div style={{ fontSize: 8, color: "#4a5568" }}>Path-adjusted value</div>
                  </div>
                </div>
              </div>

              {/* Exercise Log — Π breakdown */}
              {detail.exercises && detail.exercises.length > 0 && (
                <div style={{ padding: 10, background: "#111822", borderRadius: 5, border: "1px solid #1c2a3a", marginBottom: 10 }}>
                  <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#4a5568", marginBottom: 6 }}>
                    BORROWER EXERCISE LOG — PATH TO Π = {detail.bor_pi.toFixed(4)}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {(() => {
                      let cumPi = 1.0;
                      return detail.exercises.map((ex, idx) => {
                        const dj = EXERCISE_DJ[ex.type] || 0.05;
                        const prevPi = cumPi;
                        cumPi *= (1 - dj);
                        return (
                          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 6px", background: idx % 2 === 0 ? "transparent" : "rgba(28,42,58,0.2)", borderRadius: 3 }}>
                            <span style={{ fontSize: 9, color: "#4a5568", width: 18, textAlign: "center", fontWeight: 700 }}>{idx + 1}</span>
                            <span style={{ width: 55, fontSize: 9, color: "#5a6b7d", fontFamily: mono }}>{ex.q}</span>
                            <span style={{ width: 8, height: 8, borderRadius: 2, background: EXERCISE_COLORS[ex.type] || "#f97316", flexShrink: 0 }} />
                            <span style={{ flex: 1, fontSize: 9, color: "#8899aa" }}>{ex.type}</span>
                            <span style={{ fontSize: 9, fontFamily: mono, color: "#ef4444", width: 38, textAlign: "right" }}>d={dj.toFixed(2)}</span>
                            <span style={{ fontSize: 9, fontFamily: mono, color: "#5a6b7d", width: 16, textAlign: "center" }}>→</span>
                            <span style={{ fontSize: 9, fontFamily: mono, color: cumPi < 0.60 ? "#ef4444" : cumPi < 0.75 ? "#eab308" : "#22c55e", width: 45, textAlign: "right", fontWeight: 600 }}>{cumPi.toFixed(4)}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                  <div style={{ fontSize: 8, color: "#3d4f63", marginTop: 6, fontStyle: "italic" }}>
                    Each exercise is irreversible. Π is monotonically non-increasing. dj values are v4.7 working assumptions from the Classification Bible Appendix F.
                  </div>
                </div>
              )}

              {/* OAS family breakdown */}
              <div style={{ padding: 10, background: "#111822", borderRadius: 5, border: "1px solid #1c2a3a" }}>
                <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "#4a5568", marginBottom: 6 }}>
                  OAS BY FAMILY — {params.zone} ZONE
                  <span style={{ fontWeight: 400, fontStyle: "italic", marginLeft: 6, color: "#3d4f63" }}>Borrower-specific weights from S<sub>k</sub> × M<sub>k,Z</sub></span>
                </div>
                <div style={{ display: "flex", gap: 5 }}>
                  {["CFP", "EX", "MT", "GV", "EN"].map(fam => {
                    const contrib = detail.familyContrib[fam];
                    const pctOas = detail.oas_raw > 0 ? (contrib / detail.oas_raw) * 100 : 0;
                    return (
                      <div key={fam} style={{ flex: 1, padding: "7px 5px", background: "#080c14", borderRadius: 4, textAlign: "center" }}>
                        <div style={{ width: "100%", height: 40, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 3 }}>
                          <div style={{ width: 18, height: `${Math.max(pctOas * 0.38, 2)}px`, background: FAMILY_COLORS[fam], borderRadius: "2px 2px 0 0", maxHeight: 40, opacity: 0.85 }} />
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: FAMILY_COLORS[fam] }}>{fam}</div>
                        <div style={{ fontSize: 11, fontFamily: mono, fontWeight: 700, color: "#e0e6ed" }}>{contrib.toFixed(1)}</div>
                        <div style={{ fontSize: 8, color: "#4a5568" }}>w={((detail.w[fam]) * 100).toFixed(0)}%</div>
                        <div style={{ fontSize: 8, color: "#3d4f63" }}>S={detail.scores[fam].toFixed(2)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

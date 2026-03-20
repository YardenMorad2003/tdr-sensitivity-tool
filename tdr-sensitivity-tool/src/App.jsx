import { useState, useMemo, useCallback } from "react";
import {
  BORROWERS, DEFAULT_PARAMS, ZONE_WEIGHTS, ZONES, ZONE_EXPLANATIONS,
  FAMILY_NAMES, FAMILY_COLORS, FAMILY_EXPLANATIONS, SLIDER_TIPS, computeTDR,
} from "./data.js";

function InfoTip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", marginLeft: 5, cursor: "help" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span style={{ width: 15, height: 15, borderRadius: "50%", background: "rgba(56,189,248,0.15)", border: "1px solid rgba(56,189,248,0.3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "var(--accent)" }}>?</span>
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", width: 280, padding: "10px 12px", background: "#1e293b", border: "1px solid #334155", borderRadius: 8, fontSize: 11, lineHeight: 1.55, color: "#cbd5e1", zIndex: 100, boxShadow: "0 12px 32px rgba(0,0,0,0.6)" }}>
          {text}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 8, height: 8, background: "#1e293b", borderRight: "1px solid #334155", borderBottom: "1px solid #334155" }} />
        </div>
      )}
    </span>
  );
}

function StatusPill({ status }) {
  const c = { LIGHT: { bg: "rgba(34,197,94,0.12)", b: "rgba(34,197,94,0.3)", t: "#22c55e" }, MODERATE: { bg: "rgba(234,179,8,0.12)", b: "rgba(234,179,8,0.3)", t: "#eab308" }, HEAVY: { bg: "rgba(239,68,68,0.12)", b: "rgba(239,68,68,0.3)", t: "#ef4444" } }[status] || { bg: "#333", b: "#555", t: "#999" };
  return <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "2px 8px", borderRadius: 4, background: c.bg, border: `1px solid ${c.b}`, color: c.t }}>{status}</span>;
}

function Slider({ label, value, onChange, min, max, step, unit, tip }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--label)", display: "flex", alignItems: "center" }}>
          {label}{tip && <InfoTip text={tip} />}
        </span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)", fontFamily: "var(--mono)" }}>
          {step < 1 ? value.toFixed(2) : value}{unit || ""}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "var(--accent)", height: 4, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--muted)", marginTop: 1 }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function UGBar({ ug }) {
  const pct = Math.min(Math.abs(ug) / 120 * 50, 50);
  return (
    <div style={{ width: "100%", height: 8, background: "var(--row-alt)", borderRadius: 4, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, height: "100%", borderRadius: 4,
        ...(ug < 0 ? { right: "50%", width: `${pct}%`, background: "linear-gradient(90deg, #22c55e, #4ade80)" }
                   : { left: "50%", width: `${pct}%`, background: "linear-gradient(90deg, #f87171, #ef4444)" }),
      }} />
      <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: "var(--muted)" }} />
    </div>
  );
}

export default function TDRSensitivityTool() {
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [sortKey, setSortKey] = useState("ug");
  const [sortAsc, setSortAsc] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [expandedFamily, setExpandedFamily] = useState(null);

  const setParam = useCallback((key, val) => setParams(prev => ({ ...prev, [key]: val })), []);

  const results = useMemo(() => BORROWERS.map(b => {
    const r = computeTDR(params, b);
    return { ...b, ...r, computedStatus: b.bor_pi >= 0.75 ? "LIGHT" : b.bor_pi >= 0.60 ? "MODERATE" : "HEAVY" };
  }), [params]);

  const filtered = useMemo(() => {
    let arr = filterStatus === "ALL" ? [...results] : results.filter(r => r.computedStatus === filterStatus);
    arr.sort((a, b) => typeof a[sortKey] === "number" ? (sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]) : (sortAsc ? String(a[sortKey]).localeCompare(String(b[sortKey])) : String(b[sortKey]).localeCompare(String(a[sortKey]))));
    return arr;
  }, [results, sortKey, sortAsc, filterStatus]);

  const avg = useMemo(() => {
    const n = results.length;
    return { tdr: results.reduce((s, r) => s + r.tdr, 0) / n, ug: results.reduce((s, r) => s + r.ug, 0) / n, pi: results.reduce((s, r) => s + r.bor_pi, 0) / n,
      heavy: results.filter(r => r.computedStatus === "HEAVY").length, mod: results.filter(r => r.computedStatus === "MODERATE").length, light: results.filter(r => r.computedStatus === "LIGHT").length };
  }, [results]);

  const detail = selectedBorrower ? results.find(r => r.ticker === selectedBorrower) : null;

  return (
    <div style={{ "--bg": "#0a0e17", "--surface": "#111827", "--surface2": "#1a2332", "--border": "#1e293b", "--text": "#e2e8f0", "--label": "#94a3b8", "--muted": "#475569", "--accent": "#38bdf8", "--green": "#22c55e", "--red": "#ef4444", "--yellow": "#eab308", "--row-alt": "rgba(30,41,59,0.5)", "--mono": "'JetBrains Mono', monospace", fontFamily: "'IBM Plex Sans', -apple-system, sans-serif", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>


      {/* HEADER */}
      <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", borderBottom: "1px solid var(--border)", padding: "20px 24px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", color: "var(--accent)", marginBottom: 4 }}>COVENANTLAB ANALYTICS</div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>TDR Assumption Sensitivity</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>22 SRLN Borrowers · Real-time UG recalculation · CDR v1 × TDR v4.6</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.05em" }}>PORTFOLIO AVG UG</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "var(--mono)", color: avg.ug < 0 ? "var(--green)" : "var(--red)" }}>
              {avg.ug < 0 ? "" : "+"}{avg.ug.toFixed(0)} bps
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {[{ l: "Avg TDR", v: `${avg.tdr.toFixed(0)} bps`, c: "var(--text)" }, { l: "Avg Π", v: avg.pi.toFixed(3), c: avg.pi < 0.70 ? "var(--red)" : "var(--yellow)" }, { l: "Heavy", v: avg.heavy, c: "var(--red)" }, { l: "Moderate", v: avg.mod, c: "var(--yellow)" }, { l: "Light", v: avg.light, c: "var(--green)" }].map(s =>
            <div key={s.l}><div style={{ fontSize: 9, color: "var(--muted)", letterSpacing: "0.1em", fontWeight: 600 }}>{s.l.toUpperCase()}</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--mono)", color: s.c }}>{s.v}</div></div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 140px)" }}>

        {/* ═══════ LEFT PANEL ═══════ */}
        <div style={{ width: 320, minWidth: 320, background: "var(--surface)", borderRight: "1px solid var(--border)", padding: "12px 18px", overflowY: "auto", maxHeight: "calc(100vh - 140px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)" }}>MODEL ASSUMPTIONS</span>
            <button onClick={() => setParams(DEFAULT_PARAMS)} style={{ fontSize: 10, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.2)", color: "var(--accent)", padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>RESET</button>
          </div>
          <div style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.5, marginBottom: 14, padding: "6px 8px", background: "rgba(56,189,248,0.04)", borderRadius: 4, border: "1px solid rgba(56,189,248,0.08)" }}>
            Drag any slider to change an assumption. TDR and UG recalculate for all 22 borrowers instantly. Hover the <span style={{ color: "var(--accent)", fontWeight: 700 }}>?</span> icons for detailed explanations.
          </div>

          {/* I. Risk-Free */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8, paddingBottom: 4, borderBottom: "1px solid rgba(56,189,248,0.15)" }}>I. RISK-FREE RATE</div>
          <Slider label="rf" value={params.rf} onChange={v => setParam("rf", v)} min={300} max={600} step={5} unit=" bps"
            tip={SLIDER_TIPS.rf} />

          {/* II. Lender Sentiment */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8, marginTop: 16, paddingBottom: 4, borderBottom: "1px solid rgba(56,189,248,0.15)" }}>II. LENDER SENTIMENT</div>
          <Slider label="LS" value={params.ls} onChange={v => setParam("ls", v)} min={0} max={200} step={5} unit=" bps"
            tip={SLIDER_TIPS.ls} />

          {/* III. Default Risk */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8, marginTop: 16, paddingBottom: 4, borderBottom: "1px solid rgba(56,189,248,0.15)" }}>III. DEFAULT RISK (λ · LGD)</div>
          <Slider label="LGD Base" value={params.lgd_base} onChange={v => setParam("lgd_base", v)} min={0.15} max={0.70} step={0.01} unit=""
            tip={SLIDER_TIPS.lgd_base} />
          <Slider label="φ (phi) — Covenant Recovery" value={params.phi} onChange={v => setParam("phi", v)} min={0} max={0.60} step={0.01} unit=""
            tip={SLIDER_TIPS.phi} />

          {/* IV. Zone & Covenant OAS */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--accent)", marginBottom: 8, marginTop: 16, paddingBottom: 4, borderBottom: "1px solid rgba(56,189,248,0.15)" }}>IV. ZONE & COVENANT OAS</div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "var(--label)", marginBottom: 6, display: "flex", alignItems: "center" }}>
              Borrower Zone
              <InfoTip text={SLIDER_TIPS.zone} />
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {ZONES.map(z => (
                <button key={z} onClick={() => setParam("zone", z)} style={{
                  flex: 1, fontSize: 9, fontWeight: 700, letterSpacing: "0.04em", padding: "6px 2px", borderRadius: 4, cursor: "pointer",
                  border: params.zone === z ? "1.5px solid var(--accent)" : "1px solid var(--border)",
                  background: params.zone === z ? "rgba(56,189,248,0.15)" : "var(--surface2)",
                  color: params.zone === z ? "var(--accent)" : "var(--muted)", transition: "all 0.15s",
                }}>{z}</button>
              ))}
            </div>
          </div>

          {/* Zone explanation */}
          <div style={{ padding: "8px 10px", background: "var(--surface2)", borderRadius: 6, border: "1px solid var(--border)", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", marginBottom: 3 }}>{params.zone}</div>
            <div style={{ fontSize: 10, color: "var(--label)", lineHeight: 1.5 }}>{ZONE_EXPLANATIONS[params.zone]}</div>
          </div>

          {/* Zone weights */}
          <div style={{ padding: "10px 10px", background: "var(--surface2)", borderRadius: 6, border: "1px solid var(--border)", marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8, display: "flex", alignItems: "center" }}>
              OAS WEIGHT ALLOCATION
              <InfoTip text={SLIDER_TIPS.zone_weights} />
            </div>
            {Object.entries(ZONE_WEIGHTS[params.zone]).map(([fam, w]) => (
              <div key={fam} style={{ marginBottom: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "2px 0" }}
                  onClick={() => setExpandedFamily(expandedFamily === fam ? null : fam)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: FAMILY_COLORS[fam], flexShrink: 0 }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: "var(--label)", width: 28 }}>{fam}</span>
                    <span style={{ fontSize: 9, color: "var(--muted)" }}>{FAMILY_NAMES[fam]}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 70, height: 5, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${w * 100}%`, background: FAMILY_COLORS[fam], borderRadius: 3, transition: "width 0.3s" }} />
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text)", width: 40, textAlign: "right", fontWeight: 600 }}>{(w * 100).toFixed(1)}%</span>
                  </div>
                </div>
                {expandedFamily === fam && (
                  <div style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.5, margin: "4px 0 4px 14px", paddingLeft: 8, borderLeft: `2px solid ${FAMILY_COLORS[fam]}40` }}>
                    {FAMILY_EXPLANATIONS[fam]}
                  </div>
                )}
              </div>
            ))}
            <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 6, fontStyle: "italic" }}>Click a family to see what it covers</div>
          </div>

          {/* Δr_max sliders */}
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8, display: "flex", alignItems: "center" }}>
            Δr_max BY FAMILY
            <InfoTip text="Maximum enforcement gain — the spread contribution (in bps) if every covenant in this family were at institutional best practice (Entelechy=1.0) and fully activated. This is the ceiling, like the factor risk price in APT. The actual OAS contribution is: Δr_max × zone_weight × Entelechy × Π. These ranges are working assumptions pending calibration against LSTA/LCD matched-pair OAS differentials." />
          </div>
          <Slider label="CFP" value={params.dr_cfp} onChange={v => setParam("dr_cfp", v)} min={10} max={100} step={0.5} unit=" bps"
            tip={SLIDER_TIPS.dr_cfp} />
          <Slider label="EX" value={params.dr_ex} onChange={v => setParam("dr_ex", v)} min={5} max={60} step={0.5} unit=" bps"
            tip={SLIDER_TIPS.dr_ex} />
          <Slider label="MT" value={params.dr_mt} onChange={v => setParam("dr_mt", v)} min={10} max={80} step={0.5} unit=" bps"
            tip={SLIDER_TIPS.dr_mt} />
          <Slider label="GV" value={params.dr_gv} onChange={v => setParam("dr_gv", v)} min={5} max={70} step={0.5} unit=" bps"
            tip={SLIDER_TIPS.dr_gv} />
          <Slider label="EN" value={params.dr_en} onChange={v => setParam("dr_en", v)} min={5} max={75} step={0.5} unit=" bps"
            tip={SLIDER_TIPS.dr_en} />

          {/* Formula */}
          <div style={{ marginTop: 16, padding: "10px 12px", background: "rgba(56,189,248,0.04)", borderRadius: 6, border: "1px solid rgba(56,189,248,0.1)" }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 6 }}>THE MASTER FORMULA</div>
            <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text)", lineHeight: 1.8 }}>
              TDR = r<sub>f</sub> + λ·LGD + LS + Π·OAS
            </div>
            <div style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text)", lineHeight: 1.8 }}>
              UG&nbsp; = TDR − Offered Spread
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 6, lineHeight: 1.6, borderTop: "1px solid rgba(56,189,248,0.1)", paddingTop: 6 }}>
              <strong style={{ color: "var(--green)" }}>UG &lt; 0</strong> → Market overcompensates you<br />
              <strong style={{ color: "var(--red)" }}>UG &gt; 0</strong> → You're underpaid for the risk<br />
              <strong style={{ color: "var(--label)" }}>Π</strong> → Path degradation (1.0 = pristine, 0.5 = half value lost)
            </div>
          </div>
        </div>

        {/* ═══════ MAIN TABLE ═══════ */}
        <div style={{ flex: 1, padding: "16px 20px", overflowX: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["ALL", "HEAVY", "MODERATE", "LIGHT"].map(f => (
                <button key={f} onClick={() => setFilterStatus(f)} style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", padding: "4px 12px", borderRadius: 4, cursor: "pointer",
                  border: filterStatus === f ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: filterStatus === f ? "rgba(56,189,248,0.1)" : "transparent",
                  color: filterStatus === f ? "var(--accent)" : "var(--muted)",
                }}>{f} {f !== "ALL" && `(${f === "HEAVY" ? avg.heavy : f === "MODERATE" ? avg.mod : avg.light})`}</button>
              ))}
            </div>
            <span style={{ fontSize: 10, color: "var(--muted)" }}>{filtered.length} borrowers · Click row for detail</span>
          </div>

          <div style={{ borderRadius: 8, border: "1px solid var(--border)", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "var(--surface)" }}>
                  {[
                    { key: "ticker", label: "Ticker", w: 58 }, { key: "borrower", label: "Borrower", w: 115 }, { key: "sector", label: "Sector", w: 115 },
                    { key: "bor_am", label: "#Am", w: 38 }, { key: "bor_pi", label: "Π", w: 52 }, { key: "tdr", label: "TDR", w: 55 },
                    { key: "offered", label: "Offered", w: 55 }, { key: "ug", label: "UG (bps)", w: 68 }, { key: "ug_bar", label: "", w: 95 }, { key: "computedStatus", label: "Status", w: 70 },
                  ].map(col => (
                    <th key={col.key} onClick={() => col.key !== "ug_bar" && (sortKey === col.key ? setSortAsc(!sortAsc) : (setSortKey(col.key), setSortAsc(col.key === "borrower" || col.key === "ticker")))}
                      style={{ padding: "8px 7px", textAlign: "left", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "var(--muted)", cursor: col.key !== "ug_bar" ? "pointer" : "default", width: col.w, borderBottom: "1px solid var(--border)", userSelect: "none" }}>
                      {col.label} {sortKey === col.key && (sortAsc ? "↑" : "↓")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.ticker} onClick={() => setSelectedBorrower(selectedBorrower === r.ticker ? null : r.ticker)}
                    style={{ background: selectedBorrower === r.ticker ? "rgba(56,189,248,0.08)" : i % 2 === 0 ? "transparent" : "var(--row-alt)", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => { if (selectedBorrower !== r.ticker) e.currentTarget.style.background = "rgba(56,189,248,0.04)"; }}
                    onMouseLeave={e => { if (selectedBorrower !== r.ticker) e.currentTarget.style.background = i % 2 === 0 ? "transparent" : "var(--row-alt)"; }}>
                    <td style={{ padding: "7px 7px", fontWeight: 700, fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)" }}>{r.ticker}</td>
                    <td style={{ padding: "7px 7px", fontWeight: 500 }}>{r.borrower}</td>
                    <td style={{ padding: "7px 7px", fontSize: 11, color: "var(--label)" }}>{r.sector}</td>
                    <td style={{ padding: "7px 7px", fontFamily: "var(--mono)", textAlign: "center", fontSize: 11 }}>{r.bor_am}</td>
                    <td style={{ padding: "7px 7px", fontFamily: "var(--mono)", fontSize: 11, color: r.bor_pi < 0.60 ? "var(--red)" : r.bor_pi < 0.75 ? "var(--yellow)" : "var(--green)" }}>{r.bor_pi.toFixed(3)}</td>
                    <td style={{ padding: "7px 7px", fontFamily: "var(--mono)", fontSize: 11 }}>{r.tdr.toFixed(0)}</td>
                    <td style={{ padding: "7px 7px", fontFamily: "var(--mono)", fontSize: 11, color: "var(--label)" }}>{r.offered.toFixed(0)}</td>
                    <td style={{ padding: "7px 7px", fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: r.ug < 0 ? "var(--green)" : "var(--red)" }}>{r.ug < 0 ? "" : "+"}{r.ug.toFixed(1)}</td>
                    <td style={{ padding: "7px 7px" }}><UGBar ug={r.ug} /></td>
                    <td style={{ padding: "7px 7px" }}><StatusPill status={r.computedStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ═══════ DETAIL PANEL ═══════ */}
          {detail && (
            <div style={{ marginTop: 16, padding: 16, background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", marginBottom: 2 }}>BORROWER DETAIL</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{detail.borrower} <span style={{ color: "var(--muted)", fontWeight: 500 }}>({detail.ticker})</span></div>
                  <div style={{ fontSize: 11, color: "var(--label)" }}>{detail.sector} · ${(detail.total_size / 1000).toFixed(1)}bn total · {detail.bor_am} amendments · Π = {detail.bor_pi.toFixed(4)}</div>
                </div>
                <StatusPill status={detail.computedStatus} />
              </div>

              {/* TDR component cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 14 }}>
                {[
                  { label: "rf", value: `${params.rf}`, unit: "bps", color: "#64748b", desc: "Risk-free rate (SOFR swap)" },
                  { label: "λ · LGD", value: detail.lambda_lgd.toFixed(1), unit: "bps", color: "#f59e0b", desc: `LGD=${(detail.lgd * 100).toFixed(1)}%, λ=3.1%` },
                  { label: "LS", value: `${params.ls}`, unit: "bps", color: "#8b5cf6", desc: "BDC P/NAV friction" },
                  { label: "Π × OAS", value: detail.oas_pi.toFixed(1), unit: "bps", color: "#38bdf8", desc: `${detail.bor_pi.toFixed(3)} × ${detail.oas_raw.toFixed(1)} raw` },
                ].map(item => (
                  <div key={item.label} style={{ padding: "10px 12px", background: "var(--surface2)", borderRadius: 6, border: "1px solid var(--border)", borderTop: `3px solid ${item.color}` }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: "var(--muted)" }}>{item.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--mono)", marginTop: 2 }}>{item.value}<span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500 }}> {item.unit}</span></div>
                    <div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Waterfall */}
              <div style={{ padding: 12, background: "var(--surface2)", borderRadius: 6, border: "1px solid var(--border)", marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8 }}>TDR WATERFALL</div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, height: 36, borderRadius: 6, overflow: "hidden" }}>
                  {[{ l: "rf", v: params.rf, c: "#64748b" }, { l: "λ·LGD", v: detail.lambda_lgd, c: "#f59e0b" }, { l: "LS", v: params.ls, c: "#8b5cf6" }, { l: "Π·OAS", v: detail.oas_pi, c: "#38bdf8" }].map(seg => {
                    const pct = (seg.v / detail.tdr) * 100;
                    return <div key={seg.l} style={{ width: `${pct}%`, height: "100%", background: seg.c, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", fontSize: 9, fontWeight: 700, color: "#fff", overflow: "hidden" }}>
                      {pct > 10 && <span>{seg.l}</span>}{pct > 10 && <span style={{ fontSize: 10 }}>{seg.v.toFixed(0)}</span>}
                    </div>;
                  })}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                  <div><span style={{ fontSize: 11, color: "var(--label)" }}>TDR = </span><span style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--mono)" }}>{detail.tdr.toFixed(1)} bps</span></div>
                  <div><span style={{ fontSize: 11, color: "var(--label)" }}>Offered = </span><span style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--label)" }}>{detail.offered.toFixed(0)} bps</span></div>
                  <div><span style={{ fontSize: 11, color: "var(--label)" }}>UG = </span><span style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--mono)", color: detail.ug < 0 ? "var(--green)" : "var(--red)" }}>{detail.ug < 0 ? "" : "+"}{detail.ug.toFixed(1)} bps</span></div>
                </div>
                <div style={{ fontSize: 10, color: detail.ug < 0 ? "var(--green)" : "var(--red)", marginTop: 8, padding: "6px 8px", background: detail.ug < 0 ? "rgba(34,197,94,0.06)" : "rgba(239,68,68,0.06)", borderRadius: 4, lineHeight: 1.5 }}>
                  {detail.ug < 0
                    ? `Market offers ${Math.abs(detail.ug).toFixed(0)} bps more than the model requires — you're overcompensated for the risk given these assumptions.`
                    : `Model says you need ${detail.ug.toFixed(0)} bps more than offered — negotiate wider spread or tighter covenants.`}
                </div>
              </div>

              {/* OAS family breakdown */}
              <div style={{ padding: 12, background: "var(--surface2)", borderRadius: 6, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 8 }}>
                  OAS BY FAMILY — {params.zone} ZONE
                  <span style={{ fontWeight: 400, fontStyle: "italic", marginLeft: 8 }}>Raw OAS = {detail.oas_raw.toFixed(1)} bps → after Π({detail.bor_pi.toFixed(3)}) = {detail.oas_pi.toFixed(1)} bps</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {Object.entries(ZONE_WEIGHTS[params.zone]).map(([fam, w]) => {
                    const contrib = params[`dr_${fam.toLowerCase()}`] * w;
                    const pctOas = detail.oas_raw > 0 ? (contrib / detail.oas_raw) * 100 : 0;
                    return (
                      <div key={fam} style={{ flex: 1, padding: "8px 6px", background: "var(--bg)", borderRadius: 4, textAlign: "center" }}>
                        <div style={{ width: "100%", height: 44, display: "flex", alignItems: "flex-end", justifyContent: "center", marginBottom: 4 }}>
                          <div style={{ width: 22, height: `${Math.max(pctOas * 0.42, 3)}px`, background: FAMILY_COLORS[fam], borderRadius: "3px 3px 0 0", maxHeight: 44 }} />
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: FAMILY_COLORS[fam] }}>{fam}</div>
                        <div style={{ fontSize: 12, fontFamily: "var(--mono)", fontWeight: 700, color: "var(--text)" }}>{contrib.toFixed(1)}</div>
                        <div style={{ fontSize: 9, color: "var(--muted)" }}>{pctOas.toFixed(0)}%</div>
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

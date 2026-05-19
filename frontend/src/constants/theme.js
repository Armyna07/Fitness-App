export const COLORS = {
  bg: "#05060f",
  surface: "#0b0e1f",
  card: "#0f1326",
  cardBorder: "rgba(120,80,255,0.18)",
  amber: "#f59e0b",
  amberGlow: "#fbbf24",
  purple: "#7c3aed",
  purpleLight: "#a78bfa",
  purpleFaint: "rgba(124,58,237,0.12)",
  orange: "#ea580c",
  orangeGlow: "#fb923c",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
  success: "#10b981",
  danger: "#ef4444",
  gold: "#fbbf24",
  silver: "#94a3b8",
  bronze: "#cd7c3f",
};

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.bg};
    color: ${COLORS.text};
    font-family: 'Outfit', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${COLORS.bg}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.purple}; border-radius: 2px; }

  .noise-overlay {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .nebula {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    filter: blur(80px);
  }

  .app-shell { position: relative; z-index: 1; display: flex; flex-direction: column; min-height: 100vh; }

  /* Nav */
  .top-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(5,6,15,0.85);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid ${COLORS.cardBorder};
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 60px;
  }
  .nav-logo {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px;
    background: linear-gradient(135deg, ${COLORS.amber}, ${COLORS.orange});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab {
    padding: 6px 16px; border-radius: 20px; cursor: pointer;
    font-size: 13px; font-weight: 500; transition: all 0.2s;
    border: 1px solid transparent; color: ${COLORS.textMuted};
    background: none;
  }
  .nav-tab:hover { color: ${COLORS.text}; }
  .nav-tab.active {
    background: ${COLORS.purpleFaint};
    border-color: ${COLORS.cardBorder};
    color: ${COLORS.purpleLight};
  }
  .nav-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg, ${COLORS.purple}, ${COLORS.orange});
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; cursor: pointer;
    border: 2px solid ${COLORS.cardBorder};
  }

  /* Page */
  .page { flex: 1; padding: 28px 24px; max-width: 1100px; margin: 0 auto; width: 100%; }

  /* Cards */
  .card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 16px; padding: 20px;
    position: relative; overflow: hidden;
  }
  .card::before {
    content: ''; position: absolute; inset: 0; border-radius: 16px;
    background: linear-gradient(135deg, rgba(124,58,237,0.05) 0%, transparent 60%);
    pointer-events: none;
  }
  .card-glow {
    box-shadow: 0 0 40px rgba(124,58,237,0.08), 0 4px 20px rgba(0,0,0,0.4);
  }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .col-span-2 { grid-column: span 2; }

  /* Typography */
  .label {
    font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 500;
    letter-spacing: 1.5px; text-transform: uppercase; color: ${COLORS.textMuted};
  }
  .title-xl {
    font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800;
    line-height: 1.1; letter-spacing: -0.5px;
  }
  .title-lg {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700;
    letter-spacing: -0.3px;
  }
  .title-sm {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
  }
  .mono { font-family: 'DM Mono', monospace; }

  /* Stat bubble */
  .stat-bubble { display: flex; flex-direction: column; gap: 2px; }
  .stat-value {
    font-family: 'DM Mono', monospace; font-size: 28px; font-weight: 500;
    background: linear-gradient(135deg, ${COLORS.amber}, ${COLORS.orange});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
  }

  /* Progress bar */
  .progress-track {
    height: 6px; background: rgba(255,255,255,0.06); border-radius: 3px;
    position: relative;
  }
  .progress-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, ${COLORS.purple}, ${COLORS.amber});
    transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative; overflow: hidden;
  }

  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px; border-radius: 10px; cursor: pointer;
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    transition: all 0.2s; border: none; outline: none;
  }
  .btn-primary {
    background: linear-gradient(135deg, ${COLORS.purple}, #5b21b6);
    color: white;
    box-shadow: 0 4px 20px rgba(124,58,237,0.3);
  }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(124,58,237,0.45); }
  .btn-amber {
    background: linear-gradient(135deg, ${COLORS.amber}, ${COLORS.orange});
    color: #0b0e1f; font-weight: 700;
    box-shadow: 0 4px 20px rgba(245,158,11,0.25);
  }
  .btn-amber:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(245,158,11,0.4); }
  .btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid ${COLORS.cardBorder};
    color: ${COLORS.textDim};
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.08); color: ${COLORS.text}; }
  .btn-danger {
    background: rgba(239,68,68,0.12);
    border: 1px solid rgba(239,68,68,0.25);
    color: ${COLORS.danger};
  }
  .btn-sm { padding: 6px 14px; font-size: 12px; border-radius: 8px; }

  /* Badge */
  .badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; font-family: 'DM Mono', monospace;
  }
  .badge-active { background: rgba(16,185,129,0.12); color: ${COLORS.success}; border: 1px solid rgba(16,185,129,0.2); }
  .badge-upcoming { background: rgba(124,58,237,0.12); color: ${COLORS.purpleLight}; border: 1px solid rgba(124,58,237,0.2); }
  .badge-completed { background: rgba(100,116,139,0.12); color: ${COLORS.textDim}; border: 1px solid rgba(100,116,139,0.2); }
  .badge-amber { background: rgba(245,158,11,0.12); color: ${COLORS.amber}; border: 1px solid rgba(245,158,11,0.2); }

  /* Forms */
  .form-group { display: flex; flex-direction: column; gap: 7px; }
  .form-label { font-size: 12px; font-weight: 600; color: ${COLORS.textDim}; letter-spacing: 0.3px; }
  .form-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 10px; padding: 11px 14px;
    color: ${COLORS.text}; font-family: 'Outfit', sans-serif; font-size: 14px;
    outline: none; transition: border-color 0.2s;
    width: 100%;
  }
  .form-input:focus { border-color: ${COLORS.purple}; background: rgba(124,58,237,0.06); }
  .form-input::placeholder { color: ${COLORS.textMuted}; }
  select.form-input option { background: ${COLORS.card}; }

  /* Toggle */
  .toggle-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .toggle-switch {
    width: 44px; height: 24px; border-radius: 12px;
    background: rgba(255,255,255,0.08); border: 1px solid ${COLORS.cardBorder};
    cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0;
  }
  .toggle-switch.on { background: ${COLORS.purple}; border-color: ${COLORS.purple}; }
  .toggle-knob {
    position: absolute; top: 3px; left: 3px;
    width: 16px; height: 16px; border-radius: 50%; background: white;
    transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.3);
  }
  .toggle-switch.on .toggle-knob { left: 23px; }

  /* Tabs */
  .tab-row { display: flex; gap: 4px; margin-bottom: 20px; }
  .tab-pill {
    padding: 7px 18px; border-radius: 20px; cursor: pointer;
    font-size: 13px; font-weight: 500; transition: all 0.2s;
    border: 1px solid transparent; color: ${COLORS.textMuted};
    background: none;
  }
  .tab-pill:hover { color: ${COLORS.text}; }
  .tab-pill.active {
    background: ${COLORS.purpleFaint};
    border-color: ${COLORS.cardBorder};
    color: ${COLORS.purpleLight};
  }

  /* Heat map */
  .heatmap-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
  .heatmap-cell {
    aspect-ratio: 1; border-radius: 4px;
    background: rgba(255,255,255,0.04);
    transition: all 0.2s; cursor: default;
  }
  .heatmap-cell.hit {
    background: linear-gradient(135deg, ${COLORS.purple}, ${COLORS.amber});
    box-shadow: 0 0 8px rgba(124,58,237,0.4);
  }
  .heatmap-cell.miss { background: rgba(239,68,68,0.12); }
  .heatmap-cell.today { border: 1px solid ${COLORS.amber}; }

  /* Podium */
  .podium { display: flex; align-items: flex-end; justify-content: center; gap: 8px; margin: 8px 0 16px; }
  .podium-slot { display: flex; flex-direction: column; align-items: center; gap: 6px; }
  .podium-block {
    width: 70px; border-radius: 10px 10px 0 0;
    display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px;
  }
  .podium-1 { height: 90px; background: linear-gradient(180deg, rgba(251,191,36,0.3), rgba(251,191,36,0.05)); color: ${COLORS.gold}; border: 1px solid rgba(251,191,36,0.3); }
  .podium-2 { height: 65px; background: linear-gradient(180deg, rgba(148,163,184,0.2), rgba(148,163,184,0.02)); color: ${COLORS.silver}; border: 1px solid rgba(148,163,184,0.2); }
  .podium-3 { height: 48px; background: linear-gradient(180deg, rgba(205,124,63,0.2), rgba(205,124,63,0.02)); color: ${COLORS.bronze}; border: 1px solid rgba(205,124,63,0.2); }
  .podium-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 14px;
  }
  .podium-name { font-size: 11px; color: ${COLORS.textDim}; font-weight: 500; }

  /* Leaderboard row */
  .lb-row {
    display: grid; grid-template-columns: 36px 36px 1fr 90px 70px 36px;
    align-items: center; gap: 8px;
    padding: 10px 14px; border-radius: 10px;
    border: 1px solid transparent; transition: all 0.15s;
  }
  .lb-row:hover { background: rgba(255,255,255,0.03); border-color: ${COLORS.cardBorder}; }
  .lb-row.me { background: ${COLORS.purpleFaint}; border-color: rgba(124,58,237,0.3); }
  .lb-rank { font-family: 'DM Mono', monospace; font-size: 13px; color: ${COLORS.textMuted}; text-align: center; }
  .lb-avatar { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
  .lb-name { font-size: 13px; font-weight: 500; }
  .lb-stat { font-family: 'DM Mono', monospace; font-size: 12px; color: ${COLORS.textDim}; text-align: right; }
  .lb-check { width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; margin: 0 auto; }
  .lb-check.done { background: rgba(16,185,129,0.15); color: ${COLORS.success}; }
  .lb-check.pending { background: rgba(100,116,139,0.1); color: ${COLORS.textMuted}; }

  /* Challenge card */
  .challenge-card {
    background: ${COLORS.card};
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 16px; padding: 18px;
    position: relative; overflow: hidden; cursor: pointer;
    transition: all 0.2s;
  }
  .challenge-card:hover { border-color: rgba(124,58,237,0.35); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
  .challenge-card .accent-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, ${COLORS.purple}, ${COLORS.amber});
  }

  /* Auth pages */
  .auth-wrap {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 24px; position: relative; z-index: 1;
  }
  .auth-card {
    width: 100%; max-width: 420px;
    background: ${COLORS.card};
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 24px; padding: 36px;
    box-shadow: 0 0 80px rgba(124,58,237,0.12);
  }

  /* Misc */
  .divider { height: 1px; background: ${COLORS.cardBorder}; margin: 16px 0; }
  .flex { display: flex; }
  .flex-col { display: flex; flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }
  .gap-14 { gap: 14px; }
  .gap-16 { gap: 16px; }
  .gap-20 { gap: 20px; }
  .gap-24 { gap: 24px; }
  .mb-4 { margin-bottom: 4px; }
  .mb-8 { margin-bottom: 8px; }
  .mb-12 { margin-bottom: 12px; }
  .mb-16 { margin-bottom: 16px; }
  .mb-20 { margin-bottom: 20px; }
  .mb-24 { margin-bottom: 24px; }
  .mt-8 { margin-top: 8px; }
  .mt-12 { margin-top: 12px; }
  .mt-16 { margin-top: 16px; }
  .text-center { text-align: center; }
  .text-right { text-align: right; }
  .text-muted { color: ${COLORS.textMuted}; font-size: 13px; }
  .text-dim { color: ${COLORS.textDim}; font-size: 13px; }
  .text-amber { color: ${COLORS.amber}; }
  .text-purple { color: ${COLORS.purpleLight}; }
  .text-success { color: ${COLORS.success}; }
  .text-danger { color: ${COLORS.danger}; }
  .text-sm { font-size: 13px; }
  .text-xs { font-size: 11px; }
  .font-600 { font-weight: 600; }
  .w-full { width: 100%; }
  .flex-1 { flex: 1; }

  .fab {
    position: fixed; bottom: 28px; right: 28px;
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, ${COLORS.purple}, #5b21b6);
    box-shadow: 0 4px 24px rgba(124,58,237,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; cursor: pointer; z-index: 50;
    transition: all 0.2s; border: none; color: white;
  }
  .fab:hover { transform: scale(1.08); box-shadow: 0 8px 32px rgba(124,58,237,0.55); }

  .share-box {
    background: rgba(255,255,255,0.03);
    border: 1px solid ${COLORS.cardBorder};
    border-radius: 10px; padding: 10px 14px;
    display: flex; align-items: center; justify-content: space-between; gap: 10px;
  }
  .share-code {
    font-family: 'DM Mono', monospace; font-size: 18px; font-weight: 500;
    letter-spacing: 4px; color: ${COLORS.amber};
  }

  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 20px; gap: 12px; text-align: center;
  }
  .empty-icon { font-size: 40px; opacity: 0.4; }

  @keyframes pulse-glow {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 1; }
  }
  .pulse { animation: pulse-glow 2s ease-in-out infinite; }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeIn 0.35s ease-out; }

  .streak-flame { font-size: 14px; }

  .chip-row { display: flex; flex-wrap: wrap; gap: 8px; }
  .chip {
    padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
    background: rgba(255,255,255,0.04); border: 1px solid ${COLORS.cardBorder};
    color: ${COLORS.textDim}; cursor: pointer; transition: all 0.15s;
  }
  .chip:hover, .chip.active {
    background: ${COLORS.purpleFaint}; border-color: rgba(124,58,237,0.3); color: ${COLORS.purpleLight};
  }

  .rank-medal { font-size: 16px; }

  .profile-header {
    display: flex; gap: 24px; align-items: flex-start;
    padding: 24px; border-radius: 20px;
    background: ${COLORS.card}; border: 1px solid ${COLORS.cardBorder};
    position: relative; overflow: hidden;
  }
  .profile-banner {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(234,88,12,0.04));
    pointer-events: none;
  }
  .profile-av {
    width: 72px; height: 72px; border-radius: 50%;
    background: linear-gradient(135deg, ${COLORS.purple}, ${COLORS.orange});
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 800; flex-shrink: 0; position: relative; z-index: 1;
    border: 3px solid rgba(245,158,11,0.3);
  }

  .page-back {
    display: flex; align-items: center; gap: 8px;
    color: ${COLORS.textMuted}; font-size: 13px; cursor: pointer;
    margin-bottom: 20px; transition: color 0.15s;
  }
  .page-back:hover { color: ${COLORS.text}; }

  .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  .glowing-ring {
    box-shadow: 0 0 0 1px rgba(124,58,237,0.4), 0 0 20px rgba(124,58,237,0.15);
  }

  .not-found-number {
    font-family: 'Syne', sans-serif; font-size: 120px; font-weight: 800;
    background: linear-gradient(135deg, ${COLORS.purple}, ${COLORS.amber});
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1; letter-spacing: -4px;
  }
`;

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BTCUSD // EMA100 Breakout Backtester</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#0c0a06;
    --panel:#151109;
    --panel-2:#1c160c;
    --amber:#ffb000;
    --amber-dim:#8a5f00;
    --amber-faint:#4a3a10;
    --green:#3ddc84;
    --red:#ff5a5a;
    --text:#e8dcc0;
    --text-dim:#a9987a;
  }
  *{box-sizing:border-box;}
  body{
    margin:0;
    background:var(--bg);
    background-image:
      repeating-linear-gradient(0deg, rgba(255,176,0,0.025) 0px, rgba(255,176,0,0.025) 1px, transparent 1px, transparent 3px);
    color:var(--text);
    font-family:'JetBrains Mono', monospace;
    padding:28px 20px 80px;
    min-height:100vh;
  }
  .wrap{max-width:1180px;margin:0 auto;}
  header{
    border-bottom:1px solid var(--amber-faint);
    padding-bottom:16px;
    margin-bottom:24px;
    display:flex;
    justify-content:space-between;
    align-items:baseline;
    flex-wrap:wrap;
    gap:8px;
  }
  header h1{
    font-family:'IBM Plex Mono', monospace;
    font-size:20px;
    letter-spacing:0.5px;
    color:var(--amber);
    margin:0;
    font-weight:600;
  }
  header h1 span{color:var(--text-dim); font-weight:400;}
  .status-line{
    font-size:12px;
    color:var(--amber-dim);
  }
  .status-line .dot{
    display:inline-block;width:7px;height:7px;background:var(--green);
    border-radius:50%;margin-right:6px;
    box-shadow:0 0 6px var(--green);
    animation:blink 1.6s infinite;
  }
  @keyframes blink{0%,60%{opacity:1;}80%{opacity:0.2;}100%{opacity:1;}}

  .panel{
    background:var(--panel);
    border:1px solid var(--amber-faint);
    padding:18px 20px;
    margin-bottom:20px;
  }
  .panel-title{
    font-size:11px;
    text-transform:uppercase;
    letter-spacing:1.5px;
    color:var(--amber-dim);
    margin:0 0 14px 0;
    border-bottom:1px solid var(--amber-faint);
    padding-bottom:8px;
  }
  .grid{
    display:grid;
    grid-template-columns:repeat(auto-fit, minmax(160px,1fr));
    gap:14px;
  }
  label{
    display:block;
    font-size:11px;
    color:var(--text-dim);
    margin-bottom:5px;
    text-transform:uppercase;
    letter-spacing:0.5px;
  }
  input[type=text], input[type=number], input[type=date]{
    width:100%;
    background:var(--panel-2);
    border:1px solid var(--amber-faint);
    color:var(--text);
    padding:8px 9px;
    font-family:'JetBrains Mono', monospace;
    font-size:13px;
  }
  input:focus{outline:1px solid var(--amber); border-color:var(--amber);}
  button{
    background:var(--amber);
    color:#1a1204;
    border:none;
    font-family:'IBM Plex Mono', monospace;
    font-weight:600;
    font-size:13px;
    letter-spacing:0.5px;
    padding:11px 22px;
    cursor:pointer;
    text-transform:uppercase;
  }
  button:hover{background:#ffc540;}
  button:disabled{background:var(--amber-dim); cursor:not-allowed; color:#3a2c00;}
  button.secondary{
    background:transparent;
    border:1px solid var(--amber-dim);
    color:var(--amber-dim);
  }
  button.secondary:hover{border-color:var(--amber); color:var(--amber);}

  .run-row{display:flex; gap:10px; align-items:center; margin-top:18px; flex-wrap:wrap;}
  .progress-outer{
    flex:1; min-width:200px;
    height:8px; background:var(--panel-2); border:1px solid var(--amber-faint);
  }
  .progress-inner{height:100%; width:0%; background:var(--amber); transition:width 0.15s linear;}
  .progress-text{font-size:12px; color:var(--text-dim); min-width:220px;}

  #error-box{
    display:none;
    background:#2a0e0e; border:1px solid var(--red); color:#ffb3b3;
    padding:12px 14px; font-size:12px; margin-top:14px; line-height:1.5;
  }

  .stats-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit, minmax(150px,1fr));
    gap:1px;
    background:var(--amber-faint);
    border:1px solid var(--amber-faint);
  }
  .stat-cell{
    background:var(--panel);
    padding:14px 16px;
  }
  .stat-cell .label{font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;}
  .stat-cell .value{font-family:'IBM Plex Mono', monospace; font-size:22px; font-weight:600; color:var(--text);}
  .stat-cell .value.pos{color:var(--green);}
  .stat-cell .value.neg{color:var(--red);}
  .stat-cell .value.amber{color:var(--amber);}

  #equity-canvas{width:100%; height:280px; display:block; background:var(--panel-2); border:1px solid var(--amber-faint);}

  table{width:100%; border-collapse:collapse; font-size:12px;}
  th{
    text-align:left; color:var(--amber-dim); text-transform:uppercase; font-size:10px;
    letter-spacing:0.5px; padding:8px 10px; border-bottom:1px solid var(--amber-faint);
    position:sticky; top:0; background:var(--panel);
  }
  td{padding:7px 10px; border-bottom:1px solid #241c0f; color:var(--text-dim);}
  tr:hover td{background:var(--panel-2); color:var(--text);}
  .tag-long{color:var(--green);}
  .tag-short{color:var(--red);}
  .tag-tp{color:var(--green); font-weight:600;}
  .tag-sl{color:var(--red); font-weight:600;}
  #trade-log-wrap{max-height:420px; overflow-y:auto; border:1px solid var(--amber-faint);}

  .hint{font-size:11px; color:var(--text-dim); margin-top:10px; line-height:1.6;}
  .hint b{color:var(--amber-dim);}
  footer{text-align:center; font-size:11px; color:var(--amber-faint); margin-top:30px;}
</style>
</head>
<body>
<div class="wrap">

  <header>
    <h1>BTCUSD<span> // EMA100 RECLAIM-BREAKOUT BACKTESTER</span></h1>
    <div class="status-line"><span class="dot"></span>DATA SOURCE: DELTA EXCHANGE API</div>
  </header>

  <div class="panel">
    <p class="panel-title">01 &nbsp;// &nbsp;Configuration</p>
    <div class="grid">
      <div>
        <label>Symbol</label>
        <input type="text" id="symbol" value="BTCUSD">
      </div>
      <div>
        <label>Resolution</label>
        <input type="text" id="resolution" value="5m" disabled>
      </div>
      <div>
        <label>Start Date</label>
        <input type="date" id="startDate">
      </div>
      <div>
        <label>End Date</label>
        <input type="date" id="endDate">
      </div>
      <div>
        <label>EMA Length</label>
        <input type="number" id="emaLen" value="100">
      </div>
      <div>
        <label>Slope Lookback (bars)</label>
        <input type="number" id="slopeLookback" value="3">
      </div>
      <div>
        <label>Risk:Reward Ratio</label>
        <input type="number" id="rr" value="3" step="0.5">
      </div>
      <div>
        <label>Risk per Trade (%)</label>
        <input type="number" id="riskPct" value="1" step="0.1">
      </div>
      <div>
        <label>Starting Capital ($)</label>
        <input type="number" id="startCapital" value="10000">
      </div>
      <div>
        <label>Broker Charge per Side (%)</label>
        <input type="number" id="commissionPct" value="0.05" step="0.01">
      </div>
      <div>
        <label>GST on Broker Charge (%)</label>
        <input type="number" id="gstPct" value="18" step="0.5">
      </div>
      <div>
        <label>Max Consecutive Losses / Day</label>
        <input type="number" id="maxLossesPerDay" value="2" step="1" min="1">
      </div>
      <div>
        <label>Minimum Stop Distance (%)</label>
        <input type="number" id="minStopPct" value="0.30" step="0.05" min="0">
      </div>
      <div>
        <label>Maximum Effective Leverage</label>
        <input type="number" id="maxLeverage" value="10" step="1" min="1">
      </div>
      <div>
        <label>Maximum Fees as % of Risk</label>
        <input type="number" id="maxFeeRiskPct" value="20" step="1" min="0">
      </div>
    </div>

    <div class="run-row">
      <button id="runBtn">Run Backtest</button>
      <button class="secondary" id="cancelBtn" disabled>Cancel</button>
      <div class="progress-outer"><div class="progress-inner" id="progressBar"></div></div>
      <div class="progress-text" id="progressText">Idle — configure and run.</div>
    </div>
    <div id="error-box"></div>
    <p class="hint">
      Fetches candles in 2,000-bar chunks (Delta Exchange's per-request cap) from <b>api.india.delta.exchange</b>,
      falling back to <b>api.delta.exchange</b> if the first is unreachable. 5 years of 5m data is ~260 requests —
      this can take a few minutes. If every request fails, your browser is likely blocking the request via CORS;
      try a different network, a CORS-friendly proxy, or run this file through a local dev server instead of opening it directly as a file.
      <br><br>
      <b>Charges:</b> broker charge is applied on both the entry and exit leg of every trade; GST is then applied on top of that
      broker charge (as per India's tax treatment of brokerage). All return/drawdown/equity figures below are <b>net of both</b>.
      <br><br>
      <b>Daily loss limit:</b> after a losing trade, the next trade is still allowed. If that next trade also loses
      (i.e. consecutive losses reach the threshold set above), no further trades are taken for the rest of that calendar day.
      A winning trade resets the consecutive-loss count back to zero, and the count also resets automatically at the start of each new day.

      <br><br>
      <b>Fee guardrails:</b> trades are skipped if the signal-candle stop is tighter than the minimum stop percentage,
      if the risk-based position would require more than the maximum effective leverage, or if estimated entry+exit
      broker charges plus GST would exceed the configured percentage of the planned 1R risk amount.

      <br><br>
      <b>Important:</b> the Results panel now records the exact RR, risk %, fee, GST, minimum stop,
      leverage cap and maximum fee/risk settings used in that backtest so different runs cannot be confused.
    </p>
  </div>

  <div class="panel" id="results-panel" style="display:none;">
    <p class="panel-title">02 &nbsp;// &nbsp;Results</p>
    <div class="stats-grid" id="statsGrid"></div>
  </div>

  <div class="panel" id="equity-panel" style="display:none;">
    <p class="panel-title">03 &nbsp;// &nbsp;Equity Curve</p>
    <canvas id="equity-canvas"></canvas>
  </div>

  <div class="panel" id="log-panel" style="display:none;">
    <p class="panel-title">04 &nbsp;// &nbsp;Trade Log</p>
    <div id="trade-log-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th><th>Dir</th><th>Entry Time</th><th>Entry</th><th>SL</th><th>TP</th>
            <th>Exit Time</th><th>Exit</th><th>Result</th><th>Gross R</th><th>Net R</th><th>Stop %</th><th>Eff. Lev.</th><th>Fee/Risk %</th><th>Gross P&L</th><th>Charges</th><th>Net P&L</th><th>Equity</th><th>Net Profit (cum.)</th>
          </tr>
        </thead>
        <tbody id="tradeLogBody"></tbody>
      </table>
    </div>
  </div>

  <footer>EMA100 RECLAIM/REJECTION BREAKOUT &nbsp;·&nbsp; ENTRY = SIGNAL CANDLE HIGH/LOW BREAK &nbsp;·&nbsp; SL = SIGNAL CANDLE EXTREME &nbsp;·&nbsp; ONE POSITION AT A TIME</footer>
</div>

<script>
// ============================================================
// DATE DEFAULTS: last 5 years
// ============================================================
const todayStr = new Date().toISOString().slice(0,10);
const fiveYearsAgo = new Date();
fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
document.getElementById('endDate').value = todayStr;
document.getElementById('startDate').value = fiveYearsAgo.toISOString().slice(0,10);

let cancelRequested = false;

// ============================================================
// DATA FETCH: Delta Exchange history/candles, paginated
// ============================================================
async function fetchCandles(symbol, resolution, startUnix, endUnix, onProgress) {
  const chunkSeconds = 2000 * 5 * 60; // 2000 candles * 5min
  const bases = ['https://api.india.delta.exchange', 'https://api.delta.exchange'];
  let candles = [];
  let cursor = startUnix;
  const totalRange = Math.max(1, endUnix - startUnix);

  while (cursor < endUnix) {
    if (cancelRequested) throw new Error('Cancelled by user.');
    const chunkEnd = Math.min(cursor + chunkSeconds, endUnix);
    let success = false;
    let lastErr = null;

    for (const base of bases) {
      for (let attempt = 0; attempt < 2 && !success; attempt++) {
        try {
          const url = `${base}/v2/history/candles?resolution=${resolution}&symbol=${symbol}&start=${cursor}&end=${chunkEnd}`;
          const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data && Array.isArray(data.result)) {
            candles.push(...data.result);
            success = true;
          } else {
            throw new Error('Unexpected response shape');
          }
        } catch (e) {
          lastErr = e;
          await new Promise(r => setTimeout(r, 300));
        }
      }
      if (success) break;
    }

    if (!success) {
      throw new Error(
        `Failed to fetch candles for range ${new Date(cursor*1000).toISOString()} → ${new Date(chunkEnd*1000).toISOString()}. ` +
        `Last error: ${lastErr ? lastErr.message : 'unknown'}. This is usually a CORS or rate-limit block from the browser.`
      );
    }

    const pct = Math.min(100, ((chunkEnd - startUnix) / totalRange) * 100);
    onProgress(pct, candles.length);
    cursor = chunkEnd + 1;
    await new Promise(r => setTimeout(r, 180)); // be polite to the API
  }

  candles.sort((a, b) => a.time - b.time);
  const seen = new Set();
  const deduped = [];
  for (const c of candles) {
    if (!seen.has(c.time)) { seen.add(c.time); deduped.push(c); }
  }
  return deduped;
}

// ============================================================
// EMA
// ============================================================
function computeEMA(closes, length) {
  const k = 2 / (length + 1);
  const ema = new Array(closes.length).fill(null);
  if (closes.length < length) return ema;
  let sum = 0;
  for (let i = 0; i < length; i++) sum += closes[i];
  ema[length - 1] = sum / length;
  for (let i = length; i < closes.length; i++) {
    ema[i] = closes[i] * k + ema[i - 1] * (1 - k);
  }
  return ema;
}

// ============================================================
// STRATEGY SIMULATION (mirrors the Pine indicator logic exactly)
// ============================================================
function runBacktest(candles, p) {
  const closes = candles.map(c => c.close);
  const ema = computeEMA(closes, p.emaLen);
  const warmup = p.emaLen + p.slopeLookback + 2;

  let equity = p.startCapital;
  let peak = p.startCapital;
  let maxDD = 0;

  const equityCurve = [{ time: candles[Math.min(warmup, candles.length-1)] ? candles[warmup].time : candles[0].time, equity }];
  const trades = [];

  let pendingBuyTrigger = null, pendingBuySL = null;
  let pendingSellTrigger = null, pendingSellSL = null;
  let inTrade = false, tradeDir = null, entryPrice = null, slPrice = null, tpPrice = null, entryTime = null;

  let currentDay = null;
  let dailyLossStreak = 0;
  let dayBlocked = false;
  let tradesSkippedDueToLimit = 0;
  let tradesSkippedTightStop = 0;
  let tradesSkippedLeverage = 0;
  let tradesSkippedFees = 0;

  for (let i = warmup; i < candles.length; i++) {
    const c = candles[i];

    // --- Day rollover: reset the consecutive-loss streak and clear stale pending signals ---
    const day = Math.floor(c.time / 86400);
    if (day !== currentDay) {
      currentDay = day;
      dailyLossStreak = 0;
      dayBlocked = false;
      if (!inTrade) {
        pendingBuyTrigger = null; pendingBuySL = null;
        pendingSellTrigger = null; pendingSellSL = null;
      }
    }

    const e = ema[i];
    const ePrev = ema[i - p.slopeLookback];
    if (e == null || ePrev == null) continue;

    const trendUp = e > ePrev;
    const trendDown = e < ePrev;

    const buyPatternA = c.open < e && c.close > e;
    const buyPatternB = c.open > e && c.close > e && c.low < e;
    const buySignalCandle = trendUp && (buyPatternA || buyPatternB);

    const sellPatternA = c.open > e && c.close < e;
    const sellPatternB = c.open < e && c.close < e && c.high > e;
    const sellSignalCandle = trendDown && (sellPatternA || sellPatternB);

    if (!inTrade && !dayBlocked) {
      if (buySignalCandle) {
        pendingBuyTrigger = c.high; pendingBuySL = c.low;
        pendingSellTrigger = null; pendingSellSL = null;
      }
      if (sellSignalCandle) {
        pendingSellTrigger = c.low; pendingSellSL = c.high;
        pendingBuyTrigger = null; pendingBuySL = null;
      }
    } else if (!inTrade && dayBlocked && (buySignalCandle || sellSignalCandle)) {
      tradesSkippedDueToLimit++;
    }

    if (!inTrade && !dayBlocked && pendingBuyTrigger != null && c.high > pendingBuyTrigger) {
      const candidateEntry = pendingBuyTrigger;
      const candidateSL = pendingBuySL;
      const stopDistance = Math.abs(candidateEntry - candidateSL);
      const stopPct = candidateEntry > 0 ? (stopDistance / candidateEntry) * 100 : 0;
      const riskAmount = equity * (p.riskPct / 100);
      const riskBasedQty = stopDistance > 0 ? riskAmount / stopDistance : 0;
      const riskBasedNotional = riskBasedQty * candidateEntry;
      const effectiveLeverage = equity > 0 ? riskBasedNotional / equity : Infinity;
      const candidateTP = candidateEntry + stopDistance * p.rr;
      const estimatedEntryNotional = riskBasedNotional;
      const estimatedExitNotional = riskBasedQty * candidateTP;
      const estimatedBrokerCharge = (estimatedEntryNotional + estimatedExitNotional) * (p.commissionPct / 100);
      const estimatedGST = estimatedBrokerCharge * (p.gstPct / 100);
      const estimatedTotalCharges = estimatedBrokerCharge + estimatedGST;
      const feeRiskPct = riskAmount > 0 ? (estimatedTotalCharges / riskAmount) * 100 : Infinity;

      if (stopPct < p.minStopPct) {
        tradesSkippedTightStop++;
      } else if (effectiveLeverage > p.maxLeverage) {
        tradesSkippedLeverage++;
      } else if (feeRiskPct > p.maxFeeRiskPct) {
        tradesSkippedFees++;
      } else {
        inTrade = true; tradeDir = 'long';
        entryPrice = candidateEntry; slPrice = candidateSL;
        tpPrice = candidateTP;
        entryTime = c.time;
      }

      pendingBuyTrigger = null; pendingBuySL = null;
    } else if (!inTrade && !dayBlocked && pendingSellTrigger != null && c.low < pendingSellTrigger) {
      const candidateEntry = pendingSellTrigger;
      const candidateSL = pendingSellSL;
      const stopDistance = Math.abs(candidateEntry - candidateSL);
      const stopPct = candidateEntry > 0 ? (stopDistance / candidateEntry) * 100 : 0;
      const riskAmount = equity * (p.riskPct / 100);
      const riskBasedQty = stopDistance > 0 ? riskAmount / stopDistance : 0;
      const riskBasedNotional = riskBasedQty * candidateEntry;
      const effectiveLeverage = equity > 0 ? riskBasedNotional / equity : Infinity;
      const candidateTP = candidateEntry - stopDistance * p.rr;
      const estimatedEntryNotional = riskBasedNotional;
      const estimatedExitNotional = riskBasedQty * candidateTP;
      const estimatedBrokerCharge = (estimatedEntryNotional + estimatedExitNotional) * (p.commissionPct / 100);
      const estimatedGST = estimatedBrokerCharge * (p.gstPct / 100);
      const estimatedTotalCharges = estimatedBrokerCharge + estimatedGST;
      const feeRiskPct = riskAmount > 0 ? (estimatedTotalCharges / riskAmount) * 100 : Infinity;

      if (stopPct < p.minStopPct) {
        tradesSkippedTightStop++;
      } else if (effectiveLeverage > p.maxLeverage) {
        tradesSkippedLeverage++;
      } else if (feeRiskPct > p.maxFeeRiskPct) {
        tradesSkippedFees++;
      } else {
        inTrade = true; tradeDir = 'short';
        entryPrice = candidateEntry; slPrice = candidateSL;
        tpPrice = candidateTP;
        entryTime = c.time;
      }

      pendingSellTrigger = null; pendingSellSL = null;
    }

    if (inTrade) {
      let exitReason = null, exitPrice = null;
      if (tradeDir === 'long') {
        if (c.low <= slPrice) { exitReason = 'SL'; exitPrice = slPrice; }
        else if (c.high >= tpPrice) { exitReason = 'TP'; exitPrice = tpPrice; }
      } else {
        if (c.high >= slPrice) { exitReason = 'SL'; exitPrice = slPrice; }
        else if (c.low <= tpPrice) { exitReason = 'TP'; exitPrice = tpPrice; }
      }
      if (exitReason) {
        const rMultiple = exitReason === 'TP' ? p.rr : -1;
        const riskAmount = equity * (p.riskPct / 100);
        const grossPnL = rMultiple * riskAmount;

        // Notional traded on each leg, sized off the risk amount and the SL distance —
        // this is what broker charges are actually levied on (entry leg + exit leg).
        const slDistance = Math.abs(entryPrice - slPrice);
        const positionQty = slDistance > 0 ? riskAmount / slDistance : 0;
        const entryNotional = positionQty * entryPrice;
        const exitNotional = positionQty * exitPrice;

        const brokerCharge = (entryNotional + exitNotional) * (p.commissionPct / 100);
        const gstCharge = brokerCharge * (p.gstPct / 100);
        const totalCharges = brokerCharge + gstCharge;

        const netPnL = grossPnL - totalCharges;
        equity += netPnL;
        peak = Math.max(peak, equity);
        const dd = peak > 0 ? (peak - equity) / peak * 100 : 0;
        if (dd > maxDD) maxDD = dd;

        // --- Update the daily consecutive-loss streak ---
        if (exitReason === 'SL') {
          dailyLossStreak++;
          if (dailyLossStreak >= p.maxLossesPerDay) {
            dayBlocked = true;
          }
        } else {
          dailyLossStreak = 0; // a win resets the streak, trading continues
        }

        const netR = riskAmount > 0 ? netPnL / riskAmount : 0;
        const stopPct = entryPrice > 0 ? (slDistance / entryPrice) * 100 : 0;
        const effectiveLeverage = equity > 0 ? entryNotional / Math.max(equity - netPnL, 0.0000001) : 0;
        const feeRiskPct = riskAmount > 0 ? (totalCharges / riskAmount) * 100 : 0;

        trades.push({
          direction: tradeDir, entryTime, entryPrice, slPrice, tpPrice,
          exitTime: c.time, exitPrice, exitReason, rMultiple, netR,
          grossPnL, brokerCharge, gstCharge, totalCharges, netPnL,
          stopPct, effectiveLeverage, feeRiskPct,
          equityAfter: equity, cumulativeNetProfit: equity - p.startCapital
        });
        equityCurve.push({ time: c.time, equity });
        inTrade = false; tradeDir = null;
      }
    }
  }

  const wins = trades.filter(t => t.exitReason === 'TP');
  const losses = trades.filter(t => t.exitReason === 'SL');
  const winRate = trades.length ? (wins.length / trades.length * 100) : 0;
  const totalReturn = (equity - p.startCapital) / p.startCapital * 100;
  const grossProfit = wins.reduce((s, t) => s + Math.max(t.netPnL, 0), 0);
  const grossLoss = Math.abs(losses.reduce((s, t) => s + Math.min(t.netPnL, 0), 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? Infinity : 0);
  const grossAvgR = trades.length ? trades.reduce((s, t) => s + t.rMultiple, 0) / trades.length : 0;
  const avgR = trades.length ? trades.reduce((s, t) => s + t.netR, 0) / trades.length : 0;
  const longTrades = trades.filter(t => t.direction === 'long');
  const shortTrades = trades.filter(t => t.direction === 'short');
  const totalGrossPnL = trades.reduce((s, t) => s + t.grossPnL, 0);
  const totalBrokerCharges = trades.reduce((s, t) => s + t.brokerCharge, 0);
  const totalGST = trades.reduce((s, t) => s + t.gstCharge, 0);
  const totalCharges = totalBrokerCharges + totalGST;
  const netProfit = equity - p.startCapital;

  return {
    trades, equityCurve,
    stats: {
      totalTrades: trades.length,
      wins: wins.length,
      losses: losses.length,
      winRate, totalReturn, maxDD, profitFactor, avgR,
      finalEquity: equity,
      longCount: longTrades.length,
      shortCount: shortTrades.length,
      longWinRate: longTrades.length ? longTrades.filter(t => t.exitReason === 'TP').length / longTrades.length * 100 : 0,
      shortWinRate: shortTrades.length ? shortTrades.filter(t => t.exitReason === 'TP').length / shortTrades.length * 100 : 0,
      totalGrossPnL, totalBrokerCharges, totalGST, totalCharges, netProfit,
      grossAvgR,
      rrUsed: p.rr,
      riskPctUsed: p.riskPct,
      commissionPctUsed: p.commissionPct,
      gstPctUsed: p.gstPct,
      minStopPctUsed: p.minStopPct,
      maxLeverageUsed: p.maxLeverage,
      maxFeeRiskPctUsed: p.maxFeeRiskPct,
      maxLossesPerDayUsed: p.maxLossesPerDay,
      tradesSkippedDueToLimit,
      tradesSkippedTightStop,
      tradesSkippedLeverage,
      tradesSkippedFees,
    }
  };
}

// ============================================================
// RENDERING
// ============================================================
function fmt(n, d=2) { return Number(n).toLocaleString(undefined, {minimumFractionDigits:d, maximumFractionDigits:d}); }
function fmtDate(unix) { return new Date(unix*1000).toISOString().replace('T',' ').slice(0,16); }

function renderStats(stats) {
  const grid = document.getElementById('statsGrid');
  const cells = [
    ['RR Used', '1:'+fmt(stats.rrUsed,2), 'amber'],
    ['Risk / Trade', fmt(stats.riskPctUsed,2)+'%', ''],
    ['Broker Fee / Side', fmt(stats.commissionPctUsed,3)+'%', ''],
    ['GST on Fee', fmt(stats.gstPctUsed,1)+'%', ''],
    ['Min Stop', fmt(stats.minStopPctUsed,2)+'%', ''],
    ['Max Effective Leverage', fmt(stats.maxLeverageUsed,2)+'x', ''],
    ['Max Fee / Risk', fmt(stats.maxFeeRiskPctUsed,1)+'%', ''],
    ['Daily Loss Limit', stats.maxLossesPerDayUsed, ''],
    ['Total Trades', stats.totalTrades, ''],
    ['Win Rate', fmt(stats.winRate,1)+'%', stats.winRate>=50?'pos':'neg'],
    ['Total Return', (stats.totalReturn>=0?'+':'')+fmt(stats.totalReturn,2)+'%', stats.totalReturn>=0?'pos':'neg'],
    ['Max Drawdown', '-'+fmt(stats.maxDD,2)+'%', 'neg'],
    ['Profit Factor', stats.profitFactor===Infinity?'∞':fmt(stats.profitFactor,2), stats.profitFactor>=1.5?'pos':(stats.profitFactor<1?'neg':'amber')],
    ['Avg Net R / Trade', (stats.avgR>=0?'+':'')+fmt(stats.avgR,2)+'R', stats.avgR>=0?'pos':'neg'],
    ['Avg Gross R / Trade', (stats.grossAvgR>=0?'+':'')+fmt(stats.grossAvgR,2)+'R', stats.grossAvgR>=0?'pos':'neg'],
    ['Wins / Losses', `${stats.wins} / ${stats.losses}`, ''],
    ['Final Equity', '$'+fmt(stats.finalEquity,2), stats.totalReturn>=0?'pos':'neg'],
    ['Long Trades', `${stats.longCount} (${fmt(stats.longWinRate,0)}% win)`, ''],
    ['Short Trades', `${stats.shortCount} (${fmt(stats.shortWinRate,0)}% win)`, ''],
    ['Gross P&L (pre-charges)', '$'+fmt(stats.totalGrossPnL,2), stats.totalGrossPnL>=0?'pos':'neg'],
    ['Broker Charges Paid', '-$'+fmt(stats.totalBrokerCharges,2), 'neg'],
    ['GST Paid', '-$'+fmt(stats.totalGST,2), 'neg'],
    ['Net Profit (after charges)', (stats.netProfit>=0?'+':'-')+'$'+fmt(Math.abs(stats.netProfit),2), stats.netProfit>=0?'pos':'neg'],
    ['Setups Skipped (Daily Limit)', stats.tradesSkippedDueToLimit, 'amber'],
    ['Skipped: Stop Too Tight', stats.tradesSkippedTightStop, 'amber'],
    ['Skipped: Leverage Too High', stats.tradesSkippedLeverage, 'amber'],
    ['Skipped: Fees Too High', stats.tradesSkippedFees, 'amber'],
  ];
  grid.innerHTML = cells.map(([label,val,cls]) =>
    `<div class="stat-cell"><div class="label">${label}</div><div class="value ${cls}">${val}</div></div>`
  ).join('');
  document.getElementById('results-panel').style.display = 'block';
}

function renderEquityCurve(equityCurve) {
  const canvas = document.getElementById('equity-canvas');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = 280 * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = rect.width, H = 280;
  ctx.clearRect(0,0,W,H);

  if (equityCurve.length < 2) return;
  const values = equityCurve.map(e => e.equity);
  const min = Math.min(...values), max = Math.max(...values);
  const pad = 30;
  const range = (max - min) || 1;

  // grid lines
  ctx.strokeStyle = 'rgba(255,176,0,0.12)';
  ctx.lineWidth = 1;
  for (let i=0;i<=4;i++){
    const y = pad + (H-2*pad) * (i/4);
    ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(W-10,y); ctx.stroke();
  }

  // equity line with glow
  ctx.shadowColor = '#ffb000';
  ctx.shadowBlur = 6;
  ctx.strokeStyle = '#ffb000';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  equityCurve.forEach((pt, idx) => {
    const x = pad + (W - pad - 10) * (idx/(equityCurve.length-1));
    const y = H - pad - (H-2*pad) * ((pt.equity - min)/range);
    if (idx===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.stroke();
  ctx.shadowBlur = 0;

  // labels
  ctx.fillStyle = '#a9987a';
  ctx.font = '11px JetBrains Mono';
  ctx.fillText('$'+fmt(max,0), 4, pad+4);
  ctx.fillText('$'+fmt(min,0), 4, H-pad+4);
}

function renderTradeLog(trades) {
  const body = document.getElementById('tradeLogBody');
  body.innerHTML = trades.map((t, idx) => `
    <tr>
      <td>${idx+1}</td>
      <td class="tag-${t.direction}">${t.direction.toUpperCase()}</td>
      <td>${fmtDate(t.entryTime)}</td>
      <td>${fmt(t.entryPrice,1)}</td>
      <td>${fmt(t.slPrice,1)}</td>
      <td>${fmt(t.tpPrice,1)}</td>
      <td>${fmtDate(t.exitTime)}</td>
      <td>${fmt(t.exitPrice,1)}</td>
      <td class="tag-${t.exitReason.toLowerCase()}">${t.exitReason}</td>
      <td>${t.rMultiple>=0?'+':''}${fmt(t.rMultiple,2)}R</td>
      <td class="${t.netR>=0?'tag-tp':'tag-sl'}">${t.netR>=0?'+':''}${fmt(t.netR,2)}R</td>
      <td>${fmt(t.stopPct,3)}%</td>
      <td>${fmt(t.effectiveLeverage,2)}x</td>
      <td>${fmt(t.feeRiskPct,1)}%</td>
      <td class="${t.grossPnL>=0?'tag-tp':'tag-sl'}">${t.grossPnL>=0?'+':''}$${fmt(t.grossPnL,2)}</td>
      <td>-$${fmt(t.totalCharges,2)}</td>
      <td class="${t.netPnL>=0?'tag-tp':'tag-sl'}">${t.netPnL>=0?'+':''}$${fmt(t.netPnL,2)}</td>
      <td>$${fmt(t.equityAfter,2)}</td>
      <td class="${t.cumulativeNetProfit>=0?'tag-tp':'tag-sl'}">${t.cumulativeNetProfit>=0?'+':'-'}$${fmt(Math.abs(t.cumulativeNetProfit),2)}</td>
    </tr>
  `).join('');
  document.getElementById('log-panel').style.display = 'block';
}

function showError(msg) {
  const box = document.getElementById('error-box');
  box.style.display = 'block';
  box.textContent = msg;
}
function hideError() {
  document.getElementById('error-box').style.display = 'none';
}

// ============================================================
// MAIN
// ============================================================
document.getElementById('runBtn').addEventListener('click', async () => {
  hideError();
  cancelRequested = false;
  const runBtn = document.getElementById('runBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  runBtn.disabled = true;
  cancelBtn.disabled = false;

  document.getElementById('results-panel').style.display = 'none';
  document.getElementById('equity-panel').style.display = 'none';
  document.getElementById('log-panel').style.display = 'none';

  const symbol = document.getElementById('symbol').value.trim();
  const resolution = document.getElementById('resolution').value;
  const startUnix = Math.floor(new Date(document.getElementById('startDate').value + 'T00:00:00Z').getTime()/1000);
  const endUnix = Math.floor(new Date(document.getElementById('endDate').value + 'T23:59:59Z').getTime()/1000);

  const params = {
    emaLen: parseInt(document.getElementById('emaLen').value, 10),
    slopeLookback: parseInt(document.getElementById('slopeLookback').value, 10),
    rr: parseFloat(document.getElementById('rr').value),
    riskPct: parseFloat(document.getElementById('riskPct').value),
    startCapital: parseFloat(document.getElementById('startCapital').value),
    commissionPct: parseFloat(document.getElementById('commissionPct').value),
    gstPct: parseFloat(document.getElementById('gstPct').value),
    maxLossesPerDay: parseInt(document.getElementById('maxLossesPerDay').value, 10),
    minStopPct: parseFloat(document.getElementById('minStopPct').value),
    maxLeverage: parseFloat(document.getElementById('maxLeverage').value),
    maxFeeRiskPct: parseFloat(document.getElementById('maxFeeRiskPct').value),
  };

  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');

  try {
    progressText.textContent = 'Fetching candles...';
    const candles = await fetchCandles(symbol, resolution, startUnix, endUnix, (pct, count) => {
      progressBar.style.width = pct.toFixed(1) + '%';
      progressText.textContent = `Fetching... ${pct.toFixed(1)}% (${count.toLocaleString()} candles loaded)`;
    });

    if (candles.length < params.emaLen + params.slopeLookback + 5) {
      throw new Error(`Only ${candles.length} candles returned — not enough for a ${params.emaLen}-period EMA. Try a wider date range.`);
    }

    progressText.textContent = `Simulating strategy over ${candles.length.toLocaleString()} candles...`;
    await new Promise(r => setTimeout(r, 30)); // let UI paint

    const result = runBacktest(candles, params);

    renderStats(result.stats);
    document.getElementById('equity-panel').style.display = 'block';
    renderEquityCurve(result.equityCurve);
    renderTradeLog(result.trades);

    progressBar.style.width = '100%';
    progressText.textContent = `Done. ${candles.length.toLocaleString()} candles, ${result.trades.length} trades. RR 1:${params.rr} · Risk ${params.riskPct}% · Max Lev ${params.maxLeverage}x · Min Stop ${params.minStopPct}% · Max Fee/Risk ${params.maxFeeRiskPct}%`;
  } catch (err) {
    showError(err.message || String(err));
    progressText.textContent = 'Failed — see error above.';
  } finally {
    runBtn.disabled = false;
    cancelBtn.disabled = true;
  }
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  cancelRequested = true;
});
</script>
</body>
</html>

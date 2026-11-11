/* Shared cake-cost maths for the back office (Cake costing, Labor & time, Orders).
   Total cost = fixed cost per cake + this cake's custom items + labor (time x hourly rate). */
window.GWC = (function () {
  "use strict";
  var KEY = "gwc-costing-v2";
  var num = function (v) { var n = parseFloat(v); return isFinite(n) ? n : 0; };
  var sum = function (list) { return (list || []).reduce(function (s, x) { return s + num(x.amount); }, 0); };
  function blank() { return { fixed: [], cakes: [], current: null, wage: "" }; }
  function load() {
    try { var raw = localStorage.getItem(KEY); if (raw) return Object.assign(blank(), JSON.parse(raw)); } catch (e) { /* work in memory */ }
    return blank();
  }
  function figures(state, c) {
    var fixed = sum(state.fixed), variable = sum(c.lines);
    var minutes = num(c.hours) * 60 + num(c.minutes), labor = minutes / 60 * num(state.wage);
    var cost = fixed + variable + labor, suggested = cost * (1 + num(c.markup) / 100);
    var actual = String(c.price == null ? "" : c.price).trim() !== "", price = actual ? num(c.price) : suggested;   // price used
    return { fixed: fixed, variable: variable, minutes: minutes, labor: labor, cost: cost, suggested: suggested, actual: actual,
             price: price, profit: price - cost, margin: price > 0 ? (price - cost) / price : null };
  }
  function timeText(minutes) {
    var m = Math.round(minutes), h = Math.floor(m / 60); m -= h * 60;
    return minutes > 0 ? (h ? h + " h " : "") + (m || !h ? m + " min" : "").trim() : "No time entered";
  }
  return { KEY: KEY, num: num, sum: sum, blank: blank, load: load, figures: figures, timeText: timeText };
})();

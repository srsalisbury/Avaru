// Race results table: reads the JSON in #av-results and fills the event page.
(function () {
  var data = JSON.parse(document.getElementById('av-results').textContent);
  var N = data.laps || 3;
  function parse(t) {
    if (t == null || t === '') return null;
    var m = String(t).trim().match(/^(?:(\d+):)?(\d+(?:\.\d+)?)(\**)$/);
    return m ? { v: Math.round(((+m[1] || 0) * 60 + parseFloat(m[2])) * 1000), mark: m[3] } : null;
  }
  function fmt(v) {
    if (v == null) return '—';
    var m = Math.floor(v / 60000), s = (v % 60000) / 1000;
    return m ? m + ':' + (s < 10 ? '0' : '') + s.toFixed(2) : s.toFixed(2);
  }
  function show(p) { return p ? fmt(p.v) : '—'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var head = '<tr><th scope="col">Pos</th><th scope="col">Pilot</th>';
  for (var h = 1; h <= N; h++) head += '<th scope="col" class="av-num">Lap ' + h + '</th>';
  document.querySelector('[data-ev-head]').innerHTML = head + '<th scope="col" class="av-num">Total</th><th scope="col" class="av-num">Gap</th></tr>';

  var rows = data.entries.map(function (e, i) {
    var laps = []; for (var k = 0; k < N; k++) laps.push(parse((e.laps || [])[k]));
    var out = e.status === 'DNF' || e.status === 'DNS';
    var total = out ? null : (e.total ? parse(e.total).v : (laps.every(Boolean) ? laps.reduce(function (a, b) { return a + b.v; }, 0) : null));
    var known = laps.filter(Boolean).map(function (x) { return x.v; });
    return { e: e, i: i, laps: laps, total: total, best: known.length ? Math.min.apply(null, known) : null, out: out };
  });
  var rank = { DNF: 1, DNS: 2 };
  rows.sort(function (a, b) {
    if (a.out || b.out) return (rank[a.e.status] || 0) - (rank[b.e.status] || 0) || a.i - b.i;
    if (a.e.pos && b.e.pos) return a.e.pos - b.e.pos;
    if (a.total != null && b.total != null) return a.total - b.total;
    if ((a.total == null) !== (b.total == null)) return a.total == null ? 1 : -1;
    return a.i - b.i;
  });
  var all = []; rows.forEach(function (r) { if (!r.out) r.laps.forEach(function (x) { if (x) all.push(x.v); }); });
  var fastest = all.length ? Math.min.apply(null, all) : null;
  var lead = rows.length && rows[0].total;
  var pending = !rows.some(function (r) { return r.total != null; });

  document.querySelector('[data-ev-rows]').innerHTML = rows.map(function (r, n) {
    var p = r.out ? r.e.status : (r.e.pos || n + 1);
    var pos = '<span class="av-ev-pos' + (p <= 3 ? ' p' + p : '') + '">' + (typeof p === 'number' ? p + (['st', 'nd', 'rd'][p - 1] || 'th') : p) + '</span>';
    var ours = r.e.team === 'Avaru';
    var flag = r.e.flag ? '<img class="av-ev-flag" src="assets/flags/' + esc(r.e.flag) + '.svg" alt="' + esc(r.e.country || r.e.flag.toUpperCase()) + '" title="' + esc(r.e.country || '') + '" width="20" height="14">' : '';
    var who = '<span class="av-ev-who">' + esc(r.e.pilot) + flag + (ours ? '<img class="av-ev-emblem" src="assets/avaru-emblem.svg" alt="Avaru Racing" title="Avaru Racing" width="16" height="18">' : '') + '</span>';
    var gap = (n === 0 || r.total == null || !lead) ? '—' : '+' + fmt(r.total - lead);
    var laps = r.laps.map(function (x, k) {
      var col = 2 + k % 3, c = 'av-num av-lap' + (col === 4 ? ' av-end' : '') + (x && !r.out && x.v === fastest ? ' av-fl' : (x && !r.out && x.v === r.best ? ' av-pb' : ''));
      return '<td class="' + c + '" style="grid-column:' + col + ';grid-row:' + (2 + Math.floor(k / 3)) + '" data-l="LAP ' + (k + 1) + '"><span>' + show(x) + '</span></td>';
    }).join('');
    return '<tr' + (ours ? ' class="av-ours"' : '') + '><td class="av-c-pos">' + pos + '</td><th scope="row" class="av-c-who">' + who + '</th>' + laps
      + '<td class="av-num av-c-total"><span class="av-total' + (!r.out && r.total == null ? ' av-none' : '') + '">' + (r.out ? r.e.status : fmt(r.total)) + '</span>' + (n && r.total != null ? '<span class="av-gap-m">' + gap + '</span>' : '') + '</td>'
      + '<td class="av-num av-c-gap av-gap">' + gap + '</td></tr>';
  }).join('');

  var win = rows[0], fl = null;
  rows.forEach(function (r) { if (!fl && !r.out && fastest != null && r.laps.some(function (x) { return x && x.v === fastest; })) fl = r; });
  document.querySelector('[data-ev-sum]').innerHTML =
    '<div><dt>Winner</dt><dd>' + (win ? esc(win.e.pilot) : '—') + (win && win.total != null ? '<small>' + fmt(win.total) + '</small>' : '') + '</dd></div>'
    + '<div><dt>Fastest lap</dt><dd>' + (fl ? fmt(fastest) + '<small>' + esc(fl.e.pilot) + '</small>' : 'Pending') + '</dd></div>'
    + '<div><dt>Pilots</dt><dd>' + (pending ? 'Pending' : rows.length) + '</dd></div>';
  document.querySelector('[data-ev-pending]').hidden = !pending;
})();

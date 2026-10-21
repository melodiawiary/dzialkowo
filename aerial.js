/* Działkowo - generator obrazów działek z lotu ptaka i schematów mapy ewidencyjnej (canvas).
   Obraz jest ilustracją poglądową, a nie zdjęciem konkretnej działki. */
(function () {
  "use strict";
  var cache = {};
  function rng(seed) { var a = seed >>> 0; return function () { a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mk(w, h) { var c = document.createElement("canvas"); c.width = w; c.height = h; return c; }

  // Ziarno i plamy (wspólne tekstury)
  var GRAIN, BLOTCH;
  function textures() {
    if (GRAIN) return;
    var r = rng(7);
    GRAIN = mk(160, 160); var g = GRAIN.getContext("2d"); var id = g.createImageData(160, 160);
    for (var i = 0; i < id.data.length; i += 4) { var v = 110 + r() * 60; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    g.putImageData(id, 0, 0);
    var small = mk(24, 24), s = small.getContext("2d"), sd = s.createImageData(24, 24);
    for (var j = 0; j < sd.data.length; j += 4) { var u = 90 + r() * 90; sd.data[j] = sd.data[j + 1] = sd.data[j + 2] = u; sd.data[j + 3] = 255; }
    s.putImageData(sd, 0, 0);
    BLOTCH = mk(384, 384); var b = BLOTCH.getContext("2d"); b.imageSmoothingEnabled = true; b.imageSmoothingQuality = "high"; b.drawImage(small, 0, 0, 384, 384);
  }

  var CROPS = [
    ["#7f9f4a", "#6f9040"], ["#8eaa52", "#7d9a46"], ["#a3a95c", "#929a50"], ["#c2ad62", "#b09c55"],
    ["#cdb877", "#bca868"], ["#9a8a5c", "#8a7a4f"], ["#6e8f47", "#5f803c"], ["#b8b571", "#a6a463"],
    ["#869d5b", "#778e4f"], ["#a39066", "#937f58"]
  ];
  var FOREST = ["#2e4a2a", "#355330", "#3d5c35", "#2a4426", "#44633a"];

  function split(r, x, y, w, h, out, min) {
    if ((w < min * 2 && h < min * 2) || out.length > 60) { out.push([x, y, w, h]); return; }
    var horiz = w > h ? false : true; if (Math.abs(w - h) < min * .5) horiz = r() > .5;
    var f = .3 + r() * .4;
    if (!horiz && w >= min * 2) { var a = w * f; split(r, x, y, a, h, out, min); split(r, x + a, y, w - a, h, out, min); }
    else if (h >= min * 2) { var b = h * f; split(r, x, y, w, b, out, min); split(r, x, y + b, w, h - b, out, min); }
    else out.push([x, y, w, h]);
  }

  function tree(ctx, x, y, rad, col, sun) {
    ctx.fillStyle = "rgba(10,18,8,.38)"; ctx.beginPath(); ctx.arc(x + rad * .45 * sun, y + rad * .5 * sun, rad * 1.02, 0, 6.283); ctx.fill();
    var g = ctx.createRadialGradient(x - rad * .35, y - rad * .35, rad * .1, x, y, rad);
    g.addColorStop(0, shade(col, 26)); g.addColorStop(.7, col); g.addColorStop(1, shade(col, -16));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.283); ctx.fill();
  }
  function shade(hex, amt) {
    var n = parseInt(hex.slice(1), 16), r = (n >> 16) + amt, g = (n >> 8 & 255) + amt, b = (n & 255) + amt;
    r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
    return "rgb(" + r + "," + g + "," + b + ")";
  }
  function blob(ctx, cx, cy, rx, ry, r, pts) {
    pts = pts || 14; ctx.beginPath();
    var arr = [];
    for (var i = 0; i < pts; i++) { var a = i / pts * 6.283, k = .78 + r() * .38; arr.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    for (var j = 0; j <= pts; j++) { var p = arr[j % pts], q = arr[(j + 1) % pts]; var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; if (j === 0) ctx.moveTo(mx, my); else ctx.quadraticCurveTo(p[0], p[1], mx, my); }
    ctx.closePath();
  }

  /* d: działka; opts: {zoom, label} */
  function render(d, W, H, opts) {
    opts = opts || {};
    var key = d.id + ":" + W + "x" + H + ":" + (opts.zoom || 1) + ":" + (opts.label || "");
    if (cache[key]) return cache[key];
    textures();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = mk(Math.round(W * dpr), Math.round(H * dpr)), ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    var r = rng(d.seed || d.id * 7919);
    var z = opts.zoom || 1;
    var ok = d.okolica || [], typ = d.typ;
    var sun = 1;

    // podłoże
    ctx.fillStyle = "#7d9450"; ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, H / 2); var ang = (r() - .5) * .9; ctx.rotate(ang); ctx.scale(z, z);
    var S = Math.max(W, H) * 1.5;
    var fields = []; split(r, -S / 2, -S / 2, S, S, fields, Math.max(W, H) * (typ === "rolna" ? .2 : .13));
    fields.forEach(function (f) {
      var cr = CROPS[Math.floor(r() * CROPS.length)];
      ctx.fillStyle = cr[0]; ctx.fillRect(f[0], f[1], f[2], f[3]);
      // rzędy upraw
      var vertical = r() > .5, step = 2.6 + r() * 2.4; ctx.fillStyle = cr[1];
      if (r() > .15) {
        if (vertical) for (var x = f[0]; x < f[0] + f[2]; x += step) ctx.fillRect(x, f[1], step * .42, f[3]);
        else for (var y = f[1]; y < f[1] + f[3]; y += step) ctx.fillRect(f[0], y, f[2], step * .42);
      }
      ctx.strokeStyle = "rgba(70,62,38,.35)"; ctx.lineWidth = 1.2; ctx.strokeRect(f[0] + .5, f[1] + .5, f[2] - 1, f[3] - 1);
      // miedze z drzewami
      if (r() < .22) { var n = Math.floor(f[2] / 7); for (var t = 0; t < n; t++) tree(ctx, f[0] + t * 7 + r() * 3, f[1] + r() * 2, 2.6 + r() * 2.4, FOREST[Math.floor(r() * 5)], sun); }
    });
    ctx.restore();

    // woda
    var hasWater = ok.indexOf("woda") >= 0 || ok.indexOf("morze") >= 0;
    if (hasWater) {
      var sea = ok.indexOf("morze") >= 0 && ok.indexOf("woda") < 0;
      ctx.save();
      if (sea) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H * .18); ctx.bezierCurveTo(W * .7, H * .3, W * .3, H * .1, 0, H * .26); ctx.closePath(); }
      else { var wx = r() > .5 ? W * .86 : W * .1, wy = H * (.12 + r() * .2); blob(ctx, wx, wy, W * (.26 + r() * .1), H * (.3 + r() * .1), r, 18); }
      ctx.fillStyle = "#c9c09a"; ctx.lineWidth = 7; ctx.strokeStyle = "#7f8a55"; ctx.stroke(); ctx.fill();
      var wg = ctx.createLinearGradient(0, 0, W, H); wg.addColorStop(0, "#2f5d6e"); wg.addColorStop(1, "#3e7383");
      ctx.fillStyle = wg; ctx.fill();
      ctx.globalAlpha = .18; ctx.strokeStyle = "#cfe4e8"; ctx.lineWidth = 2; ctx.stroke(); ctx.globalAlpha = 1;
      ctx.restore();
    }

    // las
    if (typ === "lesna") { ctx.fillStyle = "#33502d"; ctx.fillRect(0, 0, W, H * .78); }
    var forestN = typ === "lesna" ? Math.round(W * H / 90) : (ok.indexOf("las") >= 0 ? 170 : 26);
    var fx = r() > .5 ? 0 : W * .55, fw = typ === "lesna" ? W : W * .45, fy = typ === "lesna" ? 0 : (r() > .5 ? 0 : H * .55), fh = typ === "lesna" ? H : H * .45;
    for (var i = 0; i < forestN; i++) {
      var tx, ty;
      if (i < forestN * .85) { tx = fx + r() * fw; ty = fy + r() * fh; } else { tx = r() * W; ty = r() * H; }
      tree(ctx, tx, ty, (3.4 + r() * 4.6) * Math.sqrt(z), FOREST[Math.floor(r() * FOREST.length)], sun);
    }

    // droga
    var roadY = H * (.7 + r() * .14), bend = (r() - .5) * H * .25;
    var asph = d.dojazd === "asfalt", hard = d.dojazd === "utwardzona";
    ctx.save(); ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-20, roadY); ctx.bezierCurveTo(W * .35, roadY + bend, W * .65, roadY - bend, W + 20, roadY - bend * .4);
    var rw = (asph ? 11 : hard ? 9 : 6) * z;
    ctx.strokeStyle = "rgba(40,40,30,.35)"; ctx.lineWidth = rw + 4; ctx.stroke();
    ctx.strokeStyle = asph ? "#8b8c86" : hard ? "#b9ad8d" : "#b39f78"; ctx.lineWidth = rw; ctx.stroke();
    if (asph) { ctx.setLineDash([7, 9]); ctx.strokeStyle = "rgba(240,240,230,.7)"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
    function roadAt(x) { var t = (x + 20) / (W + 40); var mt = 1 - t; return mt * mt * mt * roadY + 3 * mt * mt * t * (roadY + bend) + 3 * mt * t * t * (roadY - bend) + t * t * t * (roadY - bend * .4); }

    // zabudowa
    var houses = typ === "budowlana" || typ === "rolno-budowlana" ? 9 : typ === "rod" ? 26 : typ === "inwestycyjna" ? 4 : typ === "siedliskowa" ? 2 : 1;
    for (var hI = 0; hI < houses; hI++) {
      var hx = r() * W, side = r() > .5 ? -1 : 1, hy = roadAt(hx) + side * (16 + r() * 12) * z;
      var big = typ === "inwestycyjna"; var hw = (big ? 46 : typ === "rod" ? 6 : 11 + r() * 5) * z, hh = (big ? 28 : typ === "rod" ? 5 : 8 + r() * 4) * z;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate((r() - .5) * .3);
      ctx.fillStyle = "rgba(170,190,120,.55)"; ctx.fillRect(-hw * 1.1, -hh * 1.3, hw * 2.2, hh * 2.6);
      ctx.fillStyle = "rgba(15,20,10,.4)"; ctx.fillRect(-hw / 2 + 3, -hh / 2 + 3, hw, hh);
      var roof = big ? ["#b9bcc0", "#a3a6aa"] : (r() > .5 ? ["#a5533a", "#8b4430"] : ["#5d5f63", "#4a4c50"]);
      ctx.fillStyle = roof[0]; ctx.fillRect(-hw / 2, -hh / 2, hw, hh / 2);
      ctx.fillStyle = roof[1]; ctx.fillRect(-hw / 2, 0, hw, hh / 2);
      ctx.restore();
    }

    // działka
    var cx = W * (.42 + r() * .16), pw = W * (.2 + r() * .1) * z, ph = H * (.24 + r() * .08) * z;
    var cy = roadAt(cx) - ph / 2 - 9 * z;
    var sk = (r() - .5) * pw * .2;
    var P = [[cx - pw / 2 + sk, cy - ph / 2], [cx + pw / 2 + sk, cy - ph / 2 + 4], [cx + pw / 2 - sk, cy + ph / 2], [cx - pw / 2 - sk, cy + ph / 2 - 3]];
    ctx.save();
    ctx.beginPath(); P.forEach(function (p, i) { if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); }); ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fill();
    ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(0,0,0,.45)"; ctx.lineWidth = 4.5; ctx.stroke();
    ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2.2; ctx.setLineDash([9, 5]); ctx.stroke(); ctx.setLineDash([]);
    P.forEach(function (p) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(p[0], p[1], 3.2, 0, 6.283); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.5)"; ctx.lineWidth = 1; ctx.stroke(); });
    ctx.restore();
    if (opts.label) {
      ctx.save(); ctx.font = "600 " + Math.round(13 * Math.max(z, 1)) + "px Geist, system-ui, sans-serif";
      var tw = ctx.measureText(opts.label).width + 18, lx = cx - tw / 2, ly = cy - ph / 2 - 30;
      ctx.fillStyle = "rgba(15,22,17,.82)"; roundRect(ctx, lx, ly, tw, 24, 12); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.textBaseline = "middle"; ctx.fillText(opts.label, lx + 9, ly + 12.5); ctx.restore();
    }

    // tekstura i gradacja
    ctx.save();
    ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = .22; ctx.fillStyle = ctx.createPattern(BLOTCH, "repeat"); ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = .28; ctx.fillStyle = ctx.createPattern(GRAIN, "repeat"); ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "soft-light"; ctx.globalAlpha = .25; ctx.fillStyle = "#ffe6b0"; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    var vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.28)"); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    ctx.restore();

    var url = c.toDataURL("image/jpeg", .84);
    cache[key] = url;
    return url;
  }

  function roundRect(ctx, x, y, w, h, rr) { ctx.beginPath(); ctx.moveTo(x + rr, y); ctx.arcTo(x + w, y, x + w, y + h, rr); ctx.arcTo(x + w, y + h, x, y + h, rr); ctx.arcTo(x, y + h, x, y, rr); ctx.arcTo(x, y, x + w, y, rr); ctx.closePath(); }

  /* Schemat mapy ewidencyjnej: sąsiednie działki, numery, droga, wyróżniona działka */
  function plan(d, W, H, dark) {
    var key = "plan:" + d.id + ":" + W + "x" + H + ":" + (dark ? 1 : 0);
    if (cache[key]) return cache[key];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = mk(Math.round(W * dpr), Math.round(H * dpr)), ctx = c.getContext("2d"); ctx.scale(dpr, dpr);
    var r = rng((d.seed || d.id) + 11);
    var bg = dark ? "#16201a" : "#f7f6f1", line = dark ? "rgba(220,230,220,.35)" : "rgba(40,50,45,.38)", txt = dark ? "rgba(225,235,225,.75)" : "rgba(40,50,45,.75)";
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // siatka kartograficzna
    ctx.strokeStyle = dark ? "rgba(255,255,255,.05)" : "rgba(0,0,0,.045)"; ctx.lineWidth = 1;
    for (var gx = 0; gx < W; gx += 40) { ctx.beginPath(); ctx.moveTo(gx + .5, 0); ctx.lineTo(gx + .5, H); ctx.stroke(); }
    for (var gy = 0; gy < H; gy += 40) { ctx.beginPath(); ctx.moveTo(0, gy + .5); ctx.lineTo(W, gy + .5); ctx.stroke(); }
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate((r() - .5) * .35);
    var roadY = H * .22;
    ctx.fillStyle = dark ? "#26332a" : "#e6e2d6"; ctx.fillRect(-W, roadY - 14, W * 2, 28);
    ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.strokeRect(-W, roadY - 14, W * 2, 28);
    ctx.fillStyle = txt; ctx.font = "500 11px Geist, system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText((d.dojazd === "asfalt" ? "droga gminna" : d.dojazd === "służebność" ? "droga wewnętrzna" : "droga dojazdowa") + "  ·  dz. " + (100 + Math.floor(r() * 800)), 0, roadY);
    var x = -W * .75, mine = 3 + Math.floor(r() * 2), base = parseInt(d.nr, 10) || 120;
    for (var i = 0; i < 9; i++) {
      var w = 54 + r() * 46, h = H * (.42 + r() * .25);
      var isMine = i === mine;
      if (isMine) { w *= 1.15; ctx.fillStyle = dark ? "rgba(92,186,104,.28)" : "rgba(31,107,58,.14)"; ctx.fillRect(x, -roadY * -1 - 14 - h + 0, 0, 0); }
      ctx.beginPath(); ctx.rect(x, roadY - 14 - h, w, h);
      if (isMine) { ctx.fillStyle = dark ? "rgba(92,186,104,.25)" : "rgba(31,107,58,.13)"; ctx.fill(); ctx.strokeStyle = dark ? "#7fd18a" : "#1f6b3a"; ctx.lineWidth = 2.6; ctx.stroke(); }
      else { ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.stroke(); }
      ctx.fillStyle = isMine ? (dark ? "#bfeac5" : "#14532d") : txt;
      ctx.font = (isMine ? "700 13px " : "500 11px ") + "Geist, system-ui, sans-serif";
      ctx.fillText(isMine ? d.nr : (base - mine + i) + "/" + (1 + Math.floor(r() * 9)), x + w / 2, roadY - 14 - h / 2);
      // działki po drugiej stronie drogi
      var h2 = H * (.25 + r() * .15);
      ctx.strokeStyle = line; ctx.lineWidth = 1; ctx.strokeRect(x, roadY + 14, w, h2);
      ctx.fillStyle = txt; ctx.font = "500 11px Geist, system-ui, sans-serif"; ctx.fillText((base + 40 + i) + "/" + (1 + Math.floor(r() * 6)), x + w / 2, roadY + 14 + h2 / 2);
      x += w;
    }
    ctx.restore();
    // strzałka północy i skala
    ctx.fillStyle = txt; ctx.font = "600 11px Geist, system-ui, sans-serif"; ctx.textAlign = "center";
    ctx.beginPath(); ctx.moveTo(W - 26, 16); ctx.lineTo(W - 20, 32); ctx.lineTo(W - 32, 32); ctx.closePath(); ctx.fill(); ctx.fillText("N", W - 26, 44);
    ctx.fillRect(16, H - 22, 60, 2); ctx.textAlign = "left"; ctx.fillText("ok. 20 m", 16, H - 30);
    var url = c.toDataURL("image/png"); cache[key] = url; return url;
  }

  window.Aerial = { render: render, plan: plan };
})();

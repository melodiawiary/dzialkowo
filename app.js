/* Działkowo - prototyp. Cała logika działa w przeglądarce na danych z data.js. Teksty: i18n.js. */
(function () {
  "use strict";
  var I = window.I18N, t = I.t;
  function EN() { return I.lang === "en"; }
  function LL(a) { return EN() ? a[1] : a[0]; }

  /* ---------- Słowniki ---------- */
  var TYPY = {
    budowlana: { n: ["Budowlana", "Building"], plural: ["Działki budowlane", "Building plots"], c: "#3f9a4a", opis: ["Pod dom jednorodzinny", "For a family house"] },
    rekreacyjna: { n: ["Rekreacyjna", "Leisure"], plural: ["Działki rekreacyjne", "Leisure plots"], c: "#23897f", opis: ["Nad wodą, w lesie, w górach", "By lakes, forests and mountains"] },
    siedliskowa: { n: ["Siedliskowa", "Smallholding"], plural: ["Siedliska", "Smallholdings"], c: "#7d8f2e", opis: ["Rolna z prawem do siedliska", "Farmland with a right to build a farmhouse"] },
    rolna: { n: ["Rolna", "Farmland"], plural: ["Działki rolne", "Farmland"], c: "#b8922a", opis: ["Grunty orne, łąki, sady", "Fields, meadows, orchards"] },
    "rolno-budowlana": { n: ["Rolno-budowlana", "Mixed"], plural: ["Działki rolno-budowlane", "Mixed-use plots"], c: "#8f9a2c", opis: ["Część pod dom, część rolna", "Part building, part farmland"] },
    lesna: { n: ["Leśna", "Forest"], plural: ["Działki leśne", "Forest land"], c: "#2f6b3a", opis: ["Lasy i grunty leśne", "Woodland"] },
    inwestycyjna: { n: ["Inwestycyjna", "Commercial"], plural: ["Działki inwestycyjne", "Commercial land"], c: "#56698a", opis: ["Usługi, magazyny, przemysł, OZE", "Services, warehouses, solar"] },
    rod: { n: ["ROD", "Allotment"], plural: ["Ogródki działkowe", "Allotment gardens"], c: "#b0613f", opis: ["Prawo do działki w ogrodzie działkowym", "Right to use a garden plot"] }
  };
  var TYP_ORDER = ["budowlana", "rekreacyjna", "siedliskowa", "rolna", "rolno-budowlana", "lesna", "inwestycyjna", "rod"];
  var PLAN = { MPZP: ["MPZP", "Zoning plan"], WZ: ["Warunki zabudowy", "Building conditions"], WZ_w_toku: ["WZ w trakcie", "Conditions pending"], brak: ["Brak planu i WZ", "No zoning yet"] };
  var MEDIA = { prad: ["Prąd", "Electricity"], woda: ["Woda", "Water"], kanalizacja: ["Kanalizacja", "Sewage"], gaz: ["Gaz", "Gas"], swiatlowod: ["Światłowód", "Fibre"] };
  var MEDIA_ST = { na_dzialce: ["na działce", "on the plot"], w_drodze: ["w drodze", "in the road"], w_poblizu: ["w pobliżu", "nearby"], brak: ["brak", "none"] };
  var OGL = { prywatny: ["Osoba prywatna", "Private seller"], agencja: ["Biuro nieruchomości", "Estate agent"], deweloper: ["Deweloper", "Developer"], gmina: ["Gmina", "Local council"] };
  var OKOLICA = { woda: ["Przy wodzie", "By the water"], las: ["Przy lesie", "By the forest"], gory: ["Góry", "Mountains"], morze: ["Blisko morza", "Near the sea"] };
  var SYMBOL_EN = { "MN": "single-family housing", "MN/U": "housing and services", "ML": "holiday homes", "RM": "farmstead", "R": "agricultural", "MN, R": "housing and agricultural", "ZL": "forest", "U": "services", "P/U": "industry and services", "P": "industry", "U/MN": "services and housing", "ZD": "allotment gardens" };
  var EUR = 4.3706;

  var ICON = {
    prad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M13 3 6 13h5l-1 8 7-10h-5l1-8Z"/></svg>',
    woda: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></svg>',
    kanalizacja: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h10a4 4 0 0 1 4 4v8"/><path d="M4 12h8a2 2 0 0 1 2 2v5"/><path d="M16 21h4"/></svg>',
    gaz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3c1 3 5 5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 .3 1.8 1.2 2.6 2 3 0-3-1-5.5.5-8Z"/></svg>',
    swiatlowod: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1.3" fill="currentColor"/></svg>',
    road: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 3 5 21M16 3l3 18M12 4v3M12 11v3M12 18v2"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17.2v.3"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.8v.3"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    gavel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 4 6 6M11 7l6 6M12.5 5.5l-5 5 6 6 5-5M10 13l-7 7M3 21h8"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- Dane ---------- */
  var ALL = (window.DZIALKI || []).slice();
  var TOWNS = (window.MIEJSCOWOSCI || []).slice();
  [["Warszawa", "Warszawa", "Warszawa", "mazowieckie", 52.2297, 21.0122], ["Kraków", "Kraków", "Kraków", "małopolskie", 50.0614, 19.9366], ["Wrocław", "Wrocław", "Wrocław", "dolnośląskie", 51.1079, 17.0385], ["Poznań", "Poznań", "Poznań", "wielkopolskie", 52.4064, 16.9252]].forEach(function (c) {
    if (!TOWNS.some(function (x) { return x.m === c[0]; })) TOWNS.push({ m: c[0], g: c[1], p: c[2], w: c[3], lat: c[4], lng: c[5] });
  });
  var CITIES = [
    { key: "gdansk", q: "Gdańsk", n: ["Trójmiasto", "Gdańsk & Tricity"], r: 35, ap: [54.3776, 18.4662] },
    { key: "warszawa", q: "Warszawa", n: ["Warszawa", "Warsaw"], r: 45, ap: [52.1657, 20.9671] },
    { key: "krakow", q: "Kraków", n: ["Kraków", "Kraków"], r: 40, ap: [50.0777, 19.7848] },
    { key: "wroclaw", q: "Wrocław", n: ["Wrocław", "Wrocław"], r: 35, ap: [51.1027, 16.8858] },
    { key: "poznan", q: "Poznań", n: ["Poznań", "Poznań"], r: 35, ap: [52.4210, 16.8263] },
    { key: "lublin", q: "Lublin", n: ["Lublin", "Lublin"], r: 35, ap: [51.2403, 22.7136] }
  ];
  var DAY0 = new Date(2026, 9, 19);
  var WOJ = ["dolnośląskie", "kujawsko-pomorskie", "lubelskie", "lubuskie", "łódzkie", "małopolskie", "mazowieckie", "opolskie", "podkarpackie", "podlaskie", "pomorskie", "śląskie", "świętokrzyskie", "warmińsko-mazurskie", "wielkopolskie", "zachodniopomorskie"];
  var WOJ_EN = { "dolnośląskie": "Lower Silesia", "kujawsko-pomorskie": "Kuyavia-Pomerania", "lubelskie": "Lublin Province", "lubuskie": "Lubusz", "łódzkie": "Łódź Province", "małopolskie": "Lesser Poland", "mazowieckie": "Masovia", "opolskie": "Opole Province", "podkarpackie": "Subcarpathia", "podlaskie": "Podlasie", "pomorskie": "Pomerania", "śląskie": "Silesia", "świętokrzyskie": "Holy Cross Province", "warmińsko-mazurskie": "Warmia-Masuria", "wielkopolskie": "Greater Poland", "zachodniopomorskie": "West Pomerania" };
  function wojName(w) { return EN() ? WOJ_EN[w] + " (" + w + ")" : w; }
  var SIZE_R = [[null, 500], [500, 800], [800, 1000], [1000, 1500], [1500, 3000], [3000, 10000], [10000, null]];

  /* ---------- Pomocnicze ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function loc() { return EN() ? "en-GB" : "pl-PL"; }
  function fmt(n) { return Math.round(n).toLocaleString(loc()); }
  function fmtZl(n) { return fmt(n) + " zł"; }
  function money(pln) { return EN() ? "€" + fmt(pln / EUR) : fmtZl(pln); }
  function cur(pln) { return EN() ? Math.round(pln / EUR) : Math.round(pln); }
  function fromCur(v) { return v == null ? null : (EN() ? Math.round(v * EUR) : v); }
  function short(pln) {
    var n = EN() ? pln / EUR : pln, p = EN() ? "€" : "";
    if (n >= 1e6) return p + (n / 1e6).toLocaleString(loc(), { maximumFractionDigits: 2 }) + (EN() ? "m" : " mln");
    if (n >= 1e3) return p + Math.round(n / 1e3) + (EN() ? "k" : " tys.");
    return p + fmt(n);
  }
  function area(p) { return p >= 10000 ? (p / 10000).toLocaleString(loc(), { maximumFractionDigits: 2 }) + " ha" : fmt(p) + " m²"; }
  function ppm(d) { return d.op === "sprzedaz" && d.pow ? d.cena / d.pow : null; }
  function ppmLabel(d) { var v = ppm(d); return v == null ? "" : (EN() ? "€" + fmt(v / EUR) + "/m²" : fmt(v) + " zł/m²"); }
  function norm(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ł/g, "l"); }
  function num(v) {
    var s = String(v || "").toLowerCase().replace(/ /g, " ").replace(/zł|zl|pln|eur|€|m²|m2|ha\b/g, "").trim();
    var mult = 1;
    if (/(mln|milion|million|\dm\b)/.test(s)) mult = 1e6; else if (/(tys|tyś|thousand|\d\s*k\b|k$)/.test(s)) mult = 1e3;
    s = s.replace(/[^\d,.\s]/g, "").replace(/\s/g, "");
    if (mult === 1) s = s.replace(/[.,](?=\d{3}(\D|$))/g, "");
    var x = parseFloat(s.replace(",", "."));
    return isNaN(x) ? null : Math.round(x * mult);
  }
  function dist(lat1, lng1, lat2, lng2) {
    var R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }
  function lev(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) d.push([i]);
    for (j = 1; j <= n; j++) d[0].push(j);
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) d[i].push(Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)));
    return d[m][n];
  }
  function plural(n) { if (EN()) return n === 1 ? t("res.count1") : t("res.count5"); return n === 1 ? t("res.count1") : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? t("res.count2") : t("res.count5")); }
  function daysLabel(n) { return n === 0 ? t("days.0") : n === 1 ? t("days.1") : t("days.n", { n: n }); }
  function dateLabel(n) { var d = new Date(DAY0.getTime() - n * 864e5); return d.toLocaleDateString(loc(), { day: "numeric", month: "long" }); }
  function priceLabel(d) { return d.op === "dzierzawa" ? money(d.cena) + t("card.perMonth") : (d.licytacja ? t("card.from") : "") + money(d.cena); }

  var store = {
    get: function (k, def) { try { var v = localStorage.getItem("dzialkowo:" + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set: function (k, v) { try { localStorage.setItem("dzialkowo:" + k, JSON.stringify(v)); } catch (e) { /* bez pamięci przeglądarki */ } }
  };
  var favs = new Set(store.get("favs", []));
  function toggleFav(id) { if (favs.has(id)) favs.delete(id); else favs.add(id); store.set("favs", Array.from(favs)); }
  var recent = store.get("recent", []);
  function pushRecent(id) { recent = [id].concat(recent.filter(function (x) { return x !== id; })).slice(0, 8); store.set("recent", recent); }
  var buyer = store.get("buyer", null);

  var toastTimer;
  function toast(msg) {
    var el = $(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 3400);
  }

  /* ---------- Tytuły i opisy po angielsku (z danych oferty) ---------- */
  function title(d) {
    if (!EN()) return d.tytul;
    var tn = { budowlana: "Building plot", rekreacyjna: "Leisure plot", siedliskowa: "Smallholding", rolna: "Farmland", "rolno-budowlana": "Mixed-use plot", lesna: "Forest land", inwestycyjna: "Commercial plot", rod: "Allotment garden" }[d.typ];
    return tn + " " + area(d.pow) + ", " + d.miejscowosc;
  }
  function descEN(d) {
    var p = [];
    var tn = TYPY[d.typ].n[1].toLowerCase();
    p.push(cap(tn) + " land in " + d.miejscowosc + ", " + d.gmina + " municipality, " + d.woj + " province.");
    var near = (d.okolica || []).map(function (o) { return { woda: "a lake", las: "forest", gory: "the mountains", morze: "the Baltic Sea" }[o]; });
    if (near.length) p.push("The area is close to " + near.join(" and ") + ".");
    var pl = d.plan || {};
    if (pl.status === "MPZP") p.push("Covered by a local zoning plan" + (pl.symbol ? " (" + pl.symbol + ": " + (SYMBOL_EN[pl.symbol] || "see plan") + ")" : "") + ".");
    else if (pl.status === "WZ") p.push("A decision on building conditions has been issued.");
    else if (pl.status === "WZ_w_toku") p.push("The seller has applied for building conditions.");
    var have = Object.keys(MEDIA).filter(function (k) { var s = d.media[k] && d.media[k].s; return s === "na_dzialce" || s === "w_drodze"; }).map(function (k) { return MEDIA[k][1].toLowerCase(); });
    p.push(have.length ? "Utilities available: " + have.join(", ") + "." : "No utilities are connected yet.");
    p.push("Access by " + t("access." + d.dojazd) + (d.front ? ", frontage about " + d.front + " m" : "") + ".");
    if (d.podzial) p.push("The plot can be divided.");
    return p.join(" ");
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ---------- Zdjęcia ---------- */
  var PHOTOS = {
    budowlana: ["p-plot1", "p-plot2", "p-plots", "p-right", "p-plot3"],
    rekreacyjna: ["cat-rekreacyjna", "p-left", "p-right"],
    siedliskowa: ["p-right", "cat-rolna", "p-left"],
    rolna: ["cat-rolna", "p-plot2", "p-left"],
    "rolno-budowlana": ["p-plot3", "p-right", "p-plot1"],
    lesna: ["p-left", "cat-rekreacyjna"],
    inwestycyjna: ["cat-inwestycyjna"],
    rod: ["p-village", "p-right"]
  };
  function photoSrc(d, k) {
    var set = PHOTOS[d.typ] || PHOTOS.budowlana;
    if ((d.okolica || []).indexOf("woda") >= 0 && d.typ !== "inwestycyjna" && !k && (d.seed || d.id) % 2) return "img/cat-rekreacyjna.jpg";
    return "img/" + set[((d.seed || d.id) + (k || 0)) % set.length] + ".jpg";
  }
  function photo(d, k, cls) {
    var pos = ["50% 50%", "35% 55%", "65% 45%", "50% 70%", "45% 35%"][(d.seed || d.id) % 5];
    return '<img class="' + (cls || "") + '" src="' + photoSrc(d, k) + '" style="object-position:' + pos + '" alt="' + esc(t("card.photoNote") + ": " + d.miejscowosc) + '" loading="lazy" decoding="async">';
  }

  function utilsLine(d) {
    var have = Object.keys(MEDIA).filter(function (k) { var s = d.media[k] && d.media[k].s; return s === "na_dzialce" || s === "w_drodze"; });
    if (!have.length) return '<div class="card-utils"><span class="u">' + t("card.noUtils") + "</span></div>";
    return '<div class="card-utils">' + have.map(function (k) { return '<span class="u on">' + ICON.check + LL(MEDIA[k]) + "</span>"; }).join("") + "</div>";
  }
  function planText(d) {
    var p = d.plan || {};
    if (p.status === "MPZP") return EN() ? "Zoning: " + (SYMBOL_EN[p.symbol] || p.symbol || "plan") : "MPZP " + (p.symbol || "");
    if (p.status === "WZ") return t("plan.wz");
    if (p.status === "WZ_w_toku") return t("plan.wzp");
    return t("plan.none");
  }
  function chips(d, max) {
    var b = [];
    if (d.mine) b.push('<span class="chip-img dark">' + t("card.mine") + "</span>");
    if (d.licytacja) b.push('<span class="chip-img dark">' + (d.licytacja.rodzaj === "przetarg gminny" ? t("card.tender") : t("card.auction")) + "</span>");
    if (d.op === "dzierzawa") b.push('<span class="chip-img dark">' + t("card.lease") + "</span>");
    if (d.zweryfikowany) b.push('<span class="chip-img ok">' + ICON.shield + t("card.verified") + "</span>");
    if (d.historia && d.historia.length) b.push('<span class="chip-img">' + t("card.cut", { p: Math.round((1 - d.cena / d.historia[0].cena) * 100) }) + "</span>");
    if (d.dodano <= 2) b.push('<span class="chip-img">' + t("card.new") + "</span>");
    return b.slice(0, max || 2).join("");
  }
  function favBtn(d, cls) {
    return '<button class="' + (cls || "fav") + '" data-fav="' + d.id + '" aria-label="' + esc(t("card.save")) + '" aria-pressed="' + favs.has(d.id) + '">' + (favs.has(d.id) ? ICON.heartFill : ICON.heart) + "</button>";
  }
  function cardHTML(d) {
    return '<article class="card" data-id="' + d.id + '" tabindex="0" aria-label="' + esc(title(d)) + '">' +
      '<div class="media-box">' + photo(d) + '<div class="overlay-tl">' + chips(d, 2) + "</div>" + favBtn(d) + '<span class="photo-note">' + t("card.photoNote") + "</span></div>" +
      '<div class="card-info">' +
      '<div class="card-price"><span class="price">' + priceLabel(d) + "</span>" + (ppm(d) ? '<span class="ppm">' + ppmLabel(d) + "</span>" : "") + (d.historia && d.historia.length ? '<span class="was">' + money(d.historia[0].cena) + "</span>" : "") + "</div>" +
      '<div class="card-specs">' + area(d.pow) + '<span class="sep">|</span>' + LL(TYPY[d.typ].n) + '<span class="sep">|</span>' + esc(planText(d)) + "</div>" +
      '<div class="card-loc">' + esc(d.miejscowosc) + ", " + (EN() ? "" : "gm. ") + esc(d.gmina) + ", " + esc(d.woj) + "</div>" +
      utilsLine(d) + "</div></article>";
  }

  /* ---------- Rozumienie zapytania o lokalizację ---------- */
  var REGIONS = {
    "trojmiasto": { label: ["Trójmiasto i okolice", "Gdańsk & Tricity area"], center: [54.44, 18.56], r: 25 },
    "tricity": { label: ["Trójmiasto i okolice", "Gdańsk & Tricity area"], center: [54.44, 18.56], r: 25 },
    "kaszuby": { label: ["Kaszuby", "Kashubia"], powiaty: ["kartuski", "kościerski", "wejherowski", "pucki", "lęborski", "bytowski"] },
    "kashubia": { label: ["Kaszuby", "Kashubia"], powiaty: ["kartuski", "kościerski", "wejherowski", "pucki", "lęborski", "bytowski"] },
    "roztocze": { label: ["Roztocze", "Roztocze"], center: [50.55, 23.1], r: 30 },
    "zamojszczyzna": { label: ["Zamojszczyzna", "Zamość area"], center: [50.72, 23.25], r: 40 },
    "mazury": { label: ["Mazury", "Masuria"], woj: "warmińsko-mazurskie" },
    "masuria": { label: ["Mazury", "Masuria"], woj: "warmińsko-mazurskie" },
    "pomorze": { label: ["Pomorze", "Pomerania"], woj: "pomorskie" },
    "pomerania": { label: ["Pomorze", "Pomerania"], woj: "pomorskie" },
    "lubelszczyzna": { label: ["Lubelszczyzna", "Lublin province"], woj: "lubelskie" },
    "podhale": { label: ["Podhale", "Podhale"], center: [49.4, 20.0], r: 35 },
    "karkonosze": { label: ["Karkonosze", "Karkonosze"], center: [50.8, 15.7], r: 25 },
    "okolice warszawy": { label: ["Okolice Warszawy", "Warsaw area"], center: [52.23, 21.01], r: 45 },
    "warsaw": { label: ["Okolice Warszawy", "Warsaw area"], center: [52.23, 21.01], r: 45 },
    "cracow": { label: ["Okolice Krakowa", "Kraków area"], center: [50.06, 19.94], r: 40 },
    "krakow": { label: ["Okolice Krakowa", "Kraków area"], center: [50.06, 19.94], r: 40 },
    "wroclaw": { label: ["Okolice Wrocławia", "Wrocław area"], center: [51.11, 17.04], r: 35 },
    "poznan": { label: ["Okolice Poznania", "Poznań area"], center: [52.41, 16.93], r: 35 },
    "gdansk": { label: ["Trójmiasto i okolice", "Gdańsk & Tricity area"], center: [54.44, 18.56], r: 35 }
  };
  var STOP = ["powiat", "pow", "gmina", "gm", "wojewodztwo", "woj", "okolice", "okolica", "kolo", "k", "miasto", "wies", "w", "na", "przy", "dzialka", "dzialki", "budowlana", "budowlane", "near", "area", "plot", "plots", "land", "in", "around", "poland"];
  var QC = { q: null, r: null };
  function resolveQuery(q) {
    if (QC.q === q && QC.l === I.lang) return QC.r;
    var res = { type: "none" };
    var nq = norm(q).replace(/[.,&]/g, " ").replace(/\s+/g, " ").trim();
    if (nq) {
      var words = nq.split(" ").filter(function (w) { return w && STOP.indexOf(w) < 0; });
      var phrase = words.join(" ");
      if (/^\d{2}-?\d{3}$/.test(nq)) res = { type: "postcode", label: q };
      else if (REGIONS[nq] || REGIONS[phrase]) { var R0 = REGIONS[nq] || REGIONS[phrase]; res = Object.assign({ type: "region" }, R0, { label: LL(R0.label) }); }
      else {
        var town = TOWNS.find(function (x) { return norm(x.m) === phrase; });
        var gm = !town && TOWNS.find(function (x) { return norm(x.g) === phrase; });
        var pw = !town && !gm && TOWNS.find(function (x) { return norm(x.p) === phrase; });
        var wj = !town && !gm && !pw && TOWNS.find(function (x) { return norm(x.w) === phrase; });
        if (town) res = { type: "town", label: town.m, center: [town.lat, town.lng], words: [norm(town.m)] };
        else if (gm) res = { type: "text", label: (EN() ? "" : "gmina ") + gm.g, words: [norm(gm.g)] };
        else if (pw) res = { type: "powiat", label: (EN() ? "" : "powiat ") + pw.p, powiaty: [pw.p] };
        else if (wj) res = { type: "woj", label: (EN() ? "" : "woj. ") + wj.w, woj: wj.w };
        else if (phrase) {
          var best = null, bd = 99;
          TOWNS.forEach(function (x) { [x.m, x.g, x.p].forEach(function (name) { var dd = lev(norm(name), phrase); if (dd < bd) { bd = dd; best = { t: x, name: name }; } }); });
          if (best && bd <= (phrase.length > 7 ? 2 : 1) && phrase.length > 3) {
            res = best.name === best.t.m ? { type: "town", label: best.t.m, center: [best.t.lat, best.t.lng], words: [norm(best.t.m)], corrected: q } : { type: "text", label: best.name, words: [norm(best.name)], corrected: q };
          } else res = { type: "text", label: q, words: words.length ? words : [nq] };
        }
      }
    }
    QC = { q: q, r: res, l: I.lang };
    return res;
  }
  function placeMatch(d, st) {
    st = st || S;
    var Q = resolveQuery(st.q);
    switch (Q.type) {
      case "none": return true;
      case "postcode": return false;
      case "region":
        if (Q.center) return dist(d.lat, d.lng, Q.center[0], Q.center[1]) <= Q.r;
        if (Q.powiaty) return Q.powiaty.indexOf(d.powiat) >= 0;
        return d.woj === Q.woj;
      case "powiat": return Q.powiaty.indexOf(d.powiat) >= 0;
      case "woj": return d.woj === Q.woj;
      case "town":
        if (st.radius) return dist(d.lat, d.lng, Q.center[0], Q.center[1]) <= st.radius;
        return norm(d.miejscowosc) === Q.words[0] || norm(d.gmina) === Q.words[0];
      default:
        var hay = norm([d.miejscowosc, d.gmina, d.powiat, d.woj, d.tytul].join(" "));
        return Q.words.every(function (w) { return hay.indexOf(w) >= 0; });
    }
  }

  /* ---------- Stan wyszukiwania ---------- */
  function emptyState() {
    return { op: "sprzedaz", q: "", typy: [], cMin: null, cMax: null, pmMin: null, pmMax: null, powMin: null, powMax: null,
      plan: [], media: [], dojazd: "", okolica: [], frontMin: null, podzial: false, lic: "all", ogl: [], dni: 0,
      zw: false, favOnly: false, sort: "trafnosc", poly: null, bounds: null, radius: 0 };
  }
  var S = emptyState();
  var shown = 20;
  var SORTS = [["trafnosc", "sort.rel"], ["cena-asc", "sort.pa"], ["cena-desc", "sort.pd"], ["nowe", "sort.new"], ["stare", "sort.old"], ["ppm-asc", "sort.ma"], ["ppm-desc", "sort.md"], ["pow-desc", "sort.big"], ["pow-asc", "sort.small"], ["front-desc", "sort.front"], ["obnizki", "sort.cut"], ["prywatne", "sort.priv"], ["agencje", "sort.agen"]];

  function pointInPoly(lat, lng, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][1], yi = poly[i][0], xj = poly[j][1], yj = poly[j][0];
      if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function matches(d, skip, st) {
    st = st || S; skip = skip || "";
    if (d.op !== st.op) return false;
    if (st.q && !placeMatch(d, st)) return false;
    if (skip !== "typ" && st.typy.length && st.typy.indexOf(d.typ) < 0) return false;
    if (st.cMin != null && d.cena < st.cMin) return false;
    if (st.cMax != null && d.cena > st.cMax) return false;
    var pm = ppm(d);
    if (st.pmMin != null && (pm == null || pm < st.pmMin)) return false;
    if (st.pmMax != null && (pm == null || pm > st.pmMax)) return false;
    if (st.powMin != null && d.pow < st.powMin) return false;
    if (st.powMax != null && d.pow > st.powMax) return false;
    if (skip !== "plan" && st.plan.length && st.plan.indexOf(d.plan.status) < 0) return false;
    for (var i = 0; i < st.media.length; i++) { var s = d.media[st.media[i]] && d.media[st.media[i]].s; if (s !== "na_dzialce" && s !== "w_drodze") return false; }
    if (st.dojazd === "asfalt" && d.dojazd !== "asfalt") return false;
    if (st.dojazd === "utw" && d.dojazd !== "asfalt" && d.dojazd !== "utwardzona") return false;
    if (st.dojazd === "pub" && !d.drogaPubliczna) return false;
    if (st.okolica.length && !st.okolica.some(function (o) { return (d.okolica || []).indexOf(o) >= 0; })) return false;
    if (st.frontMin != null && (!d.front || d.front < st.frontMin)) return false;
    if (st.podzial && !d.podzial) return false;
    if (st.lic === "bez" && d.licytacja) return false;
    if (st.lic === "tylko" && !d.licytacja) return false;
    if (st.ogl.length && st.ogl.indexOf(d.ogl.typ) < 0) return false;
    if (st.dni && d.dodano > st.dni) return false;
    if (st.zw && !d.zweryfikowany) return false;
    if (st.favOnly && !favs.has(d.id)) return false;
    if (st.poly && !pointInPoly(d.lat, d.lng, st.poly)) return false;
    if (st.bounds && !st.bounds.contains([d.lat, d.lng])) return false;
    return true;
  }
  function sorted(list) {
    var by = {
      trafnosc: function (a, b) { return (b.zweryfikowany - a.zweryfikowany) || (a.dodano - b.dodano); },
      "cena-asc": function (a, b) { return a.cena - b.cena; },
      "cena-desc": function (a, b) { return b.cena - a.cena; },
      nowe: function (a, b) { return a.dodano - b.dodano; },
      stare: function (a, b) { return b.dodano - a.dodano; },
      "ppm-asc": function (a, b) { return (ppm(a) || 1e9) - (ppm(b) || 1e9); },
      "ppm-desc": function (a, b) { return (ppm(b) || 0) - (ppm(a) || 0); },
      "pow-desc": function (a, b) { return b.pow - a.pow; },
      "pow-asc": function (a, b) { return a.pow - b.pow; },
      "front-desc": function (a, b) { return (b.front || 0) - (a.front || 0); },
      obnizki: function (a, b) { return (b.historia.length - a.historia.length) || (a.dodano - b.dodano); },
      prywatne: function (a, b) { return ((a.ogl.typ !== "prywatny") - (b.ogl.typ !== "prywatny")) || (a.dodano - b.dodano); },
      agencje: function (a, b) { return ((a.ogl.typ !== "agencja") - (b.ogl.typ !== "agencja")) || (a.dodano - b.dodano); }
    }[S.sort];
    return list.slice().sort(by);
  }

  /* ---------- Czy mogę kupić ---------- */
  function buyAnswer(d, who) {
    if (!who) return "";
    var out = [];
    var nonEEA = who === "uk" || who === "other";
    if (d && d.typ === "rod") out.push(["info", t("buy.rodH"), t("buy.rodP")]);
    else if (nonEEA) out.push(["warn", t("buy.permitH"), t("buy.permitP")]);
    else out.push(["ok", t("buy.okH"), t("buy.okP")]);
    if (d && (d.typ === "rolna" || d.typ === "siedliskowa") && d.pow >= 3000 && d.op === "sprzedaz") out.push(["warn", t("buy.farmH"), t("buy.farmP")]);
    if (!d) out.push(["info", t("buy.farmH"), t("buy.farmP")]);
    return out.map(function (o) { return '<div class="callout ' + o[0] + '">' + (o[0] === "ok" ? ICON.check : o[0] === "warn" ? ICON.warn : ICON.info) + "<div><b>" + o[1] + "</b><p>" + o[2] + "</p></div></div>"; }).join("") + '<p class="muted small">' + t("buy.note") + "</p>";
  }
  function buyerPick(cur) {
    var opts = EN() ? ["eu", "uk", "other"] : ["pl", "eu", "uk", "other"];
    return opts.map(function (k) { return '<button class="pill' + (cur === k ? " on" : "") + '" data-buyer="' + k + '" aria-pressed="' + (cur === k) + '">' + t("buy." + k) + "</button>"; }).join("");
  }

  /* ---------- Strona główna ---------- */
  var cityKey = "gdansk";
  function areaState(a) { var st = emptyState(); st.q = a.q; st.radius = a.r || 0; return st; }
  function heroImage() {
    var h = $("#hero"); if (!h) return;
    h.style.setProperty("--hero", "url(img/" + (window.innerWidth < 720 ? "hero-m.jpg" : "hero.jpg") + ")");
  }
  function renderNear() {
    var box = $("#near"); if (!box) return;
    var a = store.get("geoArea", null);
    if (!a) {
      box.innerHTML = '<div class="near-ask">' + ICON.pin + '<div><b>' + t("near.askH") + '</b><p class="muted">' + t("near.askP") + '</p></div><button class="btn btn-ghost" id="geoBtn">' + t("near.askBtn") + "</button></div>";
      return;
    }
    var st = areaState(a);
    var list = ALL.filter(function (d) { return matches(d, "", st); }).sort(function (x, y) { return x.dodano - y.dodano; });
    var label = resolveQuery(a.q).label || a.q;
    box.innerHTML = '<div class="section-head"><div><h2>' + esc(t("near.title", { a: label + (a.r ? " + " + a.r + " km" : "") })) + '</h2></div><div class="head-actions"><button class="btn btn-ghost btn-sm" id="nearChange">' + t("near.change") + '</button><button class="btn btn-dark btn-sm" id="nearAll">' + t("near.all") + " (" + list.length + ")</button></div></div>" +
      (list.length ? '<div class="grid-cards">' + list.slice(0, 8).map(cardHTML).join("") + "</div>" : '<div class="empty">' + t("near.empty") + "</div>");
  }
  function renderRecent() {
    var items = recent.map(function (id) { return ALL.find(function (d) { return d.id === id; }); }).filter(Boolean);
    $("#recentSection").hidden = !items.length;
    $("#recent").innerHTML = items.map(cardHTML).join("");
  }
  function renderCities() {
    $("#cityTabs").innerHTML = CITIES.map(function (c) { return '<button role="tab" data-city="' + c.key + '" aria-selected="' + (c.key === cityKey) + '">' + esc(LL(c.n)) + "</button>"; }).join("");
    var c = CITIES.find(function (x) { return x.key === cityKey; });
    var st = emptyState(); st.q = c.q; st.radius = c.r;
    var list = ALL.filter(function (d) { return matches(d, "", st); }).sort(function (x, y) { return (y.zweryfikowany - x.zweryfikowany) || (x.dodano - y.dodano); });
    $("#cityCards").innerHTML = list.length ? list.slice(0, 4).map(cardHTML).join("") : '<div class="empty">' + t("near.empty") + "</div>";
    $("#citySeeAll").textContent = t("metro.seeAll", { n: list.length }) + " · " + t("metro.km", { r: c.r });
  }
  function renderHomeBuyer() {
    $("#buyerPickHome").innerHTML = buyerPick(buyer);
    $("#buyerAnswerHome").innerHTML = buyAnswer(null, buyer);
  }
  var home = { q: "", r: 0 };
  function sizeLabel(r) {
    if (EN()) return r[0] == null ? "up to " + area(r[1]) : r[1] == null ? "over " + area(r[0]) : fmt(r[0]) + " - " + area(r[1]);
    function ar(m) { return m >= 10000 ? area(m) : m / 100 + " arów"; }
    if (r[0] == null) return "do " + ar(r[1]) + " (" + area(r[1]) + ")";
    if (r[1] == null) return "powyżej " + ar(r[0]);
    return (r[1] >= 10000 ? ar(r[0]) : r[0] / 100) + " - " + ar(r[1]);
  }
  function homeState() {
    var op = $("#homeSearch .op-toggle [aria-pressed=true]").dataset.op;
    var st = emptyState(); st.op = op; st.q = home.q; st.radius = home.r;
    var ty = $("#hs-typ").value; if (ty) st.typy = [ty];
    var sz = $("#hs-size").value; if (sz !== "") { st.powMin = SIZE_R[+sz][0]; st.powMax = SIZE_R[+sz][1]; }
    var cm = $("#hs-cmax").value; if (cm && op === "sprzedaz") st.cMax = +cm;
    var pl = $("#hs-plan").value; if (pl) st.plan = pl === "MPZP+WZ" ? ["MPZP", "WZ"] : [pl];
    return st;
  }
  function updateHomeCount() {
    var st = homeState(), n = ALL.filter(function (d) { return matches(d, "", st); }).length;
    $("#hsGoLbl").textContent = t("sb.show", { n: n + " " + plural(n) });
  }
  function resetHome() {
    home = { q: "", r: 0 };
    ["#hs-typ", "#hs-size", "#hs-cmax", "#hs-plan"].forEach(function (k) { var el = $(k); if (el) el.value = ""; });
    $$("#homeSearch .op-toggle button").forEach(function (b, i) { b.setAttribute("aria-pressed", i === 0); });
    var cm = $("#catMore"); if (cm) cm.value = "";
    $("#hs-loc").innerHTML = "<span>" + esc(locLabel("", 0)) + "</span>" + ICON.chev;
    updateHomeCount();
  }
  function homeSearch(extra) {
    S = homeState();
    if (extra) extra(S);
    go("szukaj");
  }
  function renderHome() {
    heroImage();
    renderNear(); renderRecent();
    if (EN()) { renderCities(); renderHomeBuyer(); }
    var big = [["budowlana", "cat-budowlana"], ["rekreacyjna", "cat-rekreacyjna"], ["inwestycyjna", "cat-inwestycyjna"]];
    $("#cats").innerHTML = big.map(function (b) {
      return '<button class="cat" data-cat="' + b[0] + '"><img src="img/' + b[1] + '.jpg" alt="" loading="lazy"><div class="cat-body"><b>' + LL(TYPY[b[0]].plural) + "</b><span>" + LL(TYPY[b[0]].opis) + "</span></div></button>";
    }).join("");
    $("#catMore").innerHTML = '<option value="">' + t("cats.pick") + '</option><optgroup label="' + esc(t("cats.typeGroup")) + '">' + TYP_ORDER.filter(function (k) { return !big.some(function (b) { return b[0] === k; }); }).map(function (k) { return '<option value="t:' + k + '">' + LL(TYPY[k].plural) + "</option>"; }).join("") +
      '</optgroup><optgroup label="' + esc(t("cats.areaGroup")) + '">' + Object.keys(OKOLICA).map(function (k) { return '<option value="o:' + k + '">' + LL(OKOLICA[k]) + "</option>"; }).join("") + "</optgroup>";
    $("#hs-typ").innerHTML = '<option value="">' + t("sb.all") + "</option>" + TYP_ORDER.map(function (k) { return '<option value="' + k + '">' + LL(TYPY[k].n) + "</option>"; }).join("");
    $("#hs-size").innerHTML = '<option value="">' + t("sb.areaAny") + "</option>" + SIZE_R.map(function (r, i) { return '<option value="' + i + '">' + sizeLabel(r) + "</option>"; }).join("");
    $("#hs-cmax").innerHTML = '<option value="">' + t("sb.priceAny") + "</option>" + (EN() ? [25e3, 50e3, 75e3, 100e3, 150e3, 200e3, 300e3].map(function (v) { return Math.round(v * EUR); }) : [100e3, 150e3, 200e3, 300e3, 400e3, 500e3, 750e3, 1e6]).map(function (v) { return '<option value="' + v + '">' + (EN() ? "up to " : "do ") + short(v) + (EN() ? "" : " zł") + "</option>"; }).join("");
    $("#hs-loc").innerHTML = "<span>" + esc(locLabel(home.q, home.r)) + "</span>" + ICON.chev;
    $("#hs-plan").innerHTML = '<option value="">' + t("sb.any") + '</option><option value="MPZP">' + t("sb.planMpzp") + '</option><option value="WZ">' + t("sb.planWz") + '</option><option value="MPZP+WZ">' + t("sb.planBoth") + "</option>";
    $("#towns").innerHTML = TOWNS.map(function (x) { return '<option value="' + esc(x.m) + '">' + esc((EN() ? "" : "gm. ") + x.g + ", " + x.w) + "</option>"; }).join("") +
      (EN() ? ["Tricity", "Kashubia", "Masuria", "Warsaw", "Kraków", "Wrocław", "Poznań"] : ["Trójmiasto", "Kaszuby", "Mazury", "Roztocze", "Okolice Warszawy"]).map(function (r) { return '<option value="' + r + '"></option>'; }).join("");
    renderFooter();
    updateHomeCount();
    var IC3 = [ICON.pin, ICON.shield, '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 11 12 4l8 7v9H4Z"/><path d="M10 20v-5h4v5"/></svg>'];
    $("#three").innerHTML = [1, 2, 3].map(function (i) { return '<button class="three-i" data-three="' + i + '"><span class="three-ic">' + IC3[i - 1] + '</span><span class="three-n">' + i + '</span><b>' + t("three." + i + "h") + "</b><span>" + t("three." + i + "p") + "</span></button>"; }).join("");
  }
  function renderFooter() {
    var cols = [["foot.search", "foot.l1"], ["foot.sell", "foot.l2"], ["foot.portal", "foot.l3"]];
    $("#footWrap").innerHTML = '<div><b>Działkowo</b><p>' + t("foot.about") + "</p></div>" +
      cols.map(function (c) { return "<div><h4>" + t(c[0]) + "</h4><ul>" + t(c[1]).map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>"; }).join("") +
      '<div class="legal"><span>' + t("foot.legal") + "</span><span>© OpenStreetMap, Geoportal / GUGiK</span></div>";
  }

  /* ---------- Wybór lokalizacji: województwo, potem gmina ---------- */
  function locLabel(q, r) { if (!q) return t("sb.whereAll"); var Q = resolveQuery(q); return (Q.label || q) + (r && Q.type === "town" ? " + " + r + " km" : ""); }
  function openLoc(title, onPick) {
    var el = document.createElement("div"); el.className = "sheet-wrap"; el.id = "locSheet";
    var woj = null;
    function cnt(f) { return ALL.filter(function (d) { return d.op === "sprzedaz" && f(d); }).length; }
    function item(q, label, n, extra) { return '<button class="loc-item' + (extra || "") + '" data-q="' + esc(q) + '">' + esc(label) + '<span class="n">' + n + "</span></button>"; }
    function render() {
      var h = '<div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="sheet-head"><h2>' + esc(title) + '</h2><button class="icon-btn" data-x aria-label="' + esc(t("d.close")) + '">' + ICON.close + "</button></div>";
      h += '<div class="sheet-body">';
      if (!woj) {
        h += '<div class="loc-list">' + item("", t("sb.whereAll"), cnt(function () { return true; }), " strong");
        if (EN()) h += '<div class="loc-sub">' + t("loc.cities") + "</div>" + CITIES.slice().sort(function (a, b) { return LL(a.n).localeCompare(LL(b.n), "en"); }).map(function (c) { var st = emptyState(); st.q = c.q; st.radius = c.r; return '<button class="loc-item" data-q="' + esc(c.q) + '" data-r="' + c.r + '">' + esc(LL(c.n)) + '<span class="n">' + ALL.filter(function (d) { return matches(d, "", st); }).length + "</span></button>"; }).join("");
        h += '<div class="loc-sub">' + t("loc.woj") + "</div>";
        h += WOJ.slice().sort(function (a, b) { return wojName(a).localeCompare(wojName(b), EN() ? "en" : "pl"); }).map(function (w) { var n = cnt(function (d) { return d.woj === w; }); return '<button class="loc-item" data-woj="' + w + '"' + (n ? "" : " disabled") + ">" + esc(wojName(w)) + '<span class="n">' + (n || t("loc.none")) + "</span>" + (n ? ICON.chev : "") + "</button>"; }).join("") + "</div>";
      } else {
        var gm = []; TOWNS.forEach(function (x) { if (x.w === woj && gm.indexOf(x.g) < 0) gm.push(x.g); });
        gm = gm.map(function (g) { return [g, cnt(function (d) { return d.gmina === g; })]; }).filter(function (x) { return x[1]; }).sort(function (a, b) { return a[0].localeCompare(b[0], "pl"); });
        h += '<button class="loc-back" data-back>‹ ' + t("loc.back") + '</button><div class="loc-list">' + item(woj, t("loc.whole") + ": " + wojName(woj), cnt(function (d) { return d.woj === woj; }), " strong") +
          gm.map(function (x) { return item(x[0], (EN() ? "" : "gm. ") + x[0], x[1]); }).join("") + "</div>";
      }
      h += '<input class="input loc-type" id="locType" list="towns" placeholder="' + esc(t("loc.type")) + '" aria-label="' + esc(t("loc.type")) + '"></div></div>';
      el.innerHTML = h;
    }
    function close() { el.remove(); document.body.style.overflow = ""; }
    function pickTyped() { var v = $("#locType", el).value.trim(); if (v) { close(); onPick(v, 0); } }
    render(); document.body.appendChild(el); document.body.style.overflow = "hidden";
    el.addEventListener("click", function (e) {
      var b;
      if (e.target === el || e.target.closest("[data-x]")) { close(); return; }
      if ((b = e.target.closest("[data-woj]"))) { woj = b.dataset.woj; render(); $(".sheet-body", el).scrollTop = 0; return; }
      if (e.target.closest("[data-back]")) { woj = null; render(); return; }
      if ((b = e.target.closest("[data-q]"))) { close(); onPick(b.dataset.q, +(b.dataset.r || 0)); }
    });
    el.addEventListener("change", function (e) { if (e.target.id === "locType") pickTyped(); });
    el.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target.id === "locType") { e.preventDefault(); pickTyped(); } });
    var first = $("[data-x]", el); if (first) first.focus();
  }

  /* ---------- Okna: kontakt i „Czy mogę kupić” ---------- */
  function modal(title, body, onOpen) {
    var el = document.createElement("div"); el.className = "modal"; el.id = "miniModal";
    el.innerHTML = '<div class="modal-card" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="modal-head"><div><h2>' + esc(title) + '</h2></div><button class="icon-btn" data-x aria-label="' + esc(t("d.close")) + '">' + ICON.close + '</button></div><div class="modal-body">' + body + "</div></div>";
    document.body.appendChild(el); document.body.style.overflow = "hidden";
    function close() { el.remove(); document.body.style.overflow = ""; }
    el.addEventListener("click", function (e) { if (e.target === el || e.target.closest("[data-x]")) close(); });
    if (onOpen) onOpen(el, close);
    var f = $("select, input, textarea", el); if (f) f.focus();
  }
  function openContact() {
    modal(t("contact.h"), '<p class="muted" style="margin-bottom:14px">' + t("contact.p") + '</p><form id="ctForm">' +
      '<div class="field"><label for="ct-topic">' + t("contact.topic") + '</label><select class="input" id="ct-topic">' + [1, 2, 3, 4].map(function (i) { return "<option>" + t("contact.t" + i) + "</option>"; }).join("") + "</select></div>" +
      '<div class="row2"><div class="field"><label for="ct-name">' + t("contact.name") + '</label><input class="input" id="ct-name" autocomplete="name"></div><div class="field"><label for="ct-mail">E-mail</label><input class="input" id="ct-mail" type="email" autocomplete="email" required></div></div>' +
      '<div class="field"><label for="ct-msg">' + t("contact.msg") + '</label><textarea class="input" id="ct-msg" rows="4" required></textarea></div>' +
      '<button class="btn btn-primary btn-lg" type="submit" style="width:100%">' + t("d.send") + "</button></form>",
      function (el, close) { $("#ctForm", el).addEventListener("submit", function (e) { e.preventDefault(); close(); toast(t("contact.ok")); }); });
  }
  function canAnswer(cit, land, res) {
    var out = [];
    if (land === "5") out.push(["info", t("buy.rodH"), t("buy.rodP")]);
    else if (cit === "eu") out.push(["ok", t("buy.okH"), t("buy.okP")]);
    else if (res) out.push(["ok", t("can.exH"), t("can.exP")]);
    else out.push(["warn", t("buy.permitH"), t("buy.permitP")]);
    if (land === "3") out.push(["warn", t("buy.farmH"), t("buy.farmP")]);
    if (land === "4") out.push(["info", t("can.forestH"), t("can.forestP")]);
    return out.map(function (o) { return '<div class="callout ' + o[0] + '">' + (o[0] === "ok" ? ICON.check : o[0] === "warn" ? ICON.warn : ICON.info) + "<div><b>" + o[1] + "</b><p>" + o[2] + "</p></div></div>"; }).join("") + '<p class="muted small">' + t("buy.note") + "</p>";
  }
  function openCanBuy() {
    var cits = [["eu", t("buy.eu")], ["uk", t("buy.uk")], ["us", t("can.us")], ["other", t("buy.other")]];
    modal(t("can.formH"), '<form id="cbForm"><div class="row2"><div class="field"><label for="cb-cit">' + t("can.cit") + '</label><select class="input" id="cb-cit">' + cits.map(function (c) { return '<option value="' + c[0] + '"' + (buyer === c[0] ? " selected" : "") + ">" + c[1] + "</option>"; }).join("") + "</select></div>" +
      '<div class="field"><label for="cb-land">' + t("can.land") + '</label><select class="input" id="cb-land">' + [1, 2, 3, 4, 5].map(function (i) { return '<option value="' + i + '">' + t("can.l" + i) + "</option>"; }).join("") + "</select></div></div>" +
      '<label class="check cb-res"><input type="checkbox" id="cb-res">' + t("can.res") + "</label>" +
      '<button class="btn btn-primary btn-lg" type="submit" style="width:100%;margin-top:12px">' + t("can.show") + '</button><div id="cbAns" style="margin-top:16px"></div></form>',
      function (el) {
        var f = $("#cbForm", el), cit = $("#cb-cit", el), res = $(".cb-res", el);
        function sync() { res.hidden = cit.value === "eu"; }
        cit.addEventListener("change", sync); sync();
        f.addEventListener("submit", function (e) {
          e.preventDefault();
          buyer = cit.value === "us" ? "other" : cit.value; store.set("buyer", buyer);
          $("#cbAns", el).innerHTML = canAnswer(cit.value, $("#cb-land", el).value, cit.value !== "eu" && $("#cb-res", el).checked);
          $("#cbAns", el).scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      });
  }

  /* ---------- Filtry ---------- */
  function countBy(fn, skip) { var c = {}; ALL.forEach(function (d) { if (matches(d, skip)) { var k = fn(d); c[k] = (c[k] || 0) + 1; } }); return c; }
  function curVal(k) { var v = S[k]; if (v == null) return ""; return (k === "cMin" || k === "cMax" || k === "pmMin" || k === "pmMax") ? cur(v) : v; }
  function seg(key, opts) { return '<div class="seg" data-seg="' + key + '">' + opts.map(function (o) { return '<button data-v="' + o[0] + '" aria-pressed="' + (String(S[key]) === String(o[0])) + '">' + o[1] + "</button>"; }).join("") + "</div>"; }
  function checks(arr, dict, counts, two) {
    return '<div class="checks' + (two ? " two" : "") + '">' + Object.keys(dict).map(function (k) {
      return '<label class="check"><input type="checkbox" data-arr="' + arr + '" value="' + k + '"' + (S[arr].indexOf(k) >= 0 ? " checked" : "") + ">" + LL(dict[k]) + (counts ? '<span class="cnt">' + (counts[k] || 0) + "</span>" : "") + "</label>";
    }).join("") + "</div>";
  }
  function selPair(kMin, kMax, steps, lab) {
    function one(k, ph) { return '<select class="input" data-sel="' + k + '" aria-label="' + esc(ph) + '"><option value="">' + ph + "</option>" + steps.map(function (v) { return '<option value="' + v + '"' + (S[k] === v ? " selected" : "") + ">" + lab(v) + "</option>"; }).join("") + "</select>"; }
    return '<div class="pair">' + one(kMin, t("sb.from")) + one(kMax, t("sb.to")) + "</div>";
  }
  var advOpen = false;
  function renderFilters() {
    var tc = countBy(function (d) { return d.typ; }, "typ");
    var pc = countBy(function (d) { return d.plan.status; }, "plan");
    var h = '<div class="filters-head"><h3>' + t("f.title") + '</h3><button class="icon-btn only-narrow" id="closeFilters" aria-label="' + esc(t("f.close")) + '">' + ICON.close + "</button></div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.offer") + "</span>" + seg("op", [["sprzedaz", t("sb.buy")], ["dzierzawa", t("sb.lease")]]) + "</div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.where") + '</span><button class="input loc-btn" id="f-loc"><span>' + esc(locLabel(S.q, S.radius)) + "</span>" + ICON.chev + "</button></div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.type") + '</span><div class="checks">' + TYP_ORDER.map(function (k) {
      return '<label class="check"><input type="checkbox" data-arr="typy" value="' + k + '"' + (S.typy.indexOf(k) >= 0 ? " checked" : "") + '><span class="swatch" style="background:' + TYPY[k].c + '"></span>' + LL(TYPY[k].n) + '<span class="cnt">' + (tc[k] || 0) + "</span></label>";
    }).join("") + "</div></div>";
    var eu = function (a) { return a.map(function (v) { return Math.round(v * EUR); }); };
    var pSteps = S.op === "dzierzawa" ? (EN() ? eu([50, 100, 250, 500, 1000]) : [200, 500, 1000, 2000, 5000]) : (EN() ? eu([10e3, 25e3, 50e3, 75e3, 100e3, 150e3, 200e3, 300e3, 500e3]) : [50e3, 100e3, 150e3, 200e3, 300e3, 400e3, 500e3, 750e3, 1e6, 2e6]);
    h += '<div class="fgroup"><span class="flabel">' + (S.op === "dzierzawa" ? t("f.rent") : t("f.price")) + "</span>" + selPair("cMin", "cMax", pSteps, function (v) { return EN() ? "€" + fmt(v / EUR) : short(v) + " zł"; }) + "</div>";
    if (S.op === "sprzedaz") h += '<div class="fgroup"><span class="flabel">' + t("f.ppm") + "</span>" + selPair("pmMin", "pmMax", EN() ? eu([10, 25, 50, 75, 100, 150]) : [50, 100, 150, 200, 300, 500], function (v) { return EN() ? "€" + fmt(v / EUR) : fmt(v) + " zł"; }) + "</div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.size") + "</span>" + selPair("powMin", "powMax", [300, 500, 800, 1000, 1500, 3000, 10000, 30000], area) + "</div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.plan") + "</span>" + checks("plan", PLAN, pc) + "</div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.media") + "</span>" + checks("media", MEDIA, null, true) + "</div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.access") + "</span>" + seg("dojazd", [["", t("f.acc.any")], ["asfalt", t("f.acc.asf")], ["utw", t("f.acc.hard")], ["pub", t("f.acc.pub")]]) + "</div>";
    var advN = S.okolica.length + (S.frontMin != null) + (S.lic !== "all") + S.ogl.length + (S.dni ? 1 : 0) + S.zw + S.podzial + S.favOnly;
    h += '<details class="adv" id="advFilters"' + (advOpen || advN ? " open" : "") + "><summary>" + t("f.more") + (advN ? ' <span class="adv-n">' + advN + "</span>" : "") + "</summary>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.around") + "</span>" + checks("okolica", OKOLICA, null, true) + "</div>";
    h += '<div class="fgroup"><label class="flabel" for="f-front">' + t("f.front") + '</label><select class="input" id="f-front" data-sel="frontMin"><option value="">' + t("sb.any") + "</option>" + [15, 20, 25, 30, 40].map(function (v) { return '<option value="' + v + '"' + (S.frontMin === v ? " selected" : "") + ">≥ " + v + " m</option>"; }).join("") + "</select></div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.auction") + "</span>" + seg("lic", [["all", t("f.auc.all")], ["bez", t("f.auc.no")], ["tylko", t("f.auc.only")]]) + "</div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.seller") + "</span>" + checks("ogl", OGL, null, true) + "</div>";
    h += '<div class="fgroup"><span class="flabel">' + t("f.added") + "</span>" + seg("dni", [[0, t("f.added.any")], [1, "24 h"], [2, "48 h"], [7, t("f.added.7")], [30, t("f.added.30")]]) + "</div>";
    h += '<div class="fgroup"><label class="check"><input type="checkbox" data-bool="zw"' + (S.zw ? " checked" : "") + ">" + t("f.verified") + "</label>";
    h += '<label class="check"><input type="checkbox" data-bool="podzial"' + (S.podzial ? " checked" : "") + ">" + t("f.split") + "</label>";
    h += '<label class="check"><input type="checkbox" data-bool="favOnly"' + (S.favOnly ? " checked" : "") + ">" + t("f.savedOnly") + "</label></div></details>";
    h += '<div class="filters-foot"><button class="btn btn-ghost" id="resetFilters">' + t("f.clear") + '</button><button class="btn btn-dark only-narrow" id="showResults">' + t("f.show", { n: current.length }) + "</button></div>";
    var fl = $("#filters"), ae = document.activeElement, key = null;
    if (ae && fl.contains(ae)) key = ae.id ? "#" + ae.id : ae.dataset.sel ? 'select[data-sel="' + ae.dataset.sel + '"]' : ae.dataset.arr ? 'input[data-arr="' + ae.dataset.arr + '"][value="' + ae.value + '"]' : ae.dataset.num ? 'input[data-num="' + ae.dataset.num + '"]' : ae.dataset.bool ? 'input[data-bool="' + ae.dataset.bool + '"]' : null;
    var st = fl.scrollTop;
    fl.innerHTML = h;
    fl.scrollTop = st;
    if (key) { var el = $(key, fl); if (el) el.focus({ preventScroll: true }); }
    var ad = $("#advFilters", fl); if (ad) ad.addEventListener("toggle", function () { advOpen = ad.open; });
  }
  function activeChips() {
    var a = [];
    if (S.q) { var Qa = resolveQuery(S.q); a.push(["q", (Qa.label || S.q) + (Qa.type === "town" && S.radius ? " + " + S.radius + " km" : "")]); }
    S.typy.forEach(function (k) { a.push(["typy:" + k, LL(TYPY[k].n)]); });
    if (S.cMin != null || S.cMax != null) a.push(["cena", (S.cMin != null ? "≥ " + short(S.cMin) + " " : "") + (S.cMax != null ? "≤ " + short(S.cMax) : "")]);
    if (S.pmMin != null || S.pmMax != null) a.push(["pm", "/m² " + (S.pmMin != null ? "≥ " + cur(S.pmMin) + " " : "") + (S.pmMax != null ? "≤ " + cur(S.pmMax) : "")]);
    if (S.powMin != null || S.powMax != null) a.push(["pow", (S.powMin != null ? "≥ " + area(S.powMin) + " " : "") + (S.powMax != null ? "≤ " + area(S.powMax) : "")]);
    S.plan.forEach(function (p) { a.push(["plan:" + p, LL(PLAN[p])]); });
    S.media.forEach(function (m) { a.push(["media:" + m, LL(MEDIA[m])]); });
    if (S.dojazd) a.push(["dojazd", { asfalt: t("f.acc.asf"), utw: t("f.acc.hard"), pub: t("f.acc.pub") }[S.dojazd]]);
    S.okolica.forEach(function (o) { a.push(["okolica:" + o, LL(OKOLICA[o])]); });
    if (S.frontMin != null) a.push(["front", "≥ " + S.frontMin + " m"]);
    if (S.podzial) a.push(["podzial", t("f.split")]);
    if (S.lic !== "all") a.push(["lic", S.lic === "tylko" ? t("f.auc.only") : t("f.auc.no")]);
    S.ogl.forEach(function (o) { a.push(["ogl:" + o, LL(OGL[o])]); });
    if (S.dni) a.push(["dni", t("f.added") + ": " + ({ 1: "24 h", 2: "48 h", 7: t("f.added.7"), 30: t("f.added.30") }[S.dni])]);
    if (S.zw) a.push(["zw", t("card.verified")]);
    if (S.favOnly) a.push(["favOnly", t("nav.saved")]);
    if (S.poly) a.push(["poly", t("map.drawnChip")]);
    if (S.bounds) a.push(["bounds", t("map.boundsChip")]);
    $("#activeFilters").innerHTML = a.map(function (x) { return '<button class="afchip" data-rm="' + esc(x[0]) + '" aria-label="× ' + esc(x[1]) + '">' + esc(x[1]) + ' <span aria-hidden="true">×</span></button>'; }).join("");
  }
  function removeFilter(key) {
    var p = key.split(":");
    if (key.indexOf("radius:") === 0) S.radius = +p[1];
    else if (p.length === 2) { S[p[0]] = S[p[0]].filter(function (v) { return v !== p[1]; }); }
    else if (key === "q") { S.q = ""; S.radius = 0; }
    else if (key === "cena") { S.cMin = S.cMax = null; }
    else if (key === "pm") { S.pmMin = S.pmMax = null; }
    else if (key === "pow") { S.powMin = S.powMax = null; }
    else if (key === "front") S.frontMin = null;
    else if (key === "lic") S.lic = "all";
    else if (key === "dni") S.dni = 0;
    else if (key === "dojazd") S.dojazd = "";
    else if (key === "poly") clearPoly(true);
    else if (key === "bounds") { S.bounds = null; $("#boundsOnly").checked = false; }
    else S[key] = false;
  }

  /* ---------- Wyniki ---------- */
  var current = [];
  function countWith(mod) {
    var st = Object.assign({}, S, { typy: S.typy.slice(), plan: S.plan.slice(), media: S.media.slice(), okolica: S.okolica.slice(), ogl: S.ogl.slice() });
    mod(st);
    return ALL.filter(function (d) { return matches(d, "", st); }).length;
  }
  function emptyHTML(Q) {
    var tips = [];
    if (Q.type === "postcode") return '<div class="empty"><b>' + t("res.postcodeH") + "</b>" + t("res.postcodeP") + "</div>";
    if (Q.type === "town" && S.radius < 25) [10, 25].forEach(function (r) { if (r > S.radius && !tips.length) { var n = countWith(function (s) { s.radius = r; }); if (n) tips.push(["radius:" + r, t("tip.radius", { r: r, a: Q.label }), n]); } });
    var keys = [];
    if (S.cMax != null || S.cMin != null) keys.push(["cena", t("tip.price"), function (s) { s.cMin = s.cMax = null; }]);
    if (S.powMin != null || S.powMax != null) keys.push(["pow", t("tip.size"), function (s) { s.powMin = s.powMax = null; }]);
    if (S.pmMin != null || S.pmMax != null) keys.push(["pm", t("tip.ppm"), function (s) { s.pmMin = s.pmMax = null; }]);
    S.typy.forEach(function (k) { keys.push(["typy:" + k, t("tip.without", { a: LL(TYPY[k].n) }), function (s) { s.typy = s.typy.filter(function (x) { return x !== k; }); }]); });
    S.plan.forEach(function (p) { keys.push(["plan:" + p, t("tip.without", { a: LL(PLAN[p]) }), function (s) { s.plan = s.plan.filter(function (x) { return x !== p; }); }]); });
    S.media.forEach(function (m) { keys.push(["media:" + m, t("tip.without", { a: LL(MEDIA[m]) }), function (s) { s.media = s.media.filter(function (x) { return x !== m; }); }]); });
    if (S.poly) keys.push(["poly", t("tip.area"), function (s) { s.poly = null; }]);
    if (S.q) keys.push(["q", t("tip.country"), function (s) { s.q = ""; }]);
    keys.forEach(function (k) { var n = countWith(k[2]); if (n) tips.push([k[0], k[1], n]); });
    tips.sort(function (a, b) { return b[2] - a[2]; });
    return '<div class="empty"><b>' + t("res.emptyH") + "</b>" + (tips.length ? t("res.emptyTry") + '<div class="tips">' + tips.slice(0, 3).map(function (x) { return '<button class="btn btn-ghost btn-sm" data-tip="' + esc(x[0]) + '">' + esc(x[1]) + ' <span class="muted">' + x[2] + " " + plural(x[2]) + "</span></button>"; }).join("") + "</div>" : t("res.emptyGeneric")) + "</div>";
  }
  function renderResults(keepShown) {
    if (!keepShown) shown = 20;
    current = sorted(ALL.filter(function (d) { return matches(d); }));
    var Q = resolveQuery(S.q);
    var head = S.favOnly ? t("res.saved") : S.lic === "tylko" ? t("res.auctions") : (S.typy.length === 1 ? LL(TYPY[S.typy[0]].plural) : t("res.plots")) + " " + (S.op === "dzierzawa" ? t("res.forLease") : t("res.forSale"));
    $("#resTitle").textContent = head + (S.q ? ": " + (Q.label || S.q) + (Q.type === "town" && S.radius ? " + " + S.radius + " km" : "") : "");
    $("#resCount").textContent = current.length + " " + plural(current.length);
    var hint = "";
    if (Q.corrected) hint += '<p class="qhint">' + t("res.corrected", { a: esc(Q.label), b: esc(Q.corrected) }) + "</p>";
    if (Q.type === "town") {
      hint += '<div class="radius" role="group"><span>' + t("res.distance") + "</span>" + [[0, t("res.only", { a: Q.label })], [5, "+5 km"], [10, "+10 km"], [25, "+25 km"]].map(function (o) {
        return '<button data-radius="' + o[0] + '" aria-pressed="' + (S.radius === o[0]) + '">' + esc(o[1]) + "</button>";
      }).join("") + "</div>";
    }
    $("#qHints").innerHTML = hint;
    activeChips();
    var g = $("#resultsGrid");
    if (!current.length) {
      g.innerHTML = S.favOnly ? '<div class="empty"><b>' + t("res.savedEmptyH") + "</b>" + t("res.savedEmptyP") + "</div>" : emptyHTML(Q);
      $("#more").innerHTML = ""; $("#avgLine").textContent = "";
    } else {
      g.innerHTML = current.slice(0, shown).map(cardHTML).join("");
      $("#more").innerHTML = current.length > shown ? '<button class="btn btn-ghost" id="moreBtn">' + t("res.more", { n: current.length - shown }) + "</button>" : "";
      var withPm = current.filter(ppm);
      if (withPm.length >= 3) {
        var med = withPm.map(ppm).sort(function (a, b) { return a - b; })[Math.floor(withPm.length / 2)];
        $("#avgLine").textContent = t("res.median", { v: fmt(EN() ? med / EUR : med), n: withPm.length });
      } else $("#avgLine").textContent = "";
    }
    renderFilters();
    updateMarkers();
    if (map) styleWoj();
  }

  /* ---------- Mapa ---------- */
  var baseLight, lyrFlood, lyrNatura, wojLayer, wojLabels;
  var WCOL = ["#e07a5f", "#3d85c6", "#81b29a", "#f2cc8f", "#9b5de5", "#00a6a6", "#f15bb5", "#8ac926", "#ff924c", "#4361ee", "#c9a227", "#2a9d8f", "#e76f51", "#6a4c93", "#43aa8b", "#b5838d"];
  function buildWoj() {
    if (!window.WOJ_GEO) return;
    var i = 0;
    wojLayer = L.geoJSON(window.WOJ_GEO, {
      style: function () { var c = WCOL[i++ % WCOL.length]; return { color: c, weight: 1.6, opacity: 0.9, fillColor: c, fillOpacity: 0.09 }; },
      onEachFeature: function (f, layer) {
        layer.on("click", function () {
          if (drawing || map.getZoom() >= 9) return;
          S.q = f.properties.n; S.radius = 0; renderResults(); map.fitBounds(layer.getBounds(), { padding: [20, 20] });
        });
        layer.on("mouseover", function () { if (map.getZoom() < 9) layer.setStyle({ fillOpacity: 0.2 }); });
        layer.on("mouseout", function () { styleWoj(); });
      }
    }).addTo(map);
    map.createPane("wojLbl"); map.getPane("wojLbl").style.zIndex = 450; map.getPane("wojLbl").style.pointerEvents = "none";
    wojLabels = L.layerGroup().addTo(map);
    styleWoj();
  }
  function styleWoj() {
    if (!wojLayer) return;
    var z = map.getZoom(), on = map.hasLayer(wojLayer);
    wojLayer.eachLayer(function (l) { l.setStyle({ fillOpacity: z >= 9 ? 0 : 0.09, weight: z >= 9 ? 2.2 : 1.6, interactive: z < 9 }); });
    wojLabels.clearLayers();
    if (!on || z >= 8) return;
    wojLayer.eachLayer(function (l) {
      var n = l.feature.properties.n, cnt = current.filter(function (d) { return d.woj === n; }).length;
      L.marker(l.getBounds().getCenter(), { pane: "wojLbl", interactive: false, keyboard: false, icon: L.divIcon({ className: "woj-lbl-wrap", html: '<span class="woj-lbl">' + esc(EN() ? WOJ_EN[n] : n) + "</span>", iconSize: [0, 0] }) }).addTo(wojLabels);
    });
  }
  var map, markerLayer, markers = {}, baseOsm, baseOrto, lyrDz, lyrMp, polyLayer, drawPts = [], drawLine, drawing = false, tileFail = false, drawGroup;
  var HAS_L = typeof window.L !== "undefined";
  function initMap() {
    if (map || !HAS_L) return;
    map = L.map("map", { zoomControl: true }).setView([52.1, 19.4], 6);
    map.attributionControl.setPrefix(false);
    baseLight = L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { maxZoom: 19, subdomains: "abcd", attribution: "© OpenStreetMap, © CARTO" });
    baseOsm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" });
    baseOrto = L.tileLayer.wms("https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution", { layers: "Raster", format: "image/jpeg", maxZoom: 20, attribution: "© GUGiK" });
    lyrDz = L.tileLayer.wms("https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow", { layers: "dzialki,numery_dzialek", format: "image/png", transparent: true, minZoom: 15, maxZoom: 20, attribution: "© GUGiK (KIEG)" });
    lyrMp = L.tileLayer.wms("https://mapy.geoportal.gov.pl/wss/ext/KrajowaIntegracjaMiejscowychPlanowZagospodarowaniaPrzestrzennego", { layers: "raster,wektor-str,wektor-lzb,wektor-pow,wektor-lin,wektor-pkt,granice", format: "image/png", transparent: true, minZoom: 12, maxZoom: 20, opacity: 0.75, attribution: "© GUGiK (KIMPZP)" });
    lyrFlood = L.tileLayer.wms("https://wody.isok.gov.pl/wss/INSPIRE/INSPIRE_NZ_HY_MZPMRP_WMS", { layers: "NZ.Fluvial,NZ.SeaWater", format: "image/png", transparent: true, version: "1.3.0", minZoom: 9, maxZoom: 20, opacity: 0.7, attribution: "© Wody Polskie (ISOK)" });
    lyrNatura = L.tileLayer.wms("https://sdi.gdos.gov.pl/wms", { layers: "GDOS:SpecjalneObszaryOchrony,GDOS:ObszarySpecjalnejOchrony", format: "image/png", transparent: true, opacity: 0.6, attribution: "© GDOŚ" });
    [[lyrFlood, "map.flood"], [lyrNatura, "map.natura"]].forEach(function (x) { var warned = false; x[0].on("tileerror", function () { if (!warned) { warned = true; toast(t("map.layerFail", { n: t(x[1]) })); } }); });
    [baseLight, baseOsm, baseOrto, lyrDz, lyrMp].forEach(function (l) {
      l.on("tileerror", function () {
        if (tileFail) return; tileFail = true;
        var n = $("#mapNote"); n.hidden = false;
        n.innerHTML = "<span>" + t("map.blocked") + '</span><button class="note-x" aria-label="' + esc(t("d.close")) + '">' + ICON.close + "</button>";
        $(".note-x", n).addEventListener("click", function () { n.hidden = true; });
      });
    });
    baseLight.addTo(map);
    buildWoj();
    markerLayer = L.layerGroup().addTo(map);
    drawGroup = L.layerGroup().addTo(map);
    ALL.forEach(addMarker);
    map.on("zoomend", function () { styleWoj(); if (!$("#boundsOnly").checked) updateMarkers(); });
    map.on("moveend", function () { if ($("#boundsOnly").checked) { S.bounds = map.getBounds(); renderResults(true); } });
    map.on("click", onMapClick);
    map.on("click", function () { var l = $("#layers"); if (!l.hidden) { l.hidden = true; $("#layersBtn").setAttribute("aria-expanded", "false"); } });
    map.on("dblclick", function () { if (drawing && drawPts.length >= 3) finishDraw(); });
    $$('#layers input[name="base"]').forEach(function (r) {
      r.addEventListener("change", function () {
        [baseLight, baseOsm, baseOrto].forEach(function (b) { if (map.hasLayer(b)) map.removeLayer(b); });
        ({ light: baseLight, osm: baseOsm, orto: baseOrto }[r.value]).addTo(map).bringToBack();
      });
    });
    $("#lyrDzialki").addEventListener("change", function (e) { if (e.target.checked) { lyrDz.addTo(map); if (map.getZoom() < 15) toast(t("map.zoomParcels")); } else map.removeLayer(lyrDz); });
    $("#lyrWoj").addEventListener("change", function (e) { if (e.target.checked) wojLayer.addTo(map); else map.removeLayer(wojLayer); styleWoj(); });
    $("#lyrFlood").addEventListener("change", function (e) { if (e.target.checked) { lyrFlood.addTo(map); if (map.getZoom() < 9) toast(t("map.zoomFlood")); } else map.removeLayer(lyrFlood); });
    $("#lyrNatura").addEventListener("change", function (e) { if (e.target.checked) lyrNatura.addTo(map); else map.removeLayer(lyrNatura); });
    $("#lyrMpzp").addEventListener("change", function (e) { if (e.target.checked) { lyrMp.addTo(map); if (map.getZoom() < 12) toast(t("map.zoomMpzp")); } else map.removeLayer(lyrMp); });
    updateMarkers();
    fitToResults();
  }
  function pinHTML(d) { return '<span class="pin" style="--pc:' + TYPY[d.typ].c + '"><img src="' + photoSrc(d) + '" alt="">' + (d.op === "dzierzawa" ? money(d.cena) + t("card.perMonth") : short(d.cena)) + "</span>"; }
  function addMarker(d) {
    if (!map) return;
    var m = L.marker([d.lat, d.lng], { icon: L.divIcon({ className: "pin-wrap", html: pinHTML(d), iconSize: [0, 0] }), keyboard: true, title: d.tytul, riseOnHover: true });
    m.bindPopup(function () {
      return '<div class="pop">' + photo(d) + '<div class="pb"><span class="price">' + priceLabel(d) + '</span><div class="t">' + area(d.pow) + " · " + LL(TYPY[d.typ].n) + " · " + esc(planText(d)) + '</div><div class="s">' + esc(d.miejscowosc) + ", " + esc(d.gmina) + '</div><button class="btn btn-dark btn-sm" data-open="' + d.id + '">' + t("map.see") + "</button></div></div>";
    }, { maxWidth: 260, minWidth: 250 });
    m.on("mouseover", function () { hilite(d.id, true); });
    m.on("mouseout", function () { hilite(d.id, false); });
    markers[d.id] = m;
  }
  function refreshMarkerIcons() { if (!map) return; ALL.forEach(function (d) { if (markers[d.id]) markers[d.id].setIcon(L.divIcon({ className: "pin-wrap", html: pinHTML(d), iconSize: [0, 0] })); }); }
  function updateMarkers() {
    if (!map) return;
    markerLayer.clearLayers();
    var z = map.getZoom();
    var items = current.filter(function (d) { return markers[d.id]; }).map(function (d) { return { d: d, p: map.project([d.lat, d.lng], z) }; });
    var R = z >= 13 ? 0 : 54, used = new Array(items.length);
    for (var i = 0; i < items.length; i++) {
      if (used[i]) continue;
      var group = [items[i]]; used[i] = true;
      if (R) for (var k = i + 1; k < items.length; k++) { if (!used[k] && items[i].p.distanceTo(items[k].p) < R) { used[k] = true; group.push(items[k]); } }
      if (group.length === 1) { markerLayer.addLayer(markers[group[0].d.id]); continue; }
      var lat = 0, lng = 0; group.forEach(function (g) { lat += g.d.lat; lng += g.d.lng; });
      var cm = L.marker([lat / group.length, lng / group.length], { icon: L.divIcon({ className: "pin-wrap", html: '<span class="cluster' + (group.length >= 10 ? " big" : "") + '">' + group.length + "</span>", iconSize: [0, 0] }), title: t("map.cluster", { n: group.length }), keyboard: true });
      (function (gr) { cm.on("click", function () { map.fitBounds(L.latLngBounds(gr.map(function (g) { return [g.d.lat, g.d.lng]; })).pad(0.3), { maxZoom: 14 }); }); })(group);
      markerLayer.addLayer(cm);
    }
  }
  function fitToResults() {
    if (!map || !current.length || S.bounds) return;
    map.fitBounds(L.latLngBounds(current.map(function (d) { return [d.lat, d.lng]; })).pad(0.15), { maxZoom: 12 });
  }
  function hilite(id, on) {
    var c = $('.card[data-id="' + id + '"]', $("#resultsGrid")); if (c) c.classList.toggle("is-hot", on);
    var m = markers[id]; if (m && m._icon) { var p = m._icon.querySelector(".pin"); if (p) p.classList.toggle("hot", on); m.setZIndexOffset(on ? 1000 : 0); }
  }
  function onMapClick(e) {
    if (!drawing) return;
    var ll = [e.latlng.lat, e.latlng.lng];
    if (drawPts.length >= 3) {
      var first = map.latLngToContainerPoint(drawPts[0]), now = map.latLngToContainerPoint(e.latlng);
      if (first.distanceTo(now) < 18) { finishDraw(); return; }
    }
    drawPts.push(ll);
    if (drawLine) map.removeLayer(drawLine);
    drawLine = L.polyline(drawPts, { color: "#111814", weight: 2.5, dashArray: "6 5" }).addTo(map);
    L.circleMarker(ll, { radius: drawPts.length === 1 ? 7 : 4, color: "#111814", fillColor: "#fff", fillOpacity: 1, weight: 2 }).addTo(drawGroup);
  }
  function startDraw() {
    clearPoly(true); drawing = true; drawPts = [];
    map.getContainer().classList.add("is-drawing");
    $("#drawBtn").setAttribute("aria-pressed", "true"); $("#drawLbl").textContent = t("map.finish"); $("#drawHint").hidden = false;
    map.getContainer().style.cursor = "crosshair"; map.doubleClickZoom.disable();
  }
  function finishDraw() {
    drawing = false; map.getContainer().style.cursor = ""; map.getContainer().classList.remove("is-drawing"); map.doubleClickZoom.enable();
    $("#drawBtn").setAttribute("aria-pressed", "false"); $("#drawLbl").textContent = t("map.draw"); $("#drawHint").hidden = true;
    if (drawLine) { map.removeLayer(drawLine); drawLine = null; }
    drawGroup.clearLayers();
    if (drawPts.length < 3) { drawPts = []; return; }
    S.poly = drawPts.slice();
    polyLayer = L.polygon(S.poly, { color: "#111814", weight: 2.5, fillColor: "#1d6a3a", fillOpacity: 0.08, dashArray: "8 6" }).addTo(map);
    $("#clearDraw").hidden = false;
    renderResults();
    toast(t("map.inArea", { n: current.length }));
  }
  function clearPoly(silent) {
    S.poly = null; if (polyLayer && map) { map.removeLayer(polyLayer); polyLayer = null; }
    if (drawLine && map) { map.removeLayer(drawLine); drawLine = null; }
    if (drawGroup) drawGroup.clearLayers();
    drawPts = []; var cb = $("#clearDraw"); if (cb) cb.hidden = true;
    if (!silent && map) renderResults();
  }

  /* ---------- Karta działki ---------- */
  function notaryMax(v) {
    if (v <= 3000) return 100;
    if (v <= 10000) return 100 + 0.03 * (v - 3000);
    if (v <= 30000) return 310 + 0.02 * (v - 10000);
    if (v <= 60000) return 710 + 0.01 * (v - 30000);
    if (v <= 1000000) return 1010 + 0.004 * (v - 60000);
    if (v <= 2000000) return 4770 + 0.002 * (v - 1000000);
    return Math.min(6770 + 0.0025 * (v - 2000000), 10000);
  }
  function calcHTML(cena, firma) {
    var pcc = firma ? 0 : cena * 0.02, not = notaryMax(cena), vat = not * 0.23, kw = 200, wyp = 150, tr = EN() ? 1200 : 0;
    var total = pcc + not + vat + kw + wyp + tr;
    return '<div class="row"><span>' + t("c.pcc") + (firma ? t("c.pccNo") : "") + '</span><span class="num">' + money(pcc) + "</span></div>" +
      '<div class="row"><span>' + t("c.notary") + '</span><span class="num">' + money(not) + "</span></div>" +
      '<div class="row"><span>' + t("c.vat") + '</span><span class="num">' + money(vat) + "</span></div>" +
      '<div class="row"><span>' + t("c.kw") + '</span><span class="num">' + money(kw) + "</span></div>" +
      '<div class="row"><span>' + t("c.copies") + '</span><span class="num">' + money(wyp) + "</span></div>" +
      (tr ? '<div class="row"><span>' + t("c.translator") + '</span><span class="num">' + money(tr) + "</span></div>" : "") +
      '<div class="row total"><span>' + t("c.total") + '</span><span class="num">' + money(total) + "</span></div>" +
      '<div class="row"><span>' + t("c.withPrice") + '</span><span class="num"><b>' + money(total + cena) + "</b></span></div>" +
      "<small>" + t("c.note") + (EN() ? " " + t("eur.note") : "") + "</small>";
  }
  function nearestCity(d) {
    var best = null; CITIES.forEach(function (c) { var tw = TOWNS.find(function (x) { return x.m === c.q; }); if (!tw) return; var k = dist(d.lat, d.lng, tw.lat, tw.lng); if (!best || k < best.k) best = { c: c, k: k, ap: dist(d.lat, d.lng, c.ap[0], c.ap[1]) }; });
    return best;
  }

  var detailMap, detailPushed = false, curDetail = null;
  function openDetail(id, fromHash) {
    var d = ALL.find(function (x) { return x.id === id; }); if (!d) return;
    curDetail = id;
    if (!fromHash) { pushHash("d" + id); detailPushed = true; } else detailPushed = false;
    pushRecent(id);
    var pm = ppm(d), p = d.plan || {}, ver = d.zweryfikowany;
    var initials = d.ogl.nazwa.replace(/\(.*\)/, "").trim().split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase();
    var dark = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches && document.documentElement.getAttribute("data-theme") !== "light") || document.documentElement.getAttribute("data-theme") === "dark";
    var utils = Object.keys(MEDIA).map(function (k) {
      var m = d.media[k] || { s: "brak" };
      var cls = m.s === "na_dzialce" ? "on" : m.s === "w_drodze" ? "road" : m.s === "w_poblizu" ? "near" : "off";
      return '<div class="urow ' + cls + '">' + ICON[k] + "<div><b>" + LL(MEDIA[k]) + '</b><span class="st">' + LL(MEDIA_ST[m.s]) + (m.m ? ", " + t("approx") + m.m + " m" : "") + "</span></div></div>";
    }).join("") + '<div class="urow road">' + ICON.road + "<div><b>" + t("f.access") + '</b><span class="st">' + t("access." + d.dojazd) + "</span></div></div>";
    var facts = [
      [t("fact.size"), area(d.pow)], [t("fact.type"), LL(TYPY[d.typ].n)],
      [t("fact.front"), d.front ? t("approx") + d.front + " m" : t("nodata")], [t("fact.shape"), t("shape." + d.ksztalt)],
      [t("fact.terrain"), t("terrain." + d.uksztaltowanie)], [t("fact.fence"), d.ogrodzenie ? t("yes") : t("no")],
      [t("fact.road"), d.drogaPubliczna ? t("road.public") : t("road.private")], [t("fact.split"), d.podzial ? t("yes") + (d.minPow ? ", ≥ " + area(d.minPow) : "") : t("no")],
      [t("fact.nr"), d.nr + t("sample")], [t("fact.gmina"), d.gmina]
    ];
    if (d.klasa) facts.push([t("fact.class"), d.klasa]);
    if (d.wodaM) facts.push([t("fact.water"), t("approx") + d.wodaM + " m"]);
    var nc = nearestCity(d);
    if (EN() && nc) { facts.push([t("fact.city"), LL(nc.c.n) + ", " + Math.round(nc.k) + " km"]); facts.push([t("fact.airport"), Math.round(nc.ap) + " km"]); }

    var planBody;
    if (p.status === "MPZP") {
      planBody = '<div class="facts"><div><span>' + t("z.status") + "</span><b>" + t("z.mpzp") + "</b></div><div><span>" + t("z.use") + "</span><b>" + esc(p.symbol) + (EN() && SYMBOL_EN[p.symbol] ? " (" + SYMBOL_EN[p.symbol] + ")" : "") + "</b></div>" +
        (p.zabudowa ? "<div><span>" + t("z.cover") + "</span><b>" + p.zabudowa + "%</b></div>" : "") +
        (p.bio ? "<div><span>" + t("z.bio") + "</span><b>" + p.bio + "%</b></div>" : "") +
        (p.wysokosc ? "<div><span>" + t("z.height") + "</span><b>" + String(p.wysokosc).replace(".", EN() ? "." : ",") + " m</b></div>" : "") +
        (p.zabudowa && d.pow ? "<div><span>" + t("z.footprint") + "</span><b>" + t("approx") + area(d.pow * p.zabudowa / 100) + "</b></div>" : "") + "</div>";
    } else if (p.status === "WZ") planBody = '<p class="desc">' + t("z.wz", { s: esc(EN() ? "housing" : p.symbol) }) + "</p>";
    else if (p.status === "WZ_w_toku") planBody = '<p class="desc">' + t("z.wzp") + "</p>";
    else planBody = '<p class="desc">' + t("z.none") + "</p>";

    var callouts = "";
    if (d.licytacja) callouts += '<div class="callout">' + ICON.gavel + "<div><b>" + (d.licytacja.rodzaj === "przetarg gminny" ? t("card.tender") : t("card.auction")) + ", " + new Date(d.licytacja.data).toLocaleDateString(loc(), { day: "numeric", month: "long", year: "numeric" }) + "</b><p>" + t("legal.auction") + "</p></div></div>";
    var legal = ver
      ? '<div class="callout ok">' + ICON.shield + "<div><b>" + t("legal.verH") + "</b><p>" + t("legal.verP", { d: dateLabel(Math.max(d.dodano - 1, 0)) }) + "</p></div></div>"
      : '<div class="callout info">' + ICON.info + "<div><b>" + t("legal.unverH") + "</b><p>" + (d.kw === "brak" ? t("legal.noKw") : t("legal.kw")) + "</p></div></div>";
    if (d.hipoteka) legal += '<div class="callout warn">' + ICON.warn + "<div><b>" + t("legal.mortH") + "</b><p>" + t("legal.mortP") + "</p></div></div>";
    if (d.sluzebnosc) legal += '<div class="callout warn">' + ICON.warn + "<div><b>" + t("legal.servH") + "</b><p>" + t("legal.servP") + "</p></div></div>";

    var who = buyer || (EN() ? null : "pl");
    var buyBox = '<section class="dsec" id="buySec"><h2>' + t("buy.title") + '</h2><div class="buyer-row"><span class="muted">' + t("buy.as") + ':</span><div class="buyer-pick">' + buyerPick(who) + '</div></div><div id="buyAns">' + buyAnswer(d, who) + "</div></section>";

    var hist = d.historia && d.historia.length ? '<section class="dsec"><h2>' + t("d.history") + '</h2><div class="timeline"><div><span>' + t("hist.added", { d: dateLabel(d.dodano) }) + '</span><b class="num">' + money(d.historia[0].cena) + "</b></div><div><span>" + t("hist.cut", { d: dateLabel(Math.max(d.dodano - 3, 0)) }) + '</span><b class="num">' + money(d.cena) + " (−" + Math.round((1 - d.cena / d.historia[0].cena) * 100) + "%)</b></div></div></section>" : "";
    var similar = ALL.filter(function (x) { return x.id !== d.id && x.typ === d.typ && x.op === d.op; }).sort(function (a, b) { return Math.hypot(a.lat - d.lat, a.lng - d.lng) - Math.hypot(b.lat - d.lat, b.lng - d.lng); }).slice(0, 3);
    var srcTag = '<span class="src ' + (ver ? "ver" : "decl") + '">' + (ver ? t("d.verifiedSrc") : t("d.declSrc")) + "</span>";
    var priceSub = (pm ? ppmLabel(d) + " · " : "") + area(d.pow) + (EN() ? " · " + fmtZl(d.cena) : "");

    var h = '<div class="overlay" id="detailOverlay"><div class="drawer" role="dialog" aria-modal="true" aria-label="' + esc(title(d)) + '">' +
      '<div class="drawer-top"><button class="icon-btn" data-close aria-label="' + esc(t("d.close")) + '">' + ICON.close + '</button><span class="crumb">' + esc(d.woj) + " / " + esc(d.powiat) + " / " + esc(d.miejscowosc) + "</span>" +
      '<button class="btn btn-ghost btn-sm" id="dShare">' + ICON.share + '<span class="lbl">' + t("d.share") + "</span></button>" + favBtn(d, "icon-btn") + "</div>" +
      '<div class="detail"><div class="gallery">' +
      "<figure>" + photo(d) + '<div class="overlay-tl">' + chips(d, 3) + "</div><figcaption>" + t("d.photo") + "</figcaption></figure>" +
      "<figure>" + photo(d, 1) + "<figcaption>" + t("d.photo2") + "</figcaption></figure>" +
      '<figure><img src="' + (window.Aerial ? window.Aerial.plan(d, 460, 280, dark) : "") + '" alt="' + esc(t("d.scheme")) + '"><figcaption>' + t("d.scheme") + "</figcaption></figure></div>" +
      '<div class="detail-grid"><div class="dmain">' +
      '<div class="dhead"><h1>' + esc(title(d)) + '</h1><div class="loc">' + esc(d.miejscowosc) + ", " + esc(d.gmina) + ", " + esc(d.powiat) + ", " + esc(d.woj) + " · " + t("d.added", { d: daysLabel(d.dodano) }) + "</div></div>" +
      '<div class="keystats"><div><span>' + t("d.price") + "</span><b>" + priceLabel(d) + "</b></div><div><span>" + t("d.size") + "</span><b>" + area(d.pow) + "</b></div><div><span>" + t("d.ppm") + "</span><b>" + (pm ? ppmLabel(d).replace("/m²", "") : "–") + "</b></div><div><span>" + t("d.plan") + "</span><b>" + esc(planText(d)) + "</b></div></div>" +
      (callouts ? '<div class="callouts">' + callouts + "</div>" : "") +
      (EN() || d.typ === "rod" || ((d.typ === "rolna" || d.typ === "siedliskowa") && d.pow >= 3000) ? buyBox : "") +
      '<section class="dsec"><h2>' + t("d.desc") + '</h2><p class="desc">' + esc(EN() ? descEN(d) : d.opis) + "</p>" + (EN() ? '<p class="muted small">' + t("d.autoTr") + "</p>" : "") + "</section>" +
      '<section class="dsec"><h2>' + t("d.details") + '</h2><div class="facts">' + facts.map(function (f) { return "<div><span>" + f[0] + "</span><b>" + esc(f[1]) + "</b></div>"; }).join("") + "</div></section>" +
      '<section class="dsec"><h2>' + t("d.zoning") + " " + srcTag + "</h2>" + planBody + "</section>" +
      '<section class="dsec"><h2>' + t("d.utilities") + " " + srcTag + '</h2><div class="utils">' + utils + "</div></section>" +
      '<section class="dsec"><h2>' + t("d.legal") + "</h2>" + legal + "</section>" +
      (!EN() && !(d.typ === "rod" || ((d.typ === "rolna" || d.typ === "siedliskowa") && d.pow >= 3000)) ? buyBox : "") +
      '<section class="dsec"><h2>' + t("d.location") + '</h2><div class="minimap" id="minimap"></div><p class="muted small" style="margin-top:10px">' + t("d.locNote") + ' <a href="https://www.google.com/maps/search/?api=1&query=' + d.lat + "," + d.lng + '" target="_blank" rel="noopener">Google Maps</a> · <a href="https://mapy.geoportal.gov.pl/" target="_blank" rel="noopener">Geoportal</a></p></section>' +
      hist +
      hazardHTML(d) + stepsHTML(d) +
      (similar.length ? '<section class="dsec"><h2>' + t("d.similar") + '</h2><div class="grid-cards sim">' + similar.map(cardHTML).join("") + "</div></section>" : "") +
      "</div>" +
      '<aside class="dside"><div class="sticky-side">' +
      '<div class="panel"><div class="price">' + priceLabel(d) + '</div><div class="muted">' + priceSub + "</div>" +
      '<div class="who"><div class="avatar">' + esc(initials || "D") + "</div><div><b>" + esc(d.ogl.nazwa) + "</b><span>" + LL(OGL[d.ogl.typ]) + (ver ? " · " + t("card.verified").toLowerCase() : "") + (EN() ? " · " + t("d.speaks") : "") + "</span></div></div>" +
      '<form class="contact-form" id="contactForm"><label class="flabel" for="cMsg">' + t("d.msg") + '</label><textarea class="input" id="cMsg" rows="4">' + esc(t("d.msgText", { a: d.miejscowosc })) + "</textarea>" +
      '<input class="input" id="cMail" type="email" placeholder="' + esc(t("d.email")) + '" aria-label="' + esc(t("d.email")) + '">' +
      '<button class="btn btn-primary" type="submit">' + t("d.send") + '</button><button class="btn btn-ghost" type="button" id="showPhone">' + ICON.phone + t("d.phone") + "</button></form>" +
      '<div class="side-actions"><button class="btn btn-ghost btn-sm" id="priceAlert">' + ICON.bell + t("d.alert") + "</button>" + (d.op === "sprzedaz" ? '<button class="btn btn-ghost btn-sm" id="offerToggle">' + t("d.offer") + "</button>" : "") + "</div>" +
      '<div id="offerBox" hidden style="margin-top:10px"><div class="pair"><input class="input num" id="offer" inputmode="numeric" placeholder="' + fmt(cur(d.cena * 0.93)) + '" aria-label="' + esc(t("d.offer")) + '"><button class="btn btn-dark" id="offerBtn">' + t("d.offerSend") + "</button></div></div></div>" +
      (d.op === "sprzedaz" ? '<div class="panel calc"><h3>' + t("d.costs") + '</h3><div class="seg" id="calcSeg" style="margin-bottom:10px"><button data-f="0" aria-pressed="true">' + t("d.fromPriv") + '</button><button data-f="1" aria-pressed="false">' + t("d.fromFirm") + '</button></div><div id="calcBody">' + calcHTML(d.cena, false) + "</div></div>" : "") +
      "</div></aside></div></div>" +
      '<div class="mbar"><div><div class="price">' + priceLabel(d) + '</div><div class="muted">' + area(d.pow) + (pm ? " · " + ppmLabel(d) : "") + '</div></div><button class="btn btn-ghost" id="mbarCall" aria-label="' + esc(t("d.phone")) + '">' + ICON.phone + '</button><button class="btn btn-primary" id="mbarMsg">' + t("d.write") + "</button></div>" +
      "</div></div>";

    $("#overlayRoot").innerHTML = h;
    document.body.style.overflow = "hidden";
    var ov = $("#detailOverlay");
    ov.addEventListener("click", function (e) {
      if (e.target === ov || e.target.closest("[data-close]")) { closeDetail(); return; }
      var b = e.target.closest("[data-buyer]"); if (b) { buyer = b.dataset.buyer; store.set("buyer", buyer); $(".buyer-pick", ov).innerHTML = buyerPick(buyer); $("#buyAns").innerHTML = buyAnswer(d, buyer); return; }
      var c = e.target.closest(".card[data-id]"); if (c && !e.target.closest("[data-fav]")) openDetail(+c.dataset.id);
    });
    $("#contactForm").addEventListener("submit", function (e) { e.preventDefault(); toast(t("t.msg")); });
    $("#showPhone").addEventListener("click", function (e) { e.currentTarget.textContent = t("d.phoneDemo"); });
    $("#mbarCall").addEventListener("click", function () { toast(t("d.phoneDemo")); });
    $("#mbarMsg").addEventListener("click", function () { $("#contactForm").scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(function () { $("#cMsg").focus({ preventScroll: true }); }, 400); });
    $("#priceAlert").addEventListener("click", function () { toast(t("t.alert")); });
    var ot = $("#offerToggle"); if (ot) ot.addEventListener("click", function () { $("#offerBox").hidden = !$("#offerBox").hidden; if (!$("#offerBox").hidden) $("#offer").focus(); });
    var ob = $("#offerBtn"); if (ob) ob.addEventListener("click", function () { var v = num($("#offer").value); toast(v ? t("t.offerOk", { v: EN() ? "€" + fmt(v) : fmtZl(v) }) : t("t.offerErr")); });
    $("#dShare").addEventListener("click", function () {
      var url = location.href.split("#")[0] + "#d" + d.id;
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(function () { toast(t("t.link")); }, function () { toast(url); });
      else toast(url);
    });
    var cs = $("#calcSeg"); if (cs) cs.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      $$("button", cs).forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      $("#calcBody").innerHTML = calcHTML(d.cena, b.dataset.f === "1");
    });
    if (HAS_L) setTimeout(function () {
      if (detailMap) { try { detailMap.remove(); } catch (e) { /* ignoruj */ } }
      detailMap = L.map("minimap", { zoomControl: true, scrollWheelZoom: false, attributionControl: false }).setView([d.lat, d.lng], 14);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(detailMap);
      L.circle([d.lat, d.lng], { radius: Math.max(Math.sqrt(d.pow) / 1.6, 15), color: "#111814", weight: 2, dashArray: "5 4", fillColor: TYPY[d.typ].c, fillOpacity: .3 }).addTo(detailMap);
      L.marker([d.lat, d.lng], { icon: L.divIcon({ className: "pin-wrap", html: '<span class="pin hot" style="--pc:' + TYPY[d.typ].c + '">' + area(d.pow) + "</span>", iconSize: [0, 0] }) }).addTo(detailMap);
    }, 30);
    $("[data-close]", ov).focus();
  }
  function closeDetail(fromPop) {
    if (!fromPop && detailPushed && /^#d\d+$/.test(location.hash)) { detailPushed = false; history.back(); return; }
    if (detailMap) { try { detailMap.remove(); } catch (e) { /* ignoruj */ } detailMap = null; }
    curDetail = null;
    $("#overlayRoot").innerHTML = ""; document.body.style.overflow = "";
    if (!fromPop && /^#d\d+$/.test(location.hash)) setHash(currentView === "home" ? "start" : currentView);
    if (currentView === "home") renderRecent();
  }

  /* ---------- Ścieżka krok po kroku i zagrożenia ---------- */
  var KR = window.KROKI;
  var ST_ICON = { done: "check", todo: "arrow", check: "info", warn: "warn", cond: "info" };
  function stepItem(x, n, d) {
    var k = x.k, who = LL(k.who);
    return '<li class="step st-' + x.s + '"><span class="step-n">' + (x.s === "done" ? ICON.check : n) + '</span><div class="step-b"><div class="step-h"><b>' + LL(k.t) + '</b><span class="step-tag">' + (x.s === "cond" ? t("steps.cond") + ": " + LL(k.cond) : t("steps." + x.s)) + "</span></div>" +
      (x.n ? '<p class="step-note">' + esc(LL(x.n)) + "</p>" : "") + (k.p && x.s !== "done" ? '<p class="muted">' + LL(k.p) + "</p>" : "") +
      (x.s !== "done" ? '<div class="step-meta"><span>' + t("steps.who") + ": <b>" + who + "</b></span>" + (LL(k.time) !== "-" ? "<span>" + t("steps.time") + ": " + LL(k.time) + "</span><span>" + t("steps.cost") + ": " + LL(k.cost) + "</span>" : "") +
        '<button class="btn btn-ghost btn-sm" data-pro="' + esc(who) + '" data-near="' + esc(d ? d.powiat : "") + '">' + t("steps.find", { w: who.split(",")[0] }) + "</button></div>" : "") + "</div></li>";
  }
  function stepsList(list, d) {
    var html = "", ph = null, n = 0;
    list.forEach(function (x) {
      if (x.k.ph !== ph) { if (ph) html += "</ol>"; ph = x.k.ph; html += '<h3 class="phase">' + LL(KR.PH[ph]) + '</h3><ol class="steps">'; }
      n++; html += stepItem(x, n, d);
    });
    return html + "</ol>";
  }
  function stepsHTML(d) {
    if (!KR) return "";
    var list = KR.build(d), g = KR.GOALS[KR.goalFor(d)];
    var c = list.filter(function (x) { return x.s === "check"; }).length, w = list.filter(function (x) { return x.s === "warn"; }).length, dn = list.filter(function (x) { return x.s === "done"; }).length;
    return '<section class="dsec" id="stepsSec"><h2>' + t("steps.title") + '</h2><p class="muted">' + t("steps.goal") + ": <b>" + LL(g.n) + "</b> · " + t("steps.sum", { c: c, w: w, d: dn }) + "</p>" + stepsList(list, d) + '<p class="muted small">' + t("guide2.draft") + "</p></section>";
  }
  function hazardHTML(d) {
    if (!KR) return "";
    var h = KR.hazards(d);
    return '<section class="dsec"><h2>' + t("hz.title") + "</h2>" + (h.length ? h.map(function (x) { var z = KR.HZ[x[1]]; return '<div class="callout ' + x[0] + '">' + (x[0] === "warn" ? ICON.warn : ICON.info) + "<div><b>" + LL(z[0]) + "</b><p>" + LL(z[1]) + "</p></div></div>"; }).join("") : '<p class="desc">' + t("hz.none") + "</p>") + '<p class="muted small">' + t("hz.note") + "</p></section>";
  }
  var guideGoal = "dom";
  function renderGuide() {
    if (!KR) return;
    var goals = ["dom", "letnisko", "siedlisko", "hala"];
    $("#goalTabs").innerHTML = goals.map(function (g) { return '<button role="tab" data-goal="' + g + '" aria-selected="' + (guideGoal === g) + '"><b>' + LL(KR.GOALS[g].n) + "</b><span>" + LL(KR.GOALS[g].d) + "</span></button>"; }).join("") +
      '<button role="tab" data-goal="sell" aria-selected="' + (guideGoal === "sell") + '"><b>' + t("guide2.sell") + "</b><span>" + t("top.addListing") + "</span></button>";
    if (guideGoal === "sell") {
      $("#guideBody").innerHTML = '<ol class="steps">' + KR.SELL.map(function (x, i) { return '<li class="step st-todo"><span class="step-n">' + (i + 1) + '</span><div class="step-b"><div class="step-h"><b>' + LL(x[0]) + '</b></div><p class="muted">' + LL(x[1]) + "</p></div></li>"; }).join("") + "</ol>";
    } else $("#guideBody").innerHTML = stepsList(KR.build(null, guideGoal), null) + '<p class="muted small" style="margin-top:14px">' + t("guide2.draft") + "</p>";
  }

  /* ---------- Dodawanie ogłoszenia (demo) ---------- */
  var draft;
  function openAdd() {
    draft = { step: 1, town: "", nr: "", pow: "", typ: "", plan: "", media: { prad: "brak", woda: "brak", kanalizacja: "brak", gaz: "brak", swiatlowod: "brak" }, dojazd: "", cena: "", opis: "", seed: Math.floor(Math.random() * 1e6) };
    renderAdd(); document.body.style.overflow = "hidden";
  }
  function closeAdd() { $("#overlayRoot").innerHTML = ""; document.body.style.overflow = ""; }
  function renderAdd() {
    var s = draft.step, body = "";
    if (s === 1) {
      body = '<div class="row2"><div class="field"><label for="a-town">' + t("add.town") + '</label><input class="input" id="a-town" list="towns" value="' + esc(draft.town) + '" placeholder="Luzino"></div>' +
        '<div class="field"><label for="a-nr">' + t("add.nr") + '</label><div class="registry"><input class="input" id="a-nr" value="' + esc(draft.nr) + '" placeholder="123/4"><button class="btn btn-ghost" type="button" id="a-fetch">' + t("add.fetch") + "</button></div></div></div>" +
        '<div class="field"><label for="a-pow">' + t("add.size") + '</label><input class="input num" id="a-pow" inputmode="numeric" value="' + esc(draft.pow) + '" placeholder="' + esc(t("add.sizePh")) + '"></div>' +
        '<div class="callout">' + ICON.info + "<div><b>" + t("add.regH") + "</b><p>" + t("add.regP") + "</p></div></div>";
    } else if (s === 2) {
      body = '<div class="field"><span class="flabel">' + t("f.type") + '</span><div class="tiles">' + TYP_ORDER.map(function (k) { return '<button type="button" class="tile" data-typ="' + k + '" aria-pressed="' + (draft.typ === k) + '"><span class="swatch" style="background:' + TYPY[k].c + '"></span>' + LL(TYPY[k].n) + "</button>"; }).join("") + "</div></div>" +
        '<div class="field"><span class="flabel">' + t("f.plan") + '</span><div class="tiles">' + Object.keys(PLAN).map(function (k) { return '<button type="button" class="tile" data-plan="' + k + '" aria-pressed="' + (draft.plan === k) + '">' + LL(PLAN[k]) + "</button>"; }).join("") + "</div></div>" +
        '<div class="field"><span class="flabel">' + t("d.utilities") + ' <span class="muted" style="font-weight:400">' + t("add.utilHint") + '</span></span><div class="media-pick">' + Object.keys(MEDIA).map(function (k) { return '<button type="button" data-media="' + k + '" data-s="' + draft.media[k] + '">' + ICON[k] + "<div><b>" + LL(MEDIA[k]) + "</b><span>" + LL(MEDIA_ST[draft.media[k]]) + "</span></div></button>"; }).join("") + "</div></div>" +
        '<div class="field"><span class="flabel">' + t("f.access") + '</span><div class="tiles">' + ["asfalt", "utwardzona", "gruntowa", "służebność"].map(function (o) { return '<button type="button" class="tile" data-doj="' + o + '" aria-pressed="' + (draft.dojazd === o) + '">' + cap(t("access." + o)) + "</button>"; }).join("") + "</div></div>";
    } else {
      var p = num(draft.cena), pw = num(draft.pow);
      body = '<div class="preview-img"><img src="' + photoSrc({ id: 7, seed: draft.seed, typ: draft.typ || "budowlana", okolica: [] }) + '" alt=""></div>' +
        '<div class="row2"><div class="field"><label for="a-cena">' + t("add.price") + '</label><input class="input num" id="a-cena" inputmode="numeric" value="' + esc(draft.cena) + '" placeholder="189 000"></div>' +
        '<div class="field"><span class="flabel">' + t("add.ppm") + '</span><div class="input num" id="a-ppm" style="display:flex;align-items:center;background:var(--surface-2);border-color:transparent">' + (p && pw ? fmt(p / pw) + " zł/m²" : t("add.ppmAuto")) + "</div></div></div>" +
        '<div class="field"><label for="a-opis">' + t("add.desc") + '</label><textarea class="input" id="a-opis" rows="4" placeholder="' + esc(t("add.descPh")) + '">' + esc(draft.opis) + "</textarea></div>" +
        '<div class="callout ok">' + ICON.shield + "<div><b>" + t("add.verH") + "</b><p>" + t("add.verP") + "</p></div></div>";
    }
    var h = '<div class="modal" id="addModal"><div class="modal-card" role="dialog" aria-modal="true" aria-label="' + esc(t("add.title")) + '">' +
      '<div class="modal-head"><div><h2>' + t("add.t" + s) + '</h2><div class="muted">' + t("add.step", { n: s }) + '</div></div><button class="icon-btn" data-xadd aria-label="' + esc(t("d.close")) + '">' + ICON.close + "</button></div>" +
      '<div class="stepper"><div class="on"></div><div class="' + (s >= 2 ? "on" : "") + '"></div><div class="' + (s >= 3 ? "on" : "") + '"></div></div>' +
      '<div class="modal-body">' + body + "</div>" +
      '<div class="modal-foot"><button class="btn btn-ghost" id="a-back"' + (s === 1 ? " disabled" : "") + ">" + t("add.back") + '</button><button class="btn btn-dark" id="a-next">' + (s === 3 ? t("add.publish") : t("add.next")) + "</button></div></div></div>";
    $("#overlayRoot").innerHTML = h;
    var m = $("#addModal");
    m.addEventListener("click", function (e) {
      if (e.target === m || e.target.closest("[data-xadd]")) { closeAdd(); return; }
      var x;
      if ((x = e.target.closest("[data-typ]"))) { draft.typ = x.dataset.typ; renderAdd(); }
      else if ((x = e.target.closest("[data-plan]"))) { draft.plan = x.dataset.plan; renderAdd(); }
      else if ((x = e.target.closest("[data-doj]"))) { draft.dojazd = x.dataset.doj; renderAdd(); }
      else if ((x = e.target.closest("[data-media]"))) { var order = ["brak", "w_drodze", "na_dzialce", "w_poblizu"]; var k = x.dataset.media; draft.media[k] = order[(order.indexOf(draft.media[k]) + 1) % 4]; renderAdd(); }
    });
    var f = $("#a-fetch"); if (f) f.addEventListener("click", function () {
      saveStep();
      if (!draft.town) { toast(t("add.errTown1")); return; }
      if (!draft.nr) { toast(t("add.errNr")); return; }
      draft.pow = String(600 + Math.floor(Math.random() * 1400)); renderAdd(); toast(t("add.fetched"));
    });
    var ac = $("#a-cena"); if (ac) ac.addEventListener("input", function () { var p = num(ac.value), pw = num(draft.pow); $("#a-ppm").textContent = p && pw ? fmt(p / pw) + " zł/m²" : t("add.ppmAuto"); });
    $("#a-back").addEventListener("click", function () { saveStep(); draft.step--; renderAdd(); });
    $("#a-next").addEventListener("click", function () {
      saveStep();
      if (draft.step === 1) {
        if (!TOWNS.find(function (x) { return norm(x.m) === norm(draft.town); })) { toast(t("add.errTown")); return; }
        if (!num(draft.pow)) { toast(t("add.errSize")); return; }
      }
      if (draft.step === 2 && (!draft.typ || !draft.plan || !draft.dojazd)) { toast(t("add.err2")); return; }
      if (draft.step === 3) { if (!num(draft.cena)) { toast(t("add.errPrice")); return; } publish(); return; }
      draft.step++; renderAdd();
    });
    var first = $("input, button.tile", m); if (first) first.focus();
  }
  function saveStep() { ["town", "nr", "pow", "cena", "opis"].forEach(function (k) { var el = $("#a-" + k); if (el) draft[k] = el.value.trim(); }); }
  function publish() {
    var town = TOWNS.find(function (x) { return norm(x.m) === norm(draft.town); });
    var pw = num(draft.pow), c = num(draft.cena);
    var media = {}; Object.keys(draft.media).forEach(function (k) { media[k] = draft.media[k] === "w_poblizu" ? { s: "w_poblizu", m: 150 } : { s: draft.media[k] }; });
    var d = {
      id: 1000 + Math.floor(Math.random() * 8999), typ: draft.typ, op: "sprzedaz", cena: c, pow: pw,
      lat: town.lat + (Math.random() - .5) * .02, lng: town.lng + (Math.random() - .5) * .03,
      miejscowosc: town.m, gmina: town.g, powiat: town.p, woj: town.w, nr: draft.nr,
      plan: { status: draft.plan, symbol: draft.plan === "MPZP" ? { budowlana: "MN", rekreacyjna: "ML", inwestycyjna: "U", rolna: "R", lesna: "ZL", siedliskowa: "RM", "rolno-budowlana": "MN, R", rod: "ZD" }[draft.typ] : "" },
      media: media, dojazd: draft.dojazd, drogaPubliczna: draft.dojazd !== "służebność", front: Math.round(Math.sqrt(pw)), ksztalt: "prostokąt", uksztaltowanie: "płaska",
      ogrodzenie: false, okolica: [], wodaM: null, podzial: false, licytacja: null, ogl: { typ: "prywatny", nazwa: EN() ? "You (demo)" : "Ty (demo)" }, zweryfikowany: false, kw: "tak",
      hipoteka: false, sluzebnosc: draft.dojazd === "służebność", dodano: 0, historia: [],
      tytul: (draft.typ === "rod" ? "Działka w ROD " : "Działka " + TYPY[draft.typ].n[0].toLowerCase() + " ") + fmt(pw) + " m², " + town.m,
      opis: draft.opis || t("add.descDefault"), seed: draft.seed, mine: true
    };
    ALL.unshift(d); addMarker(d);
    closeAdd();
    S = emptyState(); go("szukaj");
    toast(t("add.done"));
    setTimeout(function () { openDetail(d.id); }, 150);
  }

  /* ---------- Fachowcy ---------- */
  function renderFirmy() { renderGuide(); }

  /* ---------- Nawigacja ---------- */
  var currentView = "home";
  function show(view) {
    currentView = view;
    $("#view-home").hidden = view !== "home";
    $("#view-search").hidden = view !== "szukaj";
    $("#view-firmy").hidden = view !== "firmy";
    $(".foot").hidden = view === "szukaj";
    window.scrollTo(0, 0);
  }
  function setMode(mode) {
    var r = $("#results"); r.classList.remove("mode-list", "mode-split", "mode-map"); r.classList.add("mode-" + mode);
    $$(".view-toggle button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.mode === mode); });
    if (map) setTimeout(function () { map.invalidateSize(); }, 60);
    if (mode !== "list" && !map) setTimeout(function () { initMap(); }, 30);
  }
  function go(target, fromRoute) {
    $$(".nav button, .tabbar button").forEach(function (b) { b.setAttribute("aria-current", b.dataset.nav === target); });
    var nav = fromRoute ? setHash : pushHash;
    if (target === "home") { show("home"); resetHome(); renderNear(); renderRecent(); nav("start"); return; }
    if (target === "firmy") { show("firmy"); nav("firmy"); return; }
    if (target === "ulubione") { S = emptyState(); S.favOnly = true; }
    if (target === "licytacje") { S = emptyState(); S.lic = "tylko"; }
    show("szukaj");
    var narrow = window.matchMedia("(max-width: 720px)").matches;
    setMode(target === "mapa" ? "map" : (narrow ? "list" : "split"));
    $("#sort").value = S.sort;
    renderResults();
    setTimeout(fitToResults, 120);
    nav(target === "mapa" ? "mapa" : target === "ulubione" ? "ulubione" : target === "licytacje" ? "licytacje" : "szukaj");
  }
  function snapshot() { var c = Object.assign({}, S); c.bounds = null; return JSON.parse(JSON.stringify(c)); }
  function setHash(h) { try { history.replaceState({ s: snapshot() }, "", "#" + h); } catch (e) { /* ignoruj */ } }
  function pushHash(h) {
    if (location.hash === "#" + h) return setHash(h);
    try { history.replaceState({ s: snapshot() }, "", location.hash || "#start"); history.pushState({ s: snapshot() }, "", "#" + h); } catch (e) { /* ignoruj */ }
  }
  function saveArea() { /* okolica na stronie głównej pochodzi tylko z lokalizacji przeglądarki */ }

  /* ---------- Język ---------- */
  function setLang(l) {
    I.set(l); QC = { q: null, r: null };
    document.documentElement.classList.toggle("lang-en", l === "en");
    I.apply();
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.lang === l); });
    $("#sort").innerHTML = SORTS.map(function (s) { return '<option value="' + s[0] + '">' + t(s[1]) + "</option>"; }).join("");
    $("#sort").value = S.sort;
    renderHome(); renderFirmy();
    if (currentView === "szukaj") renderResults(true);
    refreshMarkerIcons(); updateMarkers();
    if (curDetail) openDetail(curDetail, true);
  }

  /* ---------- Zdarzenia ---------- */
  function bind() {
    document.addEventListener("click", function (e) {
      var x;
      if ((x = e.target.closest("[data-fav]"))) {
        e.stopPropagation(); var id = +x.dataset.fav; toggleFav(id);
        $$('[data-fav="' + id + '"]').forEach(function (b) { b.setAttribute("aria-pressed", favs.has(id)); b.innerHTML = favs.has(id) ? ICON.heartFill : ICON.heart; });
        toast(favs.has(id) ? t("t.saved") : t("t.unsaved"));
        if (S.favOnly && currentView === "szukaj") renderResults(true);
        return;
      }
      var nv0 = $("#mainNav");
      if (e.target.closest("#menuBtn")) { var op = !nv0.classList.contains("open"); nv0.classList.toggle("open", op); $("#menuBtn").setAttribute("aria-expanded", String(op)); return; }
      if (nv0.classList.contains("open") && (e.target.closest("#mainNav button") || !e.target.closest("#mainNav"))) { nv0.classList.remove("open"); $("#menuBtn").setAttribute("aria-expanded", "false"); }
      if ((x = e.target.closest("[data-lang]"))) { setLang(x.dataset.lang); return; }
      if ((x = e.target.closest("[data-open]"))) { openDetail(+x.dataset.open); return; }
      if ((x = e.target.closest("[data-add]"))) { e.preventDefault(); openAdd(); return; }
      if ((x = e.target.closest("[data-nav]"))) {
        e.preventDefault();
        var nv = x.dataset.nav;
        var keep = nv === "mapa" && currentView === "szukaj" && !S.favOnly && S.lic === "all";
        if ((nv === "szukaj" || nv === "mapa") && !keep) S = emptyState();
        go(nv); return;
      }
      if ((x = e.target.closest("[data-go]"))) { e.preventDefault(); go("home"); return; }
      if ((x = e.target.closest("[data-cat]"))) {
        var cat = x.dataset.cat; $("#hs-typ").value = cat;
        openLoc(t("loc.titleType", { t: LL(TYPY[cat].plural) }), function (q, r) { home.q = q; home.r = r; renderHome(); $("#hs-typ").value = cat; homeSearch(); });
        return;
      }
      if ((x = e.target.closest("[data-okolica]"))) {
        var ok = x.dataset.okolica;
        openLoc(t("loc.titleType", { t: LL(OKOLICA[ok]) }), function (q, r) { home.q = q; home.r = r; renderHome(); homeSearch(function (st) { st.okolica = [ok]; }); });
        return;
      }
      if (e.target.closest("#hs-loc")) { openLoc(t("loc.title"), function (q, r) { home.q = q; home.r = r; $("#hs-loc").innerHTML = "<span>" + esc(locLabel(q, r)) + "</span>" + ICON.chev; updateHomeCount(); }); return; }
      if (e.target.closest("[data-contact]")) { openContact(); return; }
      if ((x = e.target.closest("[data-goal]"))) { guideGoal = x.dataset.goal; renderGuide(); return; }
      if ((x = e.target.closest("[data-pro]"))) { toast(t("steps.proToast", { w: x.dataset.pro, a: x.dataset.near || (EN() ? "you" : "Ciebie") })); return; }
      if ((x = e.target.closest("[data-three]"))) { var w3 = x.dataset.three; if (w3 === "1") { S = emptyState(); go("mapa"); } else if (w3 === "2") { var ex = ALL.find(function (d) { return d.zweryfikowany && d.typ === "budowlana" && d.plan.status !== "MPZP"; }) || ALL[0]; openDetail(ex.id); setTimeout(function () { var el = $("#stepsSec"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 350); } else go("firmy"); return; }
      if (e.target.closest("[data-canbuy]")) { openCanBuy(); return; }
      if ((x = e.target.closest("[data-city]"))) { cityKey = x.dataset.city; renderCities(); return; }
      if ((x = e.target.closest("[data-buyer]")) && !x.closest("#detailOverlay")) { buyer = x.dataset.buyer; store.set("buyer", buyer); renderHomeBuyer(); return; }
      if (e.target.closest("#citySeeAll")) { var c = CITIES.find(function (y) { return y.key === cityKey; }); S = emptyState(); S.q = c.q; S.radius = c.r; go("szukaj"); return; }
      if (e.target.closest("#nearChange")) { openLoc(t("loc.title"), function (q, r) { store.set("geoArea", q ? { q: q, r: r } : null); renderNear(); }); return; }
      if (e.target.closest("#nearAll")) { var a = store.get("geoArea", null); if (a) { S = emptyState(); S.q = a.q; S.radius = a.r || 0; go("szukaj"); } return; }
      if (e.target.closest("#geoBtn")) {
        var fail = function () { toast(t("near.geoFail")); };
        try {
          navigator.geolocation.getCurrentPosition(function (pos) {
            var best = null; TOWNS.forEach(function (tw) { var k = dist(pos.coords.latitude, pos.coords.longitude, tw.lat, tw.lng); if (!best || k < best.k) best = { tw: tw, k: k }; });
            if (best) { store.set("geoArea", { q: best.tw.m, r: 25 }); renderNear(); } else fail();
          }, fail, { timeout: 6000 });
        } catch (er) { fail(); }
        return;
      }
      if ((x = e.target.closest("[data-tip]"))) { removeFilter(x.dataset.tip); renderResults(); setTimeout(fitToResults, 50); return; }
      if ((x = e.target.closest("[data-radius]"))) { S.radius = +x.dataset.radius; saveArea(); renderResults(); setTimeout(fitToResults, 50); return; }
      if ((x = e.target.closest("[data-rm]"))) { removeFilter(x.dataset.rm); renderResults(); setTimeout(fitToResults, 50); return; }
      if ((x = e.target.closest(".card[data-id]")) && !e.target.closest("#overlayRoot")) { openDetail(+x.dataset.id); return; }
      if (e.target.id === "moreBtn") { shown += 20; renderResults(true); return; }
      if (e.target.closest("#loginBtn")) { toast(t("t.login")); return; }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && $("#locSheet")) { $("#locSheet").remove(); document.body.style.overflow = ""; return; }
      if (e.key === "Escape" && $("#miniModal")) { $("#miniModal").remove(); document.body.style.overflow = ""; return; }
      if (e.key === "Escape") { if ($("#addModal")) closeAdd(); else if ($("#detailOverlay")) closeDetail(); else if (drawing) finishDraw(); }
      if (e.key === "Enter" && e.target.classList && e.target.classList.contains("card")) openDetail(+e.target.dataset.id);
    });

    var hs = $("#homeSearch");
    $$(".op-toggle button", hs).forEach(function (b) { b.addEventListener("click", function () { $$(".op-toggle button", hs).forEach(function (y) { y.setAttribute("aria-pressed", y === b); }); updateHomeCount(); }); });
    hs.addEventListener("change", updateHomeCount);
    $("#catMore").addEventListener("change", function (e) {
      var v = e.target.value; if (!v) return;
      var k = v.slice(2), isT = v[0] === "t", name = isT ? LL(TYPY[k].plural) : LL(OKOLICA[k]);
      openLoc(t("loc.titleType", { t: name }), function (q, r) { home.q = q; home.r = r; if (isT) $("#hs-typ").value = k; homeSearch(function (st) { if (!isT) st.okolica = [k]; }); });
      e.target.value = "";
    });
    hs.addEventListener("submit", function (e) { e.preventDefault(); homeSearch(); });
    $$("#homeSearch .sb-field").forEach(function (f) { f.addEventListener("click", function (e) { if (e.target === f || e.target.tagName === "LABEL" || e.target.classList.contains("lbl")) { var i = $("input, select", f); if (i) i.focus(); } }); });

    var fl = $("#filters");
    fl.addEventListener("change", function (e) {
      var x = e.target;
      if (x.dataset.arr) { var a = S[x.dataset.arr]; if (x.checked) a.push(x.value); else S[x.dataset.arr] = a.filter(function (v) { return v !== x.value; }); renderResults(); setTimeout(fitToResults, 50); }
      else if (x.dataset.bool) { S[x.dataset.bool] = x.checked; renderResults(); }
      else if (x.dataset.num) { var v = num(x.value); var k = x.dataset.num; S[k] = (k === "cMin" || k === "cMax" || k === "pmMin" || k === "pmMax") ? fromCur(v) : v; renderResults(); }
      else if (x.dataset.sel) { S[x.dataset.sel] = x.value ? +x.value : null; renderResults(); }
      else if (x.id === "f-q") { S.q = x.value.trim(); S.radius = 0; saveArea(); renderResults(); setTimeout(fitToResults, 50); }
    });
    fl.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      var sg = b.closest("[data-seg]");
      if (sg) { var k = sg.dataset.seg, v = b.dataset.v; S[k] = k === "dni" ? +v : v; if (k === "op") { S.cMin = S.cMax = S.pmMin = S.pmMax = null; } renderResults(); setTimeout(fitToResults, 50); return; }
      if (b.closest("[data-quickpow]")) { var mn = +b.dataset.min, mx = b.dataset.max ? +b.dataset.max : null; if (S.powMin === mn && S.powMax === mx) { S.powMin = S.powMax = null; } else { S.powMin = mn; S.powMax = mx; } renderResults(); return; }
      if (b.id === "f-loc") { openLoc(t("loc.title"), function (q, r) { S.q = q; S.radius = r; saveArea(); renderResults(); setTimeout(fitToResults, 50); }); return; }
      if (b.id === "resetFilters") { S = emptyState(); clearPoly(true); var bo = $("#boundsOnly"); if (bo) bo.checked = false; renderResults(); setTimeout(fitToResults, 50); return; }
      if (b.id === "closeFilters" || b.id === "showResults") { setDrawer(false); return; }
    });
    function setDrawer(open) {
      $("#filters").classList.toggle("open", open);
      var bd = $(".filters-backdrop");
      if (open && !bd) { bd = document.createElement("div"); bd.className = "filters-backdrop"; bd.addEventListener("click", function () { setDrawer(false); }); document.body.appendChild(bd); }
      if (!open && bd) bd.remove();
    }
    $("#openFilters").addEventListener("click", function () { setDrawer(true); });
    $("#sort").addEventListener("change", function (e) { S.sort = e.target.value; renderResults(); });
    $$(".view-toggle button").forEach(function (b) { b.addEventListener("click", function () { setMode(b.dataset.mode); }); });
    $("#mapToList").addEventListener("click", function () { setMode("list"); });
    $("#saveSearch").addEventListener("click", function () { toast(t("t.search", { n: current.length })); });
    $("#drawBtn").addEventListener("click", function () { if (!map) return; if (drawing) finishDraw(); else startDraw(); });
    $("#clearDraw").addEventListener("click", function () { clearPoly(); });
    $("#boundsOnly").addEventListener("change", function (e) { S.bounds = e.target.checked && map ? map.getBounds() : null; renderResults(); });
    $("#layersBtn").addEventListener("click", function () { var l = $("#layers"); l.hidden = !l.hidden; $("#layersBtn").setAttribute("aria-expanded", String(!l.hidden)); });
    var grid = $("#resultsGrid");
    grid.addEventListener("mouseover", function (e) { var c = e.target.closest(".card"); if (c) hilite(+c.dataset.id, true); });
    grid.addEventListener("mouseout", function (e) { var c = e.target.closest(".card"); if (c) hilite(+c.dataset.id, false); });
    window.addEventListener("popstate", function (e) { if (e.state && e.state.s) S = Object.assign(emptyState(), e.state.s); route(true); });
    var rt; window.addEventListener("resize", function () { if (map) map.invalidateSize(); clearTimeout(rt); rt = setTimeout(heroImage, 200); });
  }

  function route(fromPop) {
    var h = (location.hash || "").replace("#", "");
    var m = h.match(/^d(\d+)$/);
    if (m) { openDetail(+m[1], true); return; }
    if ($("#detailOverlay")) closeDetail(true);
    if ($("#addModal")) closeAdd();
    if (h === "start" || h === "") { if (currentView !== "home") go("home", true); return; }
    var view = h === "firmy" ? "firmy" : "szukaj";
    if (["szukaj", "mapa", "ulubione", "licytacje", "firmy"].indexOf(h) >= 0) {
      if (fromPop && view === "szukaj" && currentView === "szukaj") { $("#sort").value = S.sort; renderResults(); setTimeout(fitToResults, 80); return; }
      if (h === "ulubione" || h === "licytacje") { var keep = S; go(h, true); if (fromPop) { S = keep; renderResults(); } return; }
      go(h, true);
    }
  }

  /* ---------- Start ---------- */
  bind();
  setLang(I.lang);
  var h0 = (location.hash || "").replace("#", "");
  if (h0 && h0 !== "start") route();
})();

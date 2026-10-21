/* Działkowo - ścieżki „Od działki do domu”. Silnik reguł: każdy krok ma warunek i stan zależny od danych działki.
   Treść to wersja robocza do weryfikacji przez architekta i prawnika. Koszty i czas są orientacyjne. */
(function () {
  "use strict";
  var PH = {
    zakup: ["Przed zakupem", "Before you buy"],
    formal: ["Projekt i formalności", "Design and permits"],
    media: ["Przyłącza", "Utilities"],
    budowa: ["Budowa", "Construction"],
    koniec: ["Zakończenie", "Completion"]
  };
  /* Kroki: t = tytuł, p = co zrobić, who = kto pomoże, time, cost, cond = kiedy krok się pojawia (widok ogólny) */
  var K = {
    kw: { ph: "zakup", t: ["Sprawdź księgę wieczystą", "Check the land register"], p: ["Kto jest właścicielem, czy są hipoteki, służebności, roszczenia. Numer KW wpisujesz na ekw.ms.gov.pl.", "Who owns it, any mortgages, rights of way or claims. Search the number on ekw.ms.gov.pl."], who: ["Prawnik od nieruchomości", "Property lawyer"], time: ["1 dzień", "1 day"], cost: ["0 zł online", "free online"] },
    plan: { ph: "zakup", t: ["Sprawdź przeznaczenie działki", "Check what you may build"], p: ["Wypis i wyrys z planu miejscowego z urzędu gminy: co, jak wysoko i jak dużo wolno zbudować.", "An extract from the local zoning plan at the council office: what, how high and how much you may build."], who: ["Architekt", "Architect"], time: ["1-2 tygodnie", "1-2 weeks"], cost: ["ok. 50-250 zł", "about €10-60"] },
    wz: { ph: "zakup", t: ["Uzyskaj warunki zabudowy", "Get building conditions (WZ)"], cond: ["Gdy działka nie ma planu miejscowego", "When there is no zoning plan"], p: ["Decyzja gminy, która ustala, co wolno zbudować. Po przyjęciu przez gminę planu ogólnego WZ wydaje się tylko w wyznaczonych obszarach, więc najpierw zapytaj w gminie. Najlepiej kup działkę dopiero z decyzją albo z zapisem w umowie przedwstępnej.", "A council decision on what may be built. Once the council adopts its general plan, WZ is issued only in designated areas, so ask the council first. Ideally buy only once the decision is issued, or make the preliminary contract depend on it."], who: ["Architekt, urbanista", "Architect, planner"], time: ["1-3 miesiące", "1-3 months"], cost: ["598 zł opłaty skarbowej", "PLN 598 stamp duty"] },
    dojazd: { ph: "zakup", t: ["Sprawdź dojazd do drogi publicznej", "Check access to a public road"], cond: ["Gdy dojazd prowadzi przez cudzą działkę", "When access crosses someone else's land"], p: ["Bez prawnie zapewnionego dojazdu nie dostaniesz pozwolenia na budowę. Służebność drogi musi być wpisana do księgi wieczystej.", "Without legal access you will not get a building permit. A right of way must be entered in the land register."], who: ["Prawnik, geodeta", "Lawyer, surveyor"], time: ["1-4 tygodnie", "1-4 weeks"], cost: ["od 0 zł do kilku tys. zł", "free to a few thousand PLN"] },
    zagr: { ph: "zakup", t: ["Sprawdź zagrożenia i ograniczenia", "Check hazards and restrictions"], cond: ["Gdy działka leży w strefie lub obok niej", "When the plot is in or next to a zone"], p: ["Strefa powodziowa, las, pas nadmorski, tereny górskie. Szczegóły w ramce „Zagrożenia i ograniczenia”.", "Flood zone, forest, coastal strip, mountains. See the box “Hazards and restrictions”."], who: ["Architekt", "Architect"], time: ["1-2 tygodnie", "1-2 weeks"], cost: ["zwykle 0 zł", "usually free"] },
    rolne: { ph: "zakup", t: ["Wyłączenie gruntu z produkcji rolnej", "Release from agricultural use"], cond: ["Gdy grunt ma klasę I-III", "When the soil is class I-III"], p: ["Przy gruntach klas I-III poza miastem budowa wymaga decyzji o wyłączeniu z produkcji rolnej i opłaty. Sprawdź klasę w wypisie z ewidencji.", "On class I-III soil outside towns you need a decision releasing it from farming and a fee. Check the class in the land registry extract."], who: ["Geodeta, urząd", "Surveyor, council"], time: ["1-2 miesiące", "1-2 months"], cost: ["zależy od klasy i powierzchni", "depends on class and area"] },
    rolnik: { ph: "zakup", t: ["Sprawdź, czy możesz kupić ziemię rolną", "Check if you may buy farmland"], cond: ["Działka rolna od 0,3 ha", "Farmland of 0.3 ha or more"], p: ["Ziemię rolną od 0,3 ha kupuje zwykle rolnik indywidualny. W innych przypadkach potrzebna jest zgoda KOWR, a siedlisko wymaga gospodarstwa rolnego.", "Farmland of 0.3 ha or more is usually bought by an individual farmer. Otherwise you need consent from KOWR, and a farmhouse needs a farm."], who: ["Prawnik, notariusz", "Lawyer, notary"], time: ["1-3 miesiące", "1-3 months"], cost: ["opłaty KOWR, prawnik", "KOWR fees, lawyer"] },
    grunt: { ph: "zakup", t: ["Badania gruntu", "Soil survey"], p: ["Odwierty pokażą, czy grunt jest nośny i jak głęboko jest woda. Od tego zależy koszt fundamentów.", "Boreholes show if the ground is stable and how deep the water is. Foundation costs depend on it."], who: ["Geolog", "Soil engineer"], time: ["1-2 tygodnie", "1-2 weeks"], cost: ["ok. 1500-3000 zł", "about PLN 1,500-3,000"] },
    akt: { ph: "zakup", t: ["Umowa u notariusza", "Sign the deed at a notary"], p: ["Najpierw umowa przedwstępna z warunkami (np. uzyskanie WZ), potem akt notarialny. Koszty policzysz w kalkulatorze obok.", "First a preliminary contract with conditions (e.g. getting WZ), then the notarial deed. See the cost calculator."], who: ["Notariusz, doradca kredytowy", "Notary, mortgage broker"], time: ["2-6 tygodni", "2-6 weeks"], cost: ["patrz kalkulator", "see calculator"] },
    mapa: { ph: "formal", t: ["Mapa do celów projektowych", "Survey map for the design"], p: ["Geodeta przygotowuje aktualną mapę działki z sieciami. Na niej architekt rysuje dom.", "A surveyor prepares an up-to-date map with utilities. The architect draws the house on it."], who: ["Geodeta", "Surveyor"], time: ["2-6 tygodni", "2-6 weeks"], cost: ["ok. 1500-3000 zł", "about PLN 1,500-3,000"] },
    projekt: { ph: "formal", t: ["Projekt domu", "House design"], p: ["Gotowy projekt z adaptacją do działki albo projekt indywidualny.", "A catalogue design adapted to the plot, or a bespoke one."], who: ["Architekt", "Architect"], time: ["1-4 miesiące", "1-4 months"], cost: ["ok. 8-40 tys. zł", "about PLN 8-40k"] },
    projektL: { ph: "formal", t: ["Projekt domu letniskowego", "Holiday house design"], p: ["Wolnostojący parterowy dom rekreacyjny do 35 m² stawiasz na zgłoszenie (jeden na każde 500 m² działki). Większy wymaga pozwolenia.", "A detached single-storey holiday house up to 35 m² needs only a notification (one per 500 m² of land). A larger one needs a permit."], who: ["Architekt", "Architect"], time: ["2-8 tygodni", "2-8 weeks"], cost: ["ok. 3-15 tys. zł", "about PLN 3-15k"] },
    projektH: { ph: "formal", t: ["Projekt hali i uzgodnienia", "Building design and approvals"], p: ["Projekt z uzgodnieniami przeciwpożarowymi, sanitarnymi i BHP przez rzeczoznawców.", "A design approved by fire, sanitary and health and safety experts."], who: ["Architekt, rzeczoznawca ppoż.", "Architect, fire safety expert"], time: ["2-6 miesięcy", "2-6 months"], cost: ["od kilkudziesięciu tys. zł", "from tens of thousands of PLN"] },
    srodow: { ph: "formal", t: ["Decyzja środowiskowa", "Environmental decision"], cond: ["Przy większych inwestycjach", "For larger developments"], p: ["Wiele hal, magazynów i zakładów wymaga decyzji o środowiskowych uwarunkowaniach przed pozwoleniem na budowę. Zależy od wielkości i rodzaju działalności.", "Many halls, warehouses and plants need an environmental decision before the building permit, depending on size and use."], who: ["Specjalista ds. ochrony środowiska", "Environmental consultant"], time: ["2-6 miesięcy", "2-6 months"], cost: ["od kilku tys. zł", "from a few thousand PLN"] },
    zjazd: { ph: "formal", t: ["Zjazd z drogi publicznej", "Road access permit"], p: ["Zgoda zarządcy drogi na zjazd, przy ruchu ciężarówek często z projektem zjazdu.", "Consent of the road authority for an entrance, often with a design when lorries will use it."], who: ["Projektant drogowy", "Road designer"], time: ["1-2 miesiące", "1-2 months"], cost: ["od kilku tys. zł", "from a few thousand PLN"] },
    prad: { ph: "media", t: ["Prąd", "Electricity"], who: ["Elektryk", "Electrician"], time: ["2-12 miesięcy", "2-12 months"], cost: ["ok. 2-5 tys. zł", "about PLN 2-5k"] },
    woda: { ph: "media", t: ["Woda", "Water"], who: ["Hydraulik, studniarz", "Plumber, well driller"], time: ["1-6 miesięcy", "1-6 months"], cost: ["ok. 3-20 tys. zł", "about PLN 3-20k"] },
    kan: { ph: "media", t: ["Ścieki", "Sewage"], who: ["Hydraulik", "Plumber"], time: ["1-6 miesięcy", "1-6 months"], cost: ["ok. 5-25 tys. zł", "about PLN 5-25k"] },
    gaz: { ph: "media", t: ["Ogrzewanie", "Heating"], who: ["Instalator", "Installer"], time: ["-", "-"], cost: ["-", "-"] },
    pozw: { ph: "formal", t: ["Pozwolenie na budowę lub zgłoszenie", "Building permit or notification"], p: ["Dom do 70 m² zabudowy możesz postawić na zgłoszenie, większy wymaga pozwolenia. Urząd ma 65 dni na decyzję.", "A house up to 70 m² footprint needs only a notification; a larger one needs a permit. The office has 65 days."], who: ["Architekt, kierownik budowy", "Architect, site manager"], time: ["1-3 miesiące", "1-3 months"], cost: ["zwykle 0 zł dla domu", "usually free for a house"] },
    pozwH: { ph: "formal", t: ["Pozwolenie na budowę", "Building permit"], p: ["Wniosek z projektem i uzgodnieniami. Urząd ma 65 dni na decyzję.", "Application with the design and approvals. The office has 65 days."], who: ["Architekt", "Architect"], time: ["2-3 miesiące", "2-3 months"], cost: ["opłata skarbowa", "stamp duty"] },
    kredyt: { ph: "formal", t: ["Kredyt na budowę", "Construction mortgage"], p: ["Bank wypłaca kredyt w transzach po kolejnych etapach budowy.", "The bank pays out in stages as the build progresses."], who: ["Doradca kredytowy", "Mortgage broker"], time: ["1-2 miesiące", "1-2 months"], cost: ["prowizja zwykle płaci bank", "broker usually paid by the bank"] },
    surowy: { ph: "budowa", t: ["Stan surowy", "Shell"], p: ["Dziennik budowy (elektroniczny), kierownik budowy, fundamenty, ściany, dach.", "Electronic site log, site manager, foundations, walls, roof."], who: ["Firma budowlana, kierownik budowy", "Builder, site manager"], time: ["4-8 miesięcy", "4-8 months"], cost: ["największa część budżetu", "the largest part of the budget"] },
    inst: { ph: "budowa", t: ["Instalacje i wykończenie", "Installations and finishing"], p: ["Okna, instalacje, pompa ciepła lub kocioł, fotowoltaika, tynki, podłogi.", "Windows, installations, heat pump or boiler, solar panels, plaster, floors."], who: ["Instalatorzy, wykończeniowcy", "Installers, finishers"], time: ["3-9 miesięcy", "3-9 months"], cost: ["zależy od standardu", "depends on the finish"] },
    otocz: { ph: "budowa", t: ["Ogrodzenie, podjazd, ogród", "Fence, driveway, garden"], who: ["Brukarz, ogrodnik", "Paver, gardener"], time: ["1-2 miesiące", "1-2 months"], cost: ["od kilku tys. zł", "from a few thousand PLN"] },
    odbior: { ph: "koniec", t: ["Zakończenie budowy", "Completion"], p: ["Zawiadomienie o zakończeniu budowy, odbiory przyłączy, nadanie numeru adresowego, wpis budynku do ewidencji.", "Notice of completion, utility acceptance, a street number, and registering the building."], who: ["Kierownik budowy, geodeta", "Site manager, surveyor"], time: ["1-2 miesiące", "1-2 months"], cost: ["inwentaryzacja ok. 1-2 tys. zł", "as-built survey about PLN 1-2k"] },
    odbiorH: { ph: "koniec", t: ["Odbiory i pozwolenie na użytkowanie", "Inspections and occupancy permit"], p: ["Odbiory straży pożarnej i sanepidu, potem pozwolenie na użytkowanie.", "Fire brigade and sanitary inspections, then the occupancy permit."], who: ["Kierownik budowy, rzeczoznawcy", "Site manager, experts"], time: ["1-2 miesiące", "1-2 months"], cost: ["opłaty urzędowe", "official fees"] },
    las: { ph: "zakup", t: ["Czy na tym gruncie wolno budować?", "May you build on this land?"], p: ["Na gruncie leśnym zwykle nie wolno budować. Potrzebna byłaby zmiana przeznaczenia w planie miejscowym, co trwa długo i nie jest pewne. Przy sprzedaży Lasy Państwowe mogą mieć prawo pierwokupu.", "Building on forest land is usually not allowed. It would need a change of the zoning plan, which takes long and is uncertain. The State Forests may have a right of first refusal."], who: ["Prawnik, architekt", "Lawyer, architect"], time: ["-", "-"], cost: ["-", "-"] },
    rod: { ph: "zakup", t: ["Przeniesienie prawa do działki w ROD", "Transfer of the allotment right"], p: ["Kupujesz prawo do użytkowania działki, nie grunt. Umowa pisemna z podpisami poświadczonymi notarialnie, potem zatwierdzenie przez zarząd ogrodu. Altana do 35 m².", "You buy the right to use the plot, not the land. A written agreement with notarised signatures, then approval by the garden board. A shed up to 35 m²."], who: ["Notariusz, zarząd ROD", "Notary, garden board"], time: ["2-4 tygodnie", "2-4 weeks"], cost: ["kilkaset zł", "a few hundred PLN"] }
  };
  var GOALS = {
    dom: { n: ["Dom jednorodzinny", "Family house"], d: ["Działka budowlana lub rolno-budowlana", "Building or mixed-use plot"], steps: ["kw", "plan", "wz", "dojazd", "zagr", "rolne", "grunt", "akt", "kredyt", "mapa", "projekt", "prad", "woda", "kan", "gaz", "pozw", "surowy", "inst", "otocz", "odbior"] },
    letnisko: { n: ["Dom letniskowy", "Holiday home"], d: ["Działka rekreacyjna", "Leisure plot"], steps: ["kw", "plan", "wz", "dojazd", "zagr", "grunt", "akt", "mapa", "projektL", "prad", "woda", "kan", "surowy", "otocz", "odbior"] },
    siedlisko: { n: ["Siedlisko", "Farmhouse"], d: ["Działka rolna lub siedliskowa", "Farmland or smallholding"], steps: ["kw", "plan", "wz", "rolnik", "dojazd", "zagr", "rolne", "grunt", "akt", "kredyt", "mapa", "projekt", "prad", "woda", "kan", "gaz", "pozw", "surowy", "inst", "otocz", "odbior"] },
    hala: { n: ["Hala, magazyn, usługi", "Warehouse, commercial building"], d: ["Działka inwestycyjna", "Commercial plot"], steps: ["kw", "plan", "wz", "dojazd", "zagr", "rolne", "grunt", "akt", "srodow", "mapa", "projektH", "zjazd", "prad", "woda", "kan", "pozwH", "surowy", "inst", "odbiorH"] },
    las: { n: ["Las", "Forest"], d: ["Działka leśna", "Forest land"], steps: ["kw", "las", "akt"] },
    rod: { n: ["Ogródek działkowy", "Allotment"], d: ["Działka w ROD", "Allotment garden"], steps: ["rod"] }
  };
  var SELL = [
    [["Sprawdź księgę wieczystą", "Check the land register"], ["Usuń stare wpisy, np. spłaconą hipotekę. Kupujący sprawdzi to pierwsze.", "Remove old entries such as a repaid mortgage. Buyers check this first."]],
    [["Wypis z planu lub warunki zabudowy", "Zoning extract or WZ"], ["Działka z jasnym przeznaczeniem sprzedaje się szybciej i drożej.", "A plot with a clear zoning sells faster and for more."]],
    [["Wznowienie granic", "Re-marking the boundaries"], ["Geodeta pokaże granice w terenie. Kupujący chętniej przyjeżdża na działkę z widocznymi palikami.", "A surveyor marks the corners on site. Buyers prefer plots with visible markers."]],
    [["Ogłoszenie z numerem działki", "Listing with the plot number"], ["Granice, powierzchnia i plan wczytają się same z rejestrów.", "Boundaries, size and zoning load from the registers."]],
    [["Weryfikacja właściciela", "Owner verification"], ["Znaczek „Zweryfikowany” zwiększa zaufanie kupujących.", "The “Verified” badge builds buyer trust."]],
    [["Umowa przedwstępna i akt notarialny", "Preliminary contract and deed"], ["Zadatek, termin i warunki zapisz w umowie przedwstępnej.", "Put the deposit, date and conditions in the preliminary contract."]],
    [["Podatek po sprzedaży", "Tax after the sale"], ["Jeśli sprzedajesz przed upływem 5 lat od końca roku zakupu, zapłacisz 19% podatku od dochodu.", "Selling within 5 years from the end of the year you bought it means 19% tax on the gain."]]
  ];

  function goalFor(d) {
    return { budowlana: "dom", "rolno-budowlana": "dom", rekreacyjna: "letnisko", siedliskowa: "siedlisko", rolna: "siedlisko", inwestycyjna: "hala", lesna: "las", rod: "rod" }[d.typ] || "dom";
  }
  /* Zagrożenia - w prototypie wyliczane z przykładowych danych; w pełnej wersji z map Wód Polskich, PIG-PIB, GDOŚ, NID. */
  function hazards(d) {
    var o = d.okolica || [], h = [];
    if (o.indexOf("woda") >= 0) h.push((d.wodaM || 999) < 150 ? ["warn", "flood"] : ["info", "floodNear"]);
    if (o.indexOf("las") >= 0) h.push(["info", "forest"]);
    if (o.indexOf("morze") >= 0) h.push(["warn", "coast"]);
    if (o.indexOf("gory") >= 0 || d.uksztaltowanie === "stok") h.push(["info", "slope"]);
    return h;
  }
  /* Stan kroku dla konkretnej działki: done | todo | check | warn | null (krok nie dotyczy) */
  function state(id, d) {
    var p = d.plan || {}, m = function (k) { return (d.media[k] || {}).s || "brak"; };
    var V = d.zweryfikowany;
    var R = function (s, pl, en) { return { s: s, n: pl ? [pl, en] : null }; };
    switch (id) {
      case "kw":
        if (d.kw === "brak") return R("warn", "Działka nie ma księgi wieczystej. Notariusz ją założy, ale zakup potrwa dłużej.", "The plot has no land register entry. The notary will create one, but it takes longer.");
        if (V) return R("done", "Sprawdzone przez Działkowo: właściciel zgodny z księgą." + (d.hipoteka ? " W księdze jest hipoteka." : ""), "Checked by Działkowo: the owner matches the register." + (d.hipoteka ? " There is a mortgage entry." : ""));
        return R("check", "Właściciel jeszcze nie został zweryfikowany. Sprawdź księgę przed wpłatą zadatku.", "The owner is not verified yet. Check the register before paying a deposit.");
      case "plan":
        if (p.status === "MPZP") return V ? R("done", "Plan miejscowy: " + p.symbol + ". Dane z Geoportalu.", "Zoning plan: " + p.symbol + ". Data from the national geoportal.") : R("check", "Sprzedający podaje plan " + p.symbol + ". Potwierdź wypisem z gminy.", "The seller states zoning " + p.symbol + ". Confirm with an extract from the council.");
        if (p.status === "WZ") return R("check", "Są warunki zabudowy. Sprawdź, czy są ważne i czy można je przenieść na Ciebie.", "Building conditions exist. Check they are valid and can be transferred to you.");
        if (p.status === "WZ_w_toku") return R("check", "Wniosek o WZ jest w toku. Wynik nie jest pewny.", "A WZ application is pending. The outcome is not certain.");
        return R("warn", "Brak planu i warunków zabudowy. Nie wiadomo jeszcze, co wolno tu zbudować.", "No zoning plan and no building conditions. It is not yet known what may be built.");
      case "wz": return p.status === "brak" || p.status === "WZ_w_toku" ? R("todo") : null;
      case "dojazd":
        if (d.dojazd === "służebność" || !d.drogaPubliczna) return R("check", "Dojazd przez służebność. Sprawdź, czy jest wpisana do księgi wieczystej.", "Access via a right of way. Check it is in the land register.");
        if (d.dojazd === "gruntowa") return R("done", "Droga publiczna, nawierzchnia gruntowa.", "Public road, dirt surface.");
        return R("done", "Droga publiczna, " + (d.dojazd === "asfalt" ? "asfaltowa." : "utwardzona."), "Public road, " + (d.dojazd === "asfalt" ? "asphalt." : "paved."));
      case "zagr": return hazards(d).length ? R(hazards(d).some(function (x) { return x[0] === "warn"; }) ? "warn" : "check") : null;
      case "rolne": return d.klasa && /^(I|II|III)/.test(d.klasa) && !/^IV|^V/.test(d.klasa) ? R("warn", "Klasa gleby " + d.klasa + ". Może być potrzebna decyzja o wyłączeniu z produkcji rolnej.", "Soil class " + d.klasa + ". A release from agricultural use may be needed.") : null;
      case "rolnik": return d.pow >= 3000 ? R("warn") : null;
      case "grunt": return d.uksztaltowanie === "stok" ? R("todo", "Działka na stoku: badania gruntu są tu szczególnie ważne.", "Sloping plot: the soil survey matters even more here.") : R("todo");
      case "prad": case "woda": case "kan": case "gaz":
        var k = { prad: "prad", woda: "woda", kan: "kanalizacja", gaz: "gaz" }[id], s = m(k);
        if (s === "na_dzialce") return R("done", "Przyłącze jest na działce.", "Already connected on the plot.");
        if (id === "gaz") return s === "w_drodze" ? R("todo", "Gaz w drodze: wniosek o warunki przyłączenia do gazowni.", "Gas in the road: apply to the gas operator.") : R("todo", "Brak gazu: najczęściej pompa ciepła, często z fotowoltaiką.", "No gas: usually a heat pump, often with solar panels.");
        if (s === "w_drodze") return R("todo", { prad: "Prąd w drodze: wniosek o warunki przyłączenia do zakładu energetycznego.", woda: "Wodociąg w drodze: wniosek do wodociągów o warunki przyłączenia.", kan: "Kanalizacja w drodze: wniosek o przyłączenie." }[id], { prad: "Power in the road: apply to the grid operator.", woda: "Water main in the road: apply to the water company.", kan: "Sewer in the road: apply for a connection." }[id]);
        if (s === "w_poblizu") return R("check", "Sieć w pobliżu (" + ((d.media[k] || {}).m || "?") + " m). Zapytaj o koszt i czas dłuższego przyłącza.", "Network nearby (" + ((d.media[k] || {}).m || "?") + " m). Ask about cost and time of a longer connection.");
        return R("warn", { prad: "Brak sieci w pobliżu. Zapytaj zakład energetyczny o rozbudowę sieci, może to trwać długo.", woda: "Brak wodociągu: potrzebna studnia.", kan: "Brak kanalizacji: przydomowa oczyszczalnia albo szambo." }[id], { prad: "No grid nearby. Ask the operator about extending it; it can take long.", woda: "No water main: you will need a well.", kan: "No sewer: a septic tank or small treatment plant." }[id]);
      default: return R("todo");
    }
  }
  function build(d, goal) {
    goal = goal || goalFor(d);
    var out = [];
    GOALS[goal].steps.forEach(function (id) {
      var st = d ? state(id, d) : { s: K[id].cond ? "cond" : "todo", n: null };
      if (!st) return;
      out.push({ id: id, k: K[id], s: st.s, n: st.n });
    });
    return out;
  }
  var HZ = {
    flood: [["Woda blisko działki: sprawdź strefę powodziową", "Water close to the plot: check the flood zone"], ["W obszarze szczególnego zagrożenia powodzią budowa jest zwykle zakazana albo wymaga zgody Wód Polskich.", "In a special flood hazard area building is usually banned or needs consent from Wody Polskie."]],
    floodNear: [["Woda w okolicy", "Water in the area"], ["Sprawdź mapę zagrożenia powodziowego (warstwa na mapie).", "Check the flood hazard map (map layer)."]],
    forest: [["Las obok działki", "Forest next to the plot"], ["Budynek zwykle musi stać co najmniej 12 m od granicy lasu. Na wąskiej działce może to ograniczyć zabudowę.", "A building usually has to stand at least 12 m from the forest edge. On a narrow plot this can limit building."]],
    coast: [["Pas nadmorski", "Coastal strip"], ["W pasie ochronnym brzegu morskiego budowa wymaga uzgodnienia z urzędem morskim.", "In the coastal protection strip, building needs approval from the maritime office."]],
    slope: [["Teren pochyły lub górski", "Sloping or mountain land"], ["Sprawdź mapę osuwisk PIG-PIB i zrób badania gruntu przed zakupem.", "Check the landslide map of the Polish Geological Institute and do a soil survey before buying."]]
  };
  window.KROKI = { PH: PH, K: K, GOALS: GOALS, SELL: SELL, HZ: HZ, build: build, goalFor: goalFor, hazards: hazards };
})();

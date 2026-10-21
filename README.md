# Działkowo - prototyp portalu z działkami

Klikalny prototyp wyszukiwarki działek: strona główna, filtry, mapa z rysowaniem obszaru,
karta działki z planem miejscowym, mediami, kosztami zakupu i weryfikacją właściciela,
oraz formularz dodawania ogłoszenia.

Miejscowości i położenie są prawdziwe. Oferty, ceny i ogłoszeniodawcy są przykładowe (100 działek).

## Jak uruchomić

1. Rozpakuj folder.
2. Otwórz plik `index.html` w przeglądarce (Chrome, Edge, Firefox, Safari).
   Do działania mapy potrzebny jest internet (podkład OpenStreetMap i warstwy Geoportalu).

## Jak opublikować na GitHub Pages

1. Załóż nowe repozytorium na GitHubie, np. `dzialkowo-prototyp`.
2. Wgraj zawartość tego folderu (przycisk "Add file" > "Upload files").
3. Wejdź w Settings > Pages, wybierz "Deploy from a branch", gałąź `main`, folder `/ (root)`, zapisz.
4. Po minucie strona będzie pod adresem `https://TWOJA-NAZWA.github.io/dzialkowo-prototyp/`.

## Pliki

- `index.html` - struktura strony
- `styles.css` - wygląd
- `app.js` - wyszukiwarka, filtry, mapa, karta działki, dodawanie ogłoszenia
- `i18n.js` - teksty po polsku i angielsku
- `data.js` - 100 przykładowych działek
- `aerial.js` - schemat działki na mapie ewidencyjnej
- `img/` - zdjęcia (z makiety, poglądowe)
- `vendor/` - biblioteka mapy Leaflet 1.9.4 (licencja BSD-2)

## Warstwy mapy

- Podkład: OpenStreetMap
- Ortofotomapa: Geoportal (GUGiK), usługa WMS
- Działki ewidencyjne: Krajowa Integracja Ewidencji Gruntów (GUGiK), widoczne od zoomu 15
- Plany miejscowe: Krajowa Integracja MPZP (GUGiK)

Przy większym ruchu podkład OpenStreetMap trzeba zastąpić własnym serwerem kafelków
albo płatnym dostawcą (zasady korzystania z tile.openstreetmap.org na to nie pozwalają).

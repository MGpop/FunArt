# FunArt™

FunArt™ este un website creat în cadrul stagiului de practică, care reunește proiecte interactive și creative realizate cu HTML, CSS și JavaScript.

Site-ul include un joc despre estetici vizuale, un instrument pentru planificarea și realizarea desenelor și o pagină de prezentare a aplicației desktop Book$$crape™.

## Ce găsești pe FunArt

### Match the Aesthetic

Match the Aesthetic este un joc interactiv dedicat esteticilor vizuale. Jucătorul alege imaginile care îi plac dintr-o serie de opțiuni, iar alegerile contribuie la stabilirea rezultatului final.

Jocul include:

- **Alegeri vizuale:** imaginile sunt prezentate pe rând, astfel încât jucătorul să poată selecta opțiunile care se potrivesc preferințelor sale.
- **Rezultate bazate pe alegeri:** fiecare selecție contribuie la scorurile esteticilor, iar la final este afișat rezultatul obținut.
- **Informații despre estetici:** jocul oferă descrieri și informații despre stilurile vizuale incluse.
- **Posibilitatea de a rejuca:** după încheierea unei runde, jucătorul poate începe un joc nou și poate explora alte combinații de alegeri.

Scopul jocului este explorarea creativă a preferințelor vizuale. Rezultatul nu reprezintă o evaluare obiectivă a personalității, ci o interpretare distractivă a alegerilor făcute în joc.

### Drawing Planner

Drawing Planner combină o listă de sarcini cu un spațiu de desen, pentru a ajuta utilizatorul să își organizeze ideile și să realizeze schițe direct în browser.

**Planificarea desenului** permite adăugarea de sarcini personalizate, bifarea etapelor finalizate și ștergerea celor care nu mai sunt necesare. Sunt disponibile și preseturi tematice, care adaugă automat idei de sarcini pentru diferite tipuri de desene.

**Zona de desen** include mai multe instrumente și setări:

- Creion și radieră, cu dimensiune ajustabilă.
- Alegerea culorii de desen.
- Forme geometrice, cu opțiuni pentru contur, umplere și rotație.
- Instrument de umplere cu culoare.
- Funcția Undo, pentru anularea modificărilor recente ale desenului.

Lista de sarcini și zona de desen pot fi folosite împreună: utilizatorul își poate stabili mai întâi pașii, apoi poate lucra la schiță și poate marca etapele pe măsură ce le finalizează.

Drawing Planner este conceput pentru schițe rapide, exerciții creative și organizarea unui proiect de desen, fără instalarea unei aplicații separate.

### Book$$crape™

O pagină dedicată aplicației desktop Book$$crape™, cu prezentarea funcțiilor, capturi de ecran și arhiva versiunii 1.0 pentru descărcare.

Aplicația folosește site-ul demonstrativ Books to Scrape pentru explorarea datelor despre cărți și permite afișarea cărților, efectuarea calculelor pe categorii, verificarea stocului și obținerea recomandărilor.

Codul sursă al aplicației se află într-un repository separat: [BookSScrape](https://github.com/MGpop/BookSScrape).

## Tehnologii utilizate

- HTML5
- CSS3
- JavaScript
- Canvas API

Website-ul este static și nu necesită un framework sau un proces de compilare.

## Rulare locală

1. Clonează repository-ul sau descarcă arhiva proiectului de pe GitHub.
2. Deschide directorul proiectului.
3. Deschide `index.html` într-un browser.

Pentru o experiență de dezvoltare mai comodă, poți folosi și un server local, de exemplu extensia Live Server din Visual Studio Code.

## Structura proiectului

```text
FunArt-website/
├── index.html
├── match-the-aesthetic.html
├── drawing-helper.html
├── booksscrape.html
├── css/
├── js/
├── data/
├── images/
├── fonts/
├── downloads/
├── README.md
├── LICENSE
└── .gitignore
```

Directoarele `css/` și `js/` conțin stilurile și scripturile paginilor. Directorul `data/` conține datele folosite de jocul Match the Aesthetic, iar `images/` și `fonts/` conțin resursele vizuale ale website-ului. În `downloads/` se află arhiva aplicației Book$$crape disponibilă pe pagina sa de prezentare.

## Autor

**MGpop — 2026**

Proiect realizat în cadrul stagiului de practică la Quasit Systems S.R.L.

## Licență

Codul original al website-ului FunArt™ este disponibil sub licența MIT.
Consultă fișierul [LICENSE](LICENSE) pentru detalii.

Imaginile, fonturile și celelalte resurse provenite din surse externe
pot avea condiții de utilizare separate și nu sunt acoperite automat
de această licență.
# Veb Aplikacija za supermarket

Ovo je projekat za ispit iz predmeta Praktikum - Internet i veb tehnologije.

Ime i prezime: Nenad Miražić
Broj indeksa: 2015/200-454
Školska godina: 2022/2023

********************************************************************************

## Projektni zahtev

Realizovati veb sajt supermarketa koji ima ulogu veb prezentacije sa više kategorija sadržaja, među kojima su stranice, vesti raspoređene u kategorije, galerija slika, kontakt formular, kao i katalog proizvoda (sa hijerarhijom minimum tri sloja, npr. Hrana » Mlečni proizvodi » Kačkavalji). Veb sajt treba da ima bazu podataka u kojoj se svaka od ovih vrsta sadržaja čuva u tabeli koja odgovara strukturi podataka svake od stavki (stranica, vest, kategorija, slika u galeriji, proizvod i kontakt poruka).

 Administratorima sadržaja, koji se na poseban deo za uređivanje sadržaja prijavljuju sa pristupnim parametrima, treba omogućiti da vide listu svake od stavki, da mogu da dodaju novu, izmene ili obrišu postojeću.

 Korisnici sajta (posetioci) treba da imaju opciju za pretragu po ključnim rečima, kao i po određenim filterima (neku od kategorija u hijerarhiji) odakle će u rezultatima pretrage videti fotografiju, naziv i cenu proizvoda, a kada kliknu na link, biće im prikazana stranica sa svim detaljima. Na stranicama sa detaljima proizvoda treba da bude prikazana lista ponuđenih sličnih proizvoda iz te kategorije. Grafički interfejs veb sajta treba da bude realizovan sa responsive dizajnom.

## Tehnička ograničenja

- Aplikacija mora da bude realizovana na Node.js platformi korišćenjem Express biblioteke. Aplikacija mora da bude podeljena u dve nezavisne celine: back-end veb servis (API) i front-end (GUI aplikacija). Sav kôd aplikacije treba da bude organizovan u jednom Git spremištu u okviru korisničkog naloga za ovaj projekat, sa podelom kao u primeru zadatka sa vežbi.
- Baza podataka mora da bude relaciona i treba koristiti MySQL ili MariaDB sistem za upravljanje bazama podataka (RDBMS) i u spremištu back-end dela aplikacije mora da bude dostupan SQL dump strukture baze podataka, eventualno sa inicijalnim podacima, potrebnim za demonstraciju rada projekta.
- Back-end i front-end delovi projekta moraju da budi pisani na TypeScript jeziku, prevedeni TypeScript prevodiocem na adekvatan JavaScript. Back-end deo aplikacije, preveden na JavaScript iz izvornog TypeScript koda se pokreće kao Node.js aplikacija, a front-end deo se statički servira sa rute statičkih resursa back-end dela aplikacije i izvršava se na strani klijenta. Za postupak provere identiteta korisnika koji upućuje zahteve back-end delu aplikacije može da se koristi mehanizam sesija ili JWT (JSON Web Tokena), po slobodnom izboru.
- Sav generisani HTML kôd koji proizvodi front-end deo aplikacije mora da bude 100% validan, tj. da prođe proveru W3C Validatorom (dopuštena su upozorenja - Warning, ali ne i greške - Error). Grafički korisnički interfejs se generiše na strani klijenta (client side rendering), korišćenjem React biblioteke, dok podatke doprema asinhrono iz back-end dela aplikacije (iz API-ja). Nije neophodno baviti se izradom posebnog dizajna grafičkog interfejsa aplikacije, već je moguće koristiti CSS biblioteke kao što je Bootstrap CSS biblioteka. Front-end deo aplikacije treba da bude realizovan tako da se prilagođava različitim veličinama ekrana (responsive design).
- Potrebno je obezbediti proveru podataka koji se od korisnika iz front-end dela upućuju back-end delu aplikacije. Moguća su tri sloja zaštite i to: (1) JavaScript validacija vrednosti na front-end-u; (2) Provera korišćenjem adekvatnih testova ili regularnih izraza na strani servera u back-end-u (moguće je i korišćenjem izričitih šema - Schema za validaciju ili drugim pristupima) i (3) provera na nivou baze podataka korišćenjem okidača nad samim tabelama baze podataka.
- Neophodno je napisati prateću projektnu dokumentaciju o izradi aplikacije koja sadrži (1) model baze podataka sa detaljnim opisom svih tabela, njihovih polja i relacija; (2) dijagram baze podataka; (3) dijagram organizacije delova sistema, gde se vidi veza između baze, back-end, front-end i korisnika sa opisom smera kretanja informacija; (4) popis svih aktivnosti koje su podržane kroz aplikaciju za sve uloge korisnika aplikacije prikazane u obliku Use-Case dijagrama; kao i (5) sve ostale elemente dokumentacije predviđene uputstvom za izradu dokumentacije po ISO standardu.
- Izrada oba dela aplikacije (projekata) i promene kodova datoteka tih projekata moraju da bude praćene korišćenjem alata za verziranje koda Git, a kompletan kôd aplikacije bude dostupan na javnom Git spremištu, npr. na besplatnim GitHub ili Bitbucket servisima, jedno spremište za back-end projekat i jedno za front-end projekat. Ne može ceo projekat da bude otpremljen u samo nekoliko masovnih Git commit-a, već mora da bude pokazano da je projekat realizovan u kontinuitetu, da su korišćene grane (branching), da je bilo paralelnog rada u više grana koje su spojene (merging) sa ili bez konflikata (conflict resolution).

## Baza podataka

- Model relacione baze podataka

![piiv_appDbModel](../02-resources/piiv_appDBmodel.png)

- Diagram relacione baze podataka

![piiv_appDBdiagram](../02-resources/piiv_appDBdiagram.png)

- Detaljan opis tabela baze podataka

 administrator                                                                  Administrator

• administrator_id          INT        10      PK   NN     UN   AI              primarni ključ
• username                  VARCHAR    32              UQ                       korisničko ime
• email                     VARCHAR    32              UQ                       adresa el. pošte
• password_hash             VARCHAR   128                                       heš lozinke
• password_reset_link       TEXT                       UQ      D NULL           link za resetovanje pass
• is_active                 TINYINT      1                 UN  D 1              status naloga
• created_at                TIMESTAMP                          D CT             vreme kreiranja naloga

page                                                                            Stranica

• page_id                   INT         10     PK   NN     UN   AI              primarni ključ
• title                     VARCHAR     32             UQ                       naslov
• alt_text                  VARCHAR     64                     D NULL           dodatni opis, seo tagovi
• content                   TEXT                                                sadržaj
• is_deleted                TINYINT      1          NN     UN  D 0              oznаčen kao izbrisan(0=ne)
• created_at                TIMESTAMP                          D CT             vreme kreiranja
• modified_at               TIMESTAMP                          D CT             vreme ažuriranja

category                                                                        Kategorija

• category_id               INT         10     PK   NN     UN   AI              primarni ključ
• name                      VARCHAR     32             UQ1                      naziv
• category_type             ENUM     {product, news, root}     D NULL           tip kategorije (za proizvod ili vesti)
• is_deleted                TINYINT      1          NN     UN  D 0              oznаčen kao izbrisan(0=ne)
• category_id               INT         10             UQ1 UN  D NULL  FK       strain ključ ka istoj tabeli (adjacency list)

photo                                                                           Slika

• photo_id                  INT         10     PK   NN     UN   AI              primarni ključ
• name                      VARCHAR     32             UQ                       naziv
• alt_text                  VARCHAR     64                     D NULL           dodatni opis, seo tagovi
• file_path                 TEXT                       UQ                       putanja datoteke
• content_type              ENUM {product,news,page}           D NULL           namena slike (proizvod,vesti,stranica)
• product_id                INT         10                 UN          FK       strain ključ ka tabeli proizvod
• page_id                   INT         10                 UN          FK       strain ključ ka tabeli stranica
• news_id                   INT         10                 UN          FK       strain ključ ka tabeli vesti

product                                                                         Proizvod

• product_id                INT         10     PK   NN     UN   AI              primarni ključ
• name                      VARCHAR     32             UQ1                      naziv  
• alt_text                  VARCHAR     64                      D NULL          dodatni opis, seo tagovi
• description               TEXT                    NN                          opis
• price                     DECIMAL     10,2        NN     UN                   cena
• sku                       INT         10          NN UQ  UN                   jedinstveni broj
• supply                    INT         10          NN     UN                   stanje u magacinu
• is_on_discount            TINYINT     0           NN     UN   D 0             status popusta(aktivan/neaktivan)
• discount                  ENU  {[0.10-0.9}}       NN                          vrednost popusta u %
• is_deleted                TINYINT      1          NN     UN   D 0             oznаčen kao izbrisan(da/ne)
• created_at                TIMESTAMP    1                      D CT            vreme kreiranja
• modified_at               TIMESTAMP    1                      D CT            vreme ažuriranja
• category_id               INT         10             UQ1 UN          FK       straini ključ ka tabeli kategorija

news                                                                            Vesti

• news_id                  INT         10     PK   NN     UN   AI               primarni ključ
• title                    VARCHAR     32             UQ1                       naslov
• content                  TEXT                                                 sadržaj/tekst
• alt_text                 VARCHAR     128                     D NULL           dodatni opis, seo tagovi
• created_at               TIMESTAMP                           D CT             vreme kreiranja
• is_deleted               TINYINT       1         NN     UN   D 0              oznаčen kao izbrisan(da/ne)
• modified_at              TIMESTAMP                           D CT             vreme ažuriranja
• category_id              INT         10             UQ1 UN          FK        straini ključ ka tabeli kategorija

contact                                                                         kontakt

• contact_id                INT         10     PK   NN     UN   AI              primarni ključ
• firstname                 VARCHAR     32                                      ime
• lastname                  VARCHAR     32                                      prezime
• email                     VARCHAR     64                                      adresa el. pošte
• title                     VARCHAR     32                                      naslov
• message                   TEXT                                                poruka/pitanje
• created_at                TIMESTAMP                           D CT            vreme kreiranja

## Dijagram organizacije komponenata aplikacije

....

### Uloge korisnika

- Spisak aktivnosti po ulogama

![spisakAktivnostiPoUlogama](../02-resources/spisakAktivnostiPoUlogama.png)

## Use-case dijagrami

...

## Prikaz konačnog spiska pojedinačnih aktivnosti

- Administrator

- Uređivanje sadržaja
  - Listanje/pregled stavki (proizvoda, vesti, galerije, poruka, stranica)
  - Dodavanje nove kategorije
  - Izmene kategorije
  - Brisanje kategorije
  - Dodavanje stranice
  - Izmena stranice
  - Brisanje stranice
  - Dodavanje slike u galeriju
  - Brisanje slike iz galerije
  - Dodavanje proizvoda
  - Brisanje proizvoda
  - Izmena proizvoda
  - Dodavanje vesti
  - Brisanje vesti
  - Pregled kontakt poruka
  - Brisanje kontakt poruka
- Izmena svog i drugih admin naloga

- Korisnik/posetilac sajta

- Prijava na administratorski nalog
- Pregledavanje stranica sajta
  - Pregled glavne stranice(Home page)
  - Pregled stranice galerije slika
  - Pregled kontakt stranice
  - Pregled kataloga proizvoda po hijerarhiji kategorija
  - Pregled kataloga vesti po hijeararhiji kategorija
  - Pregled ostalih stranica
- Pretraga proizvoda
  - Pretraga po ključnim rečima
  - Filtriranje proizvoda (imenu, kategorijama, ceni)
- Pregled detalja proizvoda
  - Pregled osnovnih informacija o proizvodu (fotografija, naziv, cena)
  - Pregled detaljnih informacija o proizvodu (opis, sastav...)
  - Pregled sličnih proizvoda/vesti iz iste kategorije
- Slanje kontakt poruke

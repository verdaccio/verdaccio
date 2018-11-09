---
id: use-cases
title: "Use Cases"
---
## Korišćenje privatnih paketa

Možete dodavati korisnike i određivati koji će korisnici imati pristup kojim paketima.

Zaista se preporučuje da definišete prefiks za svoje privatne pakete, na primer "local". Posle toga, sve što je privatno, izgledaće ovako: `local-foo`. Na ovaj način možete jasno razdvojiti javne pakete od privatnih.

## Korišćenje javnih paketa sa npmjs.org

Ako neki od paketa ne postoji u memoriji, server će pokušati da ga preuzme (fetch) sa npmjs.org. U slučaju da npmjs.org nije u funkciji, preuzeće se iz cache-a. Verdaccio će preuzeti samo ono što je neophodno (= ono što je klijent zatražio), i ta će informacija biti keširana, tako da u slučaju da klijent ponovo prosledi isti zahtev, preuzeće se bez aktivne potrebe za npmjs.org.

Primer: ako ste jednom poslali zahtev za express@3.0.1sa ovog servera, bićete u mogućnosti da to uradite ponovo (sa svim potrebnim dependencies) kad god je npmjs.org van funkcije. Ali, recimo, express@3.0.0 neće biti preuzet, sve dok ga neko ne potraži. I u slučaju da je npmjs.org offline, server će odgovoriti da je, na primer, samo express@3.0.1 dostupan (= samo onaj koji je u cache) i nijedan drugi.

## Override public packages

Ako želite da koristite modifikovanu verziju nekog javnog paketa `foo`, možete ga jednostavno publikovati na lokalnom serveru, tako da kada ukucate `npm install foo`, počeće da instalira Vašu verziju.

Ovde postoje dve opcije:

1. Ako želite da kreirate poseban fork i zaustavite sinhronizaciju sa javnom verzijom.
    
    Ako želite da uradite to, trebalo bi da modifikujetesvoju fajl za konfiguraciju tako da verdaccio prestane da traži zahteve od npmjs koji se odnose na taj paket. Dodajte psoeban unos za ovaj paket u *config.yaml* i uklonite `npmjs` iz `proxy` liste i restartujte server.
    
    Kada publikujete svoj paket lokalno, verovatno bi trebalo da otpočnete sa sa verzijom novijom od postojeće, tako da se izbegne konflikt sa postojećim paketom u cache-u.

2. Ako želite da svoju verziju samo privremeno, ali da se vratite na javnu čim se pojavi ažurirana.
    
    Kako biste izbegli konflikte sa verzijama, trebalo bi da koristite pre-release suffix sledeće patch verzije. Na primer, ako je javni paket verzije 0.1.2, možete upload-ovati 0.1.3-my-temp-fix. Na taj način paket koji koristite će opstati dok se ne pojavi javna verzija paketa 0.1.3.
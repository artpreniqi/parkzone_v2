# 🅿️ ParkZone - Real-Time Smart Parking Management System

**ParkZone** është një platformë "Full-Stack" e avancuar e ndërtuar me **Next.js**, e dizajnuar për të zgjidhur problemin e gjetjes dhe menaxhimit të vendparkimeve në kohë reale. Ky projekt është zhvilluar si pjesë e lëndës "Zhvillimi i Ueb-it në Anën e Klientit".

---

##  Karakteristikat Kryesore

###  Menaxhimi Live i Kapacitetit (Real-Time)
Sistemi llogarit automatikisht vendet e lira në çdo sekondë duke analizuar rezervimet aktive në MongoDB. Sapo një rezervim skadon, vendi lirohet automatikisht në Ballinë pa pasur nevojë për rifreskim (Polling System).

###  Simulimi i Pagesave (Checkout System)
Procesi i rezervimit përfshin një llogaritës inteligjent të çmimit (Math.ceil logic: çdo minutë shtesë llogaritet si orë e plotë) dhe një modal pagese të sigurt (simulim) me validim të kartelës bankare.

###  Siguria dhe Rolet
- **Autentifikimi:** NextAuth.js me Credentials dhe **Google OAuth**.
- **Middleware:** Mbrojtje e rrugëve (Routes) në nivel serveri.
- **Admin Hub:** Panel kontrolli i plotë për menaxhimin e lokacioneve, klijentëve, veturave dhe mesazheve.

---

##  Teknologjitë e Përdorura

- **Frontend:** React.js & Next.js (Pages Router)
- **Stilizimi:** Tailwind CSS (Elite Dark/Blue Design - Responsive)
- **Databaza:** MongoDB Atlas (Mongoose ODM)
- **Validimi:** React Hook Form
- **Testimi:** Jest & React Testing Library (5/5 teste të kaluara)
- **State Management:** Context API & Custom Hooks (`useLocalStorage`)
- **Data Fetching:** SSR (`getServerSideProps`), SSG, dhe ISR (`revalidate`)

---

##  Struktura e Faqeve (12+ Faqe)
1.  **Ballina (Home):** Prezantimi, Search Bar funksional dhe lokacionet live.
2.  **Lokacionet (Products):** Listë e veçantë e të gjitha parkingjeve.
3.  **Detajet e Produktit:** Faqe dinamike me `getStaticPaths` dhe rezervim live.
4.  **Dashboard:** Paneli i klijentit për menaxhimin e rezervimeve aktive.
5.  **Garazha (Vehicles):** CRUD i plotë për veturat e përdoruesit.
6.  **Profili:** Menaxhimi i të dhënave personale dhe upload i fotos nga media.
7.  **Admin Hub:** Menaxhim i 5 entiteteve (Parking, Bookings, Vehicles, Users, Messages).
8.  **Favoritët:** Lokacionet e pëlqyera të ruajtura për çdo përdorues (Custom Hook).
9.  **FAQ:** Pyetjet e shpeshta.
10. **About:** Rreth projektit dhe misionit tonë.
11. **Contact:** Formë kontakti me ruajtje direkte në MongoDB.
12. **Terms & Conditions:** Rregullat e përdorimit të sistemit.
13. **404 Page:** Faqja e personalizuar për gabimet e navigimit.

---

##  Grupi Punues

Projekti u realizua me bashkëpunimin e anëtarëve të grupit:

*   **Art Preniqi**: Arkitektura e sistemit, Logjika "Live Capacity", Integrimi i NextAuth/OAuth, API Routes dhe CRUD.
*   **Taulant Pefqeli**: UI/UX Design, Stilizimi me Tailwind CSS, Zhvillimi i Komponentëve (Navbar, Footer, Modals) dhe Faqet Informative.
*   **Sali Musaj**: Testimi me Jest, Dokumentimi teknik (README), Menaxhimi i MongoDB Atlas dhe logjika e formularëve të validimit.

---

##  Instalimi dhe Ekzekutimi

1. Klononi repozitorin:
   ```bash
   git clone [linku-i-repozitorit]
##  Instalimi dhe Përdorimi
1. Klononi repozitorin.
2. Instaloni varësitë: `npm install`.
3. Konfiguroni `.env.local` me 
    MONGODB_URI
    NEXTAUTH_SECRET
    GOOGLE_CLIENT_ID
    GOOGLE_CLIENT_SECRET.
4. Nisni serverin: `npm run dev`.
5. Për testim: `npm test`.
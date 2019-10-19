# Logical Dishes (Progetto TAW 2018/2019)

### Dario Lazzaro, Francesco Villani

Progetto Corso Tecnologie e Applicazioni Web [CT0142], Università Ca' Foscari Venezia.

## Dipendenze

- npm
- Node.js 10.x
- Android Sdk (solo per build Android)

Opzionali:

  - Git bash:
    solo per utenti Windows. Sono però presenti Scripts .bat (presenti nelle rispettive cartelle Scripts su front e back) per permettere     la compilazione senza l'utilizzo di Git bash.

## Building

Aprire terminale nella root del progetto (presenza cartelle back e front) ed eseguire i seguenti comandi.

- Angular, se non presente

  ```
  npm install -g @angular/cli
  ```

- Cordova, se non presente (solo per build Android)

  ```
  npm install -g cordova
  ```
  
- Moduli necessari

  ```
  npm install
  ```

**Backend**

```
npm run start-backend
```

**Frontend**

Per l'utilizzo dell'Applicazione su Desktop e Android è prima necessario lanciare il comando di Build: una volta eseguito questo comando (solamente una volta) è poi possibile eseguire direttamente il solo comando di start per avviarla le volte successive.
Se si è effettuata una build per una piattaforma (EX Desktop), per poter eseguire l'applicazione in una piattaforma differente (EX Android) è necessaria l'esecuzione del comando di build per la nuova piattaforma di esecuzione voluta (EX eseguendo build-android).

- **Web**

  ```
  npm run start-web
  ```

- **Desktop**

  1.  Build Desktop

     ```
     npm run build-desktop
     ```

  2. Start Desktop

     ```
     npm run start-desktop
     ```

- **Android**

  1. Build Android

     ```
     npm run build-android
     ```

  2. Start Android

     ```
     npm run start-android
     ```


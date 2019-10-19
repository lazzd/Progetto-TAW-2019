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


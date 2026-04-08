# VintedBoost

VintedBoost est une application permettant de générer automatiquement des descriptions optimisées, titres et prix pour vos articles Vinted grâce à l'IA.

## 🚀 Comment lancer le projet localement

### 1. Installation
Commencez par installer les dépendances du projet :
```bash
npm install
```

### 2. Démarrage
Pour faire fonctionner l'application, **deux** serveurs doivent tourner en parallèle. Vous devez donc ouvrir **deux terminaux séparés**.

**Terminal 1 : Le serveur de Base de données (Convex)**
Ce serveur s'occupe de la base de données locale.
```bash
npx convex dev
```

**Terminal 2 : Le serveur Web (Next.js)**
Ce serveur fait tourner l'interface de l'application.
```bash
npm run dev
```

Une fois les deux terminaux lancés, l'application est disponible dans votre navigateur sur [http://localhost:3000](http://localhost:3000).

---

## 🌐 Comment déployer et héberger le site gratuitement

Ce projet est pensé pour être hébergé **à 100% gratuitement** avec le combo Vercel (pour le front) et Convex (pour le back). Voici les étapes :

### Étape 1 : Héberger le code sur GitHub
1. Créez un dépôt sur GitHub.
2. Poussez votre code local (ce dossier complet) sur ce dépôt GitHub (attention de ne pas publier vos vraies clés privées d'environnement publiquement).

### Étape 2 : Déployer la Base de Données (Convex)
Convex possède un hébergement cloud gratuit pour vos bases de données.
1. Depuis votre terminal, lancez :
   ```bash
   npx convex deploy
   ```
2. Cela va pousser vos fonctions backend sur les serveurs de Convex.
3. Allez sur votre tableau de bord [Convex Dashboard](https://dashboard.convex.dev). Vous devriez y trouver votre URL de production.

### Étape 3 : Déployer le site Web (Vercel)
Vercel est la meilleure plateforme (gratuite en version "Hobby") pour héberger des applications Next.js.
1. Créez un compte sur [Vercel](https://vercel.com) (idéalement en vous connectant via GitHub).
2. Cliquez sur le bouton **"Add New Project"**.
3. Importez votre dépôt GitHub.
4. Dans la configuration du projet, allez dans la section **"Environment Variables"**. Vous devez y copier/coller TOUTES les variables de votre `.env.local`.
   *(Très important : remplacez l'URL locale `NEXT_PUBLIC_CONVEX_URL` par l'URL de production fournie par Convex).*
5. Cliquez sur **Deploy**.

Au bout de quelques minutes, Vercel vous donnera une vraie adresse web (ex: `vintedboost.vercel.app`) pour utiliser l'application au grand public !

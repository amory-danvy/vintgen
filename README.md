# VintGen

VintGen est une application qui génère automatiquement des descriptions optimisées, titres et prix pour vos articles Vinted grâce à l'IA.

## 🌍 Le site est déjà en ligne !

Pas besoin d'installer quoi que ce soit pour utiliser l'application : **[https://vintgen.vercel.app/](https://vintgen.vercel.app/)**

Le reste de ce guide explique comment lancer le projet **sur votre propre ordinateur** (par exemple pour modifier le code).

---

## 🚀 Lancer le projet en local

### Étape 1 — Installer Node.js
Si ce n'est pas déjà fait, installez **[Node.js](https://nodejs.org/)** (prenez la version "LTS").

### Étape 2 — Récupérer le projet
Téléchargez ou clonez ce dépôt, puis ouvrez un terminal dans le dossier du projet et lancez :
```bash
npm install
```
Cette commande télécharge toutes les dépendances. Patientez quelques minutes.

### Étape 3 — Créer le fichier `.env.local`
À la racine du projet, créez un fichier nommé `.env.local`. Il contiendra vos clés API. Voici le modèle à copier :

```env
# Google Gemini (l'IA qui génère les descriptions)
GEMINI_API_KEY=

# Clerk (l'authentification / connexion utilisateur)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Convex (la base de données — sera rempli automatiquement à l'étape 5)
NEXT_PUBLIC_CONVEX_URL=
```

Les sections suivantes expliquent **où trouver chaque clé**.

---

## 🔑 Comment obtenir chaque clé API (gratuit)

### 🟦 Clé Google Gemini (`GEMINI_API_KEY`)
C'est l'IA qui rédige les descriptions de vos articles.

1. Allez sur **[Google AI Studio](https://aistudio.google.com/apikey)**.
2. Connectez-vous avec votre compte Google.
3. Cliquez sur **"Create API key"**.
4. Copiez la clé qui commence par `AIza...` et collez-la dans votre `.env.local` après `GEMINI_API_KEY=`.

### 🟪 Clés Clerk (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `CLERK_SECRET_KEY`)
Clerk gère la connexion / inscription des utilisateurs.

1. Créez un compte gratuit sur **[clerk.com](https://clerk.com/)**.
2. Cliquez sur **"Create application"**, donnez-lui un nom (ex: `VintGen`).
3. Choisissez les méthodes de connexion souhaitées (Email, Google, etc.) puis validez.
4. Une fois l'application créée, allez dans le menu de gauche **"API Keys"**.
5. Vous verrez deux clés à copier dans votre `.env.local` :
   - **Publishable key** (commence par `pk_test_...`) → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** (commence par `sk_test_...`) → `CLERK_SECRET_KEY`

### 🟩 Convex (`NEXT_PUBLIC_CONVEX_URL`)
Convex est la base de données du projet. **Pas besoin d'aller chercher la clé manuellement** : elle sera créée automatiquement à l'étape suivante.

---

## ▶️ Étape 4 — Lancer l'application

Vous devez ouvrir **deux terminaux** en parallèle dans le dossier du projet.

### Terminal 1 — La base de données (Convex)
```bash
npx convex dev
```
La première fois, l'outil vous demandera de vous connecter (un compte gratuit se crée tout seul) puis remplira automatiquement les variables `NEXT_PUBLIC_CONVEX_URL` et `CONVEX_DEPLOYMENT` dans votre `.env.local`. Laissez ce terminal tourner.

### Terminal 2 — Le site web (Next.js)
```bash
npm run dev
```

Ouvrez ensuite **[http://localhost:3000](http://localhost:3000)** dans votre navigateur. C'est prêt !

---

## ❓ Problème ?

- **"command not found: npm"** → Node.js n'est pas installé (étape 1).
- **Page blanche / erreur de connexion** → Vérifiez que les deux terminaux tournent et que toutes les clés du `.env.local` sont bien remplies.
- **Erreur Clerk** → Assurez-vous d'avoir copié les clés du bon environnement (Development) sur le dashboard Clerk.

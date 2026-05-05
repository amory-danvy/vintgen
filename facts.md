# 🚀 Projet VintGen - Fiche Technique & Présentation

## 📝 Concept
VintGen est une plateforme SaaS (Software as a Service) conçue pour aider les revendeurs de vêtements de seconde main à maximiser leur visibilité et leurs ventes sur Vinted. Grâ ce à l'intelligence artificielle, l'application automatise la création d'annonces optimisées à partir d'une simple photo.

---

## 🛠️ Stack Technique (Modern & Performante)

### Frontend (User Interface)
- **Framework** : Next.js 15 (App Router) - Pour une navigation ultra-rapide et un SEO optimisé.
- **Langage** : TypeScript - Garantit un code robuste et sans erreurs de type.
- **Styling** : Tailwind CSS v4 - Design moderne, responsive et fluide (Light/Dark Mode automatique).
- **Icônes** : Lucide React - Bibliothèque d'icônes élégante et légère.
- **Expérience Mobile** : PWA (Progressive Web App) - L'application peut être installée sur smartphone comme une app native avec une icône sur l'écran d'accueil.

### Backend (Infrastructure & Logique)
- **Base de données Temps Réel** : Convex - Gère les données utilisateurs et la logique métier (crédits) avec une latence quasi nulle.
- **Authentification** : Clerk - Gestion sécurisée des comptes utilisateurs, profils et sessions.
- **Intelligence Artificielle** : Google Gemini 1.5 Flash (via SDK officiel) - Analyse visuelle avancée capable de reconnaître les vêtements, marques et d'estimer les prix.

---

## ⚙️ Fonctionnement du Produit

1. **Upload Photo** : L'utilisateur prend une photo de son article ou la choisit dans sa galerie.
2. **Analyse IA Vision** : L'image est envoyée à Gemini Vision qui :
   - Identifie le type de vêtement (matière, coupe, état).
   - Estime la valeur de marché actuelle.
   - Génère un titre accrocheur.
3. **Optimisation SEO** : L'application produit une description détaillée avec les bons mots-clés et une liste de hashtags pertinents pour l'algorithme de Vinted.
4. **Copy-to-Sell** : L'utilisateur copie les informations en un clic pour les coller directement sur Vinted.

---

## 💎 Modèle Économique (SaaS Freemium)

- **Version Gratuite** : 2 analyses offertes par jour pour tous les utilisateurs connectés.
- **Système de Crédits** : Géré par Convex, le compteur se réinitialise automatiquement toutes les 24h.
- **Paywall Premium** : Une fois la limite atteinte, un modal interactif propose un abonnement (ex: 2,99€/mois) pour débloquer les analyses illimitées.

---

## ✨ Points Forts du Projet (Pitch)
- **Rapidité** : Passer d'une photo à une annonce complète en moins de 10 secondes.
- **Mobile First** : Conçu spécifiquement pour être utilisé "en direct" pendant que l'on prépare ses colis.
- **Design Premium** : Interface "Glassmorphism" avec des micro-animations pour une expérience utilisateur haut de gamme.
- **Scalabilité** : Architecture prête à accueillir des milliers d'utilisateurs grâce à la puissance du serverless (Next.js + Convex + Clerk).

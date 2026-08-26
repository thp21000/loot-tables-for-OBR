# PROJECT_CONTEXT

## Projet
- Nom : Loot Tables for Owlbear
- Version actuelle : **0.2.00**
- Type : extension Owlbear Rodeo, frontend React/TypeScript/Vite hébergé sur GitHub Pages
- Dépôt principal : `thp21000/loot-tables-for-OBR`
- Hébergement : `https://thp21000.github.io/loot-tables-for-OBR/`
- Manifest public : `https://thp21000.github.io/loot-tables-for-OBR/manifest.json`
- Fiche store : `public/store.md`
- Clé dans le store Owlbear : `loot-tables`
- Statut store : **officiellement publié dans le store des extensions Owlbear Rodeo**. La PR `owlbear-rodeo/extensions#139` a été fusionnée le 2026-08-26.

## Objectif
Permettre au MJ de créer, modifier, importer, exporter et lancer des tables de loot dans Owlbear Rodeo, avec prise en charge PF2E et DnD 5e, puis de valider un tirage afin de partager le butin avec les autres participants de la room.

## Stack et infrastructure
- React + TypeScript + Vite
- Owlbear Rodeo SDK : `@owlbear-rodeo/sdk`
- Pas de backend dédié
- Pas de base de données serveur
- Tables enregistrées dans le stockage local du navigateur
- Déploiement automatique GitHub Pages via `.github/workflows/deploy.yml`
- Site et manifest servis depuis GitHub Pages

## Décisions techniques validées
- Les tables de loot restent stockées **localement dans le navigateur**.
- Ne pas stocker les tables complètes dans les metadata Owlbear.
- Les exports JSON/CSV restent la méthode de sauvegarde utilisateur ; le README doit continuer à recommander des exports JSON réguliers.
- Les tirages validés sont des messages éphémères et utilisent **`OBR.broadcast`**, pas les room metadata.
- L’état nécessaire à l’ouverture de la modale de gain est stocké localement par navigateur et par room.
- Flux actuel de partage :
  - MJ lance un tirage ;
  - MJ clique sur Valider ;
  - la fenêtre de résultat se ferme ;
  - le MJ ouvre localement la modale `Butin partagé` ;
  - le résultat est envoyé aux autres clients via `OBR.broadcast` avec destination `REMOTE` ;
  - chaque client affiche la modale dans sa propre langue.
- MJ : gestion complète des tables, tirages et validation.
- Joueur : consultation/réception, sans actions de gestion.
- Les gains partagés utilisent une vraie modale Owlbear dédiée.
- Les correctifs doivent rester incrémentaux et localisés ; éviter les refontes inutiles.

## État actuel fonctionnel
L’extension est fonctionnelle, déployée et publiée dans le store Owlbear.

### Tables
- Création, modification, suppression et duplication de tables
- Recherche et tri des tables
- Tables repliables/dépliables
- Tri des objets dans une table
- Édition ligne par ligne des objets
- Actions de ligne horizontales dans l’éditeur
- Barre flottante Enregistrer / Annuler / Remonter en haut

### Données d’objet
- Nom
- URL de fiche
- Niveau pour PF2E
- Catégorie
- Magique pour PF2E
- Type pour DnD 5e
- Rareté
- Montant + devise

### Systèmes
- PF2E
- DnD 5e
- Stockage séparé par système
- Formats CSV adaptés au système
- Devises adaptées au système : PF2E sans `pe/ep`, DnD 5e avec électrum

### Import / export
- Export JSON global
- Export JSON par table
- Export CSV par table
- Import JSON global
- Import JSON d’une table seule
- Import JSON en nouvelle table
- Import JSON dans une table existante avec mode ajouter/remplacer
- Import CSV en nouvelle table
- Import CSV dans une table existante avec mode ajouter/remplacer
- Détection de doublons simples
- Collage multiple depuis Excel
- Séparateurs acceptés pour le collage : tabulation, `;`, `,`
- Reconnaissance et normalisation de termes FR/EN pour catégories, raretés, types et devises

### Tirage
- Tirage configuré
- Tirage rapide avec mémorisation des derniers paramètres
- Bornes min/max pour niveau, quantité et valeur en cuivre
- Sliders synchronisés avec champs numériques manuels
- Filtres par catégories
- Gestion des doublons
- Filtre magique PF2E
- Plusieurs modes de probabilité
- Pondération DnD 5e corrigée pour respecter le sens raretés basses / hautes
- Historique local récent des tirages

### Internationalisation
- Interface FR/EN
- Provider i18n global
- Préférence de langue persistée localement
- Catégories, raretés, types et devises localisés
- Notifications Owlbear et modales de gain compatibles FR/EN
- La modale de gain reçoit explicitement `?lang=fr` ou `?lang=en` afin de respecter la langue du client qui l’ouvre
- Le MJ et les joueurs peuvent utiliser des langues différentes dans une même room

### Partage Owlbear
- `OBR.broadcast` utilisé pour les tirages validés
- Plus d’abonnement aux room metadata pour cette mécanique
- Le MJ reçoit sa modale localement
- Les autres clients reçoivent le broadcast `validated-roll`
- Le payload de la modale est conservé localement par room dans le navigateur
- Taille de la modale de gain : environ `760 × 640`

## UX Owlbear actuelle
- Popover principal configuré à **1150 × 950**
- La largeur ne varie plus selon la vue
- L’ancien mécanisme de mesure de largeur peut encore exister comme compatibilité dans le code, mais `setOwlbearPopoverWidth` ne redimensionne plus dynamiquement la fenêtre
- Page principale centrée avec marges gauche/droite symétriques
- Bouton Paramètres placé sur la même ligne visuelle que le titre
- Pas de scrollbar horizontale inutile sur la page principale
- Les aperçus larges et l’éditeur peuvent provoquer un scroll horizontal au niveau de la fenêtre principale Owlbear
- Scroll vertical également géré au niveau de la fenêtre principale
- Scrollbars personnalisées pour correspondre au thème sombre de Loot Tables
- L’éditeur réserve une largeur suffisante à la colonne Actions afin que les boutons restent entièrement dans le fond de chaque ligne
- Validation d’un tirage simplifiée : la fenêtre Résultat se ferme automatiquement après validation
- La confirmation redondante `Information — Tirage validé et partagé à tous` n’est plus affichée ; la modale `Butin partagé` sert de confirmation visuelle

## Architecture actuelle
### `public/manifest.json`
- Manifest Owlbear
- Version de release
- Action principale vers GitHub Pages
- Dimensions du popover : `1150 × 950`

### `public/store.md`
- Fiche utilisée par le store officiel Owlbear
- Front matter avec titre, description, auteur, image, icône, tags, manifest et learn-more
- Les images/GIF de la partie visible utilisent des URL absolues pour une meilleure compatibilité avec le store

### `src/main.tsx`
- Point d’entrée
- Attend que le SDK Owlbear soit prêt
- Configure le popover principal
- Détecte `?view=gain-modal`
- Ajoute `data-view` à `html`, `body` et `#root`
- Charge `src/obr-shell.css`

### `src/App.tsx`
- État principal de l’application
- Tables, recherche, tri, import/export, système, langue, tirages, historique
- Gestion rôle MJ/joueur
- Validation et partage des tirages
- Fenêtre Paramètres et News

### `src/owlbear.ts`
- Initialisation SDK
- Configuration taille/titre du popover
- Lecture room, rôle et nom du joueur
- Notifications Owlbear
- État local associé à la room
- Broadcast des tirages validés
- Abonnement au channel de broadcast
- Ouverture/fermeture de la modale de gain
- Ne doit plus utiliser les room metadata pour le partage des tirages validés

### `src/obr-shell.css`
- Couche spécifique au rendu Owlbear
- Taille et overflow du shell principal
- Scrollbars intégrées au thème
- Marges et centrage de la page principale
- Position du bouton Paramètres
- Passage du scroll horizontal au niveau de la fenêtre principale pour les vues larges
- Ajustements de l’éditeur et de la colonne Actions

### `src/components/TableList.tsx`
- Liste des tables
- Recherche/tri
- Cartes de tables
- Aperçu des objets
- Actions MJ
- Tirage rapide et tirage configuré

### `src/components/TableEditor.tsx`
- Création/modification d’une table
- Lignes d’objets
- Collage multiple
- Actions horizontales par ligne
- Barre flottante Enregistrer/Annuler/Remonter en haut

### `src/components/RollDialog.tsx`
- Configuration complète du tirage
- Bornes, sliders, filtres et probabilités

### `src/components/ResultDialog.tsx`
- Résultat local du tirage MJ
- Validation, relance, copie, historique
- Se ferme après validation réussie

### `src/components/SharedGainPage.tsx`
- Vue active de la vraie modale Owlbear de gain
- Lit le dernier payload validé dans l’état local de la room du navigateur
- Affichage localisé
- Différencie MJ/joueur

### `src/components/GainModal.tsx`
- Ancien composant de gain conservé et localisé
- Ne constitue pas le flux principal actuel de partage

### `src/i18n/`
- `index.tsx` : provider/hook
- `locales/fr.ts` et `locales/en.ts` : traductions UI + News
- `gameTerms.ts` : mapping catégories, raretés, types, devises et options par système

### `src/utils/storage.ts`
- Stockage local des tables et état UI
- Imports/exports JSON/CSV
- Normalisation des données
- Séparation PF2E / DnD 5e

### `src/utils/loot.ts`
- Filtres et sélection des objets
- Pondérations/probabilités
- Logique de tirage

## Publication Owlbear officielle
- Dépôt officiel du store : `owlbear-rodeo/extensions`
- PR : `#139 Add Loot Tables extension`
- Branche source utilisée : `thp21000/extensions:add-loot-tables-extension`
- Entrée ajoutée à `extensions.json` :
  - clé : `loot-tables`
  - valeur : `https://raw.githubusercontent.com/thp21000/loot-tables-for-OBR/main/public/store.md`
- PR fusionnée le **2026-08-26**
- L’extension est donc officiellement disponible via le store des extensions Owlbear Rodeo

## Points de vigilance actuels
- Les tables restent locales : toujours rappeler l’importance des exports JSON de sauvegarde
- Tester après chaque retouche CSS dans Owlbear réel, car le rendu dépend de l’iframe/popover de la plateforme
- Éviter de réintroduire du redimensionnement dynamique du popover
- Ne pas recréer de scrollbars horizontales internes en bas des longues listes ; le scroll horizontal doit rester rattaché à la fenêtre principale quand nécessaire
- Préserver les boutons d’action de l’éditeur sur une seule ligne et entièrement à l’intérieur de la ligne d’objet
- Continuer à tester FR/EN avec MJ et joueur dans des langues différentes

## Prochaines évolutions possibles
- Historique partagé plus riche des gains validés
- Stockage éventuellement lié à la scène pour certaines fonctions futures
- Synchronisation MJ/joueurs plus riche si un besoin concret apparaît
- Notes et tags supplémentaires
- Nouveaux packs de tables prêts à l’emploi
- Continuer les améliorations UX uniquement à partir de retours utilisateurs réels

## Journal de session

### Session du 2026-03-16
- Mise en place du socle de l’extension Owlbear
- Création/édition/import/export/tirage
- Intégration SDK et différenciation MJ/joueur
- Mise en place des premiers mécanismes de validation et partage
- Premières itérations sur la vraie modale Owlbear de gain et le layout du popover

### Session du 2026-03-18
- Stabilisation incrémentale du layout
- Alignement recherche/tri, cartes et footer
- Réduction de la densité de la vue objets
- Premiers travaux de redimensionnement du popover selon le contenu

### Session du 2026-03-24
- Ajout PF2E / DnD 5e
- Séparation du stockage par système
- Évolution du modèle de données
- Centralisation import/export dans une modal dédiée
- Adaptation des formats CSV

### Session du 2026-03-25
- Mise en place de l’i18n FR/EN
- Mapping localisé des termes de jeu
- Évolution du roll vers des bornes min/max
- Ajout des modes de probabilité et saisies manuelles synchronisées avec sliders

### Session du 2026-03-26
- Déplacement système/langue dans Paramètres
- Drapeaux SVG
- Barre flottante d’édition
- Traduction des devises
- Normalisation FR/EN des imports et collage multiple plus permissif

### Session du 2026-03-27
- Consolidation multi-systèmes + i18n + import/export
- Stabilisation des composants de tirage et du layout Owlbear

### Session du 2026-03-28
- Correction du sens des pondérations de rareté DnD 5e
- Recalibrage des modes soft/strong

### Session du 2026-05-18
- Correction de l’import JSON
- Acceptation des exports d’une table seule et des exports globaux
- Import JSON dans une table précise avec ajouter/remplacer
- Réutilisation du dédoublonnage commun CSV/JSON

### Session du 2026-08-25
- sujets traités :
  - Reprise de la soumission de Loot Tables au store officiel Owlbear Rodeo
  - Vérification de la documentation officielle `Showcase your Extension`
  - Vérification de la structure de `public/store.md` et décision de conserver une fiche store relativement concise, le README restant la documentation détaillée et maintenue
  - Fork de `owlbear-rodeo/extensions`, ajout de l’entrée `loot-tables` dans `extensions.json` et préparation de la PR vers `owlbear-rodeo/extensions:main`
  - Relecture de la PR et vérification de la règle de soumission avec un commit côté PR store
  - Analyse des retours reviewer sur l’utilisation des room metadata et sur les incohérences de langue
  - Correction du partage des tirages validés pour privilégier `OBR.broadcast` et supprimer la dépendance aux room metadata dans ce flux
  - Correction FR/EN des notifications et des modales de gain, y compris lorsqu’un MJ et un joueur utilisent des langues différentes
  - Validation des tests FR/EN dans Owlbear
  - Passage à la release intermédiaire 0.1.90 avec News correspondantes
- décisions prises :
  - Un tirage validé est un événement éphémère et doit être diffusé via `OBR.broadcast`
  - Le dernier payload nécessaire à la modale reste local au navigateur/room
  - La langue de la modale doit être déterminée côté client receveur, pas imposée par la langue du MJ
  - `store.md` n’a pas vocation à remplacer le README comme documentation utilisateur détaillée

### Session du 2026-08-26
- sujets traités :
  - Prise en compte du retour UX du reviewer Owlbear visant à réduire les modales/popovers et stabiliser les dimensions de l’interface
  - Simplification du flux de validation : fermeture automatique de `Résultat du tirage` après validation
  - Suppression de la confirmation redondante `Information — Tirage validé et partagé à tous`
  - Conservation de `Butin partagé` comme confirmation visuelle utile du partage
  - Stabilisation du popover principal à `1150 × 950`
  - Stabilisation de la modale de gain à environ `760 × 640`
  - Abandon effectif du redimensionnement dynamique de largeur pendant les interactions
  - Création de `src/obr-shell.css` pour centraliser les adaptations spécifiques Owlbear
  - Ajout de scrollbars horizontales/verticales intégrées au thème sombre
  - Passage du défilement horizontal des aperçus/éditeur vers la fenêtre principale Owlbear pour éviter une scrollbar située tout en bas d’une longue table
  - Conservation d’aucune scrollbar horizontale sur la page principale quand elle n’est pas nécessaire
  - Rééquilibrage des marges gauche/droite de la page principale
  - Déplacement visuel du bouton Paramètres sur la même ligne que le titre pour gagner de la hauteur
  - Correction des cartes `width: 100%` avec `box-sizing: border-box` afin d’éviter les dépassements de quelques pixels
  - Passage des boutons d’action des lignes d’éditeur en disposition horizontale
  - Corrections successives de la colonne Actions afin que les boutons restent entièrement à l’intérieur du fond de chaque ligne
  - Passage des URLs d’images de `store.md` vers des URL absolues
  - Fusion de la PR officielle `owlbear-rodeo/extensions#139` : Loot Tables est désormais publié dans le store officiel Owlbear
  - Passage du manifest à **0.2.00**
  - Mise à jour des 4 lignes de News FR/EN pour annoncer la release 0.2.00, la publication store et les améliorations UX
  - Mise à jour complète de ce `PROJECT_CONTEXT.md`
- principaux commits de la journée avant la release 0.2.00 :
  - `6d2f915` — Reduce redundant validation modal
  - `bdec48d` — Streamline roll validation flow
  - `ab9619f` — Stabilize Owlbear window sizes
  - `3a3e003` — Add fixed popover shell styles
  - `8bcd904` — Style fixed Owlbear shell and scrollbars
  - `a6198ee` — Enforce fixed Owlbear action size
  - `23e2523` — Use window-level scrolling and horizontal row actions
  - `118d4b6` — Polish main popover layout
  - `978d061` — Keep editor action buttons inside rows
  - `5c85841` — Reserve full width for editor action column
- décisions prises :
  - La taille du popover principal doit rester constante entre les interactions
  - Le scroll horizontal ne doit apparaître que lorsque le contenu le nécessite
  - Le scroll horizontal des longues vues doit être attaché à la fenêtre principale, pas au bas d’un bloc interne
  - Les actions de ligne doivent rester compactes, horizontales et entièrement contenues
  - Les retours UX du store peuvent être intégrés même lorsqu’ils ne sont pas obligatoires s’ils améliorent clairement le confort général

## Règles à respecter pour les prochaines sessions
- Lire ce fichier comme source principale de vérité avant toute modification importante
- Ne pas repartir de zéro
- Conserver le stockage local des tables sauf décision explicite contraire
- Ne pas réintroduire les room metadata pour diffuser les tirages validés
- Ne pas réintroduire le redimensionnement dynamique du popover principal
- Tester les changements FR/EN et MJ/joueur quand ils touchent au partage
- Préserver la sauvegarde/import/export existante
- Continuer par correctifs ciblés et incrémentaux
- Après une session importante, ajouter une entrée datée au Journal de session

## Prompt de reprise recommandé
Contexte : lis `PROJECT_CONTEXT.md` comme source principale de vérité.
Je veux reprendre le projet sans repartir de zéro.
Considère les décisions techniques déjà notées comme validées.
Travaille de façon concrète et incrémentale, en évitant les refontes inutiles.
La version de référence est 0.2.00, publiée officiellement dans le store Owlbear, avec popover principal fixe, partage des tirages via Broadcast et interface FR/EN stabilisée.

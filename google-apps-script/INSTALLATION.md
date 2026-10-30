# Connexion gratuite des avis à Google Sheets

Le formulaire reste affiché sur PassBac. Ce script crée une feuille privée dans votre compte Google et reçoit les évaluations anonymes. Le lien du déploiement est une adresse publique : ne placez aucun mot de passe ni donnée secrète dans le code du site.

## 1. Créer la feuille de réponses

1. Connectez-vous au compte Google qui doit recevoir les avis, puis ouvrez [script.google.com](https://script.google.com/).
2. Cliquez sur **Nouveau projet**.
3. Remplacez le code dans `Code.gs` par le contenu du fichier [`Code.gs`](./Code.gs).
4. Sélectionnez `setupPassBacFeedback` dans la liste des fonctions et cliquez sur **Exécuter**.
5. Autorisez le script à créer et modifier une feuille de calcul dans votre compte Google. Si Google affiche un avertissement pour ce script que vous venez de créer, vérifiez que le projet est bien celui de PassBac avant de poursuivre.
6. Dans le journal d’exécution, ouvrez le lien **Feuille de réponses**. La feuille appartient à votre compte ; ne la partagez pas publiquement.

La fonction de configuration est réutilisable : si la feuille existe déjà, elle affiche son lien au lieu d’en créer une autre.

## 2. Déployer le récepteur

1. Dans Apps Script, cliquez sur **Déployer > Nouveau déploiement**.
2. Choisissez **Application Web**.
3. Sélectionnez **Exécuter en tant que : Moi**.
4. Pour recevoir les réponses anonymes des élèves sans leur demander de compte Google, choisissez l’accès **Tout le monde**. Ce choix rend le point de réception publiquement accessible ; le script valide les champs et la feuille reste privée, mais une URL publique peut recevoir du spam et consommer les quotas gratuits Google.
5. Cliquez sur **Déployer**, autorisez l’accès demandé et copiez l’URL de l’application Web qui se termine par `/exec`.

Ne partagez pas l’URL d’édition du projet Apps Script ni celle de la feuille avec les élèves.

## 3. Activer l’envoi depuis PassBac

Dans `src/config/feedback.ts`, renseignez l’URL `/exec` obtenue :

```ts
export const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/ID_DU_DEPLOIEMENT/exec';
```

Enregistrez, vérifiez le site avec `npm run build`, puis publiez la mise à jour du site. L’URL du déploiement n’est pas un mot de passe. Le formulaire attend une confirmation du script avant d’annoncer que la réponse a été reçue.

## Confidentialité et limites

- Ne demandez ni nom, ni adresse e-mail, ni autre renseignement personnel dans ce formulaire.
- Les réponses sont envoyées à votre feuille Google privée. Le tableau affiché dans le navigateur de l’élève ne contient que les avis enregistrés sur cet appareil.
- La publication de l’application Web dépend des quotas et conditions gratuits Google Apps Script ; Google peut imposer des limites ou suspendre le service en cas d’utilisation abusive.
- Cette version inclut validation côté serveur et un champ anti-robot discret, mais pas de CAPTCHA ni de garantie contre les abus. Pour une classe, gardez l’URL de déploiement et le tableur privés et surveillez les soumissions.
- Après avoir modifié `Code.gs`, ouvrez **Déployer > Gérer les déploiements**, cliquez sur le crayon du déploiement, sélectionnez **Nouvelle version**, puis cliquez sur **Déployer**. Gardez les mêmes paramètres d’accès et utilisez l’URL `/exec` affichée pour le déploiement.

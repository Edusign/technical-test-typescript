# Test Technique Edusign

## 👋 Bienvenue

Vous allez travailler sur une application de validation de signatures utilisée par des établissements d'enseignement. Cette application traite un grand volume de données et doit garantir sécurité et performance.

**Contexte métier** : L'application gère les signatures étudiantes pour validation d'assiduité. Elle doit traiter plusieurs milliers de signatures par jour avec des contraintes de performance strictes.

---

## 🛠 Installation et démarrage

### Prérequis
- Node.js 18+
- Docker et Docker Compose

### Setup
```bash
# Installation des dépendances
npm install

# Démarrage de la base de données
docker-compose up -d

# Lancement des tests
npm test

# Développement
npm run dev
```

---

## 📋 Exercices (60 minutes)

### 🔍 Exercice 1 : Code Review & Architecture (20min)

Le fichier `src/app.ts` contient une API qui va être mise en production pour gérer des milliers d'utilisateurs.

**Votre mission** :
- **Analysez le code** et identifiez les problèmes critiques
- **Priorisez les corrections** par impact business
- **Proposez une architecture** plus robuste et sécurisée
- **Justifiez vos choix** techniques

**Points d'attention** :
- Sécurité des données
- Performance et scalabilité
- Gestion d'erreurs
- Architecture du code

### ⚡ Exercice 2 : Optimisation d'algorithmes (25min)

Le fichier `src/algorithms/signature-detector.ts` contient des algorithmes de traitement de signatures avec des problèmes de performance.

**Votre mission** :
- **Analysez la complexité** des algorithmes actuels
- **Identifiez les goulots d'étranglement** de performance
- **Optimisez les fonctions** pour gérer 10,000+ signatures
- **Mesurez l'amélioration** obtenue

**Contraintes techniques** :
- Temps de réponse < 500ms pour 1000 signatures
- Consommation mémoire maîtrisée
- Maintien de la précision des résultats

### 🤖 Exercice 3 : Développement avec IA (15min)

Utilisez l'IA pour implémenter une fonctionnalité de détection de signatures générées artificiellement.

**Votre mission** :
- **Analysez la fonction** `detectAIGeneratedSignature` dans `signature-detector.ts`
- **Utilisez l'IA** (ChatGPT, Claude, etc.) pour l'implémenter
- **Testez votre solution** avec les cas de test fournis
- **Documentez votre processus** d'utilisation de l'IA

**Évaluation** :
- Qualité du prompt initial
- Critique et amélioration des réponses IA
- Validation et tests de la solution

---

## 🎯 Livrables attendus

Pour chaque exercice :

1. **Code source** commenté et fonctionnel
2. **Explication** de votre démarche et des problèmes identifiés
3. **Justification** de vos choix techniques
4. **Mesures de performance** (exercice 2)
5. **Documentation** de votre utilisation de l'IA (exercice 3)

---

## 💡 Conseils

- **Concentrez-vous sur la logique** : nous évaluons votre raisonnement
- **Priorisez les impacts critiques** : sécurité > performance > maintenabilité
- **Documentez votre approche** : expliquez le "pourquoi" de vos décisions
- **Utilisez l'IA intelligemment** : comme un outil d'aide, pas une solution miracle
- **Posez des questions** si les besoins ne sont pas clairs

---

## ⏰ Gestion du temps (60 minutes)

- **Exercice 1** : 20 minutes - Focus sur les problèmes critiques
- **Exercice 2** : 25 minutes - Optimisation mesurable
- **Exercice 3** : 15 minutes - Implémentation guidée par IA

Si vous manquez de temps, **documentez votre approche** et les étapes suivantes.

**L'objectif est d'évaluer votre raisonnement technique et votre efficacité.**

---

## 🤝 Support

N'hésitez pas à demander :
- Clarifications sur les besoins fonctionnels
- Aide technique pour l'environnement
- Précisions sur les attentes

**Bonne chance ! 🚀**
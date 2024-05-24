# Edusign Tech Assessment

## Context :

Ce projet est un test technique centré sur la gestion de l'assiduité dans les feuilles de présence.
Il vise à développer la logique back-end en utilisant Node.js et Express.js pour gérer les opérations liées aux participants et aux feuilles de présence.

---

## Code review

Il s'agit d'un tout nouveau projet que l'un des membres de votre équipe vient de livrer.
Nous devons le mettre en production et vous êtes en charge de la revue de code.

Pendant ce test, n'hésitez pas à commenter, critiquer, suggérer des modifications par l'exemple.
Ce qui est acceptable dans ce code, ce qui ne l'est pas à vos yeux.

Considérez que si ce projet est mis en production, il aura un impact sur plus de 1.000.000 d'utilisateurs.

Info: une base de données MySQL est utilisée pour stocker les données. vous pouvez la lancer en utilisant docker-compose.

---

## Amélioration

Lorsqu'un étudiant est marqué comme présent sur une feuille de présence, il doit fournir sa signature.

Il est donc nécessaire :
- de vérifier que la signature est bien présente.
- de vérifier que la signature est bien une image.
- de vérifier que la signature est bien une image monochrome.

En cas d'erreur il faut renvoyer à l'utilisateur le détail de cette erreur.
- Il faut que l'erreur ai toujours la même structure
- Il faudra masquer les détails technique à l'utilisateur
- Il faudra quand même logger ces détails technique coté serveur.

Plusieurs tests ont été codés dans le fichier tests/signatureValidation.test.ts. 
Il serait interessant de coder la nouvelle route en suivant les principes du TDD.
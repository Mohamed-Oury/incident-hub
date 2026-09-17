# Payway Incident Hub

MVP d'une plateforme de capitalisation, diagnostic et résolution d'incidents monétiques.

## Démarrer localement

1. Copiez `.env.example` vers `.env` et renseignez PostgreSQL.
2. Installez les dépendances : `npm install` (accès au registre npm requis).
3. Générez Prisma : `npm run prisma:generate`.
4. Lancez l'application : `npm run dev`.

## Principes métier déjà modélisés

- Séparation stricte entre hypothèses, preuves, RCA et résolution.
- Les incidents de référence restent des scénarios tant qu'ils ne sont pas validés.
- Les données cartes sensibles ne font pas partie du modèle de persistance.
- Les actions sensibles sont prévues pour être auditées et protégées par rôles.

Le catalogue des 50 incidents de référence est conservé dans `app/reference-incidents.ts`. Il distingue explicitement les deux cas validés des scénarios à enrichir.

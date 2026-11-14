# Cahier des charges --- Monétique Log Analyzer

## Analyse, recherche et diagnostic des transactions à partir des fichiers de logs

**Version :** 1.0\
**Date :** 13 novembre 2026\
**Périmètre :** extension du backend et du système d'agents IA déjà
existants.

------------------------------------------------------------------------

## 1. Vision et objectifs

L'objectif est d'ajouter à l'application existante un module nommé
**Monétique Log Analyzer**. Il doit permettre d'importer des fichiers de
logs monétiques contenant plusieurs transactions entremêlées, de
rechercher une transaction par son **RRN (DE37)**, de reconstituer son
parcours technique et de produire une analyse d'incident exploitable.

Le système doit :

1.  Lire et parser les fichiers de logs.
2.  Extraire les événements et les messages ISO 8583.
3.  Rechercher une transaction à partir d'un RRN transmis en paramètre.
4.  Corréler les événements qui appartiennent à cette transaction, même
    s'ils ne sont pas contigus dans le fichier.
5.  Reconstituer la chronologie du traitement.
6.  Comparer les messages entrants et sortants.
7.  Détecter les anomalies et les ruptures de flux.
8.  Transmettre un contexte structuré aux agents IA déjà présents dans
    le backend.
9.  Produire un diagnostic traçable, en distinguant faits, hypothèses et
    vérifications nécessaires.
10. Capitaliser les incidents et les résolutions validées par les
    exploitants.

**Principe directeur :** le moteur déterministe parse, corrèle et
établit les faits observables. L'IA interprète ensuite ce contexte et
propose des hypothèses. L'IA ne doit jamais inventer un événement absent
des traces.

------------------------------------------------------------------------

## 2. Contraintes d'intégration à respecter

Le projet dispose déjà d'un backend qui gère des agents IA. Avant toute
modification, le développeur doit :

-   auditer l'architecture existante ;
-   identifier les services, routes, modèles et conventions déjà
    utilisés ;
-   comprendre le mécanisme d'orchestration des agents ;
-   identifier la base de données et le système de stockage disponibles
    ;
-   identifier les mécanismes d'authentification, d'autorisation et de
    journalisation ;
-   réutiliser les composants existants lorsqu'ils répondent au besoin ;
-   proposer les nouveaux composants et les modifications minimales ;
-   éviter de créer un deuxième backend ou une deuxième orchestration
    d'agents ;
-   préserver les fonctionnalités existantes.

Aucune technologie ni bibliothèque ne doit être imposée avant cet audit.
L'implémentation doit respecter la stack réelle du projet.

### Livrables préalables à l'implémentation

1.  Cartographie de l'architecture actuelle.
2.  Proposition d'architecture d'intégration.
3.  Schéma des flux de données.
4.  Liste des fichiers à créer ou modifier.
5.  Proposition de modèle de données.
6.  Stratégie de parsing et de corrélation.
7.  Plan de tests et critères d'acceptation.

Le développeur doit faire valider cette proposition avant de commencer
les changements structurants.

------------------------------------------------------------------------

## 3. Structure des logs à prendre en charge

Les fichiers observés contiennent des blocs de cette forme :

``` xml
<log realm="InternalChannel/10.11.20.9:9200"
     at="Mon Nov 02 00:01:55 GMT 2026.152">
  <FLOW - receive>
    <isomsg direction="incoming">
      <field id="0" value="..."/>
      <field id="11" value="..."/>
      <field id="37" value="..."/>
      <field id="41" value="..."/>
    </isomsg>
  </FLOW - receive>
</log>
```

D'autres événements observés comprennent notamment :

-   `FLOW - receive`
-   `FLOW - Msg From DISPATCH`
-   `FLOW - Msg To Host`
-   `sendMessage`
-   `send`
-   `receive`
-   `FLOW - Msg Recu`
-   `FLOW - Response Code`
-   `FLOW - send`

Les informations de transport peuvent être représentées par des dumps
hexadécimaux :

``` text
0000  31 31 30 30 FE 38 00 01  88 A0 E0 00 ...
0010  04 00 00 00 31 36 34 35 ...
```

Les messages ISO peuvent contenir des champs simples et des messages
imbriqués :

``` xml
<isomsg id="105">
  <field id="1" value="..."/>
  <field id="2" value="..."/>
</isomsg>
```

### 3.1 Particularités du format

Le fichier complet ne doit pas être considéré comme un document XML
unique nécessairement valide :

-   plusieurs blocs `<log>` peuvent se suivre ;
-   certains noms de balises contiennent des espaces ou des caractères
    spéciaux ;
-   des événements contiennent du texte brut et des dumps hexadécimaux ;
-   des messages ISO sont imbriqués ;
-   certains événements peuvent être incomplets ou tronqués.

Un parseur XML standard appliqué directement au fichier entier risque
donc d'échouer. Concevoir un parseur tolérant qui découpe d'abord les
événements selon les frontières réelles des blocs, puis interprète leur
contenu. Ne pas modifier le fichier source pour le rendre
artificiellement valide.

Le parseur doit préserver le contenu brut de chaque événement et
signaler les erreurs de parsing sans interrompre nécessairement
l'analyse des événements suivants.

------------------------------------------------------------------------

## 4. Architecture fonctionnelle cible

Le module doit s'intégrer au backend existant selon le flux logique
suivant :

``` text
Interface utilisateur
        |
        v
API existante
        |
        v
Gestion de l'importation des fichiers
        |
        v
Parser de logs
        |
        v
Normalisation des événements
        |
        v
Extracteur ISO 8583
        |
        v
Indexation des événements
        |
        v
Recherche par RRN (DE37)
        |
        v
Moteur de corrélation transactionnelle
        |
        v
Reconstitution du parcours
        |
        v
Moteur de règles et détection d'anomalies
        |
        v
Contexte structuré pour les agents IA existants
        |
        v
Diagnostic, rapport et capitalisation
```

Séparer clairement les responsabilités. Les agents IA ne doivent pas
être responsables du parsing brut, de la recherche déterministe du RRN
ou de la construction initiale de la chronologie.

------------------------------------------------------------------------

## 5. Module A --- Importation et gestion des fichiers

### Fonctionnalités

-   Importer un ou plusieurs fichiers.
-   Prendre en charge les fichiers texte compatibles, notamment `.log`
    et `.txt`.
-   Vérifier le type, la taille et l'intégrité du fichier.
-   Conserver le fichier source sans modification.
-   Calculer une empreinte du fichier pour identifier les doublons.
-   Enregistrer le nom, la taille, la date d'importation et
    l'utilisateur importateur.
-   Afficher l'état du traitement : reçu, en cours, terminé, terminé
    avec erreurs ou échoué.
-   Gérer les fichiers volumineux par lecture en flux (streaming), sans
    charger inutilement tout le fichier en mémoire.
-   Prévoir une stratégie de reprise en cas d'interruption.
-   Empêcher qu'un fichier déjà indexé soit retraité inutilement, sauf
    demande explicite.

### Résultat attendu

Chaque fichier importé reçoit un identifiant `file_id` stable qui
permettra de lancer les recherches ultérieures.

------------------------------------------------------------------------

## 6. Module B --- Parsing et normalisation

Pour chaque bloc `<log>`, extraire autant que possible :

-   l'horodatage `at` ;
-   le `realm` ;
-   le nom de l'événement ;
-   la direction du message ;
-   le contenu brut ;
-   les champs ISO 8583 ;
-   les messages ISO imbriqués ;
-   le dump hexadécimal ;
-   les informations de transport ;
-   la position ou les offsets dans le fichier source.

### Modèle d'événement normalisé

Chaque événement doit notamment contenir :

``` json
{
  "event_id": "identifiant_unique",
  "file_id": "identifiant_fichier",
  "timestamp_raw": "Mon Nov 02 00:01:55 GMT 2026.152",
  "timestamp": "2026-11-02T00:01:55.152Z",
  "realm": "InternalProcessor",
  "event_type": "FLOW - Msg To Host",
  "direction": "outgoing",
  "mti": "0200",
  "iso_fields": {
    "11": "123456",
    "37": "300013223046",
    "41": "ATM00452"
  },
  "raw_content": "contenu original de l'événement",
  "source_start": 1200,
  "source_end": 1850,
  "parse_status": "success"
}
```

Cet objet est un exemple de structure cible, pas une affirmation sur les
valeurs du fichier fourni.

### Règles de parsing

-   Conserver les identifiants de champs ISO sous forme de clés non
    ambiguës.
-   Préserver les valeurs exactes des champs, y compris les zéros
    initiaux.
-   Ne pas supposer que tous les champs sont présents.
-   Gérer les champs répétés ou les messages imbriqués sans écraser leur
    contenu.
-   Conserver le texte brut en complément des données normalisées.
-   Signaler les événements malformés.
-   Distinguer valeur absente, valeur vide et valeur masquée.
-   Gérer les fuseaux horaires et la précision à la milliseconde.
-   Ne pas interpréter une date sans connaître son fuseau.

------------------------------------------------------------------------

## 7. Module C --- Analyseur ISO 8583

Créer un moteur d'extraction et d'interprétation des messages ISO 8583.

### Champs particulièrement utiles

  -----------------------------------------------------------------------
  Champ                   Signification usuelle   Utilisation
  ----------------------- ----------------------- -----------------------
  DE0                     MTI                     Type de message

  DE2                     PAN                     Identification carte,
                                                  sous règles strictes de
                                                  masquage

  DE3                     Processing Code         Type de traitement

  DE4                     Amount, Transaction     Montant transaction

  DE5                     Amount, Settlement      Montant règlement

  DE6                     Amount, Cardholder      Montant facturé
                          Billing                 

  DE7                     Transmission Date and   Date/heure de
                          Time                    transmission

  DE11                    STAN                    Référence de trace

  DE12                    Local Transaction Time  Heure locale
                                                  transaction

  DE13                    Local Transaction Date  Date locale transaction

  DE14                    Expiration Date         Date d'expiration,
                                                  donnée sensible

  DE18                    Merchant Type           Catégorie commerçant

  DE22                    POS Entry Mode          Mode de saisie

  DE25                    POS Condition Code      Condition du point de
                                                  service

  DE32                    Acquiring Institution   Identifiant acquéreur
                          ID                      

  DE33                    Forwarding Institution  Identifiant
                          ID                      transmetteur

  DE37                    RRN                     Référence de recherche
                                                  principale

  DE39                    Response Code           Code réponse

  DE41                    Card Acceptor Terminal  Identifiant terminal
                          ID                      

  DE42                    Card Acceptor ID        Identifiant accepteur

  DE43                    Card Acceptor           Nom/localisation
                          Name/Location           accepteur

  DE49                    Currency Code,          Devise transaction
                          Transaction             

  DE54                    Additional Amounts      Montants
                                                  complémentaires

  DE102                   Account Identification  Identification compte
                          1                       

  DE105                   Champ ou sous-message   À interpréter selon le
                          spécifique              profil local
  -----------------------------------------------------------------------

**Important :** les significations exactes, formats, longueurs,
encodages et règles de présence dépendent du profil ISO 8583, du réseau
et du paramétrage du switch. Utiliser un dictionnaire configurable et
validé par l'équipe monétique. Ne pas coder en dur des interprétations
non confirmées.

### Fonctions attendues

-   Identifier le MTI.
-   Extraire les champs présents.
-   Interpréter les champs selon le dictionnaire actif.
-   Gérer les sous-messages.
-   Comparer les champs entre requête et réponse.
-   Identifier les champs attendus absents, selon le profil.
-   Signaler les incohérences de format.
-   Préserver les valeurs brutes.

### Décodage des dumps hexadécimaux

Prévoir un décodeur distinct qui :

1.  Identifie le framing et le préfixe de longueur selon la
    configuration.
2.  Sépare les octets de transport des données ISO.
3.  Détermine l'encodage du MTI et du bitmap.
4.  Décode le bitmap primaire et, si nécessaire, secondaire.
5.  Décode les champs selon le profil ISO configuré.
6.  Compare le résultat aux messages ISO déjà journalisés.
7.  Signale les divergences.

Ne pas supposer que tous les dumps sont ASCII ou qu'ils utilisent le
même framing. Ne pas déduire un message complet à partir d'un simple
affichage hexadécimal sans configuration du protocole.

------------------------------------------------------------------------

## 8. Module D --- Recherche par RRN (DE37)

### Objectif

Permettre à l'utilisateur de fournir un RRN et de retrouver la
transaction correspondante dans un fichier contenant plusieurs
transactions entremêlées.

La recherche doit porter sur l'ensemble du fichier, pas uniquement sur
le premier bloc ou sur une séquence contiguë d'événements.

### Contrat d'API indicatif

``` http
POST /api/monetique/log-analyzer/search
Content-Type: application/json
```

Corps de la requête :

``` json
{
  "file_id": "identifiant_fichier",
  "rrn": "300013223046"
}
```

Adapter le chemin et le format aux conventions de l'API existante.

### Algorithme de recherche

1.  Vérifier que le fichier existe et que son indexation est terminée.
2.  Valider le RRN fourni.
3.  Interroger l'index des événements par DE37.
4.  Retrouver tous les événements contenant exactement ce RRN dans le
    champ DE37.
5.  Identifier les transactions candidates.
6.  Regrouper les événements directement associés.
7.  Rechercher les événements intermédiaires susceptibles d'appartenir à
    ces transactions.
8.  Reconstituer les séquences.
9.  Calculer la confiance de chaque association.
10. Retourner les résultats et leurs références dans le fichier source.

La recherche doit comparer la valeur du champ DE37, et non effectuer une
simple recherche de sous-chaîne dans le texte brut. Une recherche
textuelle peut être proposée en complément, mais elle ne doit pas être
confondue avec une correspondance ISO confirmée.

### Gestion des cas particuliers

-   RRN absent : retourner « aucune transaction trouvée ».
-   RRN présent dans plusieurs transactions : présenter plusieurs
    candidats séparés.
-   RRN présent dans plusieurs événements d'une même transaction :
    regrouper ces événements.
-   RRN absent d'un événement intermédiaire : tenter une corrélation
    secondaire prudente.
-   STAN réutilisé : ne jamais corréler sur le STAN seul.
-   Réponse sans RRN : rechercher une association secondaire vérifiable.
-   Transaction interrompue : afficher le parcours partiel et les étapes
    manquantes.
-   Fichier incomplet : signaler que l'analyse peut être partielle.
-   Reversal ou répétition : distinguer les opérations et les messages
    associés.

Ne pas fusionner automatiquement deux transactions distinctes qui
partagent un RRN. Si l'ambiguïté ne peut pas être levée, afficher les
candidats et demander un critère complémentaire, par exemple la date, le
STAN, le terminal ou le montant.

------------------------------------------------------------------------

## 9. Module E --- Moteur de corrélation transactionnelle

Le RRN constitue le critère de recherche initial, mais il ne sera pas
nécessairement présent dans tous les événements.

### Critères de corrélation complémentaires

-   DE11 : STAN ;
-   DE37 : RRN ;
-   DE41 : terminal ;
-   DE3 : code traitement ;
-   DE4 : montant ;
-   DE49 : devise ;
-   DE0 : MTI ;
-   horodatage ;
-   realm ;
-   direction ;
-   identifiants de canal ou de connexion ;
-   relation requête/réponse ;
-   autres identifiants disponibles dans le profil local.

### Niveaux d'association

Chaque événement rattaché doit porter un statut :

1.  **Correspondance directe** : RRN identique dans DE37.
2.  **Association forte** : identifiants complémentaires cohérents et
    séquence compatible.
3.  **Association probable** : plusieurs indices concordants, mais
    preuve incomplète.
4.  **Association ambiguë** : plusieurs transactions possibles.
5.  **Non associé** : aucune preuve suffisante.

Attribuer un score de confiance explicable. Le score ne doit pas être
présenté comme une probabilité statistique s'il n'a pas été calibré
comme tel.

### Règle de sécurité fonctionnelle

La proximité temporelle seule ne suffit jamais à rattacher un événement
à une transaction. Toute association indirecte doit exposer les critères
qui l'ont justifiée.

------------------------------------------------------------------------

## 10. Module F --- Reconstitution du parcours transactionnel

Construire une timeline à partir des événements associés.

### Étapes observées dans l'exemple fourni

1.  Réception sur `InternalChannel` --- `FLOW - receive`.
2.  Transmission à DISPATCH --- `FLOW - Msg From DISPATCH`.
3.  Préparation de la requête HOST --- `FLOW - Msg To Host`.
4.  Envoi externe --- `sendMessage` et `send`.
5.  Réception externe --- `receive`.
6.  Décodage de la réponse --- événement `receive` avec `isomsg`.
7.  Traitement de la réponse --- `FLOW - Msg Recu`.
8.  Conversion éventuelle du code réponse --- `FLOW - Response Code`.
9.  Retour vers DISPATCH --- `FLOW - Msg To DISPATCH`.
10. Retour vers le canal interne --- `FLOW - send`.

Cette séquence est un exemple de parcours. Les étapes réellement
attendues doivent être configurables par type de transaction et par
architecture.

### Informations à afficher pour chaque étape

-   date et heure ;
-   realm ;
-   type d'événement ;
-   direction ;
-   MTI ;
-   champs ISO disponibles ;
-   statut de parsing ;
-   durée depuis l'événement précédent ;
-   source exacte dans le fichier ;
-   niveau de confiance d'association.

### Analyses temporelles

-   Calculer les écarts entre événements.
-   Identifier les délais anormalement longs selon des seuils
    configurables.
-   Détecter les ruptures de séquence.
-   Distinguer absence d'événement et événement non journalisé.
-   Ne pas conclure à un timeout uniquement parce qu'une réponse
    n'apparaît pas dans un extrait incomplet.

------------------------------------------------------------------------

## 11. Module G --- Comparaison requête / réponse

Pour chaque paire de messages identifiée, comparer :

-   MTI ;
-   STAN ;
-   RRN ;
-   montant ;
-   code traitement ;
-   terminal ;
-   devise ;
-   identifiants acquéreur/transmetteur ;
-   code réponse ;
-   autres champs pertinents selon le profil.

Afficher les champs :

-   identiques ;
-   modifiés ;
-   absents dans la réponse ;
-   absents dans la requête ;
-   incohérents selon les règles du profil.

Les MTI associés (par exemple 0200/0210 ou 0400/0410) doivent être
configurés et validés selon le profil réellement utilisé. Ne pas
supposer qu'une paire est toujours applicable à tous les flux.

------------------------------------------------------------------------

## 12. Module H --- Détection des anomalies et incidents

Créer un moteur de règles déterministes, configurable et extensible.

### Familles d'anomalies

**Communication** - absence de réponse ; - timeout détecté dans les
traces ; - erreur de connexion ; - fermeture de canal ; - réponse
tardive ; - erreur de transport.

**Traitement** - erreur interne ; - rupture entre DISPATCH et HOST ; -
erreur de routage ; - traitement interrompu ; - réponse non transmise au
système appelant.

**ISO 8583** - MTI inattendu ; - champ obligatoire absent selon le
profil ; - incohérence requête/réponse ; - code réponse non reconnu ; -
divergence entre message décodé et message journalisé.

**Transactionnel** - doublon potentiel ; - répétition ; - reversal ; -
réponse tardive ; - incohérence de montant ; - transaction
potentiellement incomplète.

### Interprétation des codes de réponse

Ne pas considérer automatiquement un code réponse négatif comme une
panne technique. Distinguer :

-   refus métier ;
-   rejet fonctionnel ;
-   problème technique ;
-   réponse inconnue ou non interprétable.

Les tables de codes doivent être configurables par réseau et par
environnement.

### Exemple important du log fourni

``` text
<FLOW - Response Code>
  Received:151
  Send    :51
</FLOW - Response Code>
```

Le système doit enregistrer les deux valeurs, détecter la transformation
et demander la table de correspondance réelle du switch. Il ne doit pas
inventer la signification de `151` ni supposer que cette conversion est
standard.

------------------------------------------------------------------------

## 13. Module I --- Diagnostic par les agents IA existants

Après le parsing, la corrélation et la détection déterministe,
transmettre à l'agent IA un dossier transactionnel structuré.

### Contexte à transmettre

-   identifiant du fichier ;
-   RRN recherché ;
-   identifiant de transaction candidate ;
-   STAN ;
-   MTI ;
-   montant et devise, si disponibles ;
-   terminal ;
-   timestamps ;
-   événements associés ;
-   champs ISO pertinents ;
-   chronologie ;
-   comparaison requête/réponse ;
-   anomalies détectées ;
-   étapes manquantes ;
-   erreurs de parsing ;
-   scores et justifications de corrélation ;
-   extraits de logs nécessaires, après masquage des données sensibles.

### Format attendu du diagnostic

1.  Résumé de l'incident.
2.  Symptôme observé.
3.  Architecture concernée.
4.  Parcours transactionnel reconstitué.
5.  Analyse ISO 8583.
6.  Analyse chronologique.
7.  Faits confirmés.
8.  Hypothèses possibles.
9.  Cause racine probable.
10. Niveau de confiance et justification.
11. Informations manquantes.
12. Vérifications complémentaires.
13. Actions correctives proposées.
14. Actions préventives.
15. Références aux événements sources.

### Règles imposées à l'agent IA

-   Ne jamais inventer un événement ou une valeur ISO.
-   Ne jamais présenter une hypothèse comme un fait.
-   Citer les événements qui soutiennent chaque conclusion.
-   Signaler les données absentes.
-   Ne pas conclure si les éléments sont insuffisants.
-   Ne pas déclencher d'action en production.
-   Ne pas transmettre de PIN, PIN Block, clés cryptographiques ou PAN
    non masqué.
-   Réutiliser le système d'orchestration existant.

------------------------------------------------------------------------

## 14. Module J --- Interface utilisateur

Créer une interface sobre, professionnelle et adaptée à l'exploitation
bancaire.

### Écran 1 : Tableau de bord

Afficher :

-   nombre de fichiers importés ;
-   nombre de fichiers analysés ;
-   nombre de transactions identifiées ;
-   nombre d'anomalies détectées ;
-   nombre d'incidents à examiner ;
-   répartition par catégorie ;
-   évolution des incidents dans le temps.

### Écran 2 : Importation des logs

Fonctionnalités :

-   dépôt d'un ou plusieurs fichiers ;
-   progression de l'importation ;
-   état du parsing ;
-   nombre d'événements extraits ;
-   nombre d'événements malformés ;
-   état de l'indexation ;
-   accès au détail du fichier.

### Écran 3 : Recherche par RRN

Prévoir :

-   sélection du fichier ;
-   saisie du RRN ;
-   validation du format selon la configuration ;
-   bouton « Analyser » ;
-   progression de la recherche ;
-   affichage du nombre de transactions candidates.

La recherche doit être limitée au fichier sélectionné, sauf si une
recherche multi-fichiers est explicitement ajoutée.

### Écran 4 : Résultats de recherche

Pour chaque candidat :

-   RRN ;
-   STAN ;
-   MTI ;
-   montant ;
-   devise ;
-   terminal ;
-   date et heure ;
-   code réponse ;
-   nombre d'événements ;
-   statut du parcours ;
-   niveau de confiance de corrélation.

Si plusieurs transactions sont candidates, les afficher séparément.

### Écran 5 : Détail d'une transaction

Organiser l'écran en quatre zones :

**A. Informations transactionnelles**

Présentation des champs ISO et des informations générales.

**B. Timeline**

Chronologie interactive des événements, avec timestamps, realm,
direction et délais.

**C. Messages ISO 8583**

Affichage des messages entrants et sortants, avec leurs Data Elements et
comparaison requête/réponse.

**D. Diagnostic intelligent**

Résumé, faits, hypothèses, cause racine probable, vérifications et
recommandations.

Permettre d'ouvrir le contenu brut d'un événement à partir de la
timeline.

### Écran 6 : Gestion des incidents

Permettre :

-   consultation des incidents ;
-   filtres par date, gravité, type et statut ;
-   validation ou rejet d'un diagnostic ;
-   ajout d'une cause racine confirmée ;
-   saisie de la résolution réellement appliquée ;
-   capitalisation des incidents résolus.

------------------------------------------------------------------------

## 15. Modèle de données à étudier

Auditer d'abord le schéma existant et ne créer que les tables
nécessaires.

Entités fonctionnelles possibles :

### `log_files`

-   id ;
-   filename ;
-   file_hash ;
-   file_size ;
-   storage_reference ;
-   imported_by ;
-   imported_at ;
-   processing_status ;
-   parsed_event_count ;
-   parse_error_count.

### `log_events`

-   id ;
-   file_id ;
-   timestamp ;
-   timestamp_raw ;
-   realm ;
-   event_type ;
-   direction ;
-   mti ;
-   raw_content_reference ;
-   source_start ;
-   source_end ;
-   parse_status.

### `iso_messages`

-   id ;
-   event_id ;
-   parent_message_id ;
-   direction ;
-   mti ;
-   profile_id.

### `iso_fields`

-   id ;
-   iso_message_id ;
-   field_number ;
-   field_value_masked ;
-   field_value_reference ;
-   nested_message_id.

### `transactions`

-   id ;
-   file_id ;
-   rrn ;
-   stan ;
-   terminal_id ;
-   mti_initial ;
-   amount ;
-   currency ;
-   transaction_timestamp ;
-   correlation_status ;
-   correlation_score.

### `transaction_events`

-   transaction_id ;
-   event_id ;
-   association_type ;
-   association_score ;
-   association_reason.

### `detected_anomalies`

-   id ;
-   transaction_id ;
-   rule_id ;
-   category ;
-   severity ;
-   description ;
-   evidence_event_ids ;
-   status.

### `ai_diagnostics`

-   id ;
-   transaction_id ;
-   agent_id ;
-   diagnostic_content ;
-   facts ;
-   hypotheses ;
-   confidence ;
-   created_at ;
-   validation_status.

### `incident_resolutions`

-   id ;
-   transaction_id ;
-   validated_root_cause ;
-   resolution ;
-   preventive_action ;
-   validated_by ;
-   validated_at.

Ces structures sont indicatives. Les types, contraintes, index et
relations doivent être adaptés à la base de données existante.

### Index recommandés

Prévoir notamment des index adaptés aux recherches sur :

-   file_id ;
-   DE37 / RRN ;
-   DE11 / STAN ;
-   DE41 / terminal ;
-   timestamp ;
-   MTI ;
-   identifiant de transaction.

Éviter de stocker inutilement plusieurs copies du même contenu brut.
Préférer des références vers les événements sources et les valeurs
sensibles protégées.

------------------------------------------------------------------------

## 16. API indicative

Les routes suivantes illustrent les opérations attendues. Les chemins
définitifs doivent respecter les conventions du backend existant.

  ------------------------------------------------------------------------------------------------------------
  Méthode                 Route indicative                                             Fonction
  ----------------------- ------------------------------------------------------------ -----------------------
  POST                    `/api/monetique/log-analyzer/files`                          Importer un fichier

  GET                     `/api/monetique/log-analyzer/files`                          Lister les fichiers

  GET                     `/api/monetique/log-analyzer/files/{id}`                     Détail d'un fichier

  POST                    `/api/monetique/log-analyzer/files/{id}/index`               Lancer ou relancer
                                                                                       l'indexation

  POST                    `/api/monetique/log-analyzer/search`                         Rechercher par RRN

  GET                     `/api/monetique/log-analyzer/transactions/{id}`              Détail d'une
                                                                                       transaction

  GET                     `/api/monetique/log-analyzer/transactions/{id}/events`       Timeline

  POST                    `/api/monetique/log-analyzer/transactions/{id}/diagnose`     Demander un diagnostic
                                                                                       IA

  POST                    `/api/monetique/log-analyzer/transactions/{id}/validate`     Valider un diagnostic

  POST                    `/api/monetique/log-analyzer/transactions/{id}/resolution`   Enregistrer une
                                                                                       résolution
  ------------------------------------------------------------------------------------------------------------

Prévoir une gestion cohérente des erreurs HTTP, des droits d'accès, de
la pagination et des traitements asynchrones pour les gros fichiers.

------------------------------------------------------------------------

## 17. Sécurité et confidentialité

Les fichiers monétiques sont sensibles.

Mettre en place :

-   contrôle d'accès par rôle ;
-   séparation des données par établissement si l'application est
    multi-entités ;
-   chiffrement des fichiers stockés ;
-   masquage des PAN ;
-   exclusion des PIN et PIN Blocks ;
-   protection des clés cryptographiques ;
-   masquage des données personnelles ;
-   contrôle des exports ;
-   journalisation des consultations et téléchargements ;
-   politique de conservation et de suppression ;
-   limitation de la taille des fichiers ;
-   validation des fichiers importés ;
-   protection contre les injections et contenus malveillants dans les
    logs.

Ne jamais transmettre à un agent IA des données sensibles non
nécessaires au diagnostic.

Les extraits bruts présentés à l'utilisateur doivent appliquer les
règles de masquage, tout en conservant une référence sécurisée vers la
source originale pour les utilisateurs autorisés.

------------------------------------------------------------------------

## 18. Performance et indexation

Ne pas reparcourir intégralement un gros fichier à chaque recherche RRN.

### À l'importation

1.  Calculer l'empreinte du fichier.
2.  Parser les événements en flux.
3.  Extraire les messages ISO.
4.  Normaliser les événements.
5.  Construire l'index des champs.
6.  Identifier les RRN présents.
7.  Enregistrer les positions sources.
8.  Marquer l'indexation comme terminée.

### À la recherche

1.  Recevoir `file_id` et `rrn`.
2.  Interroger l'index DE37 du fichier.
3.  Charger les événements correspondants.
4.  Construire les candidats transactionnels.
5.  Effectuer les corrélations secondaires.
6.  Reconstituer les timelines.
7.  Lancer les règles d'anomalie.
8.  Retourner les résultats.

Prévoir pagination, limites de résultats, tâches asynchrones et reprise
après erreur selon les capacités du backend.

------------------------------------------------------------------------

## 19. Tests et critères de validation

Construire des jeux de tests anonymisés représentatifs de
l'environnement.

### Tests de parsing

-   plusieurs blocs `<log>` successifs ;
-   plusieurs transactions dans un même fichier ;
-   noms d'événements avec espaces ;
-   messages ISO imbriqués ;
-   champs absents ;
-   champs répétés ;
-   dumps hexadécimaux ;
-   blocs malformés ;
-   fichiers tronqués ;
-   timestamps avec millisecondes.

### Tests de recherche RRN

-   RRN présent une seule fois ;
-   RRN présent dans plusieurs événements d'une transaction ;
-   plusieurs transactions avec le même RRN ;
-   RRN absent ;
-   RRN présent dans le texte brut mais pas dans DE37 ;
-   RRN absent des événements intermédiaires ;
-   transactions entremêlées ;
-   même STAN sur plusieurs opérations.

### Tests de corrélation

-   requête et réponse cohérentes ;
-   réponse sans RRN ;
-   événements proches dans le temps mais appartenant à des transactions
    différentes ;
-   STAN réutilisé ;
-   terminal partagé ;
-   reversal ;
-   retransmission ;
-   séquence incomplète.

### Tests du diagnostic IA

-   contexte complet ;
-   contexte partiel ;
-   absence de réponse ;
-   code réponse inconnu ;
-   anomalie sans cause racine confirmée ;
-   hypothèses contradictoires ;
-   données sensibles masquées.

### Critères d'acceptation

Le module est accepté lorsque :

1.  Un fichier contenant plusieurs transactions est correctement parsé.
2.  Chaque événement conserve sa référence source.
3.  Une recherche par RRN retrouve les correspondances exactes de DE37.
4.  Les événements d'une transaction peuvent être regroupés même s'ils
    ne sont pas contigus.
5.  Les transactions ambiguës restent séparées.
6.  Les associations indirectes sont justifiées et graduées.
7.  La timeline est chronologique.
8.  Les anomalies sont fondées sur des règles explicables.
9.  Le diagnostic IA distingue faits et hypothèses.
10. Les données sensibles sont protégées.
11. Les fonctionnalités existantes du backend continuent de fonctionner.
12. Le traitement de fichiers volumineux reste maîtrisé.

------------------------------------------------------------------------

## 20. Plan de développement progressif

Ne pas implémenter toutes les fonctionnalités en une seule opération.

### Phase 1 --- Audit et conception

-   Auditer le backend.
-   Comprendre les agents existants.
-   Identifier la base et le stockage.
-   Proposer les contrats d'intégration.
-   Valider l'architecture.

**Livrable :** architecture validée et plan de modifications.

### Phase 2 --- Importation et parser

-   Importer les fichiers.
-   Découper les blocs.
-   Extraire realm, timestamp et événements.
-   Extraire les messages ISO et les champs.
-   Préserver les références sources.

**Livrable :** fichier parsé et événements normalisés.

### Phase 3 --- Analyse ISO 8583

-   Dictionnaire configurable.
-   Extraction des champs.
-   Gestion des sous-messages.
-   Décodeur hexadécimal selon profil.
-   Tests de cohérence.

**Livrable :** messages ISO structurés.

### Phase 4 --- Recherche RRN et indexation

-   Indexer DE37.
-   Créer le service de recherche par `file_id` et `rrn`.
-   Gérer plusieurs candidats.
-   Retourner les événements sources.

**Livrable :** recherche RRN opérationnelle.

### Phase 5 --- Corrélation et timeline

-   Corrélation secondaire.
-   Regroupement des événements.
-   Reconstitution chronologique.
-   Calcul des délais.
-   Gestion des ambiguïtés.

**Livrable :** parcours transactionnel reconstitué.

### Phase 6 --- Détection d'anomalies

-   Règles techniques.
-   Règles ISO.
-   Comparaison requête/réponse.
-   Détection des ruptures et incohérences.

**Livrable :** moteur déterministe d'anomalies.

### Phase 7 --- Intégration IA

-   Construire le contexte transactionnel.
-   Appeler les agents existants.
-   Générer les diagnostics.
-   Citer les preuves sources.
-   Enregistrer les résultats.

**Livrable :** diagnostic intelligent traçable.

### Phase 8 --- Interface

-   Importation.
-   Recherche RRN.
-   Résultats.
-   Timeline.
-   Messages ISO.
-   Diagnostic.
-   Historique.

**Livrable :** interface exploitable.

### Phase 9 --- Validation et optimisation

-   Tests de charge.
-   Tests de sécurité.
-   Tests sur logs anonymisés.
-   Documentation.
-   Validation métier avec les exploitants.

**Livrable :** version candidate à l'exploitation.

------------------------------------------------------------------------

## 21. Scénario de démonstration de référence

Utiliser un fichier de test contenant plusieurs transactions
entrelacées.

Exemple :

``` text
Transaction A : RRN 300013223046
Transaction B : RRN 300013223047
Transaction C : RRN 300013223048

Événement 1 : Transaction A reçue
Événement 2 : Transaction B reçue
Événement 3 : Transaction A envoyée au HOST
Événement 4 : Transaction C reçue
Événement 5 : Transaction B réponse reçue
Événement 6 : Transaction A réponse reçue
Événement 7 : Transaction C envoyée au HOST
Événement 8 : Transaction A réponse retournée au canal
```

En recherchant le RRN de la transaction A, le système doit :

-   retrouver les événements 1, 3, 6 et 8 ;
-   ne pas inclure les événements B et C comme événements directs de A ;
-   rechercher d'éventuels événements intermédiaires non porteurs de RRN
    ;
-   afficher les associations indirectes séparément ;
-   reconstituer la timeline ;
-   signaler les étapes manquantes si nécessaire ;
-   fournir les références exactes dans le fichier.

Ce scénario doit être complété par des tests où plusieurs transactions
partagent des identifiants secondaires.

------------------------------------------------------------------------

## 22. Instructions finales au développeur

Avant de coder :

1.  Lire l'intégralité du backend existant.
2.  Identifier les agents et leurs interfaces.
3.  Présenter l'architecture d'intégration.
4.  Présenter les modèles de données proposés.
5.  Présenter les contrats API.
6.  Identifier les risques techniques du format de logs.
7.  Proposer un premier POC limité à l'importation, au parsing et à la
    recherche RRN.

Ensuite, développer phase par phase et exécuter les tests à chaque
étape.

Ne pas remplacer les agents existants. Ne pas créer un backend
parallèle. Ne pas modifier les fonctionnalités existantes sans
nécessité. Ne pas inventer les règles ISO locales. Ne pas considérer une
corrélation incertaine comme une preuve. Ne pas exécuter d'action
corrective en production.

**Résultat final attendu :** un moteur d'investigation monétique capable
de retrouver une transaction par son RRN, de reconstituer son parcours à
travers les composants du switch, de détecter les anomalies et de
fournir aux exploitants un diagnostic documenté, vérifiable et
capitalisable.

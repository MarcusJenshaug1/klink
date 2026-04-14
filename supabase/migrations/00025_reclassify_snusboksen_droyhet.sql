-- Reclassify Snusboksen cards based on actual content, not seed-file origin.
-- Rules:
--   mild   = trygt for alle, ingen seksuelt/intimt/kontroversielt
--   normal = standard vorspiel: flørting, dating-apper, pinligheter, ekser
--   drøy   = sex, nakenbilder, utroskap, intim fysisk kontakt, kåte scenarier

-- ============== MILD ==============
UPDATE kort SET droyhet = 'mild' WHERE id IN (
  'b1d4e8d8-b489-4e75-b271-6c2e63e367e9', -- late som ingenting etter noe pinlig
  '2bd1c0c3-a992-4935-aaa9-ba3af04febd6', -- lese folk uten at de merker
  '4ef3004f-9fd4-4661-9cba-2f27758dca21', -- frisk ut etter lite søvn
  'baab325f-0d35-4bd8-903f-5bec8da7f3a1', -- få folk til å le når det passer dårligst
  'ad8f45b1-5354-49a0-a6e1-15158f86e9d6', -- siste ord i diskusjon
  'c6f60877-f309-4cc9-ae39-4057a93715bc', -- dårlig idé fornuftig ut
  '240fb3f3-8233-455b-8f19-7eda16d0bf78', -- mer dramatisk enn nødvendig
  '6bd4cc26-577c-4c59-95d9-18098107c5cf', -- dårlig valg god idé
  '0dfe7b53-6679-4f01-813a-5aae2a3e677f', -- nøytralt ansiktsuttrykk
  'da75b765-2c0e-49f2-953e-8c2bc80bed54', -- rolig med løgn
  '3fdf4b3b-4d4f-418c-a677-a05c434c9206', -- se travel ut
  '505c9cb2-c415-48b7-8b5c-299bbcb199f5', -- ikke prøver, prøver hardest
  '7828fff4-4c51-416c-8e53-76c47aacd9fc', -- sette ord på det ingen sier
  'bada045c-af4f-4f83-bb5b-323e7c3d1693', -- kveldens store overraskelse
  'f7a88ecb-04a6-48ed-9ee9-a73675fa68cf', -- forsvinne fra vorset
  '58327c73-2532-403a-bde6-f0cd3722f099', -- glemme hva de lovet
  'f0a44c13-21de-4bed-9bca-225364ee87a4', -- plan de ikke fortalt noen
  'ad14ee42-7a92-46f9-b37d-eb2c7e340de7', -- googlet noen i rommet
  '0a5cfb7b-0a55-4eb5-b174-86dea6304a4c', -- planlagt kvelden uten å si
  'b0057843-6f20-4d86-bb4d-0d26cbcc5518', -- snike seg inn på fest
  '76e24e8a-e01d-4d7b-b74f-d6f13e4fc555', -- inside joke ingen forstår
  '38820f24-d6ac-4f5b-96a9-a6f4c7970c84', -- innrømme trøtte
  '3768027e-6bfb-481a-81c6-aa56a3139f62', -- hjem til rett tid
  'ab4075e6-25ae-4016-854e-9b6779b270fa', -- venn med alle
  '62e64924-e192-4a69-abda-ea2e9ee603fb', -- danse uten musikk
  '701fec9f-f66f-4c0f-9ec9-2b3d02e31019', -- krangel og virke fornuftig
  '75d2786c-054c-4d57-be13-46a325350a28', -- overskride budsjett
  '0c983303-3f98-497f-aaed-b83cb4a8b141', -- «bare én til» seks ganger
  '70dfe0ea-fbe2-4e5f-a64f-e1e2dcca98c8', -- «tar det rolig» ti minutter
  '66ff1d81-c61e-46d1-b591-fd4309511f9f', -- ting de skulle holdt tilbake
  '35a06a55-849b-4ace-8abe-970239e45387', -- brukt pengene villest
  'eec9ddf9-2182-4e89-8545-2ed4c2bfe21d', -- inn på utsolgt fest
  '526e63de-450a-4a5f-bb1e-72bf8f9abfce', -- feil sted til rett tid
  '34a5316e-d6ff-4857-bb12-00398f21eb32', -- mer interessant enn de er
  '00d6ce98-c6c8-4b07-84b3-405d855518a8', -- alle på dansegulvet
  '9c71ac74-ebf8-4d2f-a283-71aed7c9b8b9', -- overbevise om noe usant
  'ceab0286-15fb-412e-a7b6-69cf45f1efaf', -- lengst uten å sjekke tlf
  '531d2100-c50c-48b6-8fba-d03442087066', -- lengst uten sosiale medier
  '062abb5c-d9a1-4647-83b8-a97c73f0e23c', -- hemmelighet under press
  '3cd384f8-4dc6-42c1-a91f-2a61b61e90c5', -- improvisere unnskyldning
  '62888935-7963-4367-b0e8-ed23652d8689', -- redde pinlig m/ vittig kommentar
  '9afb0e2b-96f5-4edc-8461-722f2e9476da', -- velge musikk for kvelden
  'afc7508d-0ae2-455b-9c43-5b57327919d1', -- farligst å sette i gang på dansegulv
  'aee4b6ca-ad2d-4b4c-8d45-a296b9835920', -- kaotisk i kollektiv
  '9aa805bc-b156-452b-a92b-b450b531fc35', -- kveldens midtpunkt
  '930fd86e-5cf8-4d3c-9b8f-48c0f2969b8e', -- dra sist fra nach
  'dfc81c7f-3c78-4398-84f8-c76398009dd6', -- skryte av i morgen
  'e9ceeffc-5605-4667-81ab-2dd2711cb73e', -- beklage for noe
  'ffe68d7f-91f0-419d-89bf-1d1ca5092ebe', -- nach for historien skyld
  'bf72bdaa-ff97-4557-990e-a1f478b64e0c', -- gratis drinker ved å smile
  'd83cb327-0647-4664-a1ce-bee72640f77e', -- overtale til noe dumt
  '2e6fb4bd-307a-4661-934e-324fb3e2842a', -- ny venn på nach
  'c290adea-47cc-4454-a6ee-fdc2f31d14c3', -- full kontroll, mister raskt
  'd70ee4a2-00ce-4e7e-a862-3b7f4b363d2d', -- kontroll, mister raskt (dup)
  '3a757a6c-bff3-483e-992f-c58ed1bffa17', -- sjekker tlf i samtale
  'a9ced71a-4fb8-4552-bb28-a126b390d0d8'  -- googlet (mild-dup, allerede mild)
);

-- ============== NORMAL ==============
UPDATE kort SET droyhet = 'normal' WHERE id IN (
  'dbe0e2cb-84f2-4c6d-a7c0-f79e25bde3f0', -- drar fra vors med noen
  '4965398f-66f3-489e-84ed-3906a2e70afb', -- helt annet sted enn planlagt
  'fcb82080-d94a-4cc6-a021-c1c858dda4a1', -- uskyldig etter noe drøyt
  'c69f7000-450d-426b-8c56-be27bcc4a5fb', -- utilgjengelig for rette person
  '19661233-7c72-4a6e-9caa-aa6531e71f11', -- her for å møte noen
  'cbe0ce42-caf4-4452-9011-1ec8724297c3', -- alle snakker om i morgen
  '4c0782fa-fd82-4dbe-9ed9-7ec4500c0c4b', -- bli forelsket i løpet av kvelden
  '4c7b2b1b-8855-4ff4-9f8b-72b8f2cebf68', -- kjent med barpersonalet
  '9c916664-2cee-4248-9634-c84c893592e3', -- flørte seg ut av pinlig
  '64183a12-3f95-4df0-bc10-52fae8555a18', -- app de ikke vil vise
  'a51f11ac-cc93-4916-a019-1dbb4b574c0e', -- dating-app åpen
  'd853577a-f917-4f19-8b9d-d45fb09d2c35', -- hemmelighet som sjokkerer
  '8ee8be8f-a7d2-4cac-8578-447399a41d8e', -- bilde på tlf ikke vist
  'c0e1d83e-f596-468e-8033-307b79f493d5', -- sjekket eksens IG
  '844ea535-e8bd-4ba4-897a-8befd9c3e6d5', -- melding de angrer på
  'f372aa99-b262-42fd-91c3-f7c9c56d2a6f', -- ja klokken 03
  'ce2d7a09-45b3-4eae-b981-3db42b0e2c17', -- eksens nye partner IG
  '938424d7-5f1c-495f-8502-e8260d4483ed', -- ikke huske hele kvelden
  'ee4d4972-26e4-4169-93c0-32d2192c9795', -- ikke si nei hvis flørter
  'b9329b78-b1f1-452f-a19b-e8d347c0f121', -- ikke samme person kveld startet
  '1fec21e8-e47b-49dc-bc96-1d9471678f2a', -- dumpe på tekstmelding
  'a45de2dd-77e7-4e2d-947c-354ea09251c6', -- flørte feil person feil tid
  '4d98435b-957c-413b-b8a8-612c1baaab7a', -- «bare venner» med eks
  '9f46d309-b064-41c4-8a8c-6c8a47bed56c', -- prøve seg på mer enn en
  'b153da40-8d58-4122-b2c7-5009407c6b53', -- ikke sjalu, mener det minst
  '2bae6317-5127-40e6-bea8-a1363b32f16a', -- «hvordan skjedde dette»
  '644ca663-6baf-4956-80f1-b46398d9b1ed', -- aktive trådsamtaler
  'f8ebfb27-2025-458e-a8c8-6a7fac47b3f0', -- flørte til gratis drinker
  '5fff92b5-9006-477c-90a2-8cd1ec6002e6', -- flørte til gratis taxi
  '504d4b06-3972-4b29-b316-e5259d8500a3', -- spontan date 5 min varsel
  '33cd0650-fead-4e4d-9990-06716f46ed9c', -- Tinder ett bilde
  '8aaf61ef-2ad1-4c20-85e3-d857cb607b95', -- rotet med feil person
  '16b41af9-8d48-491a-95f1-22b46fd3f953', -- kysse noen nettopp møtt
  'b1073220-7c83-47dd-afa6-9fd16c9e9d6e', -- tre ting på gang
  '445744a9-3ea7-4746-87bb-223875fd27fc', -- tilgang til tlf
  '4e074b92-065f-45d6-8ee4-f16e374533b3', -- skaffe telefonnummer
  '06aa1f73-bdc4-4377-893f-2f4bef2a30bb', -- vanskeligst å bli kvitt nach
  'c5cb8ab7-ef83-4fc8-9c88-5ba8f6d425b7', -- kline med
  '9ecd7d9b-7090-4f40-b98b-72c6de6ba348', -- kline på dansegulv
  '15ce6182-78be-4e81-b4f3-b13bc7a5c9b3', -- later som ikke interessert
  'f08d1854-9170-4c42-b1f5-d3f1dace3564', -- melding til eks
  'fe7965e1-c4da-4b93-9bf5-a9d015abaddb', -- møte Tinder i kveld
  'be996cb4-3650-443c-abc1-bc158534eaa8'  -- uskyldig, villeste historier
);

-- ============== DRØY ==============
UPDATE kort SET droyhet = 'droy' WHERE id IN (
  '5e8f49f2-3ba7-4c46-b8df-59974af6ea45', -- ender ikke alene i natt
  'fd8afbd1-4d10-4f93-960f-c49162348d96', -- best i sengen
  'ada66b75-1597-4dae-b92d-c5a0868155b4', -- gjengens homewrecker
  '40596d1b-e7e2-45df-a3f6-5cf87846a032', -- ikke singel, oppfører seg som
  'e98d4e29-5bad-4b2c-9be3-576d0c6e5ee1', -- med noen de ikke kjenner hjem
  '9e5f6500-5ce2-4981-973a-c40a1659b2b3', -- ha sex i kveld
  'ca41f3e3-b882-4f25-8549-ecca084ed6f1', -- fremmed hjem
  'a1511196-d30a-4d40-acc9-1b4a9ee5143d', -- ikke hjem alene i kveld
  '9f8529a4-476e-44fb-9ad9-540c957c2097', -- kysse noen de ikke burde
  'b1d18807-8de1-4d6e-93a7-56e766a13746', -- villeste sexlivet
  '30e38718-a5a2-4513-983d-bb2969becf19', -- «vi er bare venner»-sex
  '47941681-9f80-43c2-b68c-2dbd7f225a9e', -- sex med noen i rommet
  '658979ba-283b-4523-8f8e-32c73aa9b1d4', -- ligget med flest fra gjengen
  '6bf5f4b3-948a-4762-bfc9-3e20967be9a4', -- kler seg av raskest
  '2b2d43f1-d32f-45ef-b033-6513b26b5bd4', -- nakenbilde i kveld
  '93836e35-f7c8-4886-bce8-4c6a85fe91b1', -- sover med fremmed i natt
  '5134c9bc-5b4d-4372-b4a2-1172347115bf'  -- gjort det på do på bar
);

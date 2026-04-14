-- Reclassify droyhet for Jeg har aldri, Klink, Pekeleken based on actual content.
-- Same kriterier som Snusboksen:
--   mild   = trygt for alle, uskyldig humor, stemning, personlighet
--   normal = flørt/dating/ekser/pinligheter uten direkte sex
--   drøy   = sex, nakenbilder, utroskap, trekant, intim fysisk kontakt

-- ============== MILD ==============
UPDATE kort SET droyhet = 'mild' WHERE id IN (
  -- Jeg har aldri
  '07042163-8d95-4d4f-8b40-314f51b6aebe', -- delt skjermbilde
  'b9309b85-65af-4982-8ba8-17d86718ac87', -- diktet opp sykdom
  'b8b8d344-d27e-4835-8fc3-3147c6f5787a', -- gjort noe på fest
  'e9631e5f-9040-4e8e-8bd4-2cd865df53e8', -- kansellert date 5 min før
  '6ad44b43-ef20-468f-a5f8-a7acd063f9f3', -- sjalu sosiale medier
  'bc4a56b2-cd65-423b-a0ca-a0732c8e16a0', -- latt som jeg sov
  'd58e6846-51aa-40ba-8e37-30712c1bc4b1', -- melding ulest med vilje
  '586ec3e2-4614-45da-b00e-2297fe85e07c', -- eksens Netflix
  '1d2d466e-ebff-4308-88e2-125af74c2bb6', -- skjult for foreldre
  'dfd07e34-50eb-45ab-b699-8eac4f621bc7', -- «jeg er på vei»
  -- Klink
  '5f06ba73-c3df-4b2b-87d5-37e5adc6254a', -- imiterer filmkarakter
  '0e3f9a8d-8d78-4acf-b61f-c891e3b597e7', -- imiterer politiker
  '81734cb2-df5f-44bb-a625-11006eb622b9', -- imiterer kjendis
  'ae807a1c-2fba-4514-9b76-4c7ba3414d01', -- mest drita i kveld
  '7b4aaea3-2b81-48b2-9cae-3cb42d78e5f2', -- verste under begravelse
  '78f9f212-3475-4a83-881e-73eb4fe22265'  -- unnskyldninger sent på jobb
);

-- ============== DRØY ==============
UPDATE kort SET droyhet = 'droy' WHERE id IN (
  -- Jeg har aldri (sex/intim/utroskap)
  '57b35f66-045b-43ca-a346-5aa3bd903ef5', -- betalt for noe seksuelt
  'f53b31cf-64b1-4b40-9225-ad9fb62555a8', -- oralsex offentlig
  '08c13fef-81df-4dc4-bd04-94d0419bc967', -- filmet sex
  'bf5c442c-9189-4919-adf6-adeca1185121', -- flørtet søsken av eks
  '2cc366ee-d5b3-4f0b-8b09-541a8a6232e5', -- one night stand vennegjeng
  'b1f3b18e-cc9a-4b5b-864a-ed2d4629993e', -- sex med eksen etter
  '50f0971b-c097-42e7-981d-a7ba038d54e2', -- sex med kollega/sjef
  'beba4130-c624-4d9d-bb2d-3ec07193c66c', -- sex med noen i rommet
  '59a1e2d1-66fe-4ed3-be20-e28bd57b8adb', -- sex med noen ikke likte
  '3e934d13-08ad-4fc7-9a97-588f2560ed76', -- sex samme kveld møtt
  'c9372666-ad4b-4244-a60f-0508aaf627b7', -- sex to fra vennekrets
  'f1c7b7a8-eac2-4f14-b0e1-0c9e0b085166', -- sex mens andre i rommet
  '0eecbfdb-5f60-4b75-aa5a-18e0857e282e', -- sex offentlig plass
  '964af202-fa41-4644-9aed-18963dcbebd1', -- trekant
  'e37ee524-71e3-47fa-b001-86410879ce4d', -- to personer som kjenner hverandre
  '09e6fc71-1b04-4646-bcea-72afd754c46a', -- kysset med kjæreste (utroskap)
  '7ff2db10-ef02-4e31-a264-f74c22001570', -- latt noen se på sex
  '4cdd33fe-38d0-4d8b-bbe1-efe3b735840a', -- ligget for å se gnist
  '1beb3a65-6468-4742-b471-4fb6b895dda2', -- løyet om å ha kommet
  '07497eee-1441-40ac-a4c9-48ea588b01f3', -- sendt nakenbilde
  'a7e8256c-8044-44b5-a557-176900141859', -- nakenbilde feil person
  'ce35564b-ee5a-4e1f-82c0-4969f84faafd', -- våknet hos fremmed
  -- Klink
  '62cabe00-0d1f-44e7-b93b-88e27446a8d5', -- best som stripper
  '8bd8311a-40a2-4167-abf2-3264dab4a573', -- ting man aldri burde si under sex
  -- Pekeleken
  '89039981-32c3-4293-86ad-6b89586cf8d6', -- sendt nakenbilder i rommet
  'a3acf9f8-da94-4b4f-8106-b0984ee7fac4', -- tenkt seksuelt
  'e754ae06-b908-49eb-95d1-7a40690ec5b6', -- helst hatt sex med
  '48999800-505a-4f86-b810-c6378d78a94c', -- hatt trekant
  '8f51c535-c9a2-4765-a5ec-4592424bdae2', -- skitneste fantasien
  '0efcf53b-8560-47d6-ae12-4b49896e93fb', -- villest i sengen
  '0f1597e8-b4c0-46f6-9975-060ca812334b', -- sex med en her inne
  '562df219-2189-4806-9386-cff194d43096'  -- to stykker hjem
);

-- Resten forblir 'normal' (default fra backfill).
-- Dette inkluderer bl.a. flørt-relaterte ekser/messaging-kort i Jeg har aldri,
-- Hot Seat-utfordringer i Klink, og "kysset"/"flest på samvittigheten" i Pekeleken.

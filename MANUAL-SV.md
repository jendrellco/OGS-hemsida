# Uppdatera OGS-hemsidan manuellt

Du behöver normalt bara redigera filen `content/schedule.json` på GitHub. Webbplatsen avgör automatiskt om den ska visa nästa sändning, `Live now` eller att eventet är avslutat.

Schemat fungerar för både endagsevent och flerdagsevent. Lägg bara in de programpunkter som faktiskt finns. Rubriker och layout ändras inte beroende på antalet dagar.

## Ändra ett event

1. Öppna repot `jendrellco/OGS-hemsida` på GitHub.
2. Öppna mappen `content` och filen `schedule.json`.
3. Klicka på pennsymbolen, `Edit this file`.
4. Ändra de värden som behövs.
5. Klicka på `Commit changes`.
6. Publicera ändringen enligt instruktionen längst ned i denna manual. Automatisk publicering från GitHub är ännu inte inkopplad.

## Vad fälten betyder

- `id` - unikt internt namn. Använd små bokstäver och bindestreck.
- `title` - sportens eller tävlingens namn.
- `subtitle` - lopp, dag eller disciplin.
- `start` - starttid med datum och svensk tidszon.
- `end` - tiden då live-läget ska avslutas.

Alla sändningar visas på `openglobalsports.com/live`. BoxCast-spelaren är kopplad centralt, så du behöver inte lägga in någon separat videolänk för varje event.

Exempel på svensk sommartid:

```json
"start": "2026-08-28T14:00:00+02:00"
```

Exempel på svensk normaltid:

```json
"start": "2026-11-28T14:00:00+01:00"
```

## Lägga till ett event

Kopiera ett helt eventblock, lägg ett kommatecken efter föregående block och ändra innehållet:

```json
{
  "id": "eventets-unika-namn",
  "title": "Event title",
  "subtitle": "Race or discipline",
  "start": "2026-09-12T14:00:00+02:00",
  "end": "2026-09-12T17:00:00+02:00"
}
```

## Manuell status

Behåll normalt `"statusOverride": "auto"`.

Vid försening eller tekniska problem kan du tillfälligt använda:

- `live` - tvingar fram `Live now` för eventet i `featuredEventId`.
- `upcoming` - tvingar fram nästa sändning.
- `offline` - visar on demand-läget.

Ändra tillbaka till `auto` när situationen är löst.

## Viktigt

- Använd raka dubbla citationstecken.
- Ta inte bort kommatecken mellan eventblock.
- All publik text ska vara på engelska.
- Kontrollera alltid att `start` och `end` är sändningens tider, inte tävlingens officiella start- och sluttider.

## Publicera manuellt

Efter att ändringen har sparats på GitHub öppnar du Terminal på datorn och ansluter till servern:

```sh
ssh root@204.168.214.234
```

Kör sedan följande på servern:

```sh
cd /var/www/ogs-hemsida
git pull --ff-only origin main
docker compose up -d --build
```

Kontrollera att webbplatsen kör:

```sh
docker compose ps
```

Raden för `ogs-hemsida-web-1` ska visa `Up`. Öppna därefter:

- `https://openglobalsports.com`
- `https://openglobalsports.com/live`

När bara `schedule.json` har ändrats behövs inga andra steg. Nedräkningen och nästa lopp uppdateras automatiskt från tiderna, och BoxCast-spelaren behöver inte ändras.

Ladda om en redan öppen webbläsarflik efter publiceringen. Besökare som öppnar eller laddar om sidan får automatiskt den senaste versionen.

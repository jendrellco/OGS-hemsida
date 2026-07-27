# Uppdatera OGS-hemsidan manuellt

Du behöver normalt bara redigera filen `content/schedule.json` på GitHub. Webbplatsen avgör automatiskt om den ska visa nästa sändning, `Live now` eller on demand.

Schemat fungerar för både endagsevent och flerdagsevent. Lägg bara in de programpunkter som faktiskt finns. Rubriker och layout ändras inte beroende på antalet dagar.

## Ändra ett event

1. Öppna repot `jendrellco/OGS-hemsida` på GitHub.
2. Öppna mappen `content` och filen `schedule.json`.
3. Klicka på pennsymbolen, `Edit this file`.
4. Ändra de värden som behövs.
5. Klicka på `Commit changes`.
6. Publiceringen startar automatiskt när den är konfigurerad.

## Vad fälten betyder

- `id` - unikt internt namn. Använd små bokstäver och bindestreck.
- `title` - sportens eller tävlingens namn.
- `subtitle` - lopp, dag eller disciplin.
- `start` - starttid med datum och svensk tidszon.
- `end` - tiden då live-läget ska avslutas.
- `youtubeUrl` - den fullständiga länken till den schemalagda YouTube-sändningen.
- `channelUrl` - OGS-kanalens permanenta YouTube-länk. Den används när en specifik sändningslänk saknas.

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
  "end": "2026-09-12T17:00:00+02:00",
  "youtubeUrl": "https://www.youtube.com/watch?v=..."
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
- Lägg alltid YouTube-länken direkt till den schemalagda sändningen, inte bara till kanalsidan.

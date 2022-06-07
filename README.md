# sif-common-forms

Fellesdialoger/skjema for sykdom i familien

# Start lokalt

1. `npm i`.
2. `npm run dev`.

# Release beta versjon til npmjs

1. `Endringer...`.
2. `Commit`.
3. `npm version 1.0.0-beta.0`.
4. `npm run build-lib`.
5. `npm publish --tag beta`. -
6. `"Det trenges å ha tilgang til npmjs navikt og bruke two-faktor auth. For å generere engangskode det kan brukes feks. Google Authenticator)"`.

# Release ny versjon til npmjs

krav: git working directory må være clean. Kode som er endret må være commitet og ligge på master på github.

1. `Endringer...`.
2. `Commit`.
3. `npm version 1.0.1`.
4. `npm run build-lib`.
5. `npm publish`.
6. `"Det trenges å ha tilgang til npmjs navikt og bruke two-faktor auth. For å generere engangskode det kan brukes feks. Google Authenticator)"`.

```
Versjonering:

- npm version patch -m "Upgrade to %s"
- npm version minor -m "Upgrade to %s"
- npm version major -m "Upgrade to %s"

eller:
- npm version 1.0.1

```

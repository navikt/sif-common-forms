import defaultValidationMessages from '../i18n/defaultMessages';

const virksomhetMessages = {
    nb: {
        'sifForms.virksomhet.næringstype_FISKE': 'Fisker',
        'sifForms.virksomhet.næringstype_JORDBRUK_SKOGBRUK': 'Jordbruker',
        'sifForms.virksomhet.næringstype_DAGMAMMA': 'Dagmamma eller familiebarnehage i eget hjem',
        'sifForms.virksomhet.næringstype_ANNEN': 'Annet',
        'sifForms.virksomhet.form_title': 'Opplysninger om virksomheten din',
        'sifForms.virksomhet.form_title.flere': 'Opplysninger om den eldste virksomheten din',
        'sifForms.virksomhet.hvilken_type_virksomhet': 'Hvilken type virksomhet har du?',
        'sifForms.virksomhet.hvilken_type_virksomhet.flere': 'Hvilken type virksomhet er den eldste virksomheten din?',
        'sifForms.virksomhet.hva_heter_virksomheten': 'Hva heter virksomheten?',
        'sifForms.virksomhet.fisker_blad_b': 'Er du fisker på blad B?',
        'sifForms.virksomhet.veileder_fisker.tittel': `Hvis du ikke har organiasjonsnummer`,
        'sifForms.virksomhet.veileder_fisker': `Hvis du ikke har organisasjonsnummer, svarer du nei på spørsmålet "Er {navnPåVirksomheten} registrert i Norge?" I nedtrekkslisten velger du at virksomheten er registrert i Norge.`,
        'sifForms.virksomhet.registert_i_norge': `Er {navnPåVirksomheten} registert i Norge?`,
        'sifForms.virksomhet.registert_i_hvilket_land': `I hvilket land er {navnPåVirksomheten} din registrert i?`,
        'sifForms.virksomhet.organisasjonsnummer': 'Hva er organisasjonsnummeret?',
        'sifForms.virksomhet.startdato': `Når startet du {navnPåVirksomheten}?`,
        'sifForms.virksomhet.kalender_fom': 'Startdato',
        'sifForms.virksomhet.kalender_tom': 'Eventuell sluttdato',
        'sifForms.virksomhet.kalender_pågående': 'Er pågående',
        'sifForms.virksomhet.nyoppstartet.næringsinntektFlere.header': 'Næringsresultat for alle virksomhetene dine',
        'sifForms.virksomhet.nyoppstartet.næringsinntektFlere.info':
            'Du har opplyst at du har flere næringsvirksomheter. Her skal du legge inn næringsresultatet totalt for alle virksomhetene du har.',
        'sifForms.virksomhet.næringsinntektFlere.header': 'Næringsvirksomhetene dine',
        'sifForms.virksomhet.næringsinntektFlere.info':
            'Du har opplyst at du har flere næringsvirksomheter som selvstendig næringsdrivende. Nå skal du svare på spørsmål som gjelder alle virksomhetene dine.',
        'sifForms.virksomhet.næringsinntekt':
            'Hva har du hatt totalt i næringsresultat før skatt de siste 12 månedene?',
        'sifForms.virksomhet.næringsinntekt.info':
            'Hvis virksomhetene har vart i kortere tid enn 12 måneder, kan du bruke denne perioden og regne om til årsinntekt. Oppgi beløpet i hele kroner.',
        'sifForms.virksomhet.næringsinntekt_info':
            'Næringsresultatet er inntekter du har i næringen din, minus utgifter og avskrivninger.',
        'sifForms.virksomhet.næringsinntekt_info_title': 'Hva er næringsresultatet?',
        'sifForms.virksomhet.har_blitt_yrkesaktiv':
            'Har du begynt i arbeidslivet i løpet av de 3 siste ferdigliknede årene?',
        'sifForms.virksomhet.har_blitt_yrkesaktiv_info_title': 'Hva betyr dette?',
        'sifForms.virksomhet.har_blitt_yrkesaktiv_info':
            'Du skal svare ja på spørsmålet hvis du før oppstart av næringsvirksomheten din hadde lav eller ingen inntekt.',
        'sifForms.virksomhet.har_blitt_yrkesaktiv_dato': 'Oppgi dato for når du begynte i arbeidslivet',
        'sifForms.virksomhet.varig_endring_spm':
            'Har du hatt en varig endring i noen av arbeidsforholdene, virksomhetene eller arbeidssituasjonen din de siste fire årene?',
        'sifForms.virksomhet.varig_endring_dato': 'Oppgi dato for endringen',
        'sifForms.virksomhet.varig_endring_inntekt':
            'Oppgi næringsinntekten din etter endringen. Oppgi årsinntekten i hele kroner.',
        'sifForms.virksomhet.varig_endring_tekst':
            'Her kan du skrive kort hva som har endret seg i arbeidsforholdene, virksomhetene eller arbeidssituasjonen din',
        'sifForms.virksomhet.regnskapsfører_spm': 'Har du regnskapsfører?',
        'sifForms.virksomhet.regnskapsfører_navn': 'Oppgi navnet til regnskapsfører',
        'sifForms.virksomhet.regnskapsfører_telefon': 'Oppgi telefonnummeret til regnskapsfører',
        'sifForms.virksomhet.veileder_innhenter_info.1':
            'Vi henter inn opplysninger om virksomheten og inntekten din fra offentlige registre.',
        'sifForms.virksomhet.veileder_innhenter_info.2': 'Vi tar kontakt med deg hvis vi trenger flere opplysninger.',

        'sifForms.virksomhet.summary.tittel': 'Næringsvirksomhet som du har lagt inn:',
        'sifForms.virksomhet.summary.navn': 'Navn',
        'sifForms.virksomhet.summary.næringstype': 'Næringstype',
        'sifForms.virksomhet.summary.varigEndring.dato': 'Dato for varig endring',
        'sifForms.virksomhet.summary.varigEndring.næringsinntekt': 'Næringsinntekt etter endring',
        'sifForms.virksomhet.summary.varigEndring.beskrivelse': 'Beskrivelse av endring',
        'sifForms.virksomhet.summary.ikkeRegnskapsfører': 'Har ikke regnskapsfører.',
        'sifForms.virksomhet.summary.tidsinfo.avsluttet': 'Startet {fraOgMed}, avsluttet {tilOgMed}.',
        'sifForms.virksomhet.summary.tidsinfo.pågående': 'Startet {fraOgMed} (pågående).',
        'sifForms.virksomhet.summary.fisker.påBladB': 'på Blad B',
        'sifForms.virksomhet.summary.fisker.ikkePåBladB': 'ikke på Blad B',
        'sifForms.virksomhet.summary.registrertILand': 'Registrert i {land}',
        'sifForms.virksomhet.summary.registrertILand.orgnr': ' (organisasjonsnummer {orgnr})',
        'sifForms.virksomhet.summary.yrkesaktiv.jaStartetDato': 'Ja, ble yrkesaktiv {dato}',
        'sifForms.virksomhet.summary.næringsinntekst': 'Næringsinntekt:',
        'sifForms.virksomhet.summary.regnskapsfører.header': 'Regnskapsfører',
        'sifForms.virksomhet.summary.regnskapsfører.info': 'Ja, {navn}, telefon {telefon}',

        'virksomhetForm.næringstyper.listIsEmpty': 'Du må velge hvilken type virksomhet du har',
        'virksomhetForm.fiskerErPåBladB.yesOrNoIsUnanswered': defaultValidationMessages.nb.yesOrNoIsUnanswered,
        'virksomhetForm.navnPåVirksomheten.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.registrertINorge.yesOrNoIsUnanswered': defaultValidationMessages.nb.yesOrNoIsUnanswered,
        'virksomhetForm.registrertILand.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.organisasjonsnummer.invalidOrgNumberFormat': 'Organisasjonsnummeret har ugyldig format',
        'virksomhetForm.fom.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.fom.dateAfterMax': defaultValidationMessages.nb.dateAfterMax,
        'virksomhetForm.fom.invalidDateFormat': defaultValidationMessages.nb.invalidDateFormat,
        'virksomhetForm.fom.fromDateIsAfterToDate': defaultValidationMessages.nb.fromDateIsAfterToDate,
        'virksomhetForm.tom.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.tom.dateBeforeMin': defaultValidationMessages.nb.dateBeforeMin,
        'virksomhetForm.tom.dateAfterMax': defaultValidationMessages.nb.dateAfterMax,
        'virksomhetForm.tom.invalidDateFormat': defaultValidationMessages.nb.invalidDateFormat,
        'virksomhetForm.tom.toDateIsBeforeFromDate': defaultValidationMessages.nb.toDateIsBeforeFromDate,
        'virksomhetForm.næringsinntekt.invalidNumberFormat': defaultValidationMessages.nb.invalidNumberFormat,
        'virksomhetForm.næringsinntekt.numberIsTooSmall': defaultValidationMessages.nb.numberIsTooSmall,
        'virksomhetForm.næringsinntekt.numberIsTooLarge': defaultValidationMessages.nb.numberIsTooLarge,
        'virksomhetForm.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene.yesOrNoIsUnanswered':
            defaultValidationMessages.nb.yesOrNoIsUnanswered,
        'virksomhetForm.blittYrkesaktivDato.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.blittYrkesaktivDato.invalidDateFormat': defaultValidationMessages.nb.invalidDateFormat,
        'virksomhetForm.blittYrkesaktivDato.dateAfterMax': defaultValidationMessages.nb.dateAfterMax,
        'virksomhetForm.blittYrkesaktivDato.dateBeforeMin': defaultValidationMessages.nb.dateBeforeMin,
        'virksomhetForm.hattVarigEndringAvNæringsinntektSiste4Kalenderår.yesOrNoIsUnanswered':
            defaultValidationMessages.nb.yesOrNoIsUnanswered,
        'virksomhetForm.varigEndringINæringsinntekt_dato.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.varigEndringINæringsinntekt_dato.invalidDateFormat':
            defaultValidationMessages.nb.invalidDateFormat,
        'virksomhetForm.varigEndringINæringsinntekt_dato.dateAfterMax': defaultValidationMessages.nb.dateAfterMax,
        'virksomhetForm.varigEndringINæringsinntekt_dato.dateBeforeMin': defaultValidationMessages.nb.dateBeforeMin,
        'virksomhetForm.varigEndringINæringsinntekt_inntektEtterEndring.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.varigEndringINæringsinntekt_inntektEtterEndring.invalidNumberFormat':
            defaultValidationMessages.nb.invalidNumberFormat,
        'virksomhetForm.varigEndringINæringsinntekt_inntektEtterEndring.numberIsTooLarge':
            defaultValidationMessages.nb.numberIsTooLarge,
        'virksomhetForm.varigEndringINæringsinntekt_inntektEtterEndring.numberIsTooSmall':
            defaultValidationMessages.nb.numberIsTooSmall,
        'virksomhetForm.varigEndringINæringsinntekt_forklaring.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.varigEndringINæringsinntekt_forklaring.stringIsTooLong':
            defaultValidationMessages.nb.stringIsTooLong,
        'virksomhetForm.varigEndringINæringsinntekt_forklaring.stringIsTooShort':
            defaultValidationMessages.nb.stringIsTooShort,

        'virksomhetForm.harRegnskapsfører.yesOrNoIsUnanswered': defaultValidationMessages.nb.yesOrNoIsUnanswered,
        'virksomhetForm.regnskapsfører_navn.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.regnskapsfører_navn.stringIsTooLong': defaultValidationMessages.nb.stringIsTooLong,
        'virksomhetForm.regnskapsfører_navn.stringIsTooShort': defaultValidationMessages.nb.stringIsTooShort,
        'virksomhetForm.regnskapsfører_telefon.noValue': defaultValidationMessages.nb.noValue,
        'virksomhetForm.regnskapsfører_telefon.stringIsTooLong': defaultValidationMessages.nb.stringIsTooLong,
        'virksomhetForm.regnskapsfører_telefon.stringIsTooShort': defaultValidationMessages.nb.stringIsTooShort,
    },
    nn: {
        'sifForms.virksomhet.næringstype_FISKE': 'Fisker',
        'sifForms.virksomhet.næringstype_JORDBRUK_SKOGBRUK': 'Jordbrukar',
        'sifForms.virksomhet.næringstype_DAGMAMMA': 'Dagmamma eller familiebarnehage i eigen heim',
        'sifForms.virksomhet.næringstype_ANNEN': 'Anna',
        'sifForms.virksomhet.form_title': 'Opplysningar om verksemda di',
        'sifForms.virksomhet.form_title.flere': 'Opplysningar om den eldste verksemda di',
        'sifForms.virksomhet.hvilken_type_virksomhet': 'Kva type verksemd har du?',
        'sifForms.virksomhet.hvilken_type_virksomhet.flere': 'Kva type er den eldste verksemda di?',
        'sifForms.virksomhet.hva_heter_virksomheten': 'Kva heiter verksemda?',
        'sifForms.virksomhet.fisker_blad_b': 'Er du fiskar på blad B?',
        'sifForms.virksomhet.veileder_fisker.tittel': `Dersom du ikkje har organiasjonsnummer`,
        'sifForms.virksomhet.veileder_fisker': `Dersom du ikkje har organisasjonsnummer, svarer du nei på spørsmålet "Er {navnPåVirksomheten} registrert i Noreg?". I nedtrekkslista vel du at verksemda er registrert i Noreg.`,
        'sifForms.virksomhet.registert_i_norge': `Er {navnPåVirksomheten} registert i Noreg?`,
        'sifForms.virksomhet.registert_i_hvilket_land': `I kva land er {navnPåVirksomheten} registrert?`,
        'sifForms.virksomhet.organisasjonsnummer': 'Kva er organisasjonsnummeret?',
        'sifForms.virksomhet.startdato': `Når starta du {navnPåVirksomheten}?`,
        'sifForms.virksomhet.kalender_fom': 'Startdato',
        'sifForms.virksomhet.kalender_tom': 'Eventuell sluttdato',
        'sifForms.virksomhet.kalender_pågående': 'Er i gang',
        'sifForms.virksomhet.nyoppstartet.næringsinntektFlere.header': 'Næringsresultat for alle verksemdene dine',
        'sifForms.virksomhet.nyoppstartet.næringsinntektFlere.info':
            'Du har opplyst at du har fleire næringsverksemder. Her skal du leggje inn næringsresultatet totalt for alle verksemdene du har.',
        'sifForms.virksomhet.næringsinntektFlere.header': 'Næringsverksemdene dine',
        'sifForms.virksomhet.næringsinntektFlere.info':
            'Du har opplyst at du har fleire næringsverksemder som sjølvstendig næringsdrivande. Nå skal du svare på spørsmål som gjeld alle verksemdene dine.',
        'sifForms.virksomhet.næringsinntekt':
            'Kva har du hatt i næringsresultat før skatt dei siste 12 månadene? Dersom verksemda har vart i kortare tid, kan du bruke denne perioden og rekne om til årsinntekt. Gi opp beløpet i heile kroner.',
        'sifForms.virksomhet.næringsinntekt.info':
            'Dresom verksemdene har vart i kortare tid enn 12 månader, kan du bruke denne perioden og rekne om til årsinntekt. Gi opp beløpet i heile kroner.',
        'sifForms.virksomhet.næringsinntekt_info':
            'Næringsresultatet er inntekter du har i næringa di, minus utgifter og avskrivingar.',
        'sifForms.virksomhet.næringsinntekt_info_title': 'Kva er næringsresultatet?',
        'sifForms.virksomhet.har_blitt_yrkesaktiv':
            'Har du begynt i arbeidslivet i løpet av dei 3 siste ferdiglikna åra?',
        'sifForms.virksomhet.har_blitt_yrkesaktiv_info_title': 'Kva betyr dette?',
        'sifForms.virksomhet.har_blitt_yrkesaktiv_info':
            'Du skal svare ja på spørsmålet dersom du før oppstart av næringsverksemda di hadde låg eller inga inntekt.',
        'sifForms.virksomhet.har_blitt_yrkesaktiv_dato': 'Gi opp datoen for når du begynte i arbeidslivet',
        'sifForms.virksomhet.varig_endring_spm':
            'Har du hatt ei varig endring i nokre av arbeidsforholda, verksemdene eller arbeidssituasjonen din dei siste fire åra?',
        'sifForms.virksomhet.varig_endring_dato': 'Gi opp datoen for endringa',
        'sifForms.virksomhet.varig_endring_inntekt':
            'Gi opp næringsinntekta di etter endringa. Gi opp årsinntekta i heile kroner.',
        'sifForms.virksomhet.varig_endring_tekst':
            'Her kan du skrive kort kva som har endra seg i arbeidsforholda, verksemdene eller arbeidssituasjonen din',
        'sifForms.virksomhet.regnskapsfører_spm': 'Har du rekneskapsførar?',
        'sifForms.virksomhet.regnskapsfører_navn': 'Gi opp namnet til rekneskapsføraren',
        'sifForms.virksomhet.regnskapsfører_telefon': 'Gi opp telefonnummeret til rekneskapsføraren',
        'sifForms.virksomhet.veileder_innhenter_info.1':
            'Vi hentar inn opplysningar om verksemda og inntekta di frå offentlege register.',
        'sifForms.virksomhet.veileder_innhenter_info.2': 'Vi tek kontakt med deg dersom vi treng fleire opplysningar',

        'sifForms.virksomhet.summary.tittel': 'Næringsvirksomhet som du har lagt inn:',
        'sifForms.virksomhet.summary.navn': 'Namn',
        'sifForms.virksomhet.summary.næringstype': 'Næringstype',
        'sifForms.virksomhet.summary.varigEndring.dato': 'Dato for varig endring',
        'sifForms.virksomhet.summary.varigEndring.næringsinntekt': 'Næringsinntekt etter endring',
        'sifForms.virksomhet.summary.varigEndring.beskrivelse': 'Skildring av endring',
        'sifForms.virksomhet.summary.ikkeRegnskapsfører': 'Har ikkje regnskapsførar.',
        'sifForms.virksomhet.summary.tidsinfo.avsluttet': 'Startet {fraOgMed}, avsluttet {tilOgMed}.',
        'sifForms.virksomhet.summary.tidsinfo.pågående': 'Startet {fraOgMed} (pågåande).',
        'sifForms.virksomhet.summary.fisker.påBladB': 'på Blad B',
        'sifForms.virksomhet.summary.fisker.ikkePåBladB': 'ikkje på Blad B',
        'sifForms.virksomhet.summary.registrertILand': 'Registrert i {land}',
        'sifForms.virksomhet.summary.registrertILand.orgnr': ' (organisasjonsnummer {orgnr})',
        'sifForms.virksomhet.summary.næringsinntekst': 'Næringsinntekt:',
        'sifForms.virksomhet.summary.yrkesaktiv.jaStartetDato': 'Ja, vart yrkesaktiv {dato}',
        'sifForms.virksomhet.summary.regnskapsfører.header': 'Regnskapsførar',
        'sifForms.virksomhet.summary.regnskapsfører.info': 'Ja, {navn}, telefon {telefon}',
    },
};
export default virksomhetMessages;

import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { YesOrNo } from '@navikt/sif-common-formik/lib';
import { Virksomhet, VirksomhetApiData } from './types';
import { harFiskerNæringstype } from './virksomhetUtils';

export const mapVirksomhetToVirksomhetApiData = (virksomhet: Virksomhet): VirksomhetApiData => {
    const registrertINorge = virksomhet.registrertINorge === YesOrNo.YES;
    const harRegnskapsfører = virksomhet.harRegnskapsfører === YesOrNo.YES;

    const data: VirksomhetApiData = {
        naringstype: [...virksomhet.næringstyper],
        navn_pa_virksomheten: virksomhet.navnPåVirksomheten,
        registrert_i_norge: registrertINorge,
        ...(registrertINorge
            ? {
                  organisasjonsnummer: virksomhet.organisasjonsnummer
              }
            : {
                  registrert_i_land: virksomhet.registrertILand
              }),
        fra_og_med: formatDateToApiFormat(virksomhet.fom),
        til_og_med:
            virksomhet.erPågående || virksomhet.tom === undefined ? null : formatDateToApiFormat(virksomhet.tom),
        er_pagaende: virksomhet.erPågående,
        naringsinntekt: virksomhet.næringsinntekt,
        har_regnskapsforer: harRegnskapsfører
    };

    if (virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår) {
        const harHatt = virksomhet.hattVarigEndringAvNæringsinntektSiste4Kalenderår === YesOrNo.YES;
        data.har_varig_endring_av_inntekt_siste_4_kalenderar = harHatt;
        const {
            varigEndringINæringsinntekt_dato,
            varigEndringINæringsinntekt_forklaring,
            varigEndringINæringsinntekt_inntektEtterEndring
        } = virksomhet;
        if (
            harHatt &&
            varigEndringINæringsinntekt_dato &&
            varigEndringINæringsinntekt_inntektEtterEndring !== undefined &&
            varigEndringINæringsinntekt_forklaring
        ) {
            data.varig_endring = {
                dato: formatDateToApiFormat(varigEndringINæringsinntekt_dato),
                forklaring: varigEndringINæringsinntekt_forklaring,
                inntekt_etter_endring: varigEndringINæringsinntekt_inntektEtterEndring
            };
        }
    }

    if (harFiskerNæringstype(virksomhet.næringstyper) && virksomhet.fiskerErPåPlanB) {
        data.fiskerErPåPlanB = virksomhet.fiskerErPåPlanB === YesOrNo.YES;
    }

    if (virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene) {
        const harBlittAktiv = virksomhet.harBlittYrkesaktivILøpetAvDeTreSisteFerdigliknedeÅrene === YesOrNo.YES;
        data.har_blitt_yrkesaktiv_siste_tre_ferdigliknede_arene = harBlittAktiv;
        if (harBlittAktiv && virksomhet.oppstartsdato) {
            data.yrkesaktiv_siste_tre_ferdigliknede_arene = {
                oppstartsdato: formatDateToApiFormat(virksomhet.oppstartsdato)
            };
        }
    }

    if (harRegnskapsfører) {
        data.regnskapsforer = {
            navn: virksomhet.regnskapsfører_navn!,
            telefon: virksomhet.regnskapsfører_telefon!
        };
    }

    if (!harRegnskapsfører) {
        data.har_revisor = virksomhet.harRevisor === YesOrNo.YES;
        if (virksomhet.harRevisor === YesOrNo.YES) {
            data.revisor = {
                navn: virksomhet.revisor_navn!,
                telefon: virksomhet.revisor_telefon!,
                kan_innhente_opplysninger: virksomhet.kanInnhenteOpplsyningerFraRevisor === YesOrNo.YES
            };
        }
    }

    return data;
};

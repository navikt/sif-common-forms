/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { formatDateToApiFormat } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { jsonSort } from '@navikt/sif-common-core/lib/utils/jsonSort';
import { dateToISOString, YesOrNo } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';

import { mapVirksomhetToVirksomhetApiData } from '../mapVirksomhetToApiData';
import { Næringstype, Virksomhet, VirksomhetApiData } from '../types';
import { erVirksomhetRegnetSomNyoppstartet } from '../virksomhetUtils';

const fom = new Date();
const tom = new Date();

const virksomhetFormData: Virksomhet = {
    næringstyper: [Næringstype.ANNEN],
    navnPåVirksomheten: 'ABC',
    fom,
    erPågående: true,
    tom,
    registrertINorge: YesOrNo.YES,
    registrertILand: '',
    organisasjonsnummer: '123123123',
    næringsinntekt: 123,
    harRegnskapsfører: YesOrNo.YES,
    regnskapsfører_navn: 'RegnskapsførerHenrik',
    regnskapsfører_telefon: '234',
};

export const revisorInfo = {
    revisor_navn: 'RevisorHenrik',
    revisor_telefon: '2341',
    kanInnhenteOpplsyningerFraRevisor: YesOrNo.YES,
};

const virksomhetApiData: VirksomhetApiData = {
    næringstyper: [Næringstype.ANNEN],
    navnPåVirksomheten: 'ABC',
    fraOgMed: formatDateToApiFormat(fom),
    tilOgMed: null,
    næringsinntekt: 123,
    registrertINorge: true,
    regnskapsfører: {
        navn: 'RegnskapsførerHenrik',
        telefon: '234',
    },
    organisasjonsnummer: '123123123',
    erNyoppstartet: true,
};

describe('erVirksomhetRegnetSomNyoppstartet', () => {
    it('True when less than four years ago', () => {
        const validDate = dayjs().subtract(4, 'years').add(1, 'day').toDate();
        expect(erVirksomhetRegnetSomNyoppstartet(validDate)).toBeTruthy();
    });
    it('False when more than four yearsago', () => {
        const invalidDate = dayjs().subtract(4, 'years').toDate();
        expect(erVirksomhetRegnetSomNyoppstartet(invalidDate)).toBeFalsy();
    });
});

describe('mapVirksomhetToApiData', () => {
    it('should verify standard required fields to be mapped', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData('nb', virksomhetFormData as Virksomhet);
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(virksomhetApiData)));
    });

    it('should not include revisor if user has regnskapsfører', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData('nb', {
            ...virksomhetFormData,
            harRegnskapsfører: YesOrNo.NO,
            harRevisor: YesOrNo.YES,
            ...revisorInfo,
        });
        const apiData: VirksomhetApiData = {
            ...virksomhetApiData,
            regnskapsfører: undefined,
            revisor: {
                navn: revisorInfo.revisor_navn,
                telefon: revisorInfo.revisor_telefon,
                kanInnhenteOpplysninger: true,
            },
        };
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(apiData)));
    });

    it('should not include orgnumber if it is not registered in Norway', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData('nb', {
            ...virksomhetFormData,
            organisasjonsnummer: '123',
            registrertINorge: YesOrNo.NO,
            registrertILand: 'SWE',
        });
        const apiData: VirksomhetApiData = {
            ...virksomhetApiData,
            organisasjonsnummer: undefined,
            registrertIUtlandet: {
                landkode: 'SWE',
                landnavn: 'Sverige',
            },
            registrertINorge: false,
        };
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(apiData)));
    });
});

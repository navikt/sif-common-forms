import { YesOrNo } from '../../../types/YesOrNo';
import { formatDateToApiFormat } from '../../../utils/dateUtils';
import { jsonSort } from '../../../utils/jsonSort';
import { mapVirksomhetToVirksomhetApiData } from '../mapVirksomhetToApiData';
import { Næringstype, Virksomhet, VirksomhetApiData } from '../types';

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
    regnskapsfører_telefon: '234'
};

export const revisorInfo = {
    revisor_navn: 'RevisorHenrik',
    revisor_telefon: '2341',
    kanInnhenteOpplsyningerFraRevisor: YesOrNo.YES
};

const virksomhetApiData: VirksomhetApiData = {
    naringstype: [Næringstype.ANNEN],
    navn_pa_virksomheten: 'ABC',
    fra_og_med: formatDateToApiFormat(fom),
    til_og_med: null,
    er_pagaende: true,
    naringsinntekt: 123,
    registrert_i_norge: true,
    har_regnskapsforer: true,
    regnskapsforer: {
        navn: 'RegnskapsførerHenrik',
        telefon: '234'
    },
    organisasjonsnummer: '123123123'
};

describe('mapVirksomhetToApiData', () => {
    it('should verify standard required fields to be mapped', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData(virksomhetFormData as Virksomhet);
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(virksomhetApiData)));
    });

    it('should not include revisor if user has regnskapsfører', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData({
            ...virksomhetFormData,
            harRegnskapsfører: YesOrNo.NO,
            harRevisor: YesOrNo.YES,
            ...revisorInfo
        });
        const apiData: VirksomhetApiData = {
            ...virksomhetApiData,
            har_regnskapsforer: false,
            regnskapsforer: undefined,
            har_revisor: true,
            revisor: {
                navn: revisorInfo.revisor_navn,
                telefon: revisorInfo.revisor_telefon,
                kan_innhente_opplysninger: true
            }
        };
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(apiData)));
    });

    it('should not include orgnumber if it is not registered in Norway', () => {
        const mappedData = mapVirksomhetToVirksomhetApiData({
            ...virksomhetFormData,
            registrertINorge: YesOrNo.NO,
            organisasjonsnummer: '123',
            registrertILand: 'se'
        });
        const apiData: VirksomhetApiData = {
            ...virksomhetApiData,
            organisasjonsnummer: undefined,
            registrert_i_norge: false,
            registrert_i_land: 'se'
        };
        expect(JSON.stringify(jsonSort(mappedData))).toEqual(JSON.stringify(jsonSort(apiData)));
    });
});

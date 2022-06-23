import bostedUtlandMessages from '../../../forms/bosted-utland/bostedUtlandMessages';
import ferieuttakMessages from '../../../forms/ferieuttak/ferieuttakMessages';
import fraværMessages from '../../../forms/fravær/fraværMessages';
import utenlandsoppholdMessages from '../../../forms/utenlandsopphold/utenlandsoppholdMessages';
import fosterbarnMessages from '../../../forms/fosterbarn/fosterbarnMessages';
import virksomhetMessages from '../../../forms/virksomhet/virksomhetMessages';
import tidsperiodeMessages from '../../../forms/tidsperiode/tidsperiodeMessages';
import annetBarnMessages from '../../../forms/annet-barn/annetBarnMessages';
import opptjeningUtlandMessages from '../../../forms/opptjening-utland/opptjeningUtlandMessages';
import utenlandskNæringMessages from '../../../forms/utenlandsk-næring/utenlandskNæringMessages';

const commonNb = require('@navikt/sif-common-core/lib/i18n/common.nb.json');
const commonNn = require('@navikt/sif-common-core/lib/i18n/common.nn.json');
const validationNb = require('@navikt/sif-common-core/lib/i18n/validationErrors.nb.json');
const validationNn = require('@navikt/sif-common-core/lib/i18n/validationErrors.nn.json');

const bokmålstekster = {
    ...commonNb,
    ...validationNb,
    ...bostedUtlandMessages.nb,
    ...fraværMessages.nb,
    ...ferieuttakMessages.nb,
    ...fosterbarnMessages.nb,
    ...utenlandsoppholdMessages.nb,
    ...opptjeningUtlandMessages.nb,
    ...tidsperiodeMessages.nb,
    ...virksomhetMessages.nb,
    ...annetBarnMessages.nb,
    ...utenlandskNæringMessages.nb,
    'common.fieldvalidation.ugyldigTall': 'Ugyldig tall',
};

const nynorsktekster = {
    ...commonNn,
    ...validationNn,
    ...bostedUtlandMessages.nn,
    ...fraværMessages.nn,
    ...ferieuttakMessages.nn,
    ...fosterbarnMessages.nn,
    ...utenlandsoppholdMessages.nn,
    ...utenlandsoppholdMessages.nb,
    ...tidsperiodeMessages.nn,
    ...virksomhetMessages.nn,
    ...annetBarnMessages.nn,
    ...utenlandskNæringMessages.nn,
    'common.fieldvalidation.ugyldigTall': 'Ugyldig tall',
};

export const appMessages = {
    nb: bokmålstekster,
    nn: nynorsktekster,
};

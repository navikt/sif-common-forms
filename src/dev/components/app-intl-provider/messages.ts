const commonNb = require('@navikt/sif-common-core/lib/i18n/common.nb.json');
const commonNn = require('@navikt/sif-common-core/lib/i18n/common.nn.json');
const validationNb = require('@navikt/sif-common-core/lib/i18n/validationErrors.nb.json');
const validationNn = require('@navikt/sif-common-core/lib/i18n/validationErrors.nn.json');

const ferieMessagesNb = require('../../../forms/ferieuttak/ferieuttak.nb.json');
const ferieMessagesNn = require('../../../forms/ferieuttak/ferieuttak.nn.json');
const utenlandsoppholdNb = require('../../../forms/utenlandsopphold/utenlandsopphold.nb.json');
const utenlandsoppholdNn = require('../../../forms/utenlandsopphold/utenlandsopphold.nn.json');
const bostedUtlandNb = require('../../../forms/bosted-utland/bostedUtland.nb.json');
const bostedUtlandNn = require('../../../forms/bosted-utland/bostedUtland.nn.json');
const fraværNb = require('../../../forms/fravær/fravær.nb.json');
const fraværNn = require('../../../forms/fravær/fravær.nn.json');

const bokmålstekster = {
    ...ferieMessagesNb,
    ...utenlandsoppholdNb,
    ...bostedUtlandNb,
    ...commonNb,
    ...validationNb,
    ...fraværNb
};
const nynorsktekster = {
    ...ferieMessagesNn,
    ...utenlandsoppholdNn,
    ...bostedUtlandNn,
    ...commonNn,
    ...validationNn,
    ...fraværNn
};

export const appMessages = {
    nb: bokmålstekster,
    nn: nynorsktekster
};

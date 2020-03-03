const ferieMessagesNb = require('../../../forms/ferieuttak/ferieuttak.nb.json');
const ferieMessagesNn = require('../../../forms/ferieuttak/ferieuttak.nn.json');
const utenlandsoppholdNb = require('../../../forms/utenlandsopphold/utenlandsopphold.nb.json');
const utenlandsoppholdNn = require('../../../forms/utenlandsopphold/utenlandsopphold.nn.json');
const bostedUtlandNb = require('../../../forms/bosted-utland/bostedUtland.nb.json');
const bostedUtlandNn = require('../../../forms/bosted-utland/bostedUtland.nn.json');

const bokmålstekster = {
    ...ferieMessagesNb,
    ...utenlandsoppholdNb,
    ...bostedUtlandNb
};
const nynorsktekster = {
    ...ferieMessagesNn,
    ...utenlandsoppholdNn,
    ...bostedUtlandNn
};

export const appMessages = {
    nb: bokmålstekster,
    nn: nynorsktekster
};

import defaultValidationMessages from '../i18n/defaultMessages';

const ferieuttakMessages = {
    nb: {
        'ferieuttak.list.title': 'Registrer uttak av ferie',
        'ferieuttak.list.fromDate': 'Fra og med',
        'ferieuttak.list.toDate': 'Til og med',
        'ferieuttak.list.intervalTitle': 'Velg tidsrom',
        'ferieuttak.list.okButton': 'Ok',
        'ferieuttak.list.cancelButton': 'Avbryt',
        'ferieuttak.form.validation.required': 'Feltet er påkrevd',
        'ferieuttak.form.validation.dateOutsideRange': 'Første gyldige dato er {fom}, og siste gyldige dato er {tom}',
        'ferieuttak.form.validation.fromDateAfterToDate': 'Fra-dato må være lik eller før til-dato',
        'ferieuttak.form.validation.toDateBeforeFromDate': 'Til-dato må være lik eller etter fra-dato',
        'ferieuttakForm.fom.dateHasNoValue': defaultValidationMessages.nb.dateHasNoValue,
        'ferieuttakForm.fom.dateIsAfterMax': defaultValidationMessages.nb.dateIsAfterMax,
        'ferieuttakForm.fom.dateIsBeforeMin': defaultValidationMessages.nb.dateIsBeforeMin,
        'ferieuttakForm.fom.dateHasInvalidFormat': defaultValidationMessages.nb.dateHasInvalidFormat,
        'ferieuttakForm.fom.fromDateIsAfterToDate': defaultValidationMessages.nb.fromDateIsAfterToDate,
        'ferieuttakForm.tom.dateHasNoValue': defaultValidationMessages.nb.dateHasNoValue,
        'ferieuttakForm.tom.dateIsAfterMax': defaultValidationMessages.nb.dateIsAfterMax,
        'ferieuttakForm.tom.dateIsBeforeMin': defaultValidationMessages.nb.dateIsBeforeMin,
        'ferieuttakForm.tom.dateHasInvalidFormat': defaultValidationMessages.nb.dateHasInvalidFormat,
        'ferieuttakForm.tom.toDateIsBeforeFromDate': defaultValidationMessages.nb.toDateIsBeforeFromDate,
    },
    nn: {
        'ferieuttak.list.title': 'Registrer uttak av ferie',
        'ferieuttak.list.fromDate': 'Frå og med',
        'ferieuttak.list.toDate': 'Til og med',
        'ferieuttak.list.intervalTitle': 'Velg tidsrom',
        'ferieuttak.list.okButton': 'Ok',
        'ferieuttak.list.cancelButton': 'Avbryt',
        'ferieuttak.form.validation.required': 'Feltet er påkrevd',
        'ferieuttak.form.validation.dateOutsideRange': 'Første gyldige dato er {fom}, og siste gyldige dato er {tom}',
        'ferieuttak.form.validation.fromDateAfterToDate': 'Frå-dato må vere lik eller før til-dato',
        'ferieuttak.form.validation.toDateBeforeFromDate': 'Til-dato må vere lik eller etter frå-dato',
    },
};

export default ferieuttakMessages;

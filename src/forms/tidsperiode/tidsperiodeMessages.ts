import defaultValidationMessages from '../i18n/defaultMessages';

const tidsperiodeMessages = {
    nb: {
        'tidsperiode.form.title': 'Tidsperiode',
        'tidsperiode.form.fromDate': 'Fra og med',
        'tidsperiode.form.toDate': 'Til og med',
        'tidsperiode.form.okButton': 'Ok',
        'tidsperiode.form.cancelButton': 'Avbryt',
        'tidsperiode.form.validation.required': 'Feltet er påkrevd',
        'tidsperiode.form.validation.dateOutsideRange': 'Første gyldige dato er {fom}, og siste gyldige dato er {tom}',
        'tidsperiode.form.validation.fromDateAfterToDate': 'Fra-dato må være lik eller før til-dato',
        'tidsperiode.form.validation.toDateBeforeFromDate': 'Til-dato må være lik eller etter fra-dato',
        'tidsperiodeForm.fom.dateHasNoValue': defaultValidationMessages.nb.dateHasNoValue,
        'tidsperiodeForm.fom.dateIsAfterMax': defaultValidationMessages.nb.dateIsAfterMax,
        'tidsperiodeForm.fom.dateIsBeforeMin': defaultValidationMessages.nb.dateIsBeforeMin,
        'tidsperiodeForm.fom.dateHasInvalidFormat': defaultValidationMessages.nb.dateHasInvalidFormat,
        'tidsperiodeForm.fom.fromDateIsAfterToDate': defaultValidationMessages.nb.fromDateIsAfterToDate,
        'tidsperiodeForm.tom.dateHasNoValue': defaultValidationMessages.nb.dateHasNoValue,
        'tidsperiodeForm.tom.dateIsAfterMax': defaultValidationMessages.nb.dateIsAfterMax,
        'tidsperiodeForm.tom.dateIsBeforeMin': defaultValidationMessages.nb.dateIsBeforeMin,
        'tidsperiodeForm.tom.dateHasInvalidFormat': defaultValidationMessages.nb.dateHasInvalidFormat,
        'tidsperiodeForm.tom.toDateIsBeforeFromDate': defaultValidationMessages.nb.dateHasInvalidFormat,
    },
    nn: {
        'tidsperiode.form.title': 'Tidsperiode',
        'tidsperiode.form.fromDate': 'Frå og med',
        'tidsperiode.form.toDate': 'Til og med',
        'tidsperiode.form.okButton': 'Ok',
        'tidsperiode.form.cancelButton': 'Avbryt',
        'tidsperiode.form.validation.required': 'Feltet er påkrevd',
        'tidsperiode.form.validation.dateOutsideRange': 'Første gyldige dato er {fom}, og siste gyldige dato er {tom}',
        'tidsperiode.form.validation.fromDateAfterToDate': 'Frå-datoen må vere lik eller før til-datoen',
        'tidsperiode.form.validation.toDateBeforeFromDate': 'Til-datoen må vere lik eller etter frå-dato',
    },
};

export default tidsperiodeMessages;

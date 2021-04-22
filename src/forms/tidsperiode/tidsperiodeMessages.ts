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
        'tidsperiodeForm.fom.noValue': defaultValidationMessages.nb.noValue,
        'tidsperiodeForm.fom.dateAfterMax': defaultValidationMessages.nb.dateAfterMax,
        'tidsperiodeForm.fom.dateBeforeMin': defaultValidationMessages.nb.dateBeforeMin,
        'tidsperiodeForm.fom.invalidDateFormat': defaultValidationMessages.nb.invalidDateFormat,
        'tidsperiodeForm.fom.fromDateIsAfterToDate': defaultValidationMessages.nb.fromDateIsAfterToDate,
        'tidsperiodeForm.tom.noValue': defaultValidationMessages.nb.noValue,
        'tidsperiodeForm.tom.dateAfterMax': defaultValidationMessages.nb.dateAfterMax,
        'tidsperiodeForm.tom.dateBeforeMin': defaultValidationMessages.nb.dateBeforeMin,
        'tidsperiodeForm.tom.invalidDateFormat': defaultValidationMessages.nb.invalidDateFormat,
        'tidsperiodeForm.tom.toDateIsBeforeFromDate': defaultValidationMessages.nb.invalidDateFormat,
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

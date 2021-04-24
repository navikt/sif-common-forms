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
        'ferieuttakForm.fom.noValue': defaultValidationMessages.nb.noValue,
        'ferieuttakForm.fom.dateAfterMax': defaultValidationMessages.nb.dateAfterMax,
        'ferieuttakForm.fom.dateBeforeMin': defaultValidationMessages.nb.dateBeforeMin,
        'ferieuttakForm.fom.invalidDateFormat': defaultValidationMessages.nb.invalidDateFormat,
        'ferieuttakForm.fom.fromDateIsAfterToDate': defaultValidationMessages.nb.fromDateIsAfterToDate,
        'ferieuttakForm.tom.noValue': defaultValidationMessages.nb.noValue,
        'ferieuttakForm.tom.dateAfterMax': defaultValidationMessages.nb.dateAfterMax,
        'ferieuttakForm.tom.dateBeforeMin': defaultValidationMessages.nb.dateBeforeMin,
        'ferieuttakForm.tom.invalidDateFormat': defaultValidationMessages.nb.invalidDateFormat,
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

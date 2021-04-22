import {
    ValidateDateError,
    ValidateDateInRangeError,
    ValidateFødselsnummerError,
    ValidateListError,
    ValidateNumberError,
    ValidateRequiredFieldError,
    ValidateStringError,
    ValidateYesOrNoError,
} from '@navikt/sif-common-formik/lib/validation';

const defaultValidationMessages = {
    nb: {
        [ValidateRequiredFieldError.noValue]: 'Feltet er påkrevd',
        [ValidateYesOrNoError.yesOrNoIsUnanswered]: 'Feltet er påkrevd',
        [ValidateFødselsnummerError.invalidFødselsnummer]: 'Ugyldig fødselsnummer',
        [ValidateFødselsnummerError.fødselsnummerNot11Chars]: 'Fødselsnummeret må bestå av 11 siffer',
        [ValidateFødselsnummerError.disallowedFødselsnummer]:
            'Fødselsnummeret du har fylt ut er ditt eget fødselsnummer',
        [ValidateDateError.invalidDateFormat]: 'Ugyldig datoformat. Formatet må være dd.mm.åååå',
        [ValidateDateError.dateBeforeMin]: 'Dato kan ikke være tidligere enn {dato}',
        [ValidateDateError.dateAfterMax]: `Dato kan ikke være etter {dato}`,
        [ValidateDateInRangeError.fromDateIsAfterToDate]: 'Fra-dato må være lik eller før til-dato',
        [ValidateDateInRangeError.toDateIsBeforeFromDate]: 'Til-dato må være lik eller etter fra-dato',
        [ValidateListError.listIsEmpty]: 'Du har ikke lagt til noe i listen',
        [ValidateListError.listHasTooFewItems]: 'Du har lagt til for få',
        [ValidateListError.listHasTooFewItems]: 'Du har lagt til for mange',
        [ValidateNumberError.invalidNumberFormat]: 'Verdien er ikke et gyldig tall',
        [ValidateNumberError.numberIsTooLarge]: 'Tallet kan ikke være større enn {maks}',
        [ValidateNumberError.numberIsTooSmall]: 'Tallet kan ikke være mindre enn {min}',
        [ValidateStringError.notAString]: 'Verdien er ikke en tekst',
        [ValidateStringError.stringIsTooLong]: 'Teksten kan ikke inneholde flere enn {lengde} tegn',
        [ValidateStringError.stringIsTooShort]: 'Teksten må være på minst {lengde} tegn',
    },
};

export default defaultValidationMessages;

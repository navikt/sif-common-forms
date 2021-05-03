import {
    ValidateDateError,
    ValidateDateRangeError,
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
        [ValidateFødselsnummerError.fødselsnummerHasNoValue]: 'Ugyldig fødselsnummer',
        [ValidateFødselsnummerError.fødselsnummerIsInvalid]: 'Ugyldig fødselsnummer',
        [ValidateFødselsnummerError.fødselsnummerIsNot11Chars]: 'Fødselsnummeret må bestå av 11 siffer',
        [ValidateFødselsnummerError.fødselsnummerIsNotAllowed]:
            'Fødselsnummeret du har fylt ut er ditt eget fødselsnummer',
        [ValidateDateError.dateHasNoValue]: 'Dato er påkrevd',
        [ValidateDateError.dateHasInvalidFormat]: 'Ugyldig datoformat. Formatet må være dd.mm.åååå',
        [ValidateDateError.dateIsBeforeMin]: 'Dato kan ikke være tidligere enn {dato}',
        [ValidateDateError.dateIsAfterMax]: `Dato kan ikke være etter {dato}`,
        [ValidateDateRangeError.fromDateIsAfterToDate]: 'Fra-dato må være lik eller før til-dato',
        [ValidateDateRangeError.toDateIsBeforeFromDate]: 'Til-dato må være lik eller etter fra-dato',
        [ValidateListError.listIsEmpty]: 'Du har ikke lagt til noe i listen',
        [ValidateListError.listHasTooFewItems]: 'Du har lagt til for få',
        [ValidateListError.listHasTooFewItems]: 'Du har lagt til for mange',
        [ValidateNumberError.numberHasNoValue]: 'Verdien er ikke et gyldig tall',
        [ValidateNumberError.numberHasInvalidFormat]: 'Verdien er ikke et gyldig tall',
        [ValidateNumberError.numberIsTooLarge]: 'Tallet kan ikke være større enn {maks}',
        [ValidateNumberError.numberIsTooSmall]: 'Tallet kan ikke være mindre enn {min}',
        [ValidateStringError.stringHasNoValue]: 'Verdien er ikke en tekst',
        [ValidateStringError.stringIsNotAString]: 'Verdien er ikke en tekst',
        [ValidateStringError.stringIsTooLong]: 'Teksten kan ikke inneholde flere enn {lengde} tegn',
        [ValidateStringError.stringIsTooShort]: 'Teksten må være på minst {lengde} tegn',
    },
};

export default defaultValidationMessages;

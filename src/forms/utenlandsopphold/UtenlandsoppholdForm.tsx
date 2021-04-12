import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { countryIsMemberOfEøsOrEfta } from '@navikt/sif-common-core/lib/utils/countryUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import dateRangeValidation from '@navikt/sif-common-core/lib/validation/dateRangeValidation';
import {
    validateRequiredField,
    validateRequiredList,
    validateRequiredSelect,
    validateYesOrNoIsAnswered,
} from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { hasValue } from '@navikt/sif-common-core/lib/validation/hasValue';
import { DateRange, getCountryName, ISOStringToDate, YesOrNo } from '@navikt/sif-common-formik';
import { getTypedFormComponents } from '@navikt/sif-common-formik/lib';
import { Systemtittel } from 'nav-frontend-typografi';
import TidsperiodeListAndDialog from '../tidsperiode/TidsperiodeListAndDialog';
import { mapFomTomToDateRange } from '../utils';
import { Utenlandsopphold, UtenlandsoppholdFormValues, UtenlandsoppholdÅrsak } from './types';
import utils from './utenlandsoppholdUtils';
import { dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';

interface Props {
    minDate: Date;
    maxDate: Date;
    opphold?: Utenlandsopphold;
    alleOpphold?: Utenlandsopphold[];
    onSubmit: (values: Utenlandsopphold) => void;
    onCancel: () => void;
}

enum UtenlandsoppholdFormFields {
    fom = 'fom',
    tom = 'tom',
    landkode = 'landkode',
    årsak = 'årsak',
    erBarnetInnlagt = 'erBarnetInnlagt',
    barnInnlagtPerioder = 'barnInnlagtPerioder',
}

const defaultFormValues: UtenlandsoppholdFormValues = {
    fom: undefined,
    tom: undefined,
    landkode: undefined,
    erBarnetInnlagt: YesOrNo.UNANSWERED,
    barnInnlagtPerioder: [],
    årsak: undefined,
};

const Form = getTypedFormComponents<UtenlandsoppholdFormFields, UtenlandsoppholdFormValues>();

const UtenlandsoppholdForm = ({ maxDate, minDate, opphold, alleOpphold = [], onSubmit, onCancel }: Props) => {
    const intl = useIntl();

    const onFormikSubmit = (formValues: Partial<UtenlandsoppholdFormValues>) => {
        const utenlandsoppholdToSubmit = utils.mapFormValuesToUtenlandsopphold(formValues, opphold?.id);
        if (utils.isValidUtenlandsopphold(utenlandsoppholdToSubmit)) {
            onSubmit({
                ...utenlandsoppholdToSubmit,
                årsak: countryIsMemberOfEøsOrEfta(utenlandsoppholdToSubmit.landkode) ? undefined : formValues.årsak,
            });
        } else {
            throw new Error('UtenlandsoppholdForm: Formvalues is not a valid Utenlandsopphold on submit.');
        }
    };

    const registrerteTidsperioder: DateRange[] | undefined =
        opphold === undefined
            ? alleOpphold.map(mapFomTomToDateRange)
            : alleOpphold.filter((o) => o.id !== opphold.id).map(mapFomTomToDateRange);

    const initialValues = opphold ? utils.mapUtenlandsoppholdToFormValues(opphold) : defaultFormValues;
    return (
        <Form.FormikWrapper
            initialValues={initialValues}
            onSubmit={onFormikSubmit}
            renderForm={(formik) => {
                const {
                    values: { fom, tom, landkode, erBarnetInnlagt, barnInnlagtPerioder = [], årsak },
                } = formik;

                const hasDateStringValues = hasValue(fom) && hasValue(tom);
                const fomDate = ISOStringToDate(fom);
                const tomDate = ISOStringToDate(tom);

                const includeInnlagtPerioderQuestion =
                    hasDateStringValues && landkode !== undefined && erBarnetInnlagt === YesOrNo.YES;

                const includeInnlagtQuestion: boolean =
                    landkode !== undefined && hasValue(landkode) && !countryIsMemberOfEøsOrEfta(landkode);

                const showÅrsakQuestion = barnInnlagtPerioder.length > 0;

                const areAllQuestionsAnswered: boolean =
                    hasDateStringValues && landkode !== undefined && includeInnlagtQuestion === false
                        ? true
                        : erBarnetInnlagt !== YesOrNo.UNANSWERED &&
                          (erBarnetInnlagt === YesOrNo.YES
                              ? barnInnlagtPerioder.length > 0 && årsak !== undefined
                              : true);

                return (
                    <Form.Form
                        includeButtons={areAllQuestionsAnswered}
                        onCancel={onCancel}
                        fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                        <Systemtittel tag="h1">
                            <FormattedMessage id="utenlandsopphold.form.tittel" />
                        </Systemtittel>
                        <FormBlock>
                            <Form.DateRangePicker
                                legend={intlHelper(intl, 'utenlandsopphold.form.tidsperiode.spm')}
                                fullscreenOverlay={true}
                                disabledDateRanges={registrerteTidsperioder}
                                minDate={minDate}
                                maxDate={maxDate}
                                fromInputProps={{
                                    name: UtenlandsoppholdFormFields.fom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.fraDato'),
                                    dayPickerProps: {
                                        initialMonth: fomDate || minDate || dateToday,
                                    },
                                    validate: (dateString) =>
                                        dateRangeValidation.validateFromDate(
                                            ISOStringToDate(dateString),
                                            minDate,
                                            maxDate,
                                            ISOStringToDate(tom)
                                        ),
                                }}
                                toInputProps={{
                                    name: UtenlandsoppholdFormFields.tom,
                                    label: intlHelper(intl, 'utenlandsopphold.form.tidsperiode.tilDato'),
                                    dayPickerProps: {
                                        initialMonth: tomDate || fomDate || dateToday,
                                    },
                                    validate: (dateString) =>
                                        dateRangeValidation.validateToDate(
                                            ISOStringToDate(dateString),
                                            minDate,
                                            maxDate,
                                            ISOStringToDate(fom)
                                        ),
                                }}
                            />
                        </FormBlock>
                        {hasDateStringValues && (
                            <FormBlock>
                                <Form.CountrySelect
                                    name={UtenlandsoppholdFormFields.landkode}
                                    label={intlHelper(intl, 'utenlandsopphold.form.land.spm')}
                                    validate={validateRequiredSelect}
                                />
                            </FormBlock>
                        )}

                        {includeInnlagtQuestion && landkode && hasDateStringValues && (
                            <>
                                <FormBlock>
                                    <Form.YesOrNoQuestion
                                        name={UtenlandsoppholdFormFields.erBarnetInnlagt}
                                        legend={intlHelper(intl, 'utenlandsopphold.form.erBarnetInnlagt.spm', {
                                            land: getCountryName(landkode, intl.locale),
                                        })}
                                        validate={validateYesOrNoIsAnswered}
                                    />
                                </FormBlock>
                                {includeInnlagtPerioderQuestion && (
                                    <FormBlock margin="l">
                                        <TidsperiodeListAndDialog
                                            name={UtenlandsoppholdFormFields.barnInnlagtPerioder}
                                            minDate={ISOStringToDate(fom)}
                                            maxDate={ISOStringToDate(tom)}
                                            validate={validateRequiredList}
                                            formTitle={intlHelper(
                                                intl,
                                                'utenlandsopphold.form.perioderBarnetErInnlag.formTitle'
                                            )}
                                            labels={{
                                                addLabel: intlHelper(
                                                    intl,
                                                    'utenlandsopphold.form.perioderBarnetErInnlag.addLabel'
                                                ),
                                                modalTitle: intlHelper(
                                                    intl,
                                                    'utenlandsopphold.form.perioderBarnetErInnlag.modalTitle'
                                                ),
                                                listTitle: intlHelper(
                                                    intl,
                                                    'utenlandsopphold.form.perioderBarnetErInnlag.listTitle'
                                                ),
                                            }}
                                        />
                                    </FormBlock>
                                )}
                                {showÅrsakQuestion && (
                                    <>
                                        <FormBlock>
                                            <Form.RadioPanelGroup
                                                legend={intlHelper(intl, 'utenlandsopphold.form.årsak.spm', {
                                                    land: getCountryName(landkode, intl.locale),
                                                })}
                                                name={UtenlandsoppholdFormFields.årsak}
                                                validate={validateRequiredField}
                                                radios={[
                                                    {
                                                        value: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.INNLAGT_DEKKET_NORGE}`
                                                        ),
                                                    },
                                                    {
                                                        value: UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.INNLAGT_DEKKET_ANNET_LAND}`,
                                                            { land: getCountryName(landkode, intl.locale) }
                                                        ),
                                                    },
                                                    {
                                                        value: UtenlandsoppholdÅrsak.ANNET,
                                                        label: intlHelper(
                                                            intl,
                                                            `utenlandsopphold.form.årsak.${UtenlandsoppholdÅrsak.ANNET}`
                                                        ),
                                                    },
                                                ]}
                                            />
                                        </FormBlock>
                                    </>
                                )}
                            </>
                        )}
                    </Form.Form>
                );
            }}
        />
    );
};

export default UtenlandsoppholdForm;

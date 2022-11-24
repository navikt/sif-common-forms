import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import { date1YearAgo, date1YearFromNow, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import flat from 'flat';
import Panel from 'nav-frontend-paneler';
import 'nav-frontend-tabs-style';
import { Undertittel } from 'nav-frontend-typografi';
import { FraværDag, FraværPeriode } from '../../../forms/fravær';
import FraværDagerListAndDialog from '../../../forms/fravær/FraværDagerListAndDialog';
import FraværDagFormView, { FraværDagFormErrors } from '../../../forms/fravær/FraværDagForm';
import fraværMessages from '../../../forms/fravær/fraværMessages';
import FraværPeriodeForm, { FraværPeriodeFormErrors } from '../../../forms/fravær/FraværPeriodeForm';
import FraværPerioderListAndDialog from '../../../forms/fravær/FraværPerioderListAndDialog';
import { fraværDagToFraværDateRange, fraværPeriodeToDateRange } from '../../../forms/fravær/fraværUtilities';
import { FraværFieldValidationErrors, validateNoCollisions } from '../../../forms/fravær/fraværValidationUtils';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import FormValidationErrorMessages from '../../components/validation-error-messages/ValidationErrorMessages';

enum FormField {
    perioder = 'perioder',
    dager = 'dager',
}

interface FormValues {
    [FormField.perioder]: FraværPeriode[];
    [FormField.dager]: FraværDag[];
}

const initialValues: FormValues = { [FormField.perioder]: [], [FormField.dager]: [] };

const FraværExample: React.FunctionComponent = () => {
    const [fraværPeriodeSingleFormValues, setFraværPeriodeSingleFormValues] = useState<
        Partial<FraværPeriode> | undefined
    >(undefined);
    const [fraværDagSingleFormValues, setFraværDagSingleFormValues] = useState<Partial<FraværDag> | undefined>(
        undefined
    );
    const [listFormValues, setListFormValues] = useState<Partial<FormValues> | undefined>(undefined);
    const intl = useIntl();
    return (
        <>
            <Box padBottom="l">
                <Undertittel>Liste og dialog</Undertittel>
            </Box>
            <Panel border={true}>
                <TypedFormikWrapper<FormValues>
                    initialValues={initialValues}
                    onSubmit={setListFormValues}
                    renderForm={(formik) => {
                        const { values } = formik;
                        const dateRangesToDisable = [
                            ...values.perioder.map(fraværPeriodeToDateRange),
                            ...values.dager.map(fraværDagToFraværDateRange),
                        ];
                        return (
                            <TypedFormikForm<FormValues, ValidationError | FraværFieldValidationErrors>
                                includeButtons={true}
                                submitButtonLabel="Valider skjema"
                                formErrorHandler={getFormErrorHandler(intl)}>
                                <FormBlock>
                                    <FraværPerioderListAndDialog<FormField>
                                        name={FormField.perioder}
                                        minDate={date1YearAgo}
                                        maxDate={dateToday}
                                        periodeDescription={
                                            <p style={{ marginTop: '.5rem' }}>
                                                Du kan kun søke for ett og samme år i en søknad. Får å søke for flere
                                                år, må du sende en søknad for hvert år.
                                            </p>
                                        }
                                        validate={(value) => {
                                            const listError = getListValidator({ required: true })(value);
                                            if (listError) {
                                                return listError;
                                            }
                                            const collisionError = validateNoCollisions(values.dager, values.perioder);
                                            if (collisionError) {
                                                return collisionError;
                                            }
                                        }}
                                        labels={{
                                            addLabel: 'Legg til periode',
                                            modalTitle: 'Fravær hele dager',
                                        }}
                                        dateRangesToDisable={dateRangesToDisable}
                                        helgedagerIkkeTillat={true}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <FraværDagerListAndDialog<FormField>
                                        name={FormField.dager}
                                        minDate={date1YearAgo}
                                        maxDate={dateToday}
                                        validate={(value) => {
                                            const listError = getListValidator({ required: true })(value);
                                            if (listError) {
                                                return listError;
                                            }
                                            const collisionError = validateNoCollisions(values.dager, values.perioder);
                                            if (collisionError) {
                                                return collisionError;
                                            }
                                        }}
                                        labels={{
                                            addLabel: 'Legg til dag med delvis fravær',
                                            listTitle: 'Dager med delvis fravær',
                                            modalTitle: 'Fravær deler av dag',
                                            emptyListText: 'Ingen dager er lagt til',
                                        }}
                                        dateRangesToDisable={dateRangesToDisable}
                                        helgedagerIkkeTillatt={true}
                                        maksArbeidstidPerDag={24}
                                    />
                                </FormBlock>
                            </TypedFormikForm>
                        );
                    }}
                />
                <SubmitPreview values={listFormValues} />
            </Panel>

            <Box margin="xxl" padBottom="l">
                <FormValidationErrorMessages
                    validationErrorIntlKeys={flat(FraværPeriodeFormErrors)}
                    intlMessages={fraværMessages}
                />
                <FormValidationErrorMessages
                    validationErrorIntlKeys={flat(FraværDagFormErrors)}
                    intlMessages={fraværMessages}
                />
            </Box>

            <Box margin="xxl" padBottom="l">
                <Undertittel>Kun dialoger</Undertittel>
            </Box>

            <FormBlock>
                <DialogFormWrapper>
                    <Panel border={true}>
                        <FraværPeriodeForm
                            minDate={date1YearAgo}
                            maxDate={date1YearFromNow}
                            fraværPeriode={{}}
                            brukeKoronaFunksjonalitet={true}
                            onSubmit={setFraværPeriodeSingleFormValues}
                            onCancel={() => {
                                // tslint:disable-next-line:no-console
                                return console.log('cancel me');
                            }}
                        />
                    </Panel>
                    <SubmitPreview values={fraværPeriodeSingleFormValues} />
                </DialogFormWrapper>
            </FormBlock>

            <FormBlock>
                <DialogFormWrapper>
                    <Panel border={true}>
                        <FraværDagFormView
                            minDate={date1YearAgo}
                            maxDate={date1YearFromNow}
                            fraværDag={{}}
                            onSubmit={setFraværDagSingleFormValues}
                            onCancel={() => {
                                // tslint:disable-next-line:no-console
                                return console.log('cancel me');
                            }}
                        />
                    </Panel>
                    <SubmitPreview values={fraværDagSingleFormValues} />
                </DialogFormWrapper>
            </FormBlock>

            <MessagesPreview messages={fraværMessages} showExplanation={false} />
        </>
    );
};

export default FraværExample;

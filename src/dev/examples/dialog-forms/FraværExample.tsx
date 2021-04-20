import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import {
    getFieldErrorRenderer,
    getSummaryFieldErrorRenderer,
} from '@navikt/sif-common-formik/lib/utils/formikErrorRenderUtils';

import { date1YearAgo, date1YearFromNow, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import Panel from 'nav-frontend-paneler';
import 'nav-frontend-tabs-style';
import { Undertittel } from 'nav-frontend-typografi';
import { FraværDag, FraværPeriode } from '../../../forms/fravær';
import FraværDagerListAndDialog from '../../../forms/fravær/FraværDagerListAndDialog';
import FraværDagFormView from '../../../forms/fravær/FraværDagForm';
import fraværMessages from '../../../forms/fravær/fraværMessages';
import FraværPeriodeForm from '../../../forms/fravær/FraværPeriodeForm';
import FraværPerioderListAndDialog from '../../../forms/fravær/FraværPerioderListAndDialog';
import { fraværDagToFraværDateRange, fraværPeriodeToDateRange } from '../../../forms/fravær/fraværUtilities';
import { validateNoCollisions } from '../../../forms/fravær/fraværValidationUtils';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import { validateAll } from '@navikt/sif-common-formik/lib/validation/validationUtils';

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
                            <TypedFormikForm<FormValues>
                                includeButtons={true}
                                submitButtonLabel="Valider skjema"
                                fieldErrorRenderer={getFieldErrorRenderer(intl, 'fraværExample')}
                                summaryFieldErrorRenderer={getSummaryFieldErrorRenderer(intl, 'fraværExample')}>
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
                                        validate={(value) =>
                                            validateAll([
                                                () => getListValidator({ required: true })(value),
                                                () => validateNoCollisions(values.dager, values.perioder),
                                            ])
                                        }
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
                                        validate={(value) =>
                                            validateAll([
                                                () => getListValidator({ required: true })(value),
                                                () => validateNoCollisions(values.dager, values.perioder),
                                            ])
                                        }
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
                <Undertittel>Kun dialoger</Undertittel>
            </Box>

            <FormBlock>
                <DialogFormWrapper>
                    <Panel border={true}>
                        <FraværPeriodeForm
                            minDate={date1YearAgo}
                            maxDate={date1YearFromNow}
                            fraværPeriode={{}}
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

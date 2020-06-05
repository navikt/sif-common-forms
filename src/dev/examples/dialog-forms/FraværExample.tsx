import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { date1YearAgo, date1YearFromNow, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredList } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import 'nav-frontend-tabs-style';
import { Undertittel } from 'nav-frontend-typografi';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import { FraværDag, FraværPeriode } from '../../../forms/fravær';
import FraværPerioderListAndDialog from '../../../forms/fravær/FraværPerioderListAndDialog';
import FraværDagerListAndDialog from '../../../forms/fravær/FraværDagerListAndDialog';
import FraværPeriodeForm from '../../../forms/fravær/FraværPeriodeForm';
import FraværDagFormView from '../../../forms/fravær/FraværDagForm';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { fraværDagToFraværDateRange, validateNoCollisions } from '../../../forms/fravær/fraværUtilities';
import { validateAll } from '../../../forms/fravær/fraværValidationUtils';
import Panel from 'nav-frontend-paneler';

interface Props {}

enum FormField {
    perioder = 'perioder',
    dager = 'dager',
}

interface FormValues {
    [FormField.perioder]: FraværPeriode[];
    [FormField.dager]: FraværDag[];
}

const initialValues: FormValues = { [FormField.perioder]: [], [FormField.dager]: [] };

const FraværExample: React.FunctionComponent<Props> = (props) => {
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
                        return (
                            <TypedFormikForm<FormValues>
                                includeButtons={true}
                                submitButtonLabel="Valider skjema"
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                                <FormBlock>
                                    <FraværPerioderListAndDialog<FormField>
                                        name={FormField.perioder}
                                        minDate={date1YearAgo}
                                        maxDate={dateToday}
                                        validate={validateAll([
                                            validateRequiredList,
                                            validateNoCollisions(values[FormField.dager], values[FormField.perioder]),
                                        ])}
                                        labels={{
                                            addLabel: 'Legg til periode',
                                            listTitle: 'Perioder med fravær',
                                            modalTitle: 'Fravær hele dager',
                                            emptyListText: 'Ingen perioder er lagt til',
                                        }}
                                        dateRangesToDisable={[
                                            ...values[FormField.dager].map(fraværDagToFraværDateRange),
                                        ]}
                                        helgedagerIkkeTillat={true}
                                    />
                                </FormBlock>
                                <FormBlock>
                                    <FraværDagerListAndDialog<FormField>
                                        name={FormField.dager}
                                        minDate={date1YearAgo}
                                        maxDate={dateToday}
                                        validate={validateAll([
                                            validateRequiredList,
                                            validateNoCollisions(values[FormField.dager], values[FormField.perioder]),
                                        ])}
                                        labels={{
                                            addLabel: 'Legg til dag med delvis fravær',
                                            listTitle: 'Dager med delvis fravær',
                                            modalTitle: 'Fravær deler av dag',
                                            emptyListText: 'Ingen dager er lagt til',
                                        }}
                                        dateRangesToDisable={[
                                            ...values[FormField.perioder],
                                        ]}
                                        helgedagerIkkeTillatt={true}
                                        fraværDagFormLabels={{
                                            title: 'Dag med delvis fravær',
                                            date: 'Dato',
                                            antallArbeidstimer: 'Antall timer du skulle ha jobbet denne dagen',
                                            timerFravær: 'Antall timer du var borte fra jobb denne dagen',
                                        }}
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
        </>
    );
};

export default FraværExample;

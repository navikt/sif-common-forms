import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { date1YearAgo, date1YearFromNow } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredList } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import Panel from 'nav-frontend-paneler';
import 'nav-frontend-tabs-style';
import { Undertittel } from 'nav-frontend-typografi';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import { DateTidsperiode } from '../../../forms/tidsperiode';
import TidsperiodeListAndDialog from '../../../forms/tidsperiode/TidsperiodeListAndDialog';
import TidsperiodeForm from '../../../forms/tidsperiode/TidsperiodeForm';

enum FormField {
    'tidsperiode' = 'tidsperiode',
}

interface FormValues {
    [FormField.tidsperiode]: DateTidsperiode[];
}
const initialValues: FormValues = { tidsperiode: [] };

const TidsperiodeExample = () => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<DateTidsperiode> | undefined>(undefined);
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
                    renderForm={() => {
                        return (
                            <TypedFormikForm<FormValues>
                                includeButtons={true}
                                submitButtonLabel="Valider skjema"
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                                <TidsperiodeListAndDialog<FormField>
                                    name={FormField.tidsperiode}
                                    minDate={date1YearAgo}
                                    maxDate={date1YearFromNow}
                                    validate={validateRequiredList}
                                    labels={{
                                        addLabel: 'Legg til periode',
                                        listTitle: 'Registrerte periode',
                                        modalTitle: 'Periode',
                                    }}
                                />
                            </TypedFormikForm>
                        );
                    }}
                />
                <SubmitPreview values={listFormValues} />
            </Panel>

            <Box margin="xxl" padBottom="l">
                <Undertittel>Kun dialog</Undertittel>
            </Box>

            <DialogFormWrapper>
                <Panel border={true}>
                    <TidsperiodeForm
                        minDate={date1YearAgo}
                        maxDate={date1YearFromNow}
                        tidsperiode={{}}
                        onSubmit={setSingleFormValues}
                        onCancel={() => console.log('cancel me')}
                    />
                </Panel>
                <SubmitPreview values={singleFormValues} />
            </DialogFormWrapper>
        </>
    );
};

export default TidsperiodeExample;

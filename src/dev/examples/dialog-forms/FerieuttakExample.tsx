import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import { Panel } from 'nav-frontend-paneler';
import 'nav-frontend-tabs-style';
import { Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common/lib/common/utils/commonFieldErrorRenderer';
import { date1YearAgo, date1YearFromNow } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { validateRequiredList } from '@navikt/sif-common/lib/common/validation/fieldValidations';
import FerieuttakForm from '../../../forms/ferieuttak/FerieuttakForm';
import FerieuttakListAndDialog from '../../../forms/ferieuttak/FerieuttakListAndDialog';
import { Ferieuttak } from '../../../forms/ferieuttak/types';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';

interface Props {}

enum FormField {
    'ferie' = 'ferie'
}

interface FormValues {
    [FormField.ferie]: Ferieuttak[];
}
const initialValues: FormValues = { ferie: [] };

const FormikExample: React.FunctionComponent<Props> = (props) => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<Ferieuttak> | undefined>(undefined);
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
                        return (
                            <TypedFormikForm<FormValues>
                                includeButtons={true}
                                submitButtonLabel="Valider skjema"
                                fieldErrorRenderer={(error) => commonFieldErrorRenderer(intl, error)}>
                                <FerieuttakListAndDialog<FormField>
                                    name={FormField.ferie}
                                    minDate={date1YearAgo}
                                    maxDate={date1YearFromNow}
                                    validate={validateRequiredList}
                                    labels={{
                                        addLabel: 'Legg til ferie',
                                        listTitle: 'Registrerte ferier',
                                        modalTitle: 'Ferie',
                                        emptyListText: 'Ingen ferier er lagt til'
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
                    <FerieuttakForm
                        minDate={date1YearAgo}
                        maxDate={date1YearFromNow}
                        ferieuttak={{}}
                        onSubmit={setSingleFormValues}
                        onCancel={() => console.log('cancel me')}
                    />
                </Panel>
                <SubmitPreview values={singleFormValues} />
            </DialogFormWrapper>
        </>
    );
};

export default FormikExample;

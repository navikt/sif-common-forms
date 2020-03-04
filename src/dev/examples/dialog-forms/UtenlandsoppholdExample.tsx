import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { date1YearAgo, date1YearFromNow } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { validateRequiredList } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import { Utenlandsopphold } from '../../../forms/utenlandsopphold/types';
import UtenlandsoppholdForm from '../../../forms/utenlandsopphold/UtenlandsoppholdForm';
import UtenlandsoppholdListAndDialog from '../../../forms/utenlandsopphold/UtenlandsoppholdListAndDialog';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';

interface Props {}
enum FormField {
    'utenlandsopphold' = 'utenlandsopphold'
}

interface FormValues {
    [FormField.utenlandsopphold]: Utenlandsopphold[];
}
const initialValues: FormValues = { utenlandsopphold: [] };

const UtenlandsoppholdExample: React.FunctionComponent<Props> = (props) => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<Utenlandsopphold> | undefined>(undefined);
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
                                <UtenlandsoppholdListAndDialog
                                    minDate={date1YearAgo}
                                    maxDate={date1YearFromNow}
                                    name={FormField.utenlandsopphold}
                                    validate={validateRequiredList}
                                    labels={{
                                        addLabel: 'Legg til utenlandsopphold',
                                        listTitle: 'Registrerte utenlandsopphold',
                                        modalTitle: 'Utenlandsopphold',
                                        emptyListText: 'Ingen utenlandsopphold er lagt til'
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
                    <UtenlandsoppholdForm
                        minDate={date1YearAgo}
                        maxDate={date1YearFromNow}
                        onSubmit={setSingleFormValues}
                        onCancel={() => console.log('cancel me')}
                    />
                    <SubmitPreview values={singleFormValues} />
                </Panel>
            </DialogFormWrapper>
        </>
    );
};

export default UtenlandsoppholdExample;

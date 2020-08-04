import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import { commonFieldErrorRenderer } from '@navikt/sif-common-core/lib/utils/commonFieldErrorRenderer';
import { validateRequiredList } from '@navikt/sif-common-core/lib/validation/fieldValidations';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import Panel from 'nav-frontend-paneler';
import 'nav-frontend-tabs-style';
import { Undertittel } from 'nav-frontend-typografi';
import { Fosterbarn } from '../../../forms/fosterbarn';
import FosterbarnForm from '../../../forms/fosterbarn/FosterbarnForm';
import FosterbarnListAndDialog from '../../../forms/fosterbarn/FosterbarnListAndDialog';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import fosterbarnMessages from '../../../forms/fosterbarn/fosterbarnMessages';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';

enum FormField {
    'fosterbarn' = 'fosterbarn',
}

interface FormValues {
    [FormField.fosterbarn]: Fosterbarn[];
}
const initialValues: FormValues = { fosterbarn: [] };

const FosterbarnExample = () => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<Fosterbarn> | undefined>(undefined);
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
                                <FosterbarnListAndDialog<FormField>
                                    name={FormField.fosterbarn}
                                    validate={validateRequiredList}
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
                    <FosterbarnForm
                        fosterbarn={{}}
                        onSubmit={setSingleFormValues}
                        onCancel={() => console.log('cancel me')}
                    />
                </Panel>
                <SubmitPreview values={singleFormValues} />
            </DialogFormWrapper>

            <MessagesPreview messages={fosterbarnMessages} showExplanation={false} />
        </>
    );
};

export default FosterbarnExample;

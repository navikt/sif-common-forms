import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import flat from 'flat';
import Panel from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import FormValidationErrorMessages from '../../components/validation-error-messages/ValidationErrorMessages';
import { UtenlandskNæring } from '../../../forms/utenlandsk-næring';
import UtenlandskNæringListAndDialog from '../../../forms/utenlandsk-næring/UtenlandskNæringListAndDialog';
import UtenlandskNæringForm, {
    UtenlandskNæringFormErrors,
} from '../../../forms/utenlandsk-næring/UtenlandskNæringForm';
import utenlandskNæringMessages from '../../../forms/utenlandsk-næring/utenlandskNæringMessages';

enum FormField {
    'utenlandskNæring' = 'utenlandskNæring',
}

interface FormValues {
    [FormField.utenlandskNæring]: UtenlandskNæring[];
}
const initialValues: FormValues = {
    utenlandskNæring: [],
};

const UtenlandskNæringExample = () => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<UtenlandskNæring> | undefined>(undefined);
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
                            <TypedFormikForm<FormValues, ValidationError>
                                includeButtons={true}
                                submitButtonLabel="Valider skjema"
                                formErrorHandler={getFormErrorHandler(intl)}>
                                <UtenlandskNæringListAndDialog
                                    name={FormField.utenlandskNæring}
                                    validate={getListValidator({ required: true })}
                                    labels={{
                                        addLabel: 'Legg til næringsvirksomhet i et annet EØS-land',
                                        deleteLabel: 'Fjern',
                                        editLabel: 'Endre',
                                        infoTitle: 'Virksomhet',
                                        modalTitle: 'Virksomhet',
                                    }}
                                />
                            </TypedFormikForm>
                        );
                    }}
                />
                <SubmitPreview values={listFormValues} />
            </Panel>

            <Box margin="xxl" padBottom="l">
                <FormValidationErrorMessages
                    validationErrorIntlKeys={flat(UtenlandskNæringFormErrors)}
                    intlMessages={utenlandskNæringMessages}
                />
            </Box>

            <Box margin="xxl" padBottom="l">
                <Undertittel>Kun dialog</Undertittel>
            </Box>

            <DialogFormWrapper>
                <Panel border={true}>
                    <UtenlandskNæringForm
                        utenlandskNæring={initialValues.utenlandskNæring[0]}
                        onSubmit={setSingleFormValues}
                        onCancel={() => console.log('cancel me')}
                    />
                    <SubmitPreview values={singleFormValues} />
                </Panel>
            </DialogFormWrapper>

            <MessagesPreview messages={utenlandskNæringMessages} showExplanation={false} />
        </>
    );
};

export default UtenlandskNæringExample;

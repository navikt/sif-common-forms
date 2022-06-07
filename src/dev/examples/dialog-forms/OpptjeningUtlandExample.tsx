import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import { date1YearAgo, date1YearFromNow } from '@navikt/sif-common-core/lib/utils/dateUtils';
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
import { OpptjeningUtland } from '../../../forms/opptjening-utland';
import OpptjeningUtlandListAndDialog from '../../../forms/opptjening-utland/OpptjeningUtlandListAndDialog';
import OpptjeningUtlandForm, {
    OpptjeningUtlandFormErrors,
} from '../../../forms/opptjening-utland/OpptjeningUtlandForm';
import opptjeningUtlandMessages from '../../../forms/opptjening-utland/opptjeningUtlandMessages';

enum FormField {
    'opptjeningUtland' = 'opptjeningUtland',
}

interface FormValues {
    [FormField.opptjeningUtland]: OpptjeningUtland[];
}
const initialValues: FormValues = {
    opptjeningUtland: [],
};

const OpptjeningUtlandExample = () => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<OpptjeningUtland> | undefined>(undefined);
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
                                <OpptjeningUtlandListAndDialog
                                    minDate={date1YearAgo}
                                    maxDate={date1YearFromNow}
                                    name={FormField.opptjeningUtland}
                                    validate={getListValidator({ required: true })}
                                    labels={{
                                        addLabel: 'Legg til jobb i annet EØS-land',
                                        listTitle: 'Registrert jobb i annet EØS-land',
                                        modalTitle: 'Jobb i annet EØS-land',
                                        emptyListText: 'Ingen jobb i annet EØS-land er lagt til',
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
                    validationErrorIntlKeys={flat(OpptjeningUtlandFormErrors)}
                    intlMessages={opptjeningUtlandMessages}
                />
            </Box>

            <Box margin="xxl" padBottom="l">
                <Undertittel>Kun dialog</Undertittel>
            </Box>

            <DialogFormWrapper>
                <Panel border={true}>
                    <OpptjeningUtlandForm
                        opptjening={initialValues.opptjeningUtland[0]}
                        minDate={date1YearAgo}
                        maxDate={date1YearFromNow}
                        onSubmit={setSingleFormValues}
                        onCancel={() => console.log('cancel me')}
                    />
                    <SubmitPreview values={singleFormValues} />
                </Panel>
            </DialogFormWrapper>

            <MessagesPreview messages={opptjeningUtlandMessages} showExplanation={false} />
        </>
    );
};

export default OpptjeningUtlandExample;

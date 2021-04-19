import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import { date1YearAgo, date1YearFromNow } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    getFieldErrorRenderer,
    getSummaryFieldErrorRenderer,
} from '@navikt/sif-common-core/lib/validation/renderUtils';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import Panel from 'nav-frontend-paneler';
import 'nav-frontend-tabs-style';
import { Undertittel } from 'nav-frontend-typografi';
import BostedUtlandForm from '../../../forms/bosted-utland/BostedUtlandForm';
import BostedUtlandListAndDialog from '../../../forms/bosted-utland/BostedUtlandListAndDialog';
import bostedUtlandMessages from '../../../forms/bosted-utland/bostedUtlandMessages';
import { BostedUtland } from '../../../forms/bosted-utland/types';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';

enum FormField {
    'bosted' = 'bosted',
}

interface FormValues {
    [FormField.bosted]: BostedUtland[];
}
const initialValues: FormValues = { bosted: [] };

const FormikExample = () => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<BostedUtland> | undefined>(undefined);
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
                                fieldErrorRenderer={getFieldErrorRenderer(intl, 'bostedUtlandForm')}
                                summaryFieldErrorRenderer={getSummaryFieldErrorRenderer(intl, 'bostedUtlandForm')}>
                                <BostedUtlandListAndDialog<FormField>
                                    name={FormField.bosted}
                                    minDate={date1YearAgo}
                                    maxDate={date1YearFromNow}
                                    validate={getListValidator({ required: true })}
                                    labels={{
                                        addLabel: 'Legg til bosted',
                                        listTitle: 'Registrerte bosteder',
                                        modalTitle: 'Bosted',
                                        emptyListText: 'Ingen bosteder er lagt til',
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

            <Box margin="xxl" padBottom="l">
                <DialogFormWrapper>
                    <Panel border={true}>
                        <BostedUtlandForm
                            minDate={date1YearAgo}
                            maxDate={date1YearFromNow}
                            onSubmit={setSingleFormValues}
                            onCancel={() => console.log('cancel me')}
                        />
                    </Panel>
                    <SubmitPreview values={singleFormValues} />
                </DialogFormWrapper>
            </Box>

            <MessagesPreview messages={bostedUtlandMessages} showExplanation={false} />
        </>
    );
};

export default FormikExample;

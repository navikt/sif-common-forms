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
import AnnetBarnForm from '../../../forms/annet-barn/AnnetBarnForm';
import { AnnetBarn } from '../../../forms/annet-barn/types';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import annetBarnMessages from '../../../forms/annet-barn/annetBarnMessages';
import AnnetBarnListAndDialog from '../../../forms/annet-barn/AnnetBarnListAndDialog';
import { dateToday, date4YearsAgo } from '@navikt/sif-common-core/lib/utils/dateUtils';

enum FormField {
    'annetBarn' = 'annetBarn',
}

interface FormValues {
    [FormField.annetBarn]: AnnetBarn[];
}
const initialValues: FormValues = { annetBarn: [] };

const AnnetBarnExample = () => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<AnnetBarn> | undefined>(undefined);
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
                                <AnnetBarnListAndDialog<FormField>
                                    name={FormField.annetBarn}
                                    validate={validateRequiredList}
                                    labels={{
                                        addLabel: 'Legg til barn',
                                        listTitle: 'Registrerte barn',
                                        modalTitle: 'Legg til barn',
                                        emptyListText: 'Ingen barn er lagt til',
                                    }}
                                    minDate={date4YearsAgo}
                                    maxDate={dateToday}
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
                    <AnnetBarnForm
                        annetBarn={{}}
                        onSubmit={setSingleFormValues}
                        onCancel={() => console.log('cancel me')}
                        minDate={date4YearsAgo}
                        maxDate={dateToday}
                    />
                </Panel>
                <SubmitPreview values={singleFormValues} />
            </DialogFormWrapper>

            <MessagesPreview messages={annetBarnMessages} showExplanation={false} />
        </>
    );
};

export default AnnetBarnExample;

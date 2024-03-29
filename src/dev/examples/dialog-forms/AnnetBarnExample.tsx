import React, { useState } from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import MessagesPreview from '@navikt/sif-common-core/lib/dev-utils/intl/messages-preview/MessagesPreview';
import { date4YearsAgo, dateToday } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import { getListValidator } from '@navikt/sif-common-formik/lib/validation';
import flatten from 'flat';
import Panel from 'nav-frontend-paneler';
import 'nav-frontend-tabs-style';
import { Undertittel } from 'nav-frontend-typografi';
import AnnetBarnForm, { AnnetBarnFormErrors } from '../../../forms/annet-barn/AnnetBarnForm';
import AnnetBarnListAndDialog from '../../../forms/annet-barn/AnnetBarnListAndDialog';
import annetBarnMessages from '../../../forms/annet-barn/annetBarnMessages';
import { AnnetBarn } from '../../../forms/annet-barn/types';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';
import FormValidationErrorMessages from '../../components/validation-error-messages/ValidationErrorMessages';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';

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
    const visBarnTypeValg = true;
    const annetBarn = listFormValues?.[FormField.annetBarn];
    const disallowedFødselsnumre = annetBarn ? annetBarn.map((barn) => barn.fnr) : undefined;

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
                                submitButtonLabel="Valider skjema">
                                <AnnetBarnListAndDialog<FormField>
                                    name={FormField.annetBarn}
                                    validate={getListValidator({ required: true })}
                                    labels={{
                                        addLabel: 'Legg til barn',
                                        listTitle: 'Registrerte barn',
                                        modalTitle: 'Legg til barn',
                                        emptyListText: 'Ingen barn er lagt til',
                                    }}
                                    minDate={date4YearsAgo}
                                    maxDate={dateToday}
                                    visBarnTypeValg={visBarnTypeValg}
                                    disallowedFødselsnumre={disallowedFødselsnumre}
                                />
                            </TypedFormikForm>
                        );
                    }}
                />
                <SubmitPreview values={listFormValues} />
            </Panel>
            <Box margin="xxl" padBottom="l">
                <FormValidationErrorMessages
                    validationErrorIntlKeys={flatten(AnnetBarnFormErrors)}
                    formName={'annetBarn'}
                    intlMessages={annetBarnMessages}
                />
            </Box>
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

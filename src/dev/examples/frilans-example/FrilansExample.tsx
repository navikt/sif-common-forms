import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { TypedFormikForm, TypedFormikWrapper } from '@navikt/sif-common-formik/lib';
import DialogFormWrapper from '@navikt/sif-common-formik/lib/components/formik-modal-form-and-list/dialog-form-wrapper/DialogFormWrapper';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import Box from '@navikt/sif-common/lib/common/components/box/Box';
import {
    commonFieldErrorRenderer
} from '@navikt/sif-common/lib/common/utils/commonFieldErrorRenderer';
import { date1YearAgo, date1YearFromNow } from '@navikt/sif-common/lib/common/utils/dateUtils';
import { validateRequiredList } from '@navikt/sif-common/lib/common/validation/fieldValidations';
import FrilansoppdragForm from '../../../forms/frilans/FrilansoppdragForm';
import FrilansoppdragListAndDialog from '../../../forms/frilans/FrilansoppdragListAndDialog';
import { mapFrilansOppdragToApiData } from '../../../forms/frilans/mapFrilansOppdragToApiData';
import { Frilansoppdrag, isFrilansoppdrag } from '../../../forms/frilans/types';
import PageIntro from '../../components/page-intro/PageIntro';
import SubmitPreview from '../../components/submit-preview/SubmitPreview';

interface Props {}

enum FormField {
    'frilansoppdrag' = 'frilansoppdrag'
}

interface FormValues {
    [FormField.frilansoppdrag]: Frilansoppdrag[];
}
const initialValues: FormValues = { frilansoppdrag: [] };

const FrilansExample: React.FunctionComponent<Props> = (props) => {
    const [singleFormValues, setSingleFormValues] = useState<Partial<Frilansoppdrag> | undefined>(undefined);
    const [listFormValues, setListFormValues] = useState<Partial<FormValues> | undefined>(undefined);
    const intl = useIntl();

    return (
        <>
            <PageIntro title="Frilans">Skjema som brukes for på registrere ett frilansoppdrag</PageIntro>
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
                                <FrilansoppdragListAndDialog<FormField>
                                    name={FormField.frilansoppdrag}
                                    validate={validateRequiredList}
                                    minDate={date1YearAgo}
                                    maxDate={date1YearFromNow}
                                    labels={{
                                        addLabel: 'Legg til',
                                        listTitle: 'Frilansoppdrag',
                                        modalTitle: 'Frilansoppdrag'
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
            <DialogFormWrapper width="wide">
                <Panel border={true}>
                    <FrilansoppdragForm
                        minDate={date1YearAgo}
                        maxDate={date1YearFromNow}
                        onCancel={() => console.log('cancel me')}
                        onSubmit={(values) => setSingleFormValues(values)}
                    />
                    <Box margin="l">
                        <SubmitPreview values={singleFormValues} />
                    </Box>
                    <Box margin="xl">
                        <Undertittel>API-data</Undertittel>
                        <SubmitPreview
                            values={
                                singleFormValues && isFrilansoppdrag(singleFormValues)
                                    ? mapFrilansOppdragToApiData(singleFormValues)
                                    : undefined
                            }
                        />
                    </Box>
                </Panel>
            </DialogFormWrapper>
        </>
    );
};

export default FrilansExample;

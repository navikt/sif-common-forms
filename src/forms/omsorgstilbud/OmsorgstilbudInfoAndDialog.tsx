import React from 'react';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import OmsorgstilbudForm from './OmsorgstilbudForm';
import OmsorgstilbudInfo from './OmsorgstilbudInfo';
import { OmsorgstilbudDag } from './types';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    fraDato: Date;
    tilDato: Date;
    onAfterChange?: (omsorgsdager: OmsorgstilbudDag[]) => void;
}

function OmsorgstilbudInfoAndDialog<FieldNames>({
    name,
    fraDato,
    tilDato,
    labels,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    return (
        <FormikModalFormAndInfo<FieldNames, OmsorgstilbudDag[], ValidationError>
            name={name}
            validate={validate}
            labels={labels}
            renderEditButtons={true}
            renderDeleteButton={false}
            dialogClassName={'omsorgstilbudDialog'}
            wrapInfoInPanel={false}
            formRenderer={({ onSubmit, onCancel, data = [] }) => {
                return (
                    <OmsorgstilbudForm
                        fraDato={fraDato}
                        tilDato={tilDato}
                        omsorgsdager={data}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data }) => {
                return <OmsorgstilbudInfo omsorgsdager={data} fraDato={fraDato} tilDato={tilDato} />;
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudInfoAndDialog;

import React from 'react';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import OmsorgstilbudForm from './OmsorgstilbudForm';
import OmsorgstilbudInfo from './OmsorgstilbudInfo';
import { Omsorgsdag } from './types';
import { filterDagerIPeriode } from './omsorgstilbudUtils';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    fraDato: Date;
    tilDato: Date;
    omsorgsdager: Omsorgsdag[];
    onAfterChange?: (omsorgsdager: Omsorgsdag[]) => void;
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
        <FormikModalFormAndInfo<FieldNames, Omsorgsdag[], ValidationError>
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
                        omsorgsdager={filterDagerIPeriode(data, fraDato, tilDato)}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data }) => {
                return (
                    <OmsorgstilbudInfo
                        omsorgsdager={filterDagerIPeriode(data, fraDato, tilDato)}
                        fraDato={fraDato}
                        tilDato={tilDato}
                    />
                );
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudInfoAndDialog;

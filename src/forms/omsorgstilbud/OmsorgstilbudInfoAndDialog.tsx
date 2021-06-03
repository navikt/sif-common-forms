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
    alleOmsorgsdager: OmsorgstilbudDag[];
    indexFørsteDagIPeriode: number;
    onAfterChange?: (omsorgsdager: OmsorgstilbudDag[]) => void;
}

function OmsorgstilbudInfoAndDialog<FieldNames>({
    name,
    fraDato,
    tilDato,
    indexFørsteDagIPeriode,
    alleOmsorgsdager,
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
            formRenderer={({ onSubmit, onCancel }) => {
                return (
                    <OmsorgstilbudForm
                        fraDato={fraDato}
                        tilDato={tilDato}
                        alleOmsorgsdager={alleOmsorgsdager}
                        indexFørsteDagIPeriode={indexFørsteDagIPeriode}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={() => {
                return <OmsorgstilbudInfo alleOmsorgsdager={alleOmsorgsdager} fraDato={fraDato} tilDato={tilDato} />;
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudInfoAndDialog;

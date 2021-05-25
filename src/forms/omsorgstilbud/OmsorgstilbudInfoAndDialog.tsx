import React from 'react';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { datoErIPeriode } from '../../dev/examples/omsorgstilbud-example/OmsorgstilbudExample';
import OmsorgstilbudForm from './OmsorgstilbudForm';
import OmsorgstilbudInfo from './OmsorgstilbudInfo';
import { Omsorgsdag } from './types';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    fraDato: Date;
    tilDato: Date;
    omsorgsdager: Omsorgsdag[];
    onAfterChange?: (omsorgsdager: Omsorgsdag[]) => void;
}

const filterDagerIPeriode = (data: Omsorgsdag[], fraDato: Date, tilDato: Date): Omsorgsdag[] =>
    data.filter((dag) => datoErIPeriode(dag.dato, { from: fraDato, to: tilDato }));

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

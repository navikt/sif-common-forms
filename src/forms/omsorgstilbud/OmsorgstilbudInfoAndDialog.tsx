import React from 'react';
import {
    FormikModalFormAndInfo,
    ModalFormAndInfoLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import OmsorgstilbudForm, { getDatoerForOmsorgstilbudPeriode } from './OmsorgstilbudForm';
import OmsorgstilbudInfo from './OmsorgstilbudInfo';
import { OmsorgstilbudDag } from './types';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import dayjs from 'dayjs';
import { getOmsorgsdagerIPeriode } from './omsorgstilbudUtils';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndInfoLabels;
    fraDato: Date;
    tilDato: Date;
    søknadsperiode: DateRange;
    omsorgsdager: OmsorgstilbudDag[];
    onAfterChange?: (omsorgsdager: OmsorgstilbudDag[]) => void;
}

function OmsorgstilbudInfoAndDialog<FieldNames>({
    name,
    fraDato,
    tilDato,
    omsorgsdager,
    søknadsperiode,
    labels,
    validate,
    onAfterChange,
}: Props<FieldNames>) {
    const gjeldendePeriodeForSkjema: DateRange = { from: fraDato, to: tilDato };
    return (
        <FormikModalFormAndInfo<FieldNames, OmsorgstilbudDag[], ValidationError>
            name={name}
            validate={validate}
            labels={labels}
            renderEditButtons={true}
            renderDeleteButton={false}
            dialogClassName={'omsorgstilbudDialog'}
            wrapInfoInPanel={false}
            formRenderer={({ onSubmit, onCancel, data }) => {
                /**
                 * Det er kun én formik-variabel for omsorgstilbud-dager, mens denne dialogen endrer og viser
                 * dager for en måned. Derfor må vi kun oppdatere dager i perioden definert gjennom fraDato og tilDato.
                 */
                const doSubmit = (dager: OmsorgstilbudDag[]) => {
                    const formValue = [...omsorgsdager];
                    const datoer = getDatoerForOmsorgstilbudPeriode(søknadsperiode.from, søknadsperiode.to);
                    dager?.forEach((dag) => {
                        const index = datoer.findIndex((d) => dayjs(d.dato).isSame(dag.dato, 'day'));
                        if (index >= 0) {
                            formValue[index] = { ...dag };
                        }
                    });
                    onSubmit(formValue);
                };
                return (
                    <OmsorgstilbudForm
                        fraDato={fraDato}
                        tilDato={tilDato}
                        omsorgsdager={getOmsorgsdagerIPeriode(data || [], gjeldendePeriodeForSkjema)}
                        onSubmit={doSubmit}
                        onCancel={onCancel}
                    />
                );
            }}
            infoRenderer={({ data }) => {
                const dagerIPerioden = getOmsorgsdagerIPeriode(data, gjeldendePeriodeForSkjema);
                return <OmsorgstilbudInfo omsorgsdager={dagerIPerioden} fraDato={fraDato} tilDato={tilDato} />;
            }}
            onAfterChange={onAfterChange}
        />
    );
}

export default OmsorgstilbudInfoAndDialog;

import React from 'react';
import {
    FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels
} from '@navikt/sif-common-formik';
import { sortItemsByFom } from '@navikt/sif-common/lib/common/utils/dateUtils';
import FrilansoppdragForm from './FrilansoppdragForm';
import FrilansoppdragListe from './FrilansoppdragListe';
import { Frilansoppdrag } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
}

function FrilansoppdragListAndDialog<FieldNames>({ name, minDate, maxDate, validate, labels }: Props<FieldNames>) {
    return (
        <FormikModalFormAndList<FieldNames, Frilansoppdrag>
            name={name}
            labels={labels}
            validate={validate}
            dialogWidth="narrow"
            sortFunc={sortItemsByFom}
            formRenderer={({ onSubmit, onCancel, item }) => (
                <FrilansoppdragForm
                    oppdrag={item}
                    minDate={minDate}
                    maxDate={maxDate}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                />
            )}
            listRenderer={({ items, onEdit, onDelete }) => (
                <FrilansoppdragListe oppdrag={items} onEdit={onEdit} onDelete={onDelete} />
            )}
        />
    );
}

export default FrilansoppdragListAndDialog;

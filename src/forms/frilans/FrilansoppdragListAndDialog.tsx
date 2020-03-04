import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels
} from '@navikt/sif-common-formik';
import FrilansoppdragForm from './FrilansoppdragForm';
import FrilansoppdragList from './FrilansoppdragList';
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
                <FrilansoppdragList oppdrag={items} onEdit={onEdit} onDelete={onDelete} />
            )}
        />
    );
}

export default FrilansoppdragListAndDialog;

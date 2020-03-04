import React from 'react';
import {
    FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels
} from '@navikt/sif-common-formik';
import { sortItemsByFom } from '@navikt/sif-common/lib/common/utils/dateUtils';
import FerieuttakForm from './FerieuttakForm';
import FerieuttakList from './FerieuttakList';
import { Ferieuttak } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
}

function FerieuttakListAndDialog<FieldNames>({ name, minDate, maxDate, validate, labels }: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, Ferieuttak>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={sortItemsByFom}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <FerieuttakForm
                        ferieuttak={item}
                        minDate={minDate}
                        maxDate={maxDate}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <FerieuttakList ferieuttak={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default FerieuttakListAndDialog;

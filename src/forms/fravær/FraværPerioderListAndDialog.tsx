import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import { DateRangeToDisable, FraværPeriode } from './types';
import FraværPeriodeForm from './FraværPeriodeForm';
import FraværPerioderList from './FraværPerioderList';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    minDate: Date;
    maxDate: Date;
    dateRangesToDisable?: DateRangeToDisable[];
    helgedagerIkkeTillat?: boolean;
    labels: ModalFormAndListLabels;
}

function FraværPerioderListAndDialog<FieldNames>({ name, minDate, maxDate, dateRangesToDisable, validate, labels, helgedagerIkkeTillat }: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, FraværPeriode>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={sortItemsByFom}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <FraværPeriodeForm
                        fraværPeriode={item}
                        minDate={minDate}
                        maxDate={maxDate}
                        dateRangesToDisable={dateRangesToDisable}
                        helgedagerIkkeTillat={helgedagerIkkeTillat}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <FraværPerioderList fraværPerioder={items} onEdit={onEdit} onDelete={onDelete}/>
                )}
            />
        </>
    );
}

export default FraværPerioderListAndDialog;

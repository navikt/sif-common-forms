import React from 'react';
import { DateRange, sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import { FraværPeriode } from './types';
import FraværPeriodeForm, { FraværPeriodeFormLabels } from './FraværPeriodeForm';
import FraværPerioderList from './FraværPerioderList';

interface Props<FieldNames> {
    name: FieldNames;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
    validate?: FormikValidateFunction;
    dateRangesToDisable?: DateRange[];
    helgedagerIkkeTillat?: boolean;
    fraværPeriodeFormLabels?: Partial<FraværPeriodeFormLabels>;
}

function FraværPerioderListAndDialog<FieldNames>({
    name,
    minDate,
    maxDate,
    dateRangesToDisable,
    validate,
    labels,
    helgedagerIkkeTillat,
    fraværPeriodeFormLabels,
}: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, FraværPeriode>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={(fraværPeriodeA: FraværPeriode, fraværPeriodeB: FraværPeriode) =>
                    sortItemsByFom({ fom: fraværPeriodeA.from }, { fom: fraværPeriodeB.from })
                }
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <FraværPeriodeForm
                        fraværPeriode={item}
                        minDate={minDate}
                        maxDate={maxDate}
                        dateRangesToDisable={dateRangesToDisable}
                        helgedagerIkkeTillat={helgedagerIkkeTillat}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        labels={fraværPeriodeFormLabels}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <FraværPerioderList fraværPerioder={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default FraværPerioderListAndDialog;

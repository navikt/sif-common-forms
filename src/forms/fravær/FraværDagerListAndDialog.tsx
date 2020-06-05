import React from 'react';
import { sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import { FraværDag, FraværDateRange } from './types';
import FraværDagFormView, { FraværDagFormLabels } from './FraværDagForm';
import FraværDagerList from './FraværDagerList';

interface Props<FieldNames> {
    name: FieldNames;
    validate?: FormikValidateFunction;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
    dateRangesToDisable?: FraværDateRange[];
    helgedagerIkkeTillatt?: boolean;
    fraværDagFormLabels?: Partial<FraværDagFormLabels>;
}

function FraværDagerListAndDialog<FieldNames>({
    name,
    minDate,
    maxDate,
    validate,
    labels,
    dateRangesToDisable,
    helgedagerIkkeTillatt,
    fraværDagFormLabels,
}: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, FraværDag>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={(fraværDagA: FraværDag, fraværDagB: FraværDag) =>
                    sortItemsByFom({ fom: fraværDagA.dato }, { fom: fraværDagB.dato })
                }
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <FraværDagFormView
                        fraværDag={item}
                        minDate={minDate}
                        maxDate={maxDate}
                        dateRangesToDisable={dateRangesToDisable}
                        helgedagerIkkeTillatt={helgedagerIkkeTillatt}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        labels={fraværDagFormLabels}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <FraværDagerList fraværDager={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default FraværDagerListAndDialog;

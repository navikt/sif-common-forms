import React from 'react';
import { DateRange, sortItemsByFom } from '@navikt/sif-common-core/lib/utils/dateUtils';
import {
    FormikModalFormAndList,
    ModalFormAndListLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import FraværPeriodeForm from './FraværPeriodeForm';
import FraværPerioderList from './FraværPerioderList';
import { FraværPeriode } from './types';

interface Props<FieldNames> extends TypedFormInputValidationProps {
    name: FieldNames;
    minDate: Date;
    maxDate: Date;
    labels: ModalFormAndListLabels;
    periodeDescription?: JSX.Element;
    formHeaderContent?: JSX.Element;
    dateRangesToDisable?: DateRange[];
    begrensTilSammeÅr?: boolean;
    helgedagerIkkeTillat?: boolean;
}

function FraværPerioderListAndDialog<FieldNames>({
    name,
    minDate,
    maxDate,
    dateRangesToDisable,
    periodeDescription,
    formHeaderContent,
    begrensTilSammeÅr = true,
    validate,
    labels,
    helgedagerIkkeTillat,
}: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, FraværPeriode>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                sortFunc={(fraværPeriodeA: FraværPeriode, fraværPeriodeB: FraværPeriode) =>
                    sortItemsByFom({ fom: fraværPeriodeA.fraOgMed }, { fom: fraværPeriodeB.tilOgMed })
                }
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <FraværPeriodeForm
                        fraværPeriode={item}
                        periodeDescription={periodeDescription}
                        minDate={minDate}
                        maxDate={maxDate}
                        headerContent={formHeaderContent}
                        dateRangesToDisable={dateRangesToDisable}
                        helgedagerIkkeTillat={helgedagerIkkeTillat}
                        begrensTilSammeÅr={begrensTilSammeÅr}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
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

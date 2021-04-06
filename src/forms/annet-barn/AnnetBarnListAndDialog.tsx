import React from 'react';
import { FormikModalFormAndList, FormikValidateFunction, ModalFormAndListLabels } from '@navikt/sif-common-formik';
import AnnetBarnForm from './AnnetBarnForm';
import AnnetBarnList from './AnnetBarnList';
import { AnnetBarn } from './types';

interface Props<FieldNames> {
    name: FieldNames;
    includeFødselsdatoSpørsmål?: boolean;
    validate?: FormikValidateFunction;
    labels: ModalFormAndListLabels;
    minDate: Date;
    maxDate: Date;
    aldersGrenseText?: string;
    placeholderFnr?: string;
    placeholderNavn?: string;
}

function AnnetBarnListAndDialog<FieldNames>({
    name,
    validate,
    labels,
    minDate,
    maxDate,
    aldersGrenseText,
    includeFødselsdatoSpørsmål = true,
    placeholderFnr,
    placeholderNavn,
}: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, AnnetBarn>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <AnnetBarnForm
                        annetBarn={item}
                        includeFødselsdatoSpørsmål={includeFødselsdatoSpørsmål}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        minDate={minDate}
                        maxDate={maxDate}
                        labels={{
                            aldersGrenseText: aldersGrenseText,
                            placeholderFnr: placeholderFnr,
                            placeholderNavn: placeholderNavn,
                        }}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <AnnetBarnList
                        annetBarn={items}
                        includeFødselsdato={includeFødselsdatoSpørsmål}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                )}
            />
        </>
    );
}

export default AnnetBarnListAndDialog;

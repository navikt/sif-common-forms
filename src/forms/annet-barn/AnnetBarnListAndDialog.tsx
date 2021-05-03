import React from 'react';
import {
    FormikModalFormAndList,
    ModalFormAndListLabels,
    TypedFormInputValidationProps,
} from '@navikt/sif-common-formik';
import AnnetBarnForm from './AnnetBarnForm';
import AnnetBarnList from './AnnetBarnList';
import { AnnetBarn } from './types';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';

interface Props<FieldNames> extends TypedFormInputValidationProps<FieldNames, ValidationError> {
    name: FieldNames;
    labels: ModalFormAndListLabels;
    minDate: Date;
    maxDate: Date;
    disallowedFødselsnumre?: string[];
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
    disallowedFødselsnumre,
    aldersGrenseText,
    placeholderFnr,
    placeholderNavn,
}: Props<FieldNames>) {
    return (
        <>
            <FormikModalFormAndList<FieldNames, AnnetBarn, ValidationError>
                name={name}
                labels={labels}
                dialogWidth="narrow"
                validate={validate}
                formRenderer={({ onSubmit, onCancel, item }) => (
                    <AnnetBarnForm
                        annetBarn={item}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        minDate={minDate}
                        maxDate={maxDate}
                        disallowedFødselsnumre={disallowedFødselsnumre}
                        labels={{
                            aldersGrenseText: aldersGrenseText,
                            placeholderFnr: placeholderFnr,
                            placeholderNavn: placeholderNavn,
                        }}
                    />
                )}
                listRenderer={({ items, onEdit, onDelete }) => (
                    <AnnetBarnList annetBarn={items} onEdit={onEdit} onDelete={onDelete} />
                )}
            />
        </>
    );
}

export default AnnetBarnListAndDialog;

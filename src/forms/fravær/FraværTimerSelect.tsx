import React from 'react';
import { FraværDagForm, FraværDagFormFields } from './FraværDagForm';
import { FormikValidateFunction } from '@navikt/sif-common-formik/lib';
import { timeText } from './fraværUtilities';

interface Props<> {
    name: FraværDagFormFields;
    validate: FormikValidateFunction;
    label?: string;
    maksTid?: number;
}

const getOptionsList: (maksTid: number) => JSX.Element[] = (maksTid: number) => {
    const newOptionElement = (t: number): JSX.Element => {
        // console.info("typeof t:" + typeof t);
        return (
            <option key={t} value={t}>
                {t.toString(10).replace('.', ',')} {timeText(t.toString(10))}
            </option>
        );
    };
    const go = (jsxList: JSX.Element[], tid: number): JSX.Element[] => {
        return tid >= maksTid
            ? [...jsxList, newOptionElement(tid)]
            : go([...jsxList, newOptionElement(tid)], tid + 0.5);
    };
    return go([], 0.5);
};

const FraværTimerSelect: React.FunctionComponent<Props> = ({ name, validate, label, maksTid }) => {
    return (
        <FraværDagForm.Select bredde="s" label={label || 'Antall timer'} name={name} validate={validate}>
            <option />
            {getOptionsList(maksTid || 7.5)}
        </FraværDagForm.Select>
    );
};

export default FraværTimerSelect;

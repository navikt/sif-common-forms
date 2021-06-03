import React from 'react';
import { useIntl } from 'react-intl';
import { useMediaQuery } from 'react-responsive';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import bemUtils from '@navikt/sif-common-core/lib/utils/bemUtils';
import { FormikTimeInput, getTypedFormComponents, Time } from '@navikt/sif-common-formik/lib';
import {
    isValidTime,
    TimeInputLayoutProps,
} from '@navikt/sif-common-formik/lib/components/formik-time-input/TimeInput';
import getTimeValidator from '@navikt/sif-common-formik/lib/validation/getTimeValidator';
import getFormErrorHandler from '@navikt/sif-common-formik/lib/validation/intlFormErrorHandler';
import { ValidationError } from '@navikt/sif-common-formik/lib/validation/types';
import { hasValue } from '@navikt/sif-common-formik/lib/validation/validationUtils';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import groupby from 'lodash.groupby';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { OmsorgstilbudDag } from './types';
import './omsorgstilbudForm.less';

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);

interface Props {
    omsorgsdager?: OmsorgstilbudDag[];
    fraDato: Date;
    tilDato: Date;
    onSubmit: (omsorgsdager: OmsorgstilbudDag[]) => void;
    onCancel?: () => void;
}

enum FormField {
    tidIOmsorg = 'tidIOmsorg',
}
interface FormValues {
    [FormField.tidIOmsorg]: Array<Partial<Time>>;
}

interface Daginfo {
    index: number;
    dato: Date;
    ukedag: number;
    årOgUke: string;
    ukenummer: number;
    år: number;
    label: string;
    labelFull: string;
    tid?: Time;
}

interface Ukeinfo {
    år: number;
    ukenummer: number;
    dager: Daginfo[];
}

// -- UTILS -----------------------------

export const getDatoerForOmsorgstilbudPeriode = (from: Date, to: Date): Daginfo[] => {
    const dager: Daginfo[] = [];
    let dayjsDato = dayjs(from);
    let index = 0;
    while (dayjsDato.isSameOrBefore(to, 'day')) {
        const ukedag = dayjsDato.isoWeekday();
        if (ukedag <= 5) {
            dager.push({
                index,
                dato: dayjsDato.toDate(),
                ukedag,
                ukenummer: dayjsDato.isoWeek(),
                år: dayjsDato.year(),
                årOgUke: `${dayjsDato.year()}.${dayjsDato.isoWeek()}`,
                label: `${dayjsDato.format('dddd').substring(0, 3)}. ${dayjsDato.format('DD.MM.YYYY')}`,
                labelFull: `${dayjsDato.format('dddd')} ${dayjsDato.format('DD. MMM')}`,
            });
            index++;
        }
        dayjsDato = dayjsDato.add(1, 'day');
    }
    return dager;
};

const getEmptyElements = (num: number): JSX.Element[] | undefined => {
    return num === 0
        ? undefined
        : Array.from({ length: num }).map((_, index) => React.createElement('span', { key: index }));
};

const getUker = (dager: Daginfo[]): Ukeinfo[] => {
    const ukerOgDager = groupby(dager, (dag) => dag.årOgUke);
    const uker = Object.keys(ukerOgDager).map((key): Ukeinfo => {
        const dagerIUke = ukerOgDager[key];
        return { år: dagerIUke[0].år, ukenummer: dagerIUke[0].ukenummer, dager: dagerIUke };
    });
    return uker;
};

const getInitialFormValues = (omsorgsdager: OmsorgstilbudDag[] = [], dagerIPerioden: Daginfo[]): FormValues => ({
    tidIOmsorg: dagerIPerioden.map((dag) => {
        const omsorgsdag = omsorgsdager?.find((od) => dayjs(od.dato).isSame(dag.dato, 'day'));
        return omsorgsdag ? omsorgsdag.tid : { hours: '', minutes: '' };
    }),
});

const getTimeInputLayout = (isNarrow: boolean, isWide: boolean): TimeInputLayoutProps => ({
    srOnlyLabels: false,
    justifyContent: 'right',
    layout: isNarrow ? 'compact' : isWide ? 'compact' : 'horizontalCompact',
});

const mapTidIOmsorgToOmsorgsdager = (tidIOmsorg: Array<Partial<Time>>, dager: Daginfo[]): OmsorgstilbudDag[] => {
    const omsorgsdager: OmsorgstilbudDag[] = [];
    tidIOmsorg?.forEach((tid, index) => {
        const dato = dager[index]?.dato;
        if (dato && tid && (hasValue(tid.hours) || hasValue(tid.minutes)) && isValidTime(tid)) {
            omsorgsdager.push({
                dato,
                tid,
            });
        }
    });
    return omsorgsdager;
};

const getTidIOmsorgValidator = (dag: Daginfo) => (tid: Time) => {
    const error = getTimeValidator({
        required: false,
        max: { hours: 7, minutes: 30 },
    })(tid);
    return error
        ? {
              key: `omsorgstilbud.validation.${error}`,
              values: {
                  dag: dag.labelFull,
                  maksTimer: 7,
              },
              keepKeyUnaltered: true,
          }
        : undefined;
};

// -- Component -----------------------------

const Form = getTypedFormComponents<FormField, FormValues, ValidationError>();

const bem = bemUtils('omsorgstilbudForm');

const OmsorgstilbudForm = ({ fraDato, tilDato, omsorgsdager, onSubmit, onCancel }: Props) => {
    const intl = useIntl();
    const isNarrow = useMediaQuery({ maxWidth: 400 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    const datoer = getDatoerForOmsorgstilbudPeriode(fraDato, tilDato);
    const uker = getUker(datoer);

    if (dayjs(fraDato).isAfter(tilDato)) {
        return <div>Fra dato er før til-dato</div>;
    }

    const onFormikSubmit = ({ tidIOmsorg = [] }: Partial<FormValues>) => {
        onSubmit(mapTidIOmsorgToOmsorgsdager(tidIOmsorg, datoer));
    };

    return (
        <Normaltekst tag="div" className={bem.block}>
            <Form.FormikWrapper
                initialValues={getInitialFormValues(omsorgsdager, datoer)}
                onSubmit={onFormikSubmit}
                renderForm={() => {
                    return (
                        <Form.Form
                            onCancel={onCancel}
                            formErrorHandler={getFormErrorHandler(intl, 'tidsperiodeForm')}
                            includeButtons={true}>
                            <Systemtittel tag="h1">Omsorgstilbud - {dayjs(fraDato).format('MMMM YYYY')}</Systemtittel>
                            <Box margin="l">
                                <p>
                                    Fyll ut antall timer og minutter de dagene barnet skal være i omsorgstilbud. Dager
                                    hvor barnet ikke skal være i omsorgstilbud, trenger du ikke fylle ut noe.
                                </p>
                                <p>
                                    <strong>Du kan registrere opp til 7 timer og 30 minutter på én dag.</strong>
                                </p>
                            </Box>
                            <div>
                                {uker.map((week) => {
                                    return (
                                        <Box key={week.ukenummer} margin="m">
                                            <OmsorgstilbudUkeForm
                                                fieldName={FormField.tidIOmsorg}
                                                ukeinfo={week}
                                                isNarrow={isNarrow}
                                                isWide={isWide}
                                            />
                                        </Box>
                                    );
                                })}
                            </div>
                        </Form.Form>
                    );
                }}
            />
        </Normaltekst>
    );
};

// -- Sub components -----------------------------

interface OmsorgstilbudInlineFormProps {
    fieldName: string;
    datoer: Daginfo[];
}

export const OmsorgstilbudInlineForm: React.FunctionComponent<OmsorgstilbudInlineFormProps> = ({
    fieldName,
    datoer,
}) => {
    const isNarrow = useMediaQuery({ maxWidth: 400 });
    const isWide = useMediaQuery({ minWidth: 1050 });
    const uker = getUker(datoer);

    return (
        <>
            {uker.map((week) => {
                return (
                    <Box key={week.ukenummer} margin="m">
                        <OmsorgstilbudUkeForm
                            fieldName={fieldName}
                            ukeinfo={week}
                            isNarrow={isNarrow}
                            isWide={isWide}
                        />
                    </Box>
                );
            })}
        </>
    );
};

// -- Sub components -----------------------------

interface OmsorgstilbudUkeFormProps {
    fieldName: string;
    ukeinfo: Ukeinfo;
    isNarrow: boolean;
    isWide: boolean;
}

const OmsorgstilbudUkeForm: React.FunctionComponent<OmsorgstilbudUkeFormProps> = ({
    fieldName,
    ukeinfo: { dager, ukenummer, år },
    isNarrow,
    isWide,
}) => {
    return (
        <ResponsivePanel className={bem.element('uke')}>
            <Undertittel className={bem.element('uke__tittel')}>
                Uke {ukenummer}, {år}
            </Undertittel>
            <div className={bem.element('uke__ukedager', isWide ? 'grid' : 'liste')}>
                {getEmptyElements(dager[0].ukedag - 1)}
                {dager.map((dag) => (
                    <div key={dag.dato.getTime()} className={bem.element('dag')}>
                        <FormikTimeInput
                            name={`${fieldName}.${dag.index}` as any}
                            label={<span className={bem.element('dag__label')}>{dag.label}</span>}
                            timeInputLayout={getTimeInputLayout(isNarrow, isWide)}
                            validate={getTidIOmsorgValidator(dag)}
                        />
                    </div>
                ))}
            </div>
        </ResponsivePanel>
    );
};

export default OmsorgstilbudForm;

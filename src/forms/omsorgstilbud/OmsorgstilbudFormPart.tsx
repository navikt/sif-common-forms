import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import { getDatoerForOmsorgstilbudPeriode } from './OmsorgstilbudForm';
import OmsorgstilbudInfoAndDialog from './OmsorgstilbudInfoAndDialog';
import { OmsorgstilbudDag, OmsorgstilbudPeriode, SkalHaOmsorgstilbudFormField } from './types';
import { getMonthsInDateRange } from './omsorgstilbudUtils';

interface Props {
    perioder: OmsorgstilbudPeriode[];
    dager: OmsorgstilbudDag[];
    søknadsperiode: DateRange;
    perioderFieldName: string;
    dagerFieldName: string;
}

const OmsorgstilbudFormPart: React.FunctionComponent<Props> = ({
    perioder,
    dager,
    perioderFieldName,
    dagerFieldName,
    søknadsperiode,
}) => {
    const omsorgstilbudDatoerISøknadsperiode = getDatoerForOmsorgstilbudPeriode(
        søknadsperiode.from,
        søknadsperiode.to,
        0
    );
    const måneder = getMonthsInDateRange(søknadsperiode);
    return (
        <>
            {måneder.map((periode, index) => {
                const { from, to } = periode;
                const mndOgÅr = dayjs(from).format('MMMM YYYY');
                const skalIOmsorgstilbud = perioder[index]?.skalHaOmsorgstilbud === YesOrNo.YES;
                const indexFørsteDagIPeriode = omsorgstilbudDatoerISøknadsperiode.findIndex((d) =>
                    dayjs(d.dato).isSame(from, 'day')
                );
                return (
                    <Box key={dayjs(from).format('MM.YYYY')} margin="xl">
                        <FormikYesOrNoQuestion
                            name={`${perioderFieldName}.${index}.${SkalHaOmsorgstilbudFormField.skalHaOmsorgstilbud}`}
                            legend={`Skal barnet i omsorgstilbud ${mndOgÅr}?`}
                        />
                        {skalIOmsorgstilbud && (
                            <FormBlock margin="l">
                                <ResponsivePanel className={'omsorgstilbudInfoDialogWrapper'}>
                                    <OmsorgstilbudInfoAndDialog
                                        name={dagerFieldName}
                                        fraDato={from}
                                        tilDato={to}
                                        alleOmsorgsdager={dager}
                                        indexFørsteDagIPeriode={indexFørsteDagIPeriode}
                                        labels={{
                                            addLabel: `Legg til timer`,
                                            deleteLabel: `Fjern alle timer`,
                                            editLabel: `Endre`,
                                            modalTitle: `Omsorgstilbud - ${mndOgÅr}`,
                                        }}
                                    />
                                </ResponsivePanel>
                            </FormBlock>
                        )}
                    </Box>
                );
            })}
        </>
    );
};

export default OmsorgstilbudFormPart;

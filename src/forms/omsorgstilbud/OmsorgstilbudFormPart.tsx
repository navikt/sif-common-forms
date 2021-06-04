import React from 'react';
import Box from '@navikt/sif-common-core/lib/components/box/Box';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import ResponsivePanel from '@navikt/sif-common-core/lib/components/responsive-panel/ResponsivePanel';
import { YesOrNo } from '@navikt/sif-common-core/lib/types/YesOrNo';
import { DateRange } from '@navikt/sif-common-core/lib/utils/dateUtils';
import { FormikYesOrNoQuestion } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import OmsorgstilbudInfoAndDialog from './OmsorgstilbudInfoAndDialog';
import { getMonthsInDateRange } from './omsorgstilbudUtils';
import { OmsorgstilbudDag, OmsorgstilbudMåned, SkalHaOmsorgstilbudFormField } from './types';

interface Props {
    måneder: OmsorgstilbudMåned[];
    dager: OmsorgstilbudDag[];
    søknadsperiode: DateRange;
    perioderFieldName: string;
    dagerFieldName: string;
}

const OmsorgstilbudFormPart: React.FunctionComponent<Props> = ({
    måneder,
    dager,
    perioderFieldName,
    dagerFieldName,
    søknadsperiode,
}) => {
    return (
        <>
            {getMonthsInDateRange(søknadsperiode).map((periode, index) => {
                const { from, to } = periode;
                const mndOgÅr = dayjs(from).format('MMMM YYYY');
                const skalIOmsorgstilbud = måneder[index]?.skalHaOmsorgstilbud === YesOrNo.YES;
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
                                        omsorgsdager={dager}
                                        søknadsperiode={søknadsperiode}
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

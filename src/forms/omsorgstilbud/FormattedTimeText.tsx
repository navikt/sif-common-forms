import React from 'react';
import { Time } from '@navikt/sif-common-formik/lib';

const FormattedTimeText = ({ time }: { time: Partial<Time> }): JSX.Element => {
    const timer = time.hours || '0';
    const minutter = time.minutes || '0';
    return (
        <>
            <span style={{ whiteSpace: 'nowrap' }}>{timer} tim.</span>
            {` `}
            <span style={{ whiteSpace: 'nowrap' }}>{minutter} min.</span>
        </>
    );
};

export default FormattedTimeText;

import { timeText } from '../fraværUtilities';

describe('timeText', () => {
    it('gir entall', () => {
        expect(timeText('0')).toEqual('time');
        expect(timeText('0.5')).toEqual('time');
        expect(timeText('1')).toEqual('time');
    });
    it('gir flertall', () => {
        expect(timeText('1.5')).toEqual('timer');
        expect(timeText('2')).toEqual('timer');
        expect(timeText('2.5')).toEqual('timer');
        expect(timeText('23.5')).toEqual('timer');
        expect(timeText('24')).toEqual('timer');
    });
});

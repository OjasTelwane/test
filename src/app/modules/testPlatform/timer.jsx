import React from 'react'
import { useTimer } from 'react-timer-hook';

const Timer = ({expiryTimestamp, onExpire}) => {
    const zeroPad = (num, places) => String(num).padStart(places, '0');

    const {
        seconds,
        minutes,
        hours
    } = useTimer({expiryTimestamp, onExpire: onExpire });

    return (
        <div>            
            <div style={{fontSize: '30px'}}>
                <span>{ zeroPad(hours, 2)}</span>:<span>{zeroPad(minutes, 2)}</span>:<span>{zeroPad(seconds, 2)}</span>
            </div>            
        </div>
    )
}

export default Timer;

import { useState, useEffect, useRef, useCallback } from 'react';

export const useInactivity = (timeoutMs: number = 20 * 60 * 1000) => { // Default to 20 minutes
    const [isInactive, setIsInactive] = useState(false);
    const isInactiveRef = useRef(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setIsInactive(true);
            isInactiveRef.current = true;
        }, timeoutMs);
    }, [timeoutMs]);

    const handleActivity = useCallback(() => {
        // If we are already inactive, do nothing. (Wait for explicit refresh)
        if (isInactiveRef.current) return;

        // Reset timer on activity
        startTimer();
    }, [startTimer]);

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

        const onEvent = () => handleActivity();

        events.forEach(event => {
            window.addEventListener(event, onEvent);
        });

        startTimer();

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, onEvent);
            });
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [handleActivity, startTimer]);

    return { isInactive };
};

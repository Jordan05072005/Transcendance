import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    phase: 'enter' | 'stay' | 'exit';
}

interface NotificationContextType {
    notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};

const NotificationItem: React.FC<{
    notif: Notification;
    onRemove: (id: number) => void;
    color: string;
}> = ({ notif, onRemove, color }) => {
    const [phase, setPhase] = useState<'enter' | 'stay' | 'exit'>('enter');

    useEffect(() => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const freq = notif.type === 'success' ? 600 : notif.type === 'error' ? 200 : 400;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.15);
    }, [notif.type]);

    useEffect(() => {
        const enterTimer = setTimeout(() => setPhase('stay'), 300);
        const exitTimer = setTimeout(() => setPhase('exit'), 2500);
        const removeTimer = setTimeout(() => onRemove(notif.id), 3000);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
            clearTimeout(removeTimer);
        };
    }, [notif.id, onRemove]);

    const getAnimation = () => {
        switch (phase) {
            case 'enter': return 'notif-slide-in 0.3s ease-out forwards';
            case 'exit': return 'notif-glitch-out 0.5s steps(5) forwards';
            default: return 'none';
        }
    };

    const getTextAnimation = () => {
        if (phase === 'enter') return 'notif-text-glitch 0.3s steps(3)';
        if (phase === 'exit') return 'notif-text-glitch 0.5s steps(5) infinite';
        return 'none';
    };

    return (
        <div
			className={`bg-black border-solid border-1 border-[${color}] text-${color} py-3 px-5 font-[Courier_New] font-mono text-[0.9rem] font-bold shadow-[0_0_20px_${color}/50] inset-shadow-[0_0_10px_${color}/20] max-w-[300px] animate-${getAnimation()} relative overflow-hidden`}
        >
            <span className={`animate-${getTextAnimation()}`}>
                {notif.type === 'error' && '⚠ '}
                {notif.type === 'success' && '✓ '}
                {notif.type === 'info' && '► '}
                {notif.message}
            </span>
            <div 
				className={`absolute top-0 left-0 right-0 bottom-0 bg-linear-90 from-transparent via-${color}/10 to-transparent animate-[notif-scan_1s_linear_infinite] pointer-events-none`}
			/>
        </div>
    );
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now() + Math.random();
        setNotifications(prev => [...prev, { id, message, type, phase: 'enter' }]);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const getColor = (type: string) => {
        switch (type) {
            case 'success': return '#33ff00';
            case 'error': return '#ff3333';
            default: return '#ffcc00';
        }
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}
            <div className="fixed top-[20px] right-[20px] z-200 flex flex-col gap-[10px]">
                {notifications.map(notif => (
                    <NotificationItem
                        key={notif.id}
                        notif={notif}
                        onRemove={removeNotification}
                        color={getColor(notif.type)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

import React, { type ReactNode, type CSSProperties } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    id?: string;
    style?: CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', id, style }) => {
    return (
        <div
            id={id}
            className={`relative bg-[rgba(10,10,10,0.85)] border border-[rgba(51,255,0,0.15)] p-10 shadow-[0_0_60px_rgba(0,0,0,1),0_0_15px_rgba(51,255,0,0.05)] z-10 overflow-hidden ${className}`}
            style={style}
        >
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-[15] opacity-[0.06] vhs-noise-bg"></div>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 scanlines-bg"></div>
            {children}
        </div>
    );
};

export default Card;

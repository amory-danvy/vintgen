import React from 'react';

export function VintGenIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Main Sparkle */}
            <path d="M12 2.5c0 4.5-4 8.5-8.5 8.5 4.5 0 8.5 4 8.5 8.5 0-4.5 4-8.5 8.5-8.5-4.5 0-8.5-4-8.5-8.5z" />
            {/* Bottom Left Circle */}
            <circle cx="5" cy="19" r="1.5" />
            {/* Top Right Plus */}
            <path d="M19 4v4m-2-2h4" />
        </svg>
    );
}

interface VintGenLogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
    showText?: boolean;
}

export function VintGenLogo({
    className = "",
    iconClassName = "w-8 h-8 text-vinted",
    textClassName = "text-xl font-bold tracking-tight text-foreground dark:text-white",
    showText = true
}: VintGenLogoProps) {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <VintGenIcon className={iconClassName} />
            {showText && <h1 className={textClassName}>VintGen</h1>}
        </div>
    );
}

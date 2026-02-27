'use client';

export default function HoyrLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const fontSize = size === 'sm' ? 'text-xl' : size === 'lg' ? 'text-4xl' : 'text-2xl';
    const circleSize = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;
    const strokeW = size === 'sm' ? 2.2 : size === 'lg' ? 3 : 2.5;
    const gap = size === 'sm' ? 'gap-[1px]' : size === 'lg' ? 'gap-[2px]' : 'gap-[1px]';

    return (
        <span className={`hoyr-logo group inline-flex items-center ${gap} cursor-pointer select-none`}>
            <span className={`${fontSize} font-semibold tracking-[0.08em] hoyr-text`} style={{ fontFamily: "var(--font-playfair), 'Georgia', serif" }}>
                H
            </span>
            {/* O with diagonal slash */}
            <svg
                width={circleSize}
                height={circleSize}
                viewBox="0 0 36 36"
                fill="none"
                className="inline-block relative"
                style={{ marginBottom: size === 'sm' ? '-1px' : size === 'lg' ? '-2px' : '-1px' }}
            >
                <ellipse cx="18" cy="18" rx="14" ry="15" strokeWidth={strokeW} className="hoyr-circle" fill="none" />
                <line x1="8" y1="28" x2="28" y2="8" strokeWidth={strokeW * 0.6} className="hoyr-circle" />
            </svg>
            <span className={`${fontSize} font-semibold tracking-[0.08em] hoyr-text`} style={{ fontFamily: "var(--font-playfair), 'Georgia', serif" }}>
                YR
            </span>
        </span>
    );
}

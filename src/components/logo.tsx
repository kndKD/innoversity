import React from "react";

interface LogoProps {
    className?: string; // Icon එකේ ප්‍රමාණය සහ පාට (Tailwind classes)
    showText?: boolean; // Innoversity අකුරු පෙළ අවශ්‍යද නැද්ද යන්න
    textColor?: string;
}

export function Logo({
    className = "w-8 h-8 text-indigo-600",
    showText = true,
    textColor = "text-slate-900 dark:text-white",
}: LogoProps) {
    return (
        <div className="flex items-center gap-2.5">
            {/* SVG Icon using currentColor */}
            <svg
                viewBox="0 0 100 100"
                fill="currentColor"
                className={className}
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Monogram Shape Path */}
                <path
                    d="M32 82C24 82 18 76 18 68V36C18 26 26 18 36 18C44 18 50 22 54 28L68 50L54 72C50 78 44 82 36 82H32ZM68 28C72 28 76 24 76 20C76 16 72 12 68 12C64 12 60 16 60 20C60 24 64 28 68 28ZM62 34V68C62 76 68 82 76 82C84 82 90 76 90 68V42L78 60H70L62 34Z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                />
            </svg>

            {showText && (
                <span className={`font-bold text-xl tracking-tight ${textColor}`}>
                    Innoversity
                </span>
            )}
        </div>
    );
}
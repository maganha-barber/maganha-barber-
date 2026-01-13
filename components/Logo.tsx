"use client";

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tesoura estilizada */}
      <path
        d="M30 20 L50 50 L30 80"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-500"
      />
      <path
        d="M70 20 L50 50 L70 80"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-amber-500"
      />
      {/* Círculo central */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="currentColor"
        className="text-amber-500"
      />
      {/* Linha decorativa */}
      <path
        d="M20 50 L30 50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-black"
      />
      <path
        d="M70 50 L80 50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-black"
      />
    </svg>
  );
}

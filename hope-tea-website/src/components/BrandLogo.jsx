import { Link } from "react-router-dom";

export function TeaSproutIcon({ size = 28, color = "#1e3b26" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      {/* Center upright leaf */}
      <path
        d="M16 4C16 4 19.5 10 19 16.5C18.5 22.5 16 26 16 26C16 26 13.5 22.5 13 16.5C12.5 10 16 4 16 4Z"
        fill={color}
      />
      {/* Left curved leaf */}
      <path
        d="M15 17C15 17 9 14 5 18C1.5 21.5 4 25.5 8 25C12 24.5 15 20 15 17Z"
        fill={color}
        opacity="0.9"
      />
      {/* Right curved leaf */}
      <path
        d="M17 17C17 17 23 14 27 18C30.5 21.5 28 25.5 24 25C20 24.5 17 20 17 17Z"
        fill={color}
        opacity="0.9"
      />
      {/* Stem */}
      <path
        d="M16 24V29"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BrandLogo({ light = false }) {
  const textColor = light ? "#ffffff" : "#1e3b26";
  const subColor = light ? "#b8cbbe" : "#5d6d60";
  const iconColor = light ? "#a8c5aa" : "#1e3b26";

  return (
    <Link to="/" className="brand-logo-container">
      <TeaSproutIcon size={30} color={iconColor} />
      <div className="brand-text-block">
        <span className="brand-primary-text" style={{ color: textColor }}>
          HOPE TEA ESTATE
        </span>
        <span className="brand-motto-text" style={{ color: subColor }}>
          A little peace in every cup.
        </span>
      </div>
    </Link>
  );
}


import React, { useEffect, useState } from 'react';

interface CountUpTextProps {
  value: string;
  numericTarget?: number;
  duration?: number; // ms
  className?: string;
}

export const CountUpText: React.FC<CountUpTextProps> = ({
  value,
  numericTarget,
  duration = 800,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value);

  useEffect(() => {
    // If not a number target, try to extract first number from value string
    const match = value.match(/([\d,.]+)/);
    const hasNumber = match && match[1];

    if (!hasNumber) {
      setDisplayValue(value);
      return;
    }

    const cleanNum = parseFloat(hasNumber.replace(/,/g, ''));
    if (isNaN(cleanNum)) {
      setDisplayValue(value);
      return;
    }

    const target = numericTarget !== undefined ? numericTarget : cleanNum;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index || 0) + match[1].length);

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      let formattedNumber: string;
      if (Number.isInteger(target)) {
        formattedNumber = Math.round(current).toLocaleString();
      } else {
        formattedNumber = current.toFixed(1);
      }

      setDisplayValue(`${prefix}${formattedNumber}${suffix}`);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, numericTarget, duration]);

  return <span className={`tabular-nums ${className}`}>{displayValue}</span>;
};

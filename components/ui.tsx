import React from 'react';
import { AspectRatio } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-darker";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 border border-transparent",
    secondary: "bg-surface text-gray-200 border border-slate-700 hover:bg-slate-700 hover:text-white",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </>
      ) : children}
    </button>
  );
};

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onChange }) => {
  const ratios: { value: AspectRatio; label: string; iconClass: string }[] = [
    { value: '1:1', label: 'Square', iconClass: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: '3:4', label: 'Portrait', iconClass: 'w-5 h-7 border-2 border-current rounded-sm' },
    { value: '4:3', label: 'Landscape', iconClass: 'w-7 h-5 border-2 border-current rounded-sm' },
    { value: '9:16', label: 'Mobile', iconClass: 'w-4 h-7 border-2 border-current rounded-sm' },
    { value: '16:9', label: 'Cinema', iconClass: 'w-7 h-4 border-2 border-current rounded-sm' },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {ratios.map((ratio) => (
        <button
          key={ratio.value}
          onClick={() => onChange(ratio.value)}
          className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 ${
            selected === ratio.value
              ? 'bg-primary/10 border-primary text-primary shadow-md shadow-primary/10'
              : 'bg-surface border-slate-700 text-gray-400 hover:border-slate-500 hover:text-gray-200'
          }`}
          title={ratio.label}
        >
          <div className={`flex items-center justify-center w-8 h-8`}>
             <div className={ratio.iconClass}></div>
          </div>
          <span className="text-xs font-medium">{ratio.value}</span>
        </button>
      ))}
    </div>
  );
};

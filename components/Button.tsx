import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-2xl font-bold transition-all duration-200 text-lg shadow-lg flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50 hover:shadow-indigo-900/70 border border-indigo-500/50",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 shadow-slate-900/50 border border-slate-600",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 border border-rose-500/50",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white shadow-none"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

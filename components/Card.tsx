import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-xl w-full max-w-md mx-auto ${className}`}>
      {children}
    </div>
  );
};

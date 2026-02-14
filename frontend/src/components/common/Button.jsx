import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  icon: Icon,
  fullWidth = false,
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    fontWeight: 'bold',
    borderRadius: '16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Syne, sans-serif',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
    },
    secondary: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#ffffff',
      boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
    },
    success: {
      background: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)',
      color: '#ffffff',
      boxShadow: '0 8px 32px rgba(5, 150, 105, 0.4)',
    },
    outline: {
      background: 'transparent',
      border: '2px solid rgba(16, 185, 129, 0.5)',
      color: '#10b981',
    },
  };

  const sizes = {
    sm: { padding: '10px 20px', fontSize: '0.9rem' },
    md: { padding: '14px 28px', fontSize: '1rem' },
    lg: { padding: '18px 36px', fontSize: '1.1rem' },
  };

  const buttonStyle = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
  };

  const hoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: variant === 'primary' 
      ? '0 16px 48px rgba(16, 185, 129, 0.6)' 
      : variant === 'secondary'
      ? '0 16px 48px rgba(245, 158, 11, 0.6)'
      : variant === 'success'
      ? '0 16px 48px rgba(5, 150, 105, 0.6)'
      : buttonStyle.boxShadow,
  };

  return (
    <motion.button
      type={type}
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      className={className}
      whileHover={disabled ? {} : hoverStyle}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      {...props}
    >
      {/* Shine effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          pointerEvents: 'none',
        }}
        animate={{
          left: ['100%', '100%', '-100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      />
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
      {children}
    </motion.button>
  );
};

export default Button;
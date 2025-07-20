import React from 'react';
import { motion } from 'framer-motion';

const Card = React.forwardRef(({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'default',
  ...props 
}, ref) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6', 
    lg: 'p-8'
  };

  const cardClasses = [
    'bg-white border border-gray-200 rounded-xl shadow-sm',
    hover && 'hover:shadow-md transition-all duration-200',
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  const MotionDiv = hover ? motion.div : 'div';
  const motionProps = hover ? {
    whileHover: { y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
    transition: { type: "spring", stiffness: 300 }
  } : {};

  return (
    <MotionDiv 
      ref={ref} 
      className={cardClasses} 
      {...motionProps} 
      {...props}
    >
      {children}
    </MotionDiv>
  );
});

const CardHeader = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`pb-4 ${className}`} {...props}>
    {children}
  </div>
));

const CardContent = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    {children}
  </div>
));

const CardFooter = React.forwardRef(({ className = '', children, ...props }, ref) => (
  <div ref={ref} className={`pt-4 border-t border-gray-100 ${className}`} {...props}>
    {children}
  </div>
));

Card.Header = CardHeader;
Card.Content = CardContent;  
Card.Footer = CardFooter;
Card.displayName = 'Card';

export default Card;

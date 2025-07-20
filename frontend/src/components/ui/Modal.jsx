import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Button from './Button';

function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className = ''
}) {
  const sizeClasses = {
    small: 'modal-small',
    medium: 'modal-medium',
    large: 'modal-large',
    fullscreen: 'modal-fullscreen'
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <motion.div
            className={`modal ${sizeClasses[size]} ${className}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            {(title || showCloseButton) && (
              <div className="modal-header">
                {title && <h2 className="modal-title">{title}</h2>}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={onClose}
                    className="modal-close-btn"
                    icon={X}
                    aria-label="Close modal"
                  />
                )}
              </div>
            )}

            {/* Modal Content */}
            <div className="modal-content">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

Modal.Header = ({ children, className = '' }) => (
  <div className={`modal-section-header ${className}`}>
    {children}
  </div>
);

Modal.Body = ({ children, className = '' }) => (
  <div className={`modal-section-body ${className}`}>
    {children}
  </div>
);

Modal.Footer = ({ children, className = '' }) => (
  <div className={`modal-section-footer ${className}`}>
    {children}
  </div>
);

export default Modal;

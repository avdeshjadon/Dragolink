import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TRANSITIONS } from '../../constants/motion';

export default function MotionModal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  footer,
  className = '',
  hideCloseButton = false
}) {
  
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const content = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.EASE_OUT}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md"
          />
          
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={TRANSITIONS.SPRING}
              className={`bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden w-full max-h-full flex flex-col pointer-events-auto min-h-0 ${className.includes('max-w-') ? '' : 'max-w-lg'} ${className}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || !hideCloseButton) && (
                <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20 shrink-0">
                  {title ? <h3 className="text-lg font-semibold text-on-surface">{title}</h3> : <div />}
                  {!hideCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-full transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              )}
              
              {/* Content */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 min-h-0">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-4 sm:px-6 py-4 border-t border-outline-variant/20 shrink-0 bg-surface-container-lowest flex items-center">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { TRANSITIONS, VARIANTS } from '../../constants/motion';
import AsyncButton from '../AsyncButton'; // Assuming AsyncButton is one level up or adjust import

export default function MotionAlert({ 
  isOpen, 
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  icon
}) {
  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={TRANSITIONS.EASE_OUT}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div
            variants={VARIANTS.SCALE_UP}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl flex flex-col items-center text-center z-10"
          >
            {icon && (
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                {icon}
              </div>
            )}
            
            <h3 className="text-xl font-headline-sm text-on-surface mb-2">{title}</h3>
            <p className="text-body-md text-on-surface-variant mb-8">{description}</p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-outline-variant/30 text-on-surface font-label-md hover:bg-surface-container transition-colors cursor-pointer"
              >
                {cancelText}
              </button>
              <AsyncButton 
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-lg font-label-md transition-colors shadow-sm cursor-pointer ${isDestructive ? 'bg-error text-white hover:bg-error/90' : 'bg-primary text-white hover:bg-primary/90'}`}
              >
                {confirmText}
              </AsyncButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(content, document.body);
}

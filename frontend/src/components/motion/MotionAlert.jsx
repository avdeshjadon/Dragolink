import React from 'react';
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
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={TRANSITIONS.EASE_OUT}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40"
          />
          
          <motion.div
            variants={VARIANTS.SCALE_UP}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl flex flex-col items-center text-center z-10"
          >
            {icon && (
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>
                {icon}
              </div>
            )}
            
            <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 mb-8">{description}</p>
            
            <div className="flex gap-3 w-full">
              <button 
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {cancelText}
              </button>
              <AsyncButton 
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-lg font-medium text-white transition-colors shadow-sm cursor-pointer ${isDestructive ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {confirmText}
              </AsyncButton>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

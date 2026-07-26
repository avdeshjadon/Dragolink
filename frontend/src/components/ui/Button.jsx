import * as React from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

const buttonVariants = {
  default: "bg-brand text-white hover:bg-brand-dark shadow-sm hover:shadow-md",
  destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  outline: "border border-border-light bg-transparent hover:bg-slate-50 text-slate-700",
  secondary: "bg-brand-emerald text-white hover:bg-green-600 shadow-sm",
  ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-700",
  link: "text-brand underline-offset-4 hover:underline",
};

const sizeVariants = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-12 rounded-lg px-8",
  icon: "h-10 w-10",
};

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", isLoading: externalLoading, onClick, children, type = "button", ...props }, ref) => {
    const [internalLoading, setInternalLoading] = React.useState(false);
    const isLoading = externalLoading !== undefined ? externalLoading : internalLoading;

    const handleClick = async (e) => {
      if (isLoading || props.disabled) {
        e.preventDefault();
        return;
      }
      
      if (onClick) {
        const result = onClick(e);
        if (result instanceof Promise) {
          setInternalLoading(true);
          try {
            await result;
          } finally {
            setInternalLoading(false);
          }
        }
      }
    };

    return (
      <motion.button
        ref={ref}
        type={type}
        whileTap={{ scale: isLoading || props.disabled ? 1 : 0.98 }}
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand overflow-hidden",
          isLoading ? "opacity-90 cursor-wait !pointer-events-none" : "cursor-pointer",
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        disabled={isLoading || props.disabled}
        onClick={handleClick}
        {...props}
      >
        <span className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          {children}
        </span>
        
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };

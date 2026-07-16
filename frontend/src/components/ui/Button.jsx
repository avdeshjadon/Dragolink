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
  ({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          buttonVariants[variant],
          sizeVariants[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button };

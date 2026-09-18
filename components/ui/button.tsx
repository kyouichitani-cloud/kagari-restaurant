import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-6 text-sm font-medium tracking-[0.04em] transition-[background-color,color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A16B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#081A2B] disabled:pointer-events-none disabled:opacity-45 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "border-[#6D1F36] bg-[#6D1F36] text-[#F3EEE5] hover:bg-[#7f2943]",
        ivory: "border-[#F3EEE5] bg-[#F3EEE5] text-[#081A2B] hover:bg-white",
        outline: "border-[#F3EEE5]/55 bg-[#081A2B]/55 text-[#F3EEE5] hover:border-[#F3EEE5] hover:bg-[#081A2B]",
        quiet: "border-[#C4A16B]/45 bg-transparent text-[#F3EEE5] hover:border-[#C4A16B] hover:bg-[#C4A16B]/10",
      },
      size: {
        default: "h-12",
        large: "min-h-14 px-7 text-[0.92rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

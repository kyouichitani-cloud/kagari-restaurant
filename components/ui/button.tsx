import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border px-6 text-sm font-medium tracking-[0.04em] transition-[background-color,color,border-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D8B46F] focus-visible:ring-offset-4 focus-visible:ring-offset-[#050A0F] disabled:pointer-events-none disabled:opacity-45 active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "border-[#6D1F36] bg-[#6D1F36] text-[#F3EEE5] hover:bg-[#7f2943]",
        ivory: "button-ivory border-[#F3EEE5]",
        outline: "border-[#F3EEE5]/55 bg-[#050A0F]/55 text-[#F3EEE5] hover:border-[#F3EEE5] hover:bg-[#050A0F]",
        quiet: "border-[#D8B46F]/45 bg-transparent text-[#F3EEE5] hover:border-[#D8B46F] hover:bg-[#D8B46F]/10",
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
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Component = asChild ? Slot : "button";
    const ivoryStyle: React.CSSProperties | undefined = variant === "ivory"
      ? { ...style, color: "#050A0F", WebkitTextFillColor: "#050A0F", backgroundColor: "#F3EEE5" }
      : style;
    return <Component ref={ref} className={cn(buttonVariants({ variant, size }), className)} style={ivoryStyle} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

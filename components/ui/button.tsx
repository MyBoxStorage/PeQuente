import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF0000] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[#FF0000] text-white hover:bg-[#ff3333] active:bg-[#CC0000] shadow-md hover:shadow-lg",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-md",
        outline:
          "border border-[#353535] bg-transparent hover:bg-[#2d2d2d] hover:border-[#252525] text-white",
        secondary:
          "bg-[#2d2d2d] text-white hover:bg-[#353535] active:bg-[#252525]",
        ghost: "hover:bg-[#2d2d2d] text-white active:bg-[#252525]",
        link: "text-[#FF0000] underline-offset-4 hover:text-[#ff3333] hover:underline active:text-[#CC0000]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

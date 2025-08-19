import { forwardRef,HTMLAttributes,ReactNode, } from "react"
import { cn } from "@/lib/utils"

// Simple fallback components to avoid Radix UI React hooks issues
const TooltipProvider = ({ children, ...props }: { children: ReactNode; delayDuration?: number }) => {
  return <>{children}</>
}

const Tooltip = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

const TooltipTrigger = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ children, ...props }, ref) => (
  <div ref={ref} {...props}>
    {children}
  </div>
))
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }

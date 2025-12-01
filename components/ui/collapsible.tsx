import * as React from "react"
import { cn } from "@/lib/utils"

type CollapsibleContextValue = {
  open: boolean
  toggle: () => void
}

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null)

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
}

const Collapsible = ({ defaultOpen = false, className, children, ...props }: CollapsibleProps) => {
  const [open, setOpen] = React.useState(defaultOpen)
  const toggle = React.useCallback(() => setOpen((o) => !o), [])

  return (
    <CollapsibleContext.Provider value={{ open, toggle }}>
      <div className={cn("rounded-md", className)} data-state={open ? "open" : "closed"} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(CollapsibleContext)
    return (
      <button
        type="button"
        ref={ref}
        onClick={ctx?.toggle}
        className={cn("flex w-full items-center justify-between px-3 py-3 text-lg font-semibold", className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(CollapsibleContext)
    if (!ctx?.open) return null
    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
          className
        )}
        data-state="open"
        {...props}
      >
        {children}
      </div>
    )
  }
)
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
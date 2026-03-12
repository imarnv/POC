import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
    ({ className, onCheckedChange, checked, id, ...props }, ref) => {
        return (
            <label
                htmlFor={id}
                className={cn(
                    "relative inline-flex h-6 w-11 cursor-pointer items-center rounded-full transition-colors",
                    checked ? "bg-primary" : "bg-muted-foreground/30",
                    className
                )}
            >
                <input
                    ref={ref}
                    id={id}
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    {...props}
                />
                <span
                    className={cn(
                        "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                        checked ? "translate-x-6" : "translate-x-1"
                    )}
                />
            </label>
        )
    }
)
Switch.displayName = "Switch"

export { Switch }

"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, ...props }, ref) => {
        return (
            <div className="relative flex items-center h-5 w-5">
                <input
                    type="checkbox"
                    className={cn(
                        "peer h-5 w-5 cursor-pointer appearance-none rounded border border-input bg-background transition-all hover:shadow-md checked:border-primary checked:bg-primary",
                        className
                    )}
                    ref={ref}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    {...props}
                />
                <span className="absolute text-primary-foreground opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <Check className="h-3.5 w-3.5 stroke-[3px]" />
                </span>
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

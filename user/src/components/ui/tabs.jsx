import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = ({ children, defaultValue, className, ...props }) => {
    const [value, setValue] = React.useState(defaultValue)
    return (
        <TabsContext.Provider value={{ value, setValue }}>
            <div className={cn("w-full", className)} {...props}>
                {children}
            </div>
        </TabsContext.Provider>
    )
}

const TabsContext = React.createContext({})

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, ...props }, ref) => {
    const { value: activeValue, setValue } = React.useContext(TabsContext)
    return (
        <button
            ref={ref}
            onClick={() => setValue(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                activeValue === value
                    ? "bg-background text-foreground shadow-sm"
                    : "hover:bg-background/50",
                className
            )}
            {...props}
        />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, ...props }, ref) => {
    const { value: activeValue } = React.useContext(TabsContext)
    if (activeValue !== value) return null
    return (
        <div
            ref={ref}
            className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
            {...props}
        />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }

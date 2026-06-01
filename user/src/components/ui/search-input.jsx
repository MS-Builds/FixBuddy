import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "../../lib/utils"

const SearchInput = React.forwardRef(({ className, wrapperClassName, ...props }, ref) => {
  return (
    <div className={cn("relative w-full group", wrapperClassName)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black" />
      <Input
        ref={ref}
        type="search"
        className={cn("pl-9 h-11 bg-card/50 backdrop-blur-sm transition-all focus-visible:ring-primary/20", className)}
        {...props}
      />
    </div>
  )
})
SearchInput.displayName = "SearchInput"

export { SearchInput }

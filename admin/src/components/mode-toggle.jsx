import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { Switch } from "./ui/switch"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-black p-1.5 border-2 border-black dark:border-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
      <Switch 
        id="admin-dark-mode" 
        checked={isDark}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-black data-[state=unchecked]:bg-zinc-200 border-black"
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-white" />
        ) : (
          <Sun className="h-3 w-3 text-black" />
        )}
      </Switch>
    </div>
  )
}

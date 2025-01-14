import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

const ThemeToggler = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)

    if (theme === "dark") {
      document.body.classList.add("dark")
      document.body.classList.remove("light")
    } else {
      document.body.classList.add("light")
      document.body.classList.remove("dark")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return (
    <div onClick={toggleTheme} className="cursor-pointer text-primary">
      {theme === "light" ? <Moon /> : <Sun />}
    </div>
  )
}

export default ThemeToggler

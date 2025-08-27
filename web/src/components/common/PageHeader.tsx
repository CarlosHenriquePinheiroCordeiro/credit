import React from "react"
import ThemeToggle from "./ThemeToggle"
import { useTheme } from "../../theme/ThemeProvider"
import logoLight from "../../assets/logo-light.png"
import logoDark from "../../assets/logo-dark.png"

type Props = {
  title?: string
  onLogoClick?: () => void
  height?: number
}

export default function PageHeader({
  title = "Listagem de Contratos",
  onLogoClick,
  height = 90,
}: Props) {
  const { isDark } = useTheme()

  return (
    <div className="w-full border-b border-border bg-card/70 backdrop-blur-sm">
      <div className="mx-auto max-w-full px-12 pb-4">
        <div
          className="grid grid-cols-[auto_1fr_auto] items-end gap-4"
          style={{ height }}
        >
          <button
            type="button"
            onClick={onLogoClick}
            className="place-self-end-start focus:outline-none rounded-md pb-1"
          >
            <img
              src={isDark ? logoDark : logoLight}
              alt="MyCred"
              style={{ height: Math.max(40, Math.min(height - 28, 64)) }} // 40–64px
              className="w-auto object-contain"
            />
          </button>

          <h1 className="justify-self-center text-center text-xl md:text-4xl font-semibold leading-none truncate pb-1">
            {title}
          </h1>

          <div className="justify-self-end pb-1">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

import React from 'react'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../../theme/ThemeProvider'
import logoLight from '../../assets/logo-light.png'
import logoDark from '../../assets/logo-dark.png'

type Props = {
  title?: string
  onLogoClick?: () => void
  height?: number
}

export default function PageHeader({
  title = 'Listagem de Contratos',
  onLogoClick,
  height = 90,
}: Props) {
  const { isDark } = useTheme()

  return (
    <div className="w-full border-b border-border bg-card/70 backdrop-blur-sm">
      <div className="mx-auto max-w-full px-12 pb-4">
        <div className="relative flex items-end" style={{ height }}>
          <div className="absolute left-0 bottom-0">
            <button
              type="button"
              onClick={onLogoClick}
              className="focus:outline-none rounded-md"
            >
              <img
                src={isDark ? logoDark : logoLight}
                alt="Meu Crediário"
                style={{ height: Math.max(40, Math.min(height - 28, 64)) }}
                className="w-auto object-contain"
              />
            </button>
          </div>

          <h1 className="absolute left-1/2 bottom-0 -translate-x-1/2 pb-1 text-center text-xl md:text-4xl font-semibold leading-none">
            {title}
          </h1>

          <div className="absolute right-0 bottom-0 pb-1">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

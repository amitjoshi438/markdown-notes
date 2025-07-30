import { Moon, Sun } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/contexts/ThemeContext'

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function ThemeToggle({ variant = 'ghost', size = 'sm', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`shrink-0 ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4" />
      ) : (
        <Sun className="w-4 h-4" />
      )}
    </Button>
  )
}
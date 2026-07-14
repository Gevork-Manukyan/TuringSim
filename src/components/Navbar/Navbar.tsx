import './Navbar.scss'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../lib/stores/useTheme'
import Logo from './Logo'

export default function Navbar() {
  const theme = useTheme(state => state.theme)
  const toggle = useTheme(state => state.toggle)

  return (
    <nav className='Navbar'>
      <span className="Navbar__brand">
        <Logo />
        <span className="Navbar__wordmark">Turing Sim</span>
      </span>
      <button
        className="Navbar__themeToggle"
        onClick={toggle}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  )
}

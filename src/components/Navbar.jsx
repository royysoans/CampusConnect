import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Calendar, Home, Shield, LogOut, Sparkles } from 'lucide-react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, isAdmin, signOut } = useAuth()
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    const navLinks = [
        { to: '/', label: 'Home', icon: Home },
        { to: '/calendar', label: 'Calendar', icon: Calendar },
    ]

    return (
        <nav className="sticky top-0 z-50 bg-paper border-b-4 border-charcoal-900 shadow-xl sm:transform sm:-rotate-1 relative overflow-hidden">
            {/* Visual texture overlay */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-campus-500 border-2 border-charcoal-900 flex items-center justify-center transform hover:rotate-12 transition-transform duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal-900" />
                        </div>
                        <span className="font-heading text-lg sm:text-2xl font-bold text-charcoal-900 tracking-wider transform rotate-1">
                            CampusConnect
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-4">
                        {navLinks.map(({ to, label, icon: Icon }) => (
                            <Link
                                key={to}
                                to={to}
                                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all duration-300 transform hover:-translate-y-1 ${isActive(to)
                                    ? 'text-charcoal-900 bg-tape-yellow -rotate-2 border-2 border-charcoal-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                    : 'text-charcoal-600 hover:text-charcoal-900 hover:rotate-2'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </Link>
                        ))}

                        {isAdmin ? (
                            <>
                                <Link
                                    to="/admin/dashboard"
                                    className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all duration-300 transform hover:-translate-y-1 ${isActive('/admin/dashboard')
                                        ? 'text-charcoal-900 bg-tape-yellow -rotate-2 border-2 border-charcoal-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                        : 'text-charcoal-600 hover:text-charcoal-900 hover:rotate-2'
                                        }`}
                                >
                                    <Shield className="w-4 h-4" />
                                    Dashboard
                                </Link>
                                <button
                                    onClick={signOut}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-coral-600 hover:text-coral-800 hover:underline transform hover:rotate-2 transition-all ml-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/admin/login"
                                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold transition-all duration-300 transform hover:-translate-y-1 ${isActive('/admin/login')
                                    ? 'text-charcoal-900 bg-tape-yellow -rotate-2 border-2 border-charcoal-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                    : 'text-charcoal-600 hover:text-charcoal-900 hover:rotate-2'
                                    }`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-charcoal-900 hover:bg-charcoal-200 rounded-lg transition-colors border-2 border-transparent hover:border-charcoal-900"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t-2 border-charcoal-900 bg-paper animate-in slide-in-from-top duration-200 shadow-xl">
                        <div className="flex flex-col gap-2 px-2">
                            {navLinks.map(({ to, label, icon: Icon }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 text-base font-bold transition-all ${isActive(to)
                                        ? 'bg-tape-yellow border-2 border-charcoal-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-1'
                                        : 'text-charcoal-600 hover:bg-charcoal-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {label}
                                </Link>
                            ))}

                            {isAdmin ? (
                                <>
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-base font-bold text-charcoal-600 hover:bg-charcoal-100 transition-all"
                                    >
                                        <Shield className="w-5 h-5" />
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { signOut(); setIsOpen(false); }}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 font-bold font-heading hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/admin/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 text-base font-bold text-charcoal-600 hover:bg-charcoal-100 transition-all"
                                >
                                    <Shield className="w-5 h-5" />
                                    Admin
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

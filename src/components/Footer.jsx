import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sparkles, Mail, Phone } from 'lucide-react'

export default function Footer() {
    const { user, isAdmin } = useAuth()

    return (
        <footer className="bg-charcoal-900 border-t border-charcoal-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="space-y-3">
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-campus-500 border-2 border-charcoal-900 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Sparkles className="w-4 h-4 text-charcoal-900" />
                            </div>
                            <span className="font-heading text-lg font-bold text-charcoal-100">
                                CampusConnect
                            </span>
                        </Link>
                        <p className="text-charcoal-400 text-sm leading-relaxed">
                            Your centralized hub for discovering and registering for campus events. Stay connected, stay engaged.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="font-heading font-semibold text-charcoal-200">Quick Links</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/" className="text-charcoal-400 hover:text-campus-400 text-sm transition-colors">
                                Browse Events
                            </Link>
                            <Link to="/calendar" className="text-charcoal-400 hover:text-campus-400 text-sm transition-colors">
                                Calendar View
                            </Link>
                            <Link to={user && isAdmin ? "/admin/dashboard" : "/admin/login"} className="text-charcoal-400 hover:text-campus-400 text-sm transition-colors">
                                Admin Portal
                            </Link>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-3">
                        <h4 className="font-heading font-semibold text-charcoal-200">Contact</h4>
                        <div className="flex flex-col gap-2">
                            <a href="mailto:roystonsoans3@gmail.com" className="text-charcoal-400 hover:text-campus-400 text-sm transition-colors flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                roystonsoans3@gmail.com
                            </a>
                            <a href="tel:8369036325" className="text-charcoal-400 hover:text-campus-400 text-sm transition-colors flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                8369036325
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

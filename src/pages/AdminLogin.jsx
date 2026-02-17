import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, Mail, Lock, Loader2, AlertCircle, Sparkles } from 'lucide-react'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { signIn, isAdmin, user } = useAuth()
    const navigate = useNavigate()

    // If already logged in as admin, redirect
    if (user && isAdmin) {
        navigate('/admin/dashboard', { replace: true })
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await signIn(email, password)
            // After sign in, wait briefly for role to be fetched
            setTimeout(() => {
                navigate('/admin/dashboard')
            }, 500)
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="relative w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-8 relative">
                    {/* Tape */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-tape-yellow/90 border border-charcoal-900/10 transform -rotate-1 shadow-sm z-0"></div>

                    <div className="inline-flex items-center justify-center w-16 h-16 bg-campus-500 border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-3 mb-4 relative z-10">
                        <Sparkles className="w-8 h-8 text-charcoal-900" />
                    </div>
                    <h1 className="font-heading text-3xl font-bold text-charcoal-100 transform -rotate-1 relative z-10">
                        <span className="bg-charcoal-900 text-paper px-2 py-1 rotate-1 inline-block border-2 border-paper">Admin Portal</span>
                    </h1>
                    <p className="font-typewriter text-charcoal-500 text-sm mt-2 font-bold bg-tape-yellow inline-block px-2 transform rotate-1 border border-charcoal-900/10">
                        AUTHORIZED PERSONNEL ONLY
                    </p>
                </div>

                {/* Login Card - Clipboard Style */}
                <div className="bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 p-8 relative">
                    {/* Texture overlay */}
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                    {/* Clip mechanism */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-8 bg-charcoal-800 border-2 border-charcoal-900 rounded-sm shadow-md z-20"></div>

                    {error && (
                        <div className="flex items-start gap-3 p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-sm transform -rotate-1 shadow-sm font-typewriter mb-6 relative z-10">
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Email Access</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@college.edu"
                                    className="input-handwritten pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Secret Phrase</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-handwritten pl-10"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-sticker flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Shield className="w-5 h-5" />
                                    Unlock Dashboard
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-8">
                    <p className="font-typewriter text-charcoal-500 text-xs">
                        &copy; CampusConnect Security Division
                    </p>
                </div>
            </div>
        </div>
    )
}

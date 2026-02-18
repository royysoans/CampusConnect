import { useState } from 'react'
import { X, User, Mail, Hash, Loader2, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import confetti from 'canvas-confetti'

export default function RegistrationModal({ event, isOpen, onClose }) {
    const [formData, setFormData] = useState({ name: '', email: '', roll_no: '' })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Check for duplicate registration
            const { data: existing, error: checkError } = await supabase
                .from('registrations')
                .select('id')
                .eq('event_id', event.id)
                .eq('email', formData.email)
                .single()

            if (existing) {
                setError('You have already registered for this event with this email.')
                setLoading(false)
                return
            }

            // PGRST116 = no rows found, which means no duplicate — safe to proceed
            if (checkError && checkError.code !== 'PGRST116') {
                throw checkError
            }
        } catch (err) {
            setError(err.message || 'Something went wrong checking registration. Please try again.')
            setLoading(false)
            return
        }

        try {
            const { error: insertError } = await supabase
                .from('registrations')
                .insert({
                    event_id: event.id,
                    name: formData.name,
                    email: formData.email,
                    roll_no: formData.roll_no,
                })

            if (insertError) throw insertError

            setSuccess(true)

            // Fire celebratory confetti 🎉
            confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#f08c28', '#fef08a', '#f86545', '#f4a74e', '#ff8a72'],
            })
            setTimeout(() => {
                onClose()
                setSuccess(false)
                setFormData({ name: '', email: '', roll_no: '' })
            }, 2000)
        } catch (err) {
            setError(err.message || 'Failed to register. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-charcoal-900/90 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal - Clipboard Style */}
            <div className="relative w-full max-w-md bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                {/* Visual texture overlay */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                {/* Clip mechanism at top */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-charcoal-800 border-2 border-charcoal-900 rounded-lg flex items-center justify-center shadow-md z-20">
                    <div className="w-24 h-8 border-2 border-charcoal-600 border-dashed rounded bg-charcoal-700"></div>
                </div>

                {/* Header */}
                <div className="relative px-8 pt-8 pb-4 border-b-2 border-charcoal-900 border-dashed">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 p-1 text-charcoal-900 hover:text-red-600 transition-colors transform hover:rotate-90 duration-300"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <h2 className="font-heading text-3xl font-bold text-charcoal-900 transform -rotate-1 mt-4">
                        SIGN UP SHEET
                    </h2>
                    <p className="font-typewriter text-charcoal-600 text-sm mt-1 font-bold">
                        RE: {event.title}
                    </p>
                </div>

                {success ? (
                    <div className="px-8 py-12 flex flex-col items-center gap-6 text-center">
                        <div className="w-20 h-20 rounded-full border-4 border-green-600 flex items-center justify-center transform rotate-6 mask-rough">
                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="transform -rotate-1">
                            <h3 className="font-heading font-bold text-2xl text-charcoal-900 bg-green-200 px-2 inline-block border-2 border-charcoal-900">
                                YOU'RE IN!
                            </h3>
                            <p className="font-typewriter text-charcoal-600 text-sm mt-4 font-bold">
                                See you there!
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="px-8 pb-8 pt-6 space-y-5 relative z-10">
                        {error && (
                            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-sm transform rotate-1 shadow-sm font-typewriter">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    className="input-handwritten pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="student@college.edu"
                                    className="input-handwritten pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Roll Number</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.roll_no}
                                    onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                                    placeholder="e.g., 21CS101"
                                    className="input-handwritten pl-10"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-sticker mt-4"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Confirm Registration'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

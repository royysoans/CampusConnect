import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { X, Loader2, Download, User, Mail, Hash, Calendar } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export default function RegistrationViewer({ event, isOpen, onClose }) {
    const [registrations, setRegistrations] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (isOpen && event) {
            fetchRegistrations()
        }
    }, [isOpen, event])

    async function fetchRegistrations() {
        setLoading(true)
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('event_id', event.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setRegistrations(data || [])
        } catch (err) {
            console.error('Error fetching registrations:', err)
        } finally {
            setLoading(false)
        }
    }

    const exportCSV = () => {
        if (registrations.length === 0) return

        const headers = ['Name', 'Email', 'Roll No', 'Registered At']
        const rows = registrations.map(r => [
            r.name,
            r.email,
            r.roll_no,
            r.created_at ? format(parseISO(r.created_at), 'yyyy-MM-dd HH:mm') : '',
        ])

        const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${event.title.replace(/\s+/g, '_')}_registrations.csv`
        a.click()
        URL.revokeObjectURL(url)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="fixed inset-0 bg-charcoal-950/90 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-3xl my-8 bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                {/* Texture overlay */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                {/* Clip mechanism */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-10 bg-charcoal-800 border-2 border-charcoal-900 rounded-sm shadow-md z-20 flex items-center justify-center">
                    <span className="text-xs font-bold text-charcoal-200 uppercase tracking-widest">ATTENDANCE SHEET</span>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-8 border-b-2 border-charcoal-900 border-dashed relative z-10">
                    <div>
                        <h2 className="font-heading text-2xl font-bold text-charcoal-900 uppercase">
                            REGISTRATION LIST
                        </h2>
                        <p className="font-typewriter text-charcoal-600 text-sm font-bold bg-tape-yellow inline-block px-1 transform rotate-1 border border-charcoal-900/20 mt-1">
                            {event.title}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {registrations.length > 0 && (
                            <button
                                onClick={exportCSV}
                                className="btn-sticker-secondary flex items-center gap-2 text-xs"
                            >
                                <Download className="w-4 h-4" />
                                SAVE CSV
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 text-charcoal-500 hover:text-red-600 hover:scale-110 transition-all"
                        >
                            <X className="w-8 h-8" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 relative z-10 min-h-[300px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-4">
                            <Loader2 className="w-8 h-8 text-charcoal-900 animate-spin" />
                            <p className="font-typewriter text-charcoal-600">Retrieving records...</p>
                        </div>
                    ) : registrations.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-charcoal-300 rounded-lg">
                            <div className="w-16 h-16 bg-charcoal-100 border-2 border-charcoal-900 rounded-full flex items-center justify-center mx-auto mb-3 transform rotate-2">
                                <User className="w-8 h-8 text-charcoal-400" />
                            </div>
                            <p className="font-heading text-xl text-charcoal-400 font-bold">NO SIGNUPS YET</p>
                            <p className="font-typewriter text-charcoal-500 text-sm mt-1">
                                The list is empty. Advertise more!
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2 mb-4 px-1">
                                <span className="text-charcoal-900 font-typewriter font-bold text-sm bg-campus-200 px-2 border border-charcoal-900 transform -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    COUNT: {registrations.length}
                                </span>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-charcoal-900 border-b-2 border-charcoal-900 text-paper">
                                            <th className="text-left px-4 py-3 font-heading text-sm uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    Student
                                                </div>
                                            </th>
                                            <th className="text-left px-4 py-3 font-heading text-sm uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Contact
                                                </div>
                                            </th>
                                            <th className="text-left px-4 py-3 font-heading text-sm uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-4 h-4" />
                                                    Roll No
                                                </div>
                                            </th>
                                            <th className="text-left px-4 py-3 font-heading text-sm uppercase tracking-wider">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Signed Up
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-typewriter divide-y-2 divide-charcoal-900/10">
                                        {registrations.map((reg, idx) => (
                                            <tr
                                                key={reg.id}
                                                className={`hover:bg-campus-50 transition-colors ${idx % 2 === 0 ? 'bg-charcoal-50/50' : 'bg-white'}`}
                                            >
                                                <td className="px-4 py-3 text-charcoal-900 font-bold border-r border-charcoal-900/10">{reg.name}</td>
                                                <td className="px-4 py-3 text-charcoal-700 border-r border-charcoal-900/10">{reg.email}</td>
                                                <td className="px-4 py-3 text-charcoal-700 font-bold border-r border-charcoal-900/10">{reg.roll_no}</td>
                                                <td className="px-4 py-3 text-charcoal-600">
                                                    {reg.created_at ? format(parseISO(reg.created_at), 'MMM d, HH:mm') : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

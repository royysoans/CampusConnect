import { useState, useEffect, useMemo } from 'react'
import { useEvents } from '../context/EventsContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import EventForm from '../components/admin/EventForm'
import RegistrationViewer from '../components/admin/RegistrationViewer'
import { format, parseISO, isAfter, startOfDay } from 'date-fns'
import {
    Plus, Edit3, Trash2, Eye, Calendar, MapPin, Tag, Users,
    LayoutDashboard, CalendarClock, Archive, TrendingUp, Loader2,
    AlertTriangle
} from 'lucide-react'

export default function AdminDashboard() {
    const { events, loading, fetchEvents } = useEvents()
    const { user } = useAuth()
    const [showForm, setShowForm] = useState(false)
    const [editEvent, setEditEvent] = useState(null)
    const [viewRegistrations, setViewRegistrations] = useState(null)
    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const [deleting, setDeleting] = useState(false)
    const [totalRegistrations, setTotalRegistrations] = useState(0)

    useEffect(() => {
        fetchTotalRegistrations()
    }, [events])

    async function fetchTotalRegistrations() {
        try {
            const { count, error } = await supabase
                .from('registrations')
                .select('*', { count: 'exact', head: true })

            if (!error) {
                setTotalRegistrations(count || 0)
            }
        } catch {
            // ignore
        }
    }

    const stats = useMemo(() => {
        const today = startOfDay(new Date())
        const upcoming = events.filter(e => isAfter(parseISO(e.date), today)).length
        return {
            total: events.length,
            upcoming,
            registrations: totalRegistrations,
        }
    }, [events, totalRegistrations])

    const handleCreate = () => {
        setEditEvent(null)
        setShowForm(true)
    }

    const handleEdit = (event) => {
        setEditEvent(event)
        setShowForm(true)
    }

    const handleDelete = async (event) => {
        setDeleting(true)
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', event.id)
            if (error) throw error
            setDeleteConfirm(null)
            fetchEvents() // Refresh list
        } catch (err) {
            console.error('Error deleting event:', err)
            alert('Failed to delete event.')
        } finally {
            setDeleting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-campus-500 animate-spin" />
                    <p className="text-charcoal-400 font-typewriter">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-campus-500 border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
                        <LayoutDashboard className="w-6 h-6 text-charcoal-900" />
                    </div>
                    <div>
                        <h1 className="font-heading text-4xl font-bold text-charcoal-100 transform rotate-1">Admin Dashboard</h1>
                        <p className="font-typewriter text-charcoal-400 text-sm mt-1 bg-charcoal-900 border border-charcoal-700 px-2 inline-block -rotate-1">
                            LOGGED IN AS: {user?.email}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    className="btn-sticker flex items-center gap-2 group"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Create Event
                </button>
            </div>

            {/* Stats - Sticky Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                <StatCard
                    icon={<CalendarClock className="w-6 h-6 text-charcoal-900" />}
                    label="Total Events"
                    value={stats.total}
                    type="yellow"
                    rotate="-2"
                />
                <StatCard
                    icon={<TrendingUp className="w-6 h-6 text-charcoal-900" />}
                    label="Upcoming"
                    value={stats.upcoming}
                    type="green"
                    rotate="1"
                />
                <StatCard
                    icon={<Users className="w-6 h-6 text-charcoal-900" />}
                    label="Registrations"
                    value={stats.registrations}
                    type="pink"
                    rotate="-1"
                />
            </div>

            {/* Events list - Clipboard/Manifest */}
            {events.length === 0 ? (
                <div className="text-center py-20 bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 relative">
                    <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>
                    <div className="w-16 h-16 bg-charcoal-200 border-2 border-charcoal-900 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                        <Calendar className="w-8 h-8 text-charcoal-500" />
                    </div>
                    <h3 className="font-heading text-2xl font-bold text-charcoal-900 mb-2 relative z-10">No Events Yet</h3>
                    <p className="font-typewriter text-charcoal-600 mb-6 relative z-10"> The board is empty. Pin something up!</p>
                    <button
                        onClick={handleCreate}
                        className="btn-sticker relative z-10"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Event
                    </button>
                </div>
            ) : (
                <div className="relative">
                    {/* Clipboard Clip */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-12 bg-charcoal-800 border-2 border-charcoal-900 rounded-sm shadow-md z-20 flex items-center justify-center">
                        <span className="font-heading text-charcoal-200 text-sm tracking-wider">EVENT MANIFEST</span>
                    </div>

                    <div className="bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] pt-12 pb-4 px-4 sm:px-8 transform -rotate-0.5 relative">
                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                        <div className="divide-y-2 divide-charcoal-900 divide-dashed relative z-10">
                            {events.map(event => (
                                <div
                                    key={event.id}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 group hover:bg-campus-100/50 transition-colors -mx-4 px-4 sm:mx-0 sm:px-0"
                                >
                                    {/* Event info */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        {event.banner_url ? (
                                            <div className="w-16 h-16 border-2 border-charcoal-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-2 group-hover:rotate-0 transition-transform shrink-0">
                                                <img
                                                    src={event.banner_url}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover transition-all"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 bg-charcoal-200 border-2 border-charcoal-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform rotate-2 flex items-center justify-center shrink-0">
                                                <Calendar className="w-8 h-8 text-charcoal-500" />
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <h3 className="font-heading text-xl font-bold text-charcoal-900 truncate">{event.title}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-typewriter text-charcoal-600 text-xs font-bold">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(parseISO(event.date), 'MMM d, yyyy')}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {event.venue}
                                                </span>
                                                <span className="flex items-center gap-1 bg-tape-yellow px-1 border border-charcoal-900 transform -rotate-1">
                                                    <Tag className="w-3 h-3" />
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0 justify-end">
                                        <button
                                            onClick={() => setViewRegistrations(event)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-charcoal-900 text-charcoal-900 hover:bg-campus-200 text-xs font-bold font-heading shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all"
                                            title="View registrations"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span className="hidden sm:inline">VIEW LIST</span>
                                        </button>
                                        <button
                                            onClick={() => handleEdit(event)}
                                            className="p-2 bg-tape-yellow border-2 border-charcoal-900 text-charcoal-900 hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all"
                                            title="Edit event"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(event)}
                                            className="p-2 bg-coral-400 border-2 border-charcoal-900 text-charcoal-900 hover:bg-coral-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all"
                                            title="Delete event"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Event Form Modal */}
            <EventForm
                event={editEvent}
                isOpen={showForm}
                onClose={() => { setShowForm(false); setEditEvent(null); }}
                onSave={fetchEvents}
            />

            {/* Registration Viewer Modal */}
            <RegistrationViewer
                event={viewRegistrations}
                isOpen={!!viewRegistrations}
                onClose={() => setViewRegistrations(null)}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-charcoal-950/90 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
                    <div className="relative w-full max-w-sm bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform rotate-2">
                        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-red-500/80 transform -rotate-1"></div>

                        <div className="flex flex-col items-center text-center gap-4 relative z-10">
                            <div className="w-16 h-16 border-2 border-charcoal-900 bg-red-100 flex items-center justify-center transform -rotate-3">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-heading text-2xl font-bold text-charcoal-900 mb-2">RIP IT DOWN?</h3>
                                <p className="font-typewriter text-charcoal-700 text-sm font-bold">
                                    Are you sure you want to delete <br /><span className="bg-tape-yellow px-1 border border-charcoal-900 transform rotate-1 inline-block mt-1">{deleteConfirm.title}</span>?
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full mt-2">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 py-2 bg-white border-2 border-charcoal-900 text-charcoal-900 font-bold font-heading shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDelete(deleteConfirm)}
                                    disabled={deleting}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500 border-2 border-charcoal-900 text-white font-bold font-heading shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all disabled:opacity-50"
                                >
                                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'DELETE'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function StatCard({ icon, label, value, type, rotate }) {
    const bgColors = {
        yellow: 'bg-tape-yellow',
        green: 'bg-green-300',
        pink: 'bg-pink-300',
    }

    return (
        <div
            className={`${bgColors[type]} p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-300 relative`}
            style={{ transform: `rotate(${rotate}deg)` }}
        >
            {/* Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border-2 border-charcoal-900 shadow-sm z-10"></div>

            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/50 border-2 border-charcoal-900 flex items-center justify-center shrink-0 rounded-full">
                    {icon}
                </div>
                <div>
                    <p className="text-charcoal-900 font-typewriter font-bold text-xs uppercase tracking-wider mb-1">{label}</p>
                    <p className="font-heading text-4xl font-bold text-charcoal-900">{value}</p>
                </div>
            </div>
        </div>
    )
}

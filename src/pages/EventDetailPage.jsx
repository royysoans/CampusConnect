import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEvents } from '../context/EventsContext'
import RegistrationModal from '../components/RegistrationModal'
import { format, parseISO, isAfter, isToday, startOfDay } from 'date-fns'
import {
    Calendar, Clock, MapPin, Tag, Users, ArrowLeft,
    UserPlus, Share2, Loader2, Phone
} from 'lucide-react'

export default function EventDetailPage() {
    const { id } = useParams()
    const { getEventById, loading } = useEvents()
    const [event, setEvent] = useState(null)
    const [showRegistration, setShowRegistration] = useState(false)

    useEffect(() => {
        const found = getEventById(id)
        setEvent(found)
    }, [id, getEventById])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-campus-500 animate-spin" />
                    <p className="text-charcoal-400">Loading event...</p>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="font-heading text-2xl font-bold text-charcoal-200">Event Not Found</h2>
                    <p className="text-charcoal-500">The event you're looking for doesn't exist or has been removed.</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-campus-500/10 border border-campus-500/30 rounded-lg text-campus-400 text-sm font-medium hover:bg-campus-500/20 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Events
                    </Link>
                </div>
            </div>
        )
    }

    const eventDate = parseISO(event.date)
    const today = startOfDay(new Date())
    const isUpcoming = isAfter(eventDate, today) || isToday(eventDate)

    const handleShare = async () => {
        try {
            await navigator.share({
                title: event.title,
                text: `Check out ${event.title} at ${event.venue}`,
                url: window.location.href,
            })
        } catch {
            navigator.clipboard.writeText(window.location.href)
        }
    }

    return (
        <div className="min-h-screen pb-20 pt-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-charcoal-600 hover:text-charcoal-900 font-bold mb-8 transition-colors group"
                >
                    <div className="w-8 h-8 bg-paper border-2 border-charcoal-900 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1 transition-transform">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-heading uppercase tracking-wide">Back to Board</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Flyer Content */}
                    <div className="lg:col-span-2 relative">
                        <div className="bg-paper border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:transform sm:-rotate-1 p-2 relative">
                            {/* Texture overlay */}
                            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                            {/* Tape */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-tape-yellow/90 border border-charcoal-900/10 transform rotate-2 shadow-sm z-20"></div>

                            {/* Banner Image */}
                            <div className="relative h-64 sm:h-80 md:h-96 border-2 border-charcoal-900 overflow-hidden mb-6">
                                {event.banner_url ? (
                                    <img
                                        src={event.banner_url}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-charcoal-100 flex items-center justify-center">
                                        <Calendar className="w-20 h-20 text-charcoal-300" />
                                    </div>
                                )}

                                {/* Status Stamp removed from banner */}
                            </div>

                            <div className="px-6 pb-8 relative z-10">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold border-2 border-charcoal-900 bg-campus-200 text-charcoal-900 transform -rotate-2">
                                        <Tag className="w-3 h-3" />
                                        {event.category}
                                    </span>
                                </div>

                                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal-900 mb-6 leading-tight border-b-4 border-charcoal-900 inline-block pb-2">
                                    {event.title}
                                </h1>

                                <div className="prose prose-lg text-charcoal-700 font-typewriter leading-relaxed">
                                    {event.description || 'No description provided for this event.'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Ticket Stub */}
                    <div className="space-y-6 relative z-10">
                        <div className="bg-campus-400 border-2 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 transform rotate-1 relative">
                            {/* Texture overlay */}
                            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                            {/* Holes for ticket look */}
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-charcoal-950 rounded-full border-r-2 border-charcoal-900"></div>
                            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-charcoal-950 rounded-full border-l-2 border-charcoal-900"></div>

                            <h3 className="font-heading font-bold text-2xl text-charcoal-900 mb-6 text-center border-b-2 border-charcoal-900 border-dashed pb-4">
                                EVENT DETAILS
                            </h3>

                            <div className="space-y-6 font-typewriter">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-6 h-6 text-charcoal-900 shrink-0" />
                                    <div>
                                        <p className="font-bold text-charcoal-900 uppercase text-xs">When</p>
                                        <p className="text-charcoal-800 text-lg">{format(eventDate, 'MMM d, yyyy')}</p>
                                        <p className="text-charcoal-800">{format(eventDate, 'EEEE')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Clock className="w-6 h-6 text-charcoal-900 shrink-0" />
                                    <div>
                                        <p className="font-bold text-charcoal-900 uppercase text-xs">Time</p>
                                        <p className="text-charcoal-800 text-lg">{event.time?.slice(0, 5)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-6 h-6 text-charcoal-900 shrink-0" />
                                    <div>
                                        <p className="font-bold text-charcoal-900 uppercase text-xs">Where</p>
                                        <p className="text-charcoal-800 text-lg leading-tight">{event.venue}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Users className="w-6 h-6 text-charcoal-900 shrink-0" />
                                    <div>
                                        <p className="font-bold text-charcoal-900 uppercase text-xs">Organizer</p>
                                        <p className="text-charcoal-800 text-lg">{event.organizer}</p>
                                        {event.organizer_phone && (
                                            <a href={`tel:${event.organizer_phone}`} className="flex items-center gap-1.5 text-sm text-campus-600 hover:text-campus-700 mt-1 font-typewriter">
                                                <Phone className="w-3.5 h-3.5" />
                                                {event.organizer_phone}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            {isUpcoming && (
                                <button
                                    onClick={() => setShowRegistration(true)}
                                    className="w-full btn-sticker flex items-center justify-center gap-2 group"
                                >
                                    <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    Register Now
                                </button>
                            )}

                            <button
                                onClick={handleShare}
                                className="w-full btn-sticker-secondary flex items-center justify-center gap-2 font-bold"
                            >
                                <Share2 className="w-5 h-5" />
                                Share Flyer
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <RegistrationModal
                event={event}
                isOpen={showRegistration}
                onClose={() => setShowRegistration(false)}
            />
        </div>
    )
}

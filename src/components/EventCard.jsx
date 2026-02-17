import { Link } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Calendar, MapPin, Tag, Users, Clock, ArrowRight } from 'lucide-react'

const categoryColors = {
    'Technology': 'from-blue-500/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Cultural': 'from-purple-500/20 to-pink-500/20 text-pink-400 border-pink-500/30',
    'Sports': 'from-green-500/20 to-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Academic': 'from-amber-500/20 to-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Workshop': 'from-orange-500/20 to-red-500/20 text-orange-400 border-orange-500/30',
    'Social': 'from-rose-500/20 to-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30',
    'Seminar': 'from-indigo-500/20 to-violet-500/20 text-violet-400 border-violet-500/30',
}

const defaultCategoryColor = 'from-campus-500/20 to-coral-500/20 text-campus-400 border-campus-500/30'

function getEventStatus(dateStr) {
    const eventDate = parseISO(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDay = new Date(eventDate)
    eventDay.setHours(0, 0, 0, 0)

    if (eventDay.getTime() === today.getTime()) return 'ongoing'
    if (eventDay > today) return 'upcoming'
    return 'past'
}

const statusConfig = {
    upcoming: { label: 'Upcoming', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
    ongoing: { label: 'Happening Now', class: 'bg-campus-500/20 text-campus-400 border-campus-500/30 animate-pulse' },
    past: { label: 'Completed', class: 'bg-charcoal-600/30 text-charcoal-400 border-charcoal-600/30' },
}

export default function EventCard({ event }) {
    const status = getEventStatus(event.date)
    const statusInfo = statusConfig[status]
    const colorClass = categoryColors[event.category] || defaultCategoryColor

    return (
        <Link
            to={`/event/${event.id}`}
            className="group block relative bg-paper border-2 border-charcoal-900 shadow-[6px_6px_0px_0px_rgba(30,30,34,1)] hover:shadow-[10px_10px_0px_0px_rgba(240,140,40,1)] hover:-translate-y-1 transition-all duration-300 transform hover:rotate-1"
            style={{ transform: `rotate(${Math.random() * 2 - 1}deg)` }}
        >
            {/* Tape effect at top center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-tape-yellow/90 border border-charcoal-900/10 transform -rotate-1 shadow-sm z-10"></div>

            {/* Banner */}
            <div className="relative h-48 overflow-hidden border-b-2 border-charcoal-900">
                {event.banner_url ? (
                    <img
                        src={event.banner_url}
                        alt={event.title}
                        className="w-full h-full object-cover transition-all duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-charcoal-100 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-charcoal-400" />
                    </div>
                )}

                {/* Status and Category badges removed from banner */}\n
            </div>

            {/* Content */}
            <div className="p-5 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-40 pointer-events-none"></div>
                <h3 className="font-heading text-xl font-bold text-charcoal-900 mb-3 group-hover:text-campus-600 transition-colors line-clamp-1 border-b-2 border-transparent group-hover:border-campus-500 inline-block">
                    {event.title}
                </h3>

                <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2.5 text-charcoal-600 font-typewriter text-xs">
                        <Calendar className="w-4 h-4 text-charcoal-900" />
                        <span className="font-bold">{format(parseISO(event.date), 'EEE, MMM d, yyyy')}</span>
                        <span>•</span>
                        <span>{event.time?.slice(0, 5)}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-charcoal-600 font-typewriter text-xs">
                        <MapPin className="w-4 h-4 text-charcoal-900" />
                        <span className="line-clamp-1">{event.venue}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-charcoal-600 font-typewriter text-xs">
                        <Users className="w-4 h-4 text-charcoal-900" />
                        <span>{event.organizer || 'Campus Event'}</span>
                    </div>
                </div>

                <div className="h-px w-full bg-charcoal-900/20 mb-4 border-t border-dashed border-charcoal-900"></div>

                <div className="flex items-center justify-end">
                    <span className="text-sm font-bold text-campus-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Details <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>
        </Link>
    )
}

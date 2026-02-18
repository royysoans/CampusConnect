import { useState, useMemo } from 'react'
import { useEvents } from '../context/EventsContext'
import EventCard from '../components/EventCard'
import SearchFilter from '../components/SearchFilter'
import { parseISO, isToday, isAfter, startOfDay } from 'date-fns'
import { Sparkles, TrendingUp, Clock, Archive, CalendarDays, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
    const { events, loading, categories } = useEvents()
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('')

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Search filter
            if (searchQuery) {
                const q = searchQuery.toLowerCase()
                const matchesSearch =
                    event.title?.toLowerCase().includes(q) ||
                    event.category?.toLowerCase().includes(q) ||
                    event.organizer?.toLowerCase().includes(q) ||
                    event.venue?.toLowerCase().includes(q)
                if (!matchesSearch) return false
            }

            // Status filter
            if (statusFilter !== 'all') {
                const eventDate = parseISO(event.date)
                const today = startOfDay(new Date())
                const status = isToday(eventDate) ? 'ongoing' : isAfter(eventDate, today) ? 'upcoming' : 'past'
                if (status !== statusFilter) return false
            }

            // Category filter
            if (categoryFilter && event.category !== categoryFilter) return false

            return true
        })
    }, [events, searchQuery, statusFilter, categoryFilter])

    const categorizedEvents = useMemo(() => {
        const today = startOfDay(new Date())
        const upcoming = []
        const ongoing = []
        const past = []

        filteredEvents.forEach(event => {
            const eventDate = parseISO(event.date)
            if (isToday(eventDate)) ongoing.push(event)
            else if (isAfter(eventDate, today)) upcoming.push(event)
            else past.push(event)
        })

        return { upcoming, ongoing, past }
    }, [filteredEvents])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-campus-500 animate-spin" />
                    <p className="text-charcoal-400">Loading events...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-12">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto space-y-8">
                        {/* Stamped Badge */}
                        <div className="inline-block transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <div className="px-6 py-2 bg-coral-500 border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <span className="font-heading font-bold text-charcoal-900 tracking-widest uppercase">
                                    Official Campus Board
                                </span>
                            </div>
                        </div>

                        <h1 className="font-heading text-4xl sm:text-6xl md:text-8xl font-bold text-white leading-tight drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] transform sm:-rotate-1">
                            DISCOVER
                            <br />
                            <span className="text-campus-500 relative inline-block">
                                EVENTS
                                <span className="absolute -bottom-2 left-0 w-full h-4 bg-tape-yellow/80 -z-10 transform -rotate-1 skew-x-12"></span>
                            </span>
                        </h1>

                        <p className="font-typewriter text-charcoal-200 text-base sm:text-lg md:text-xl max-w-2xl mx-auto bg-charcoal-900/50 p-3 sm:p-4 border border-charcoal-600 border-dashed sm:transform sm:rotate-1">
                            Your chaotic, centralized hub for everything happening on campus.
                            Don't miss the good stuff.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                            <a href="#events" className="btn-sticker">
                                Explore Board
                            </a>
                            <Link to="/calendar" className="btn-sticker-secondary">
                                <CalendarDays className="w-5 h-5 mr-2" />
                                Calendar
                            </Link>
                        </div>

                        {/* Stats Tape */}
                        <div className="pt-12 flex justify-center">
                            <div className="bg-paper px-6 sm:px-8 py-4 border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:transform sm:rotate-1 flex flex-col sm:flex-row items-center gap-4 sm:gap-12 relative">
                                {/* Pins */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-charcoal-900"></div>

                                <div className="text-center">
                                    <div className="font-heading text-3xl font-bold text-campus-600">
                                        {events.length}
                                    </div>
                                    <div className="font-typewriter text-charcoal-900 text-xs font-bold bg-tape-yellow px-1">POSTINGS</div>
                                </div>
                                <div className="hidden sm:block w-0.5 h-10 bg-charcoal-900 dashed-border"></div>
                                <div className="text-center">
                                    <div className="font-heading text-3xl font-bold text-campus-600">
                                        {categories.length}
                                    </div>
                                    <div className="font-typewriter text-charcoal-900 text-xs font-bold bg-tape-yellow px-1">TOPICS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* pinned strip */}
            <div className="w-full h-8 bg-repeating-linear-gradient-45 from-charcoal-900 to-charcoal-900 10px from-transparent to-transparent 20px opacity-20 my-8"></div>

            {/* Search & Events */}
            <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Search & Filter */}
                <div className="mb-16 transform -rotate-1 hover:rotate-0 transition-transform duration-500 z-20 relative">
                    <SearchFilter
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                    />
                </div>

                {filteredEvents.length === 0 ? (
                    <div className="text-center py-20 bg-paper border-2 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md mx-auto transform rotate-1">
                        <div className="w-20 h-20 bg-charcoal-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-charcoal-900 border-dashed">
                            <Archive className="w-10 h-10 text-charcoal-400" />
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-charcoal-900 mb-2">
                            EMPTY BOARD
                        </h3>
                        <p className="font-typewriter text-charcoal-600 px-8">
                            {searchQuery || categoryFilter
                                ? 'Someone tore down those flyers. Try a different search.'
                                : 'Nothing pinned yet. Be the first!'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {/* Upcoming - Masonry */}
                        {categorizedEvents.upcoming.length > 0 && (
                            <div className="relative">
                                <div className="inline-block bg-charcoal-900 text-white px-4 py-2 font-heading font-bold text-2xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] mb-8 transform -rotate-1">
                                    UPCOMING GIGS
                                </div>
                                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                                    {categorizedEvents.upcoming.map(event => (
                                        <div key={event.id} className="break-inside-avoid">
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Ongoing */}
                        {categorizedEvents.ongoing.length > 0 && (
                            <div className="relative">
                                <div className="inline-block bg-red-600 text-white px-6 py-2 font-heading font-bold text-2xl border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 transform rotate-1 animate-pulse">
                                    HAPPENING NOW
                                </div>
                                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                                    {categorizedEvents.ongoing.map(event => (
                                        <div key={event.id} className="break-inside-avoid">
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Past */}
                        {categorizedEvents.past.length > 0 && (
                            <div className="relative opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                                <div className="inline-block bg-charcoal-200 text-charcoal-500 px-4 py-2 font-heading font-bold text-xl border-2 border-charcoal-500 border-dashed mb-8">
                                    OLD NEWS
                                </div>
                                <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8">
                                    {categorizedEvents.past.map(event => (
                                        <div key={event.id} className="break-inside-avoid">
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    )
}

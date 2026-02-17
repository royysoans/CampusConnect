import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEvents } from '../context/EventsContext'
import { parseISO } from 'date-fns'
import { CalendarDays, Loader2 } from 'lucide-react'

const categoryColorMap = {
    'Technology': { bg: '#0891b2', border: '#06b6d4' },
    'Cultural': { bg: '#a855f7', border: '#c084fc' },
    'Sports': { bg: '#10b981', border: '#34d399' },
    'Academic': { bg: '#f59e0b', border: '#fbbf24' },
    'Workshop': { bg: '#f97316', border: '#fb923c' },
    'Social': { bg: '#ec4899', border: '#f472b6' },
    'Seminar': { bg: '#6366f1', border: '#818cf8' },
}

const defaultColor = { bg: '#f08c28', border: '#f4a74e' }

export default function CalendarPage() {
    const { events, loading } = useEvents()
    const navigate = useNavigate()

    const calendarEvents = useMemo(() => {
        return events.map(event => {
            const colors = categoryColorMap[event.category] || defaultColor
            return {
                id: event.id,
                title: event.title,
                start: event.date + (event.time ? 'T' + event.time : ''),
                backgroundColor: colors.bg,
                borderColor: colors.border,
                textColor: '#ffffff',
                extendedProps: {
                    venue: event.venue,
                    category: event.category,
                    organizer: event.organizer,
                },
            }
        })
    }, [events])

    const handleEventClick = (info) => {
        navigate(`/event/${info.event.id}`)
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-campus-500 animate-spin" />
                    <p className="font-typewriter text-charcoal-400">Loading schedule...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-12 h-12 bg-campus-500 border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-2">
                    <CalendarDays className="w-6 h-6 text-charcoal-900" />
                </div>
                <div>
                    <h1 className="font-heading text-4xl font-bold text-charcoal-100 transform -rotate-1 border-b-4 border-charcoal-900/50 inline-block pb-1">
                        MASTER SCHEDULE
                    </h1>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 transform rotate-0.5 relative">
                {/* Texture overlay */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                {/* Tape */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-48 h-10 bg-tape-yellow/90 border border-charcoal-900/10 transform -rotate-1 shadow-sm z-20"></div>

                <div className="relative z-10 font-typewriter">
                    <style>{`
                        .fc-toolbar-title { font-family: 'Permanent Marker', cursive !important; color: #1a1a1a !important; font-size: 1.5rem !important; }
                        .fc-button { background-color: #1a1a1a !important; border: none !important; border-radius: 0 !important; font-weight: bold !important; text-transform: uppercase !important; }
                        .fc-button:hover { background-color: #333 !important; }
                        .fc-button-active { background-color: #000 !important; }
                        .fc-daygrid-day { border-color: #1a1a1a20 !important; }
                        .fc-col-header-cell { background-color: #1a1a1a !important; color: #fff !important; padding: 8px 0 !important; border: 2px solid #1a1a1a !important; }
                        .fc-day-today { background-color: #fff9c4 !important; }
                        .fc-event { border: 2px solid #1a1a1a !important; border-radius: 0 !important; box-shadow: 2px 2px 0px 0px rgba(0,0,0,1) !important; cursor: pointer !important; }
                        .fc-daygrid-day-number { color: #1a1a1a !important; font-weight: bold !important; font-family: 'Special Elite', monospace !important; }
                    `}</style>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek',
                        }}
                        events={calendarEvents}
                        eventClick={handleEventClick}
                        height="auto"
                        dayMaxEvents={3}
                        eventDisplay="block"
                        nowIndicator={true}
                        editable={false}
                        selectable={false}
                    />
                </div>
            </div>

            {/* Legend - Taped Notes */}
            <div className="mt-8 flex flex-wrap items-center gap-4 justify-center">
                {Object.entries(categoryColorMap).map(([cat, colors]) => (
                    <div key={cat} className="flex items-center gap-2 bg-white border-2 border-charcoal-900 px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform hover:-translate-y-1 transition-transform rotate-1">
                        <div
                            className="w-4 h-4 border-2 border-charcoal-900"
                            style={{ backgroundColor: colors.bg }}
                        />
                        <span className="font-heading text-charcoal-900 text-xs font-bold uppercase">{cat}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

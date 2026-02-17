import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { isAfter, isBefore, isToday, parseISO, startOfDay, endOfDay } from 'date-fns'

const EventsContext = createContext({})

export const useEvents = () => useContext(EventsContext)

export function EventsProvider({ children }) {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchEvents = useCallback(async () => {
        try {
            setLoading(true)
            const { data, error: fetchError } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true })

            if (fetchError) throw fetchError
            setEvents(data || [])
        } catch (err) {
            console.error('Error fetching events:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchEvents()

        // Subscribe to realtime changes
        const channel = supabase
            .channel('events-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'events' },
                (payload) => {
                    switch (payload.eventType) {
                        case 'INSERT':
                            setEvents(prev => {
                                // Check if event already exists to prevent duplicates
                                if (prev.some(e => e.id === payload.new.id)) {
                                    return prev
                                }
                                return [...prev, payload.new].sort((a, b) =>
                                    new Date(a.date) - new Date(b.date)
                                )
                            })
                            break
                        case 'UPDATE':
                            setEvents(prev =>
                                prev.map(e => e.id === payload.new.id ? payload.new : e)
                            )
                            break
                        case 'DELETE':
                            setEvents(prev => prev.filter(e => e.id !== payload.old.id))
                            break
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [fetchEvents])

    const categorizeEvents = useCallback(() => {
        const now = new Date()
        const today = startOfDay(now)

        const upcoming = []
        const ongoing = []
        const past = []

        events.forEach(event => {
            const eventDate = parseISO(event.date)
            if (isToday(eventDate)) {
                ongoing.push(event)
            } else if (isAfter(eventDate, today)) {
                upcoming.push(event)
            } else {
                past.push(event)
            }
        })

        return { upcoming, ongoing, past }
    }, [events])

    const getEventById = useCallback((id) => {
        return events.find(e => e.id === id) || null
    }, [events])

    const categories = [...new Set(events.map(e => e.category).filter(Boolean))]
    const organizers = [...new Set(events.map(e => e.organizer).filter(Boolean))]

    return (
        <EventsContext.Provider value={{
            events,
            loading,
            error,
            fetchEvents,
            categorizeEvents,
            getEventById,
            categories,
            organizers,
        }}>
            {children}
        </EventsContext.Provider>
    )
}

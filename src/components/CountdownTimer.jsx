import { useState, useEffect } from 'react'
import { Timer } from 'lucide-react'

function calculateTimeLeft(targetDate, targetTime) {
    const target = new Date(`${targetDate}T${targetTime || '00:00:00'}`)
    const now = new Date()
    const diff = target - now

    if (diff <= 0) return null

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    }
}

export default function CountdownTimer({ date, time }) {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(date, time))

    useEffect(() => {
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft(date, time)
            setTimeLeft(remaining)
            if (!remaining) clearInterval(timer)
        }, 1000)

        return () => clearInterval(timer)
    }, [date, time])

    if (!timeLeft) {
        return (
            <div className="bg-green-200 border-2 border-charcoal-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 transform -rotate-1 text-center">
                <p className="font-heading text-lg font-bold text-charcoal-900 animate-pulse">
                    🎉 EVENT IS LIVE!
                </p>
            </div>
        )
    }

    const units = [
        { label: 'DAYS', value: timeLeft.days },
        { label: 'HRS', value: timeLeft.hours },
        { label: 'MIN', value: timeLeft.minutes },
        { label: 'SEC', value: timeLeft.seconds },
    ]

    return (
        <div className="bg-charcoal-900 border-2 border-charcoal-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 transform rotate-1 relative overflow-hidden">
            {/* Texture */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none"></div>

            <div className="flex items-center justify-center gap-2 mb-3 relative z-10">
                <Timer className="w-4 h-4 text-campus-400" />
                <span className="font-heading text-sm text-campus-400 uppercase tracking-widest">Countdown</span>
            </div>

            <div className="grid grid-cols-4 gap-2 relative z-10">
                {units.map(({ label, value }) => (
                    <div key={label} className="text-center">
                        <div className="bg-charcoal-800 border border-charcoal-600 px-1 py-2 mb-1">
                            <span className="font-heading text-2xl sm:text-3xl font-bold text-campus-400 tabular-nums">
                                {String(value).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="font-typewriter text-[10px] text-charcoal-400 font-bold tracking-wider">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

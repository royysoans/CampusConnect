import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import {
    X, Upload, Loader2, Image as ImageIcon, Calendar, Clock,
    MapPin, Tag, Users, AlignLeft, Type, Phone
} from 'lucide-react'

const CATEGORIES = ['Technology', 'Cultural', 'Sports', 'Academic', 'Workshop', 'Social', 'Seminar']

export default function EventForm({ event, isOpen, onClose, onSave }) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [bannerPreview, setBannerPreview] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        category: '',
        organizer: '',
        organizer_phone: '',
        banner_url: '',
    })

    useEffect(() => {
        if (event) {
            setFormData({
                title: event.title || '',
                description: event.description || '',
                date: event.date || '',
                time: event.time?.slice(0, 5) || '',
                venue: event.venue || '',
                category: event.category || '',
                organizer: event.organizer || '',
                organizer_phone: event.organizer_phone || '',
                banner_url: event.banner_url || '',
            })
            setBannerPreview(event.banner_url || '')
        } else {
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                venue: '',
                category: '',
                organizer: '',
                organizer_phone: '',
                banner_url: '',
            })
            setBannerPreview('')
        }
    }, [event, isOpen])

    const handleBannerUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('banners')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from('banners')
                .getPublicUrl(filePath)

            setFormData(prev => ({ ...prev, banner_url: data.publicUrl }))
            setBannerPreview(data.publicUrl)
        } catch (err) {
            console.error('Error uploading banner:', err)
            alert('Failed to upload image. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const payload = {
                ...formData,
                created_by: user.id,
            }

            if (event) {
                // Update
                const { error } = await supabase
                    .from('events')
                    .update(payload)
                    .eq('id', event.id)
                if (error) throw error
            } else {
                // Create
                const { error } = await supabase
                    .from('events')
                    .insert(payload)
                if (error) throw error
            }

            onSave()
            onClose()
        } catch (err) {
            console.error('Error saving event:', err)
            alert('Failed to save event. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div
                className="fixed inset-0 bg-charcoal-950/90 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl my-8 bg-paper border-4 border-charcoal-900 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                {/* Texture overlay */}
                <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none mix-blend-multiply"></div>

                {/* Clip mechanism */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-10 bg-charcoal-800 border-2 border-charcoal-900 rounded-sm shadow-md z-20 flex items-center justify-center">
                    <span className="text-xs font-bold text-charcoal-200 uppercase">SUBMISSION</span>
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-8 border-b-2 border-charcoal-900 border-dashed relative z-10">
                    <h2 className="font-heading text-3xl font-bold text-charcoal-900 uppercase">
                        {event ? 'Edit Flyer' : 'New Event Flyer'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-charcoal-500 hover:text-red-600 hover:rotate-90 transition-all"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
                    {/* Banner upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Banner Image</label>
                        <div className="relative">
                            {bannerPreview ? (
                                <div className="relative border-2 border-charcoal-900 overflow-hidden transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <img src={bannerPreview} alt="Banner preview" className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all" />
                                    <div className="absolute inset-0 bg-charcoal-900/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-paper border-2 border-charcoal-900 text-charcoal-900 text-sm font-bold font-heading hover:bg-tape-yellow transition-colors">
                                            <Upload className="w-4 h-4" />
                                            SWAP PHOTO
                                            <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-charcoal-900 bg-campus-50 cursor-pointer hover:bg-campus-100 transition-all group">
                                    {uploading ? (
                                        <Loader2 className="w-8 h-8 text-charcoal-900 animate-spin" />
                                    ) : (
                                        <ImageIcon className="w-10 h-10 text-charcoal-400 group-hover:text-charcoal-900 group-hover:scale-110 transition-all" />
                                    )}
                                    <span className="text-charcoal-600 font-typewriter font-bold text-sm">
                                        {uploading ? 'Processing...' : 'Click to attach photo evidence'}
                                    </span>
                                    <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Event Title</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="THE BIG GIG..."
                                className="input-handwritten pl-10"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Details</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 w-4 h-4 text-charcoal-500" />
                            <textarea
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="What's going down?"
                                className="input-handwritten pl-10 resize-none"
                            />
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="input-handwritten pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Time</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="input-handwritten pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Venue */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Location</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                            <input
                                type="text"
                                required
                                value={formData.venue}
                                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                placeholder="Where's it at?"
                                className="input-handwritten pl-10"
                            />
                        </div>
                    </div>

                    {/* Category & Organizer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Category</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-handwritten pl-10"
                                >
                                    <option value="">Pick a vibe...</option>
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Organizer</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                                <input
                                    type="text"
                                    required
                                    value={formData.organizer}
                                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                    placeholder="Who's running this?"
                                    className="input-handwritten pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Organizer Phone */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold font-heading text-charcoal-900 uppercase tracking-wide">Organizer Phone</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                            <input
                                type="tel"
                                value={formData.organizer_phone}
                                onChange={(e) => setFormData({ ...formData, organizer_phone: e.target.value })}
                                placeholder="Contact number"
                                className="input-handwritten pl-10"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4 pt-4 border-t-2 border-charcoal-900 border-dashed">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white border-2 border-charcoal-900 text-charcoal-900 font-bold font-heading shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all"
                        >
                            SCRAP IT
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn-sticker flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                event ? 'RE-PRINT FLYER' : 'PIN TO BOARD'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

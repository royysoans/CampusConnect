import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
    const { user, isAdmin, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-charcoal-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-3 border-campus-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-charcoal-400 text-sm">Verifying access...</p>
                </div>
            </div>
        )
    }

    if (!user || !isAdmin) {
        return <Navigate to="/admin/login" replace />
    }

    return children
}

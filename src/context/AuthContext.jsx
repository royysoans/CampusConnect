import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user)
                fetchUserRole(session.user.id)
            } else {
                setLoading(false)
            }
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user)
                fetchUserRole(session.user.id)
            } else {
                setUser(null)
                setUserRole(null)
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function fetchUserRole(userId) {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('role')
                .eq('id', userId)
                .single()

            if (error) throw error
            setUserRole(data?.role || 'student')
        } catch (err) {
            console.error('Error fetching user role:', err)
            setUserRole('student')
        } finally {
            setLoading(false)
        }
    }

    async function signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        return data
    }

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    const isAdmin = userRole === 'admin'

    return (
        <AuthContext.Provider value={{ user, userRole, isAdmin, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

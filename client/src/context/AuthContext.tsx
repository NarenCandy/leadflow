import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthState, LoginCredentials, RegisterCredentials } from '../types/index'
import axiosInstance from '../api/axios'
import toast from 'react-hot-toast'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (credentials: RegisterCredentials) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On app load, restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials)
      const { user: loggedInUser, token: newToken } = response.data.data

      setUser(loggedInUser)
      setToken(newToken)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(loggedInUser))

      toast.success(`Welcome back, ${loggedInUser.name}!`)
      return true
    } catch (error: unknown) {
      let message ='Login failed. Please try again.'
      if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data
    ) {
      message = (error.response.data as { message: string }).message
    }
      toast.error(message)
      return false
    }
  }

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      const response = await axiosInstance.post('/auth/register', credentials)
      const { user: newUser, token: newToken } = response.data.data

      setUser(newUser)
      setToken(newToken)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))

      toast.success('Account created successfully!')
      return true
    } catch (error: unknown) {
      let message ='Registration failed. Please try again.'
      if (
      error &&
      typeof error === 'object' &&
      'response' in error &&
      error.response &&
      typeof error.response === 'object' &&
      'data' in error.response &&
      error.response.data &&
      typeof error.response.data === 'object' &&
      'message' in error.response.data
    ) {
      message = (error.response.data as { message: string }).message
    }
      toast.error(message)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.success('Logged out successfully')
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}





export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
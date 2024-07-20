import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"


function ProtectedRoute({ children }) {
    // Verificando se estamos autorizados
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    const refresToken = async () => {
        const refresToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            const response = await api.post('/api/token/refresh/', {
                refresh: refresToken 
            })

            if (response.status >= 200 && response.status < 300) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access) // Novo token Configurado
                setIsAuthorized(true)
            } else {
                console.log('um erro>>>>', error)
                setIsAuthorized(false)
            }
        } catch (error) {
            console.log(error)
            setIsAuthorized(false)
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        
        if (!token) {
            setIsAuthorized(false)
            return
        }

        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        if (tokenExpiration < now) {
            await refresToken()
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null) {
        return <div>Carregando...</div>
    }

    return isAuthorized? children: <Navigate to="/login" />
}

export default ProtectedRoute
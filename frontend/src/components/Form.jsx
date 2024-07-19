import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"


function Form({ route, method }) {
    const [email, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login"? "Login": "Register"

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            if (method == "login") {
                const response = await api.post(route, { email, password })
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                navigate("/dashboard")
            } else {
                const response = await api.post(route, { email, password, first_name, last_name})
                navigate("/login")
            }

        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>

        <input className="form-input"
            type="email"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nome"
        />

        <input className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
        />

        <button type="submit">{name}</button>
    </form>
}

export default Form
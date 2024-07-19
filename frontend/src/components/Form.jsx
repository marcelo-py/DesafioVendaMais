import { useState } from "react"
import api from "../api"
import { useNavigate } from "react-router-dom"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import "../styles/Form.css"


function Form({ route, method }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [first_name, setFirstName] = useState("")
    const [last_name, setLastName] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const name = method === "login" ? "Entrar" : "Cadastrar"
    const isLogin = method === "login";

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            if (isLogin) {
                const response = await api.post(route, { email, password })
                localStorage.setItem(ACCESS_TOKEN, response.data.access)
                localStorage.setItem(REFRESH_TOKEN, response.data.refresh)
                navigate("/dashboard")
            } else {
                await api.post(route, { email, password, first_name, last_name });
                navigate("/login")
            }
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main>
            <h1>{name}</h1>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="fieldWrapper">
                    <label htmlFor="email">Email</label>
                    <input
                        className="form-input"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                </div>

                <div className="fieldWrapper">
                    <label htmlFor="password">Senha</label>
                    <input
                        className="form-input"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />
                </div>

                {!isLogin && (
                    <>
                        <div className="fieldWrapper">
                            <label htmlFor="first_name">Nome</label>
                            <input
                                className="form-input"
                                id="first_name"
                                type="text"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Nome"
                                required
                            />
                        </div>

                        <div className="fieldWrapper">
                            <label htmlFor="last_name">Sobrenome</label>
                            <input
                                className="form-input"
                                id="last_name"
                                type="text"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Sobrenome"
                                required
                            />
                        </div>
                    </>
                )}

                <button type="submit" disabled={loading}>
                    {name}
                </button>
            </form>
        </main>
    );
}

export default Form
import { useState, useEffect } from "react"
import api from "../api"
import TransactionList from "../components/Transaction"
import "../styles/Dashboard.css"
import TransactionTypeChart from '../components/TransactionTypeChart'


function DashBoard() {
    const [userName, setUserName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [transactions, setTransactions] = useState([])
    const [amount, setAmount] = useState("")
    const [transactionType, setTransactionType] = useState("")
    const [toAccount, setToAccount] = useState("")
    const [userID, setUserID] = useState(null)
    const [totalAmoutThirty, setTotalAmoutThirty] = useState('0, 00')
    const [balance, setBalance] = useState('0, 00')
    const [filterType, setFilterType] = useState('');

    useEffect(() => {
        fetchDashboardData()
        fetchTransactions()
    }, [])

    const fetchDashboardData = () => {
        api.get('/api/mybank/dashboard/')
            .then((response) => {
                setUserID(response.data.user_id)
                setUserName(response.data.username)
                setAccountNumber(response.data.account_number)
                setBalance(response.data.balance)
                setTotalAmoutThirty(response.data.total_amount_last_30_days)
            })
            .catch((error) => alert(error))
    }

    const fetchTransactions = (type = '') => {
        api.get("/api/mybank/transactions/", {
            params: { transaction_type: type }
        })
            .then((response) => {
                setTransactions(response.data)
                console.log(response.data)
            })
            .catch((error) => alert(error))
    }

    const createTransaction = (e) => {
        e.preventDefault()

        api.post("/api/mybank/transactions/create/", {
            amount: amount,
            transaction_type: transactionType,
            from_account: userID,
            to_account: toAccount,
        })
            .then((response) => {
                if (response.status === 201 && response.status <= 300) {
                    alert("Transação feita com sucesso!")
                    fetchTransactions()
                } else {
                    alert("Falha na transação.")
                }
            })
            .catch((error) => alert(error))
    }


    const handleFilterChange = (e) => {
        const type = e.target.value;
        setFilterType(type);
        fetchTransactions(type);
    }

    const clearFilter = () => {
        setFilterType('');
        fetchTransactions();
    }

    return (
        <main>
            <header className="headerGlobal">
                <h1>Dashboard</h1>
            </header>

            <section className="capeInfo">
                <div className="info">
                    <h2 className="username">{userName}</h2>
                    <div className="account-number-wrapper">
                        <svg width="28" height="21" viewBox="0 0 30 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M30 3.25V19.75C30 20.4884 29.7246 21.1314 29.1738 21.6788C28.623 22.2263 27.9609 22.5 
                            27.1875 22.5H2.8125C2.05729 22.5 1.39974 22.2263 0.839844 21.6788C0.279948 21.1314 0 20.4884 0 
                            19.75V3.25C0 2.51157 0.279948 1.86863 0.839844 1.32118C1.39974 0.773727 2.05729 0.5 2.8125 
                            0.5H27.1875C27.9609 0.5 28.623 0.773727 29.1738 1.32118C29.7246 1.86863 30 2.51157 30 3.25ZM2.8125 
                            6H27.1875V3.25H2.8125V6ZM2.8125 11.5V19.75H27.1875V11.5H2.8125Z" fill="#1E1E1E"/>
                        </svg>
                        <p className="account-number">{accountNumber}</p>
                    </div>
                    
                    <p className="balance">R${balance}, 00</p>
                </div>
            </section>


            <div className="wrapperSide">
                <article>
                    <section className="transaction-report-container-section">
                        <TransactionTypeChart />

                        <div className="recent-balance">
                            <h4>R${totalAmoutThirty}, 00</h4>
                            <p>Movimentados na sua conta nos últimos 30 dias </p>
                        </div>
                    </section>

                    <section className="make-transaction-section">
                        <h3>Fazer uma transação</h3>
                        <form onSubmit={createTransaction}>
                            <div className="field-wrapper">
                                <label htmlFor="transaction_type">Tipo de Transação</label>
                                <select
                                    id="transaction_type"
                                    name="transaction_type"
                                    required
                                    onChange={(e) => setTransactionType(e.target.value)}
                                    value={transactionType}
                                >
                                    <option value="">Selecione o tipo de transação</option>
                                    <option value="deposit">Deposito</option>
                                    <option value="withdrawal">Saque</option>
                                    <option value="transfer">Transferencia</option>
                                </select>
                            </div>
                            <div className="number-account-amount">
                                <div className="field-wrapper">
                                    <label htmlFor="to_account">Numero da conta</label>
                                    <input
                                        type="text"
                                        id="to_account"
                                        name="to_account"
                                        placeholder="número da conta"
                                        required
                                        onChange={(e) => setToAccount(e.target.value)}
                                        value={toAccount}
                                    />
                                </div>

                                <div className="field-wrapper">
                                    <label htmlFor="amount">Valor</label>
                                    <input
                                        type="number"
                                        id="amount"
                                        name="amount"
                                        placeholder="valor"
                                        required
                                        onChange={(e) => setAmount(e.target.value)}
                                        value={amount}
                                    />
                                </div>
                            </div>
                            <button type="submit">Enviar</button>
                        </form>
                    </section>
                </article>

                <aside className="transaction-container">
                    <header>
                        <h3>Extrato</h3>
                        <form>
                            <select id="transaction_type" name="transaction_type" onChange={handleFilterChange}>
                                <option value="">Filtrar por</option>
                                <option value="deposit">Deposito</option>
                                <option value="withdrawal">Saque</option>
                                <option value="transfer">Transferencia</option>
                            </select>
                            <button type="reset" onClick={clearFilter}>Limpar Filtro</button>
                        </form> 
                    </header>
                    
                    <TransactionList transactions={transactions} accountNumberMyUser={accountNumber} />
                </aside>
            </div>
        </main>
    );
}

export default DashBoard;

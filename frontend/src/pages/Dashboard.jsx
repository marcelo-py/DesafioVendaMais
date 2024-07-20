import { useState, useEffect } from "react"
import api from "../api"
import TransactionList from "../components/Transaction"

function DashBoard() {
    let userName
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState("")
    const [transactionType, setTransactionType] = useState("")
    const [toAccount, setToAccount] = useState("")
    const [userID, setUserID] = useState(null)

    useEffect(() => {
        fetchDashboardData();
        fetchTransactions();
    }, []);

    const fetchDashboardData = () => {
        api.get('/api/mybank/dashboard/')
            .then((response) => {
                setUserID(response.data.user_id);
                console.log(response.data)
                userName = `${response.data}`
            })
            .catch((error) => alert(error));
    }

    const fetchTransactions = () => {
        api.get("/api/mybank/transactions/")
            .then((response) => {
                setTransactions(response.data);
                console.log(response.data);
            })
            .catch((error) => alert(error));
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
                    alert("Transação feita com sucesso!");
                    fetchTransactions(); // Atualize a lista de transações
                } else {
                    alert("Falha na transação.");
                }
            })
            .catch((error) => alert(error));
    };

    return (
        <main>
            <h1>Dashboard</h1>

            <section>
                <h2>Fazer uma transação</h2>
                <form onSubmit={createTransaction}>
                    <div>
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

                    <div>
                        <label htmlFor="to_account">Fazer transferencia para</label>
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

                    <div>
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

                    <button type="submit">Enviar</button>
                </form>
            </section>

            <section>
                <h2>Lista de Transações</h2>
                <TransactionList transactions={transactions} />
            </section>
        </main>
    );
}

export default DashBoard;

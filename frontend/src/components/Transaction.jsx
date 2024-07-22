import React from "react"
import redeem from "../images/redeem.svg"

function TransactionList({ transactions, accountNumberMyUser }) {
    const transactionTypeTranslations = {
        deposit: 'Depósito',
        withdrawal: 'Saque',
        transfer: 'Transferência',
    }

    return (
        <>
            {transactions.length > 0 ? (
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>

                            <div className="top-info">
                                <h4>
                                    {
                                        transaction.gift && ( // checando se foi o presente
                                            <img src={redeem} alt="Redeem" title="Prsente nosso por entrar" />
                                        )
                                    }
                                    {
                                        transaction.to_account == accountNumberMyUser && transaction.transaction_type !== 'withdrawal' ? '+' : '-'} R${transaction.amount
                                    }
                                </h4>
                                <p>({transactionTypeTranslations[transaction.transaction_type]})</p>
                            </div>

                            {(transaction.transaction_type !== 'deposit' && transaction.to_account !== accountNumberMyUser) && (
                                <>
                                    <p>Nome Usuario - {transaction.from_account}</p>
                                </>
                            )}

                            <p>Data: {new Date(transaction.timestamp).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma transação encontrada</p>
            )}
        </>
    )
}

export default TransactionList

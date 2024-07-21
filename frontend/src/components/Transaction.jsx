import React from "react"

function TransactionList({ transactions, accountNumberMyUser }) {
    const transactionTypeTranslations = {
        deposit: 'Depósito',
        withdrawal: 'Saque',
        transfer: 'Transferência',
    };
    
    return (
        <>
            {transactions.length > 0 ? (
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            
                            <div className="top-info">
                                <h4>{transaction.to_account == accountNumberMyUser && transaction.transaction_type !== 'withdrawal'? '+': '-'} R${transaction.amount}</h4>
                                <p>({transactionTypeTranslations[transaction.transaction_type]})</p>
                            </div>

                            {transaction.transaction_type !== 'deposit' && (
                                <>
                                    <p>Nome Usuario - {transaction.from_account}</p>
                                </>
                            )}

                            <p>Data: {transaction.timestamp}</p>
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

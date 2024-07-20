import React from "react";

function TransactionList({ transactions }) {
    return (
        <div>
            {transactions.length > 0 ? (
                <ul>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            <p>Tipo: {transaction.transaction_type}</p>
                            <p>Valor: {transaction.amount}</p>
                            <p>De: {transaction.from_account}</p>
                            <p>Para: {transaction.to_account}</p>
                            <p>Data: {transaction.timestamp}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Nenhuma transação encontrada</p>
            )}
        </div>
    );
}

export default TransactionList;


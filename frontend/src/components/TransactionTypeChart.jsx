import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import api from '../api'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const TransactionTypeChart = () => {
    const [chartData, setChartData] = useState({ labels: [], counts: [] })

    useEffect(() => {
        api.get('/api/mybank/transaction-stats/')
            .then(response => {
                console.log('API response:', response.data)
                const { labels, counts } = response.data
                setChartData({ labels, counts })
            })
            .catch(error => console.error(error))
    }, [])

    const data = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Número de Transações',
                data: chartData.counts,
                backgroundColor: '#4477AA',
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1,

                barThickness: 30, // Define a largura das barras
                maxBarThickness: 20, // Define a largura máxima das barras
                minBarLength: 2, // Define a altura mínima das barras
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`
                    },
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                // Ajuste o espaço entre as barras
                ticks: {
                    autoSkip: true,
                },
                grid: {
                    display: true,
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    // Força o eixo Y a usar apenas inteiros
                    stepSize: 1,
                    callback: function(value) {
                        return Number.isInteger(value) ? value : ''
                    },
                },
            },
        },
    }

    return (
        <div className='graphic-area'>
            <h2>Grafico de transações</h2>
            <div className='graphic-wrapper'> {/* Defina o tamanho do gráfico */}
                <Bar data={data} options={options} />
            </div>
        </div>
    )
}

export default TransactionTypeChart

# DesafioVendaMais

## Visão Geral

Este projeto é uma aplicação web que permite aos usuários visualizar e fazer transações bancarias (Simulação). 
Ele inclui funcionalidades como visualizar transações, realizar depósitos, saques e transferências, e visualizar 
um relatório das transações dos últimos 30 dias, além de filtrar todos os extratos extratos.

## Funcionalidades

- Visualização de transações financeiras
- Realização de depósitos, saques e transferências
- Relatório de transações dos últimos 30 dias
- Filtros de transações por tipo
- Autenticação de usuários

## Tecnologias Utilizadas

- **Frontend**: React
- **Backend**: Django, Django REST Framework
- **Banco de Dados**: SQLite3
- **Outras**: CSS para estilização

## Pré-requisitos

Certifique-se de ter instalado:

- Python 3.x
- Node.js e npm

## Configuração do Ambiente

### Backend (Django)

#### Detalhe
crie um arquivo ```.env``` na raiz de DesafioVendaMais/backend/ e coloque as variaveis do arquivo ```.env.exemplo``` e seus valores

1. Clone o repositório:
    ```bash
    https://github.com/marcelo-py/DesafioVendaMais
    cd /backend

2. Configure o DJango:
    ```bash
    python3 -m venv .venv

    # Comandos para Sitemas diferentes para ativar o Ambiente virtual

    # Linux
    source ./.venv/bin/activate
    # Windows
    .\venv\Scripts\Activate

    # Para instalar as dependencias
    pip install -r requirements.txt

3. Rode as migrações do Django
para trabalhor melhor no django sugiro que mude pra a pasta /backend/
    ```bash
    python manage.py makemigrations accounts
    python manage.py makemigrations mybank
    python manage.py migrate

    # Rode o django
    python manage.py runserver
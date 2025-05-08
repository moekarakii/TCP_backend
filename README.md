# TCP Backend – Pokémon Trading Card Platform

This is the **backend API** for the Pokémon Trading Card Platform (PTC). It supports user authentication, pack opening, card collection management, and a real-time trading system.

🔗 Frontend Repo: [TCP Frontend](https://github.com/Jaden-B11/TCP_frontend)

---

## 📦 Tech Stack

- **Node.js** with **Express**
- **Sequelize** ORM with **MySQL**
- **Firebase Auth** for secure authentication
- **Heroku** for deployment
- **Docker** (local dev DB)
- External API: [Pokémon TCG API](https://pokemontcg.io/)

---

## 🚀 Features

- 🔐 **Authentication** (Firebase JWT)
- 📦 **Card Packs** – Open packs and add cards to collection
- 🃏 **User Collection** – Track owned cards by user
- 🔍 **Search** – Browse cards by rarity and set
- 🔄 **Trading System** – Offer, view, accept, and cancel trades
- 🌐 **Public Trade Forum** – View all pending trade listings

---

## 🛠️ Setup Instructions

### 1. Clone the repo

git clone https://github.com/moekarakii/TCP_backend.git
cd TCP_backend
npm install

### 2. Create a .env file
PORT=3001
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
POKEMON_TCG_API_KEY=your-pokemon-tcg-api-key

### 3. Run locally
npm run dev

To test MySQL locally with Docker:
docker-compose up


🧪 API Endpoints

Auth
	•	Protected routes require Authorization: Bearer <FirebaseToken>

Packs
	•	GET /api/packs/:packId – Opens a pack (1 = Common, 2 = Uncommon, 3 = Rare)

Collection
	•	GET /api/collection – Returns full card info for the authenticated user’s collection

Trading
	•	POST /api/trades – Create a trade offer
	•	PUT /api/trades/:id/accept – Accept a trade
	•	DELETE /api/trades/:id – Cancel a trade
	•	GET /api/trades/:userId – View user’s trade history
	•	GET /api/trades/forum – View public trade forum

📷 Sample Trade Payload
{
  "receivingUserId": "abc123",
  "offeredCardId": "swsh1-10",
  "requestedCardId": "swsh1-16"
}

📚 Project Structure
src/
├── routes/       # Express routes
├── models/       # Sequelize models
├── middleware/   # Auth middleware
├── config/       # Sequelize & Firebase config
└── server.js     # Entry point




Created by Moe Karaki and team for CST 438 – Software Engineering
© 2025 Pokémon Trading Card Platform

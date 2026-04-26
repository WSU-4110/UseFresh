# UseFresh — Installation Guide

## System Requirements

| Requirement | Minimum Version | Notes |
|-------------|----------------|-------|
| Node.js | v16 or higher | Required for all three components |
| npm | v8 or higher | Comes bundled with Node.js |
| MongoDB | v6 or higher | Cloud (MongoDB Atlas) or local instance |
| Hugging Face Account | — | Free account needed for AI features |
| Git | Any recent version | For cloning the repository |

To verify your Node.js and npm versions:
```bash
node -v
npm -v
```

---

## External Accounts Required

### MongoDB Atlas (Database)
1. Create a free account at [mongodb.com](https://www.mongodb.com)
2. Create a new cluster
3. Under **Database Access**, create a database user with a username and password
4. Under **Network Access**, add your IP address (or `0.0.0.0/0` to allow all)
5. Click **Connect → Drivers** and copy the connection string — you will need this for the `.env` files

### Hugging Face (AI Component)
1. Create a free account at [huggingface.co](https://huggingface.co)
2. Go to **Settings → Access Tokens**
3. Create a new token with **Read** permissions
4. Copy the token — you will need this for the AI component `.env` file

### Gmail App Password (Password Reset Emails)
1. Use or create a Gmail account for the app to send emails from
2. Enable **2-Step Verification** on that Google account
3. Go to **Google Account → Security → App Passwords**
4. Create a new App Password (name it "UseFresh")
5. Copy the 16-character password — you will need this for the backend `.env` file

---

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd UseFresh
```

### 2. Set Up the Backend

Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```
MONGO_URI=your_mongodb_connection_string
PORT=3001
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your16characterapppassword
```

> Replace `your_mongodb_connection_string` with the connection string from MongoDB Atlas. Make sure to append the database name, e.g. `...mongodb.net/usefresh?...`

### 3. Set Up the Frontend

Navigate to the frontend folder and install dependencies:
```bash
cd ../frontend
npm install
```

No `.env` file is required for the frontend.

### 4. Set Up the AI Component

Navigate to the AI component folder and install dependencies:
```bash
cd ../AI_component
npm install
```

Create a `.env` file inside the `AI_component` folder:
```
MONGO_URI=your_mongodb_connection_string
HF_TOKEN=your_hugging_face_api_token
```

> Use the same `MONGO_URI` as the backend. The `HF_TOKEN` is the token from your Hugging Face account.

---

## Running the Application

The application has three separate servers that must all be running at the same time. Open three separate terminals.

**Terminal 1 — AI Component**
```bash
cd AI_component
node Scanserver.js
```
Runs on `http://localhost:5000`

**Terminal 2 — Backend**
```bash
cd backend
npm start
```
Runs on `http://localhost:3001`

**Terminal 3 — Frontend**
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173`

Once all three are running, open your browser and go to `http://localhost:5173`.

---

## Dependencies Reference

### Frontend
| Package | Version |
|---------|---------|
| react | ^19.2.0 |
| react-dom | ^19.2.0 |
| react-router-dom | ^7.13.0 |
| axios | ^1.15.0 |
| bootstrap | ^5.3.8 |
| vite | ^7.2.4 |

### Backend
| Package | Version |
|---------|---------|
| express | ^4.18.2 |
| mongoose | ^8.23.0 |
| bcrypt | ^6.0.0 |
| nodemailer | ^8.0.5 |
| dotenv | ^17.3.1 |
| cors | ^2.8.6 |
| nodemon | ^3.1.11 |

### AI Component
| Package | Version |
|---------|---------|
| express | ^5.2.1 |
| @huggingface/inference | ^4.13.14 |
| mongoose | ^8.23.0 |
| multer | ^2.1.1 |
| dotenv | ^17.3.1 |
| cors | ^2.8.6 |

---

## Troubleshooting

**`npm install` fails**
- Make sure you are running Node.js v16 or higher (`node -v`)
- Delete the `node_modules` folder and `package-lock.json`, then run `npm install` again

**Backend fails to connect to MongoDB**
- Verify the `MONGO_URI` in `backend/.env` is correct
- Check that your IP address is whitelisted in MongoDB Atlas under Network Access

**AI component fails to start**
- Verify `HF_TOKEN` is set correctly in `AI_component/.env`
- Make sure the same `MONGO_URI` is used in both `backend/.env` and `AI_component/.env`

**Password reset email not sending**
- Make sure 2-Step Verification is enabled on the Gmail account
- Make sure the App Password has no spaces (enter the 16 characters without spaces)
- Check the backend terminal for the exact error message

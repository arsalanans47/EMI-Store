# EMI Store

A full-stack EMI product catalog for smartphones. The app shows available phones, color and storage variants, pricing, cashback offers, and EMI plans. It uses a React + Vite frontend and an Express + MongoDB backend.

## Tech Stack

### Frontend

- React 19
- Vite
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv
- Nodemon for development

## Project Structure

```text
1fi-emi-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                     # MongoDB connection setup
│   │   ├── controllers/
│   │   │   └── productController.js      # Product API controller logic
│   │   ├── models/
│   │   │   └── product.js                # Mongoose schema for products, variants, and EMI plans
│   │   ├── routes/
│   │   │   └── productRoutes.js          # /api/products and /api/products/:slug routes
│   │   ├── seed/
│   │   │   └── products.js               # Sample product seed data
│   │   └── server.js                     # Express server entry point
│   ├── package.json
│   └── .env                              # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx                       # Main React app, product listing, and detail views
│   │   ├── App.css                       # App-level styling
│   │   ├── index.css                     # Global styling
│   │   └── main.jsx                      # React entry point
│   ├── public/
│   ├── vite.config.js                    # Vite configuration and API proxy
│   ├── .env.production                   # Production API base URL
│   └── package.json
└── README.md
```

## Setup and Run Instructions

### Prerequisites

Make sure these are installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance

### 1. Clone the Project

```bash
git clone <repository-url>
cd "Assessment_ 1Fi"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGO_URL=your_mongodb_connection_string
```

Run the backend server:

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Seed the Database

The project includes seed data for products and EMI plans.

From the `backend` folder, run:

```bash
node src/seed/products.js
```

This command removes existing products and inserts the sample products from `backend/src/seed/products.js`.

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

For local development, the frontend uses Vite's proxy for `/api` requests.

Run the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

### 5. Production API URL

The frontend production environment is configured with:

```env
VITE_API_BASE_URL=https://emi-store-1hok.onrender.com/api
```

For your own deployment, update `frontend/.env.production` with your backend API URL.

## API Endpoints

Base URL for local development:

```text
http://localhost:5000
```

### Health Check

```http
GET /
```

Example response:

```json
{
  "status": "ok",
  "message": "EMI Store API is running"
}
```

### Get All Products

```http
GET /api/products
```

Example response:

```json
{
  "success": true,
  "data": [
    {
      "_id": "66d9f2f9b1234567890abcde",
      "name": "iPhone 17 Pro",
      "slug": "iphone-17-pro",
      "brand": "Apple",
      "variants": [
        {
          "color": "Silver",
          "storage": "256GB",
          "image": "https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/317432_0_8iVhHIsBIF.png?updatedAt=1757529382415",
          "mrp": 134900,
          "price": 129900,
          "emiplans": [
            {
              "monthlyPayment": 43300,
              "tenure": 3,
              "interestRate": 0,
              "cashback": 2000
            },
            {
              "monthlyPayment": 21650,
              "tenure": 6,
              "interestRate": 0,
              "cashback": 2500
            }
          ]
        }
      ],
      "createdAt": "2026-09-05T00:00:00.000Z",
      "updatedAt": "2026-09-05T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### Get Product by Slug

```http
GET /api/products/:slug
```

Example request:

```http
GET /api/products/iphone-17-pro
```

Example response:

```json
{
  "success": true,
  "data": {
    "_id": "66d9f2f9b1234567890abcde",
    "name": "iPhone 17 Pro",
    "slug": "iphone-17-pro",
    "brand": "Apple",
    "variants": [
      {
        "color": "Silver",
        "storage": "256GB",
        "image": "https://media-ik.croma.com/Croma%20Assets/Communication/Mobiles/Images/317432_0_8iVhHIsBIF.png?updatedAt=1757529382415",
        "mrp": 134900,
        "price": 129900,
        "emiplans": [
          {
            "monthlyPayment": 43300,
            "tenure": 3,
            "interestRate": 0,
            "cashback": 2000
          },
          {
            "monthlyPayment": 21650,
            "tenure": 6,
            "interestRate": 0,
            "cashback": 2500
          },
          {
            "monthlyPayment": 11450.5,
            "tenure": 12,
            "interestRate": 10.5,
            "cashback": 3000
          }
        ]
      }
    ],
    "createdAt": "2026-09-05T00:00:00.000Z",
    "updatedAt": "2026-09-05T00:00:00.000Z"
  }
}
```

### Product Not Found

```http
GET /api/products/invalid-slug
```

Example response:

```json
{
  "success": false,
  "message": "Product not found"
}
```

### Server Error Response

Example response:

```json
{
  "success": false,
  "message": "Failed to fetch products",
  "error": "Error message"
}
```

## Schema Used

The backend uses a Mongoose `Product` schema.

### Product Schema

```js
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  variants: [
    {
      color: {
        type: String,
        required: true,
        trim: true
      },
      storage: {
        type: String,
        required: true,
        trim: true
      },
      image: {
        type: String,
        required: true,
        trim: true
      },
      mrp: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      emiplans: [
        {
          monthlyPayment: {
            type: Number,
            required: true
          },
          tenure: {
            type: Number,
            required: true
          },
          interestRate: {
            type: Number,
            required: true
          },
          cashback: {
            type: Number,
            default: 0
          }
        }
      ]
    }
  ]
}
```

The schema also enables timestamps, so MongoDB documents include:

```js
createdAt
updatedAt
```

## Main Features

- Product listing page
- Product detail page using product slug
- Multiple product variants
- EMI plan display
- Cashback and pricing details
- MongoDB seed data
- Production-ready frontend API environment variable

## Useful Scripts

### Backend

```bash
npm run dev
npm start
node src/seed/products.js
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Notes

- Backend must be running before using the frontend locally.
- Make sure `MONGO_URL` is valid before starting the backend or running the seed script.
- The frontend fetches products from `/api/products` in development.
- The production frontend uses `VITE_API_BASE_URL` from `frontend/.env.production`.

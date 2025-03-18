
# ExpenseTracker Backend

This is the backend server for the ExpenseTracker application.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/expensetracker
     JWT_SECRET=your_jwt_secret_key_change_this_in_production
     ```

3. Run the server:
   - For development:
     ```
     npm run dev
     ```
   - For production:
     ```
     npm start
     ```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login a user
- `GET /api/users/me` - Get authenticated user profile

### Transactions
- `GET /api/transactions` - Get all transactions for authenticated user
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get a specific transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/transactions/summary/monthly` - Get monthly summary

### Categories
- `GET /api/categories` - Get all categories for authenticated user
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

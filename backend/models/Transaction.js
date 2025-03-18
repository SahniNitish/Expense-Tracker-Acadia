
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add an amount']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Please specify transaction type']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);

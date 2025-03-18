
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @route   GET /api/transactions
// @desc    Get all transactions for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    
    res.json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/transactions
// @desc    Add transaction
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { amount, description, category, type, date } = req.body;
    
    const transaction = await Transaction.create({
      amount,
      description,
      category,
      type,
      date: date || Date.now(),
      user: req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/transactions/:id
// @desc    Get single transaction
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this transaction'
      });
    }
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this transaction'
      });
    }
    
    transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }
    
    // Make sure user owns transaction
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this transaction'
      });
    }
    
    await transaction.deleteOne();
    
    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/transactions/summary
// @desc    Get transactions summary (monthly data)
// @access  Private
router.get('/summary/monthly', protect, async (req, res) => {
  try {
    // Get all user transactions
    const transactions = await Transaction.find({ user: req.user._id });
    
    // Process transactions to get monthly summary
    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize monthly data with zeros
    months.forEach(month => {
      monthlyData.push({
        month,
        income: 0,
        expense: 0
      });
    });
    
    // Populate with actual data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthIndex = date.getMonth();
      
      if (transaction.type === 'income') {
        monthlyData[monthIndex].income += transaction.amount;
      } else {
        monthlyData[monthIndex].expense += transaction.amount;
      }
    });
    
    res.json({
      success: true,
      data: monthlyData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;

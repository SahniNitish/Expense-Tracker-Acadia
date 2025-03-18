
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

// @route   GET /api/categories
// @desc    Get all categories for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user._id });
    
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/categories
// @desc    Add category
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, color } = req.body;
    
    // Check if category already exists for this user
    const existingCategory = await Category.findOne({ 
      name: name, 
      user: req.user._id 
    });
    
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists'
      });
    }
    
    const category = await Category.create({
      name,
      color,
      user: req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Make sure user owns category
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this category'
      });
    }
    
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    
    // Make sure user owns category
    if (category.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this category'
      });
    }
    
    await category.deleteOne();
    
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

module.exports = router;

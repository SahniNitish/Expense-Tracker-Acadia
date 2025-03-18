
const Category = require('../models/Category');

// Default categories with colors
const defaultCategories = [
  { name: 'Food', color: '#FF5733' },
  { name: 'Transportation', color: '#33A1FF' },
  { name: 'Housing', color: '#33FF57' },
  { name: 'Entertainment', color: '#D433FF' },
  { name: 'Shopping', color: '#FF33A1' },
  { name: 'Utilities', color: '#33FFD4' },
  { name: 'Healthcare', color: '#FF3333' },
  { name: 'Education', color: '#FFFF33' },
  { name: 'Salary', color: '#33FF33' },
  { name: 'Investments', color: '#3333FF' }
];

// Function to create default categories for a new user
const setupDefaultCategories = async (userId) => {
  try {
    console.log(`Setting up default categories for user: ${userId}`);
    
    // Check if user already has categories
    const existingCategories = await Category.find({ user: userId });
    
    if (existingCategories.length > 0) {
      console.log('User already has categories, skipping setup');
      return;
    }
    
    // Create default categories for the user
    const categoryPromises = defaultCategories.map(category => 
      Category.create({
        name: category.name,
        color: category.color,
        user: userId
      })
    );
    
    await Promise.all(categoryPromises);
    console.log(`Successfully created ${defaultCategories.length} default categories for user`);
  } catch (error) {
    console.error('Error setting up default categories:', error);
  }
};

module.exports = { setupDefaultCategories };

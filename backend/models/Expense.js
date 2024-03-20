const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  // _id: String,
  title: String,
  amount: Number,
  category: String,
  type: { type: String, enum: ['Debit', 'Credit'], default: 'Debit' }, // Add the type field
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
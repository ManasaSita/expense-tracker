const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new expense
router.post('/', async (req, res) => {
  const expense = new Expense({
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    type: req.body.type
  });
    console.log("---------------------------------", req);
    // console.log("Router POST", JSON.stringify(expense));
  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    console.log("Error message: ", err.message);
    res.status(400).json({ message: err.message });
  }
});

// Update an expense
router.put('/:id', async (req, res) => {
  console.log("----------------------");
  console.log(req.body);
  const { title, amount, category, type } = req.body;
  const expenseId = req.params.id;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      { title, amount, category, type },
      { new: true }
    );

    res.json(updatedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch an expense
router.get('/:id', async (req, res) => {
  const expenseId = req.params.id;

  try {
    const fetchExpense = await Expense.findById(expenseId);

    if (fetchExpense) {
      res.json(fetchExpense);
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an expense
router.delete('/:id', async (req, res) => {
try {
  const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
  if (!deletedExpense) {
    return res.status(404).json({ message: 'Expense not found' });
  }
  res.json({ message: 'Expense deleted successfully', deletedExpense });
} catch (err) {
  res.status(500).json({ message: err.message });
}
});

// POST route to add a new expense
router.post('/expenses', async (req, res) => {
  try {
    const { title, amount, category, type } = req.body;
    const expense = new Expense({ title, amount, category, type });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Error adding expense' });
  }
});

// GET route to fetch the balance
router.get('/balance', async (req, res) => {
  try {
    const expenses = await Expense.find();
    const totalCredit = expenses.reduce((total, expense) => {
      return expense.type === 'Credit' ? total + expense.amount : total;
    }, 0);
    const totalDebit = expenses.reduce((total, expense) => {
      return expense.type === 'Debit' ? total + expense.amount : total;
    }, 0);
    const balance = totalCredit - totalDebit;
    res.json({ balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({ message: 'Error fetching balance' });
  }
});

// GET route to fetch the latest transactions
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Expense.find().sort({ date: -1 }).limit(5);
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

module.exports = router;

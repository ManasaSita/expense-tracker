// EditExpenseForm.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const EditExpenseForm = ({ fetchExpenses, expenseDetails }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'Debit'
  });

  useEffect(() => {
    if (expenseDetails) {
        setFormData({
          title: expenseDetails.title,
          amount: expenseDetails.amount,
          category: expenseDetails.category,
          type: expenseDetails.type
        });
      }
    }, [expenseDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedExpense = {
      ...formData,
      _id: id
    };

    try {
      await axios.put(`http://localhost:5000/api/expenses/edit/${id}`, updatedExpense); // Correct API endpoint
      fetchExpenses();
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  };

  return (
    <div>
      <h2>Edit Expense</h2>
        <form onSubmit={handleSubmit}>
        <div className="main-form">
          <label>
            Title:
            <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
          </label>
          <label>
            Amount:
            <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} required />
          </label>
          <label>
            Category:
            <input type="text" name="category" value={formData.category} onChange={handleInputChange} required />
          </label>
          <label>
            Type:
            <select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </select>
          </label>
          <button className='submit-btn'  type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditExpenseForm;

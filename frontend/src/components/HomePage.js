import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, PlusCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
// import NewExpenseForm from './NewExpense';
import EditExpenseForm from './EditExpense';
import { Link, useHistory } from 'react-router-dom';

const HomePage = ({ expenses, fetchExpenses }) => {
  const history = useHistory(); // Access the history object
  const [exps, setExpenses] = useState([expenses]);
  const [balance, setBalance] = useState(0);
  const [form, setHide] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    calculateBalance();
  }, [expenses]);

  const calculateBalance = () => {
    const totalCredit = expenses
      .filter(expense => expense.type === 'Credit')
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalDebit = expenses
      .filter(expense => expense.type === 'Debit')
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    setBalance(totalCredit - totalDebit);
  };

  const showForm = () => {
    console.log("showForm--------", form);
    setHide(!form);
  };

  // Function to fetch expense details by ID
  const fetchExpenseDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/expenses/${id}`);
      const data = response.data;
      return data;
    } catch (error) {
      console.error('Error fetching expense details:', error);
      throw error;
    }
  };

  // Function to handle edit button click
  const handleEditClick = async (id) => {
    try {
      const expenseDetails = await fetchExpenseDetails(id);
      // Navigate to edit page with the expense ID and details
      history.push(`/edit/${id}`, { expenseDetails });
    } catch (error) {
      console.error('Error handling edit click:', error);
    }
  };


  const handleDelete = async (id) => {
    try {
      console.log("deleting------------", id);
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense._id !== id));
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className='main'>
      <div className='main-header'>
        <Home className='align-svg-home'/>
        <p>Expense Tracker</p>
        <PlusCircle className='align-svg-plus' onClick={showForm}/>
      </div>
      <h2>Balance: ₹{balance.toFixed(2)}</h2>
      {/* {form && <NewExpenseForm toggleForm={showForm} fetchExpenses={fetchExpenses}/>} */}
      <h2>Expenses</h2>
      <ul className='expense-list'>
        {expenses.slice().reverse().map(expense => (
          <li key={expense._id} value={expense._id}>
            <div>
              {expense.title}
            </div>
            <div id='expAmount' className='green-font'>
              ₹ {expense.amount}
            </div>
            <div>
              <Link to={`/edit/${expense._id}`}>
                <Edit2 onClick={() => handleEditClick(expense._id)}/>
              </Link>
            </div>
            <div>
              <Trash2 onClick={() => handleDelete(expense._id)}/>
            </div>
             {/* onClick={() => handleDelete(expense._id)}  - ₹ - {expense.category} - {expense.type}  onLoad={getExpenseType(expense.type)}*/}
          </li>
        ))}
      </ul>
      {/* <Link to="/edit">Edit Expense</Link> Link to edit expense form */}
    </div>
  );
};

export default HomePage;






 // const fetchExpenses = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:5000/api/expenses');
  //     setExpenses(response.data);
  //   } catch (error) {
  //     console.error('Error fetching expenses:', error);
  //   }
  // };
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, PlusCircle, XCircle, Edit2, Trash2 } from 'lucide-react';
import Modal from 'react-modal';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    type: 'Debit' // Default type is Debit
  });
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    calculateBalance();
  }, [expenses]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/expenses', newExpense);
      setNewExpense({ title: '', amount: '', category: '', type: 'Debit' });
      fetchExpenses(); // Refresh the expense list after adding a new expense
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [newValues, setNewValues] = useState({
    newTitle: '',
    newAmount: 0,
    newCategory: '',
    newType: ''
  });

  const handleEdit = async (id) => {
    // Fetch the expense to be edited
    const expenseToEdit = expenses.find(expense => expense._id === id);
    console.log(expenseToEdit);
    if (!expenseToEdit) {
      console.error('Expense not found');
      return;
    }
    setEditId(id);
    setNewValues({
      newTitle: expenseToEdit.title,
      newAmount: expenseToEdit.amount,
      newCategory: expenseToEdit.category,
      newType: expenseToEdit.type
    });
    openModal();
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setNewValues({
      ...newValues,
      [name]: value
    });
  };

  const handleEditSubmit = async () => {
    // Prepare updated expense data
    const id = editId;
    const expenseToEdit = expenses.find(expense => expense._id === id);
    const updatedExpense = {
      ...expenseToEdit,
      title: newValues.newTitle,
      amount: parseFloat(newValues.newAmount),
      category: newValues.newCategory,
      type: newValues.newType
    };

    // Make API call to update expense
    try {
      await axios.put(`http://localhost:5000/api/expenses/${id}`, updatedExpense);
      console.log("Updated-----");
      fetchExpenses(); // Refresh the expense list after editing
      closeModal();
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  };  
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense._id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const calculateBalance = () => {
    const totalCredit = expenses
      .filter(expense => expense.type === 'Credit')
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalDebit = expenses
      .filter(expense => expense.type === 'Debit')
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    setBalance(totalCredit - totalDebit);
  };

  const [form, setHide] = useState(true);

  const showForm = () => {
    setHide(!form);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option) => {
    handleInputChange({ target: { name: 'type', value: option } });
    handleEditInputChange( { target: {name: 'newType', value: option}});
    setIsOpen(false); // Close the dropdown after selecting an option
  };


  return (
    <div className='main'>
      <div className='main-header'>
        <Home className='align-svg-home'/>
        <p>Expense Tracker</p>
        <PlusCircle className='align-svg-plus' onClick={showForm} alt='Add a new transaction'/>
      </div>
      <div className='balance'>
        <h2>Balance: </h2> 
        <p> ₹ {balance.toFixed(2)}</p>
      </div>
      <form id='inputForm' className={form ? 'hidden' : ''} onSubmit={handleSubmit}>
        <div className="main-form">
          <div className='add-expense-title'>
            <h3 className='add-new-title'>Add a new transaction</h3>
            <div className='close-form'>
              <XCircle onClick={showForm}/>
            </div>
          </div>
          <div class="grid-container">
            <label for="title">Title:</label>
            <input type="text" id="title" name="title" value={newExpense.title} onChange={handleInputChange} required placeholder='Ex: Salary'/>
          </div>
          <div class="grid-container">
            <label for="amount">Amount: (in ₹ )</label>
            <input id='amount' type="number" name="amount" value={newExpense.amount} onChange={handleInputChange} required placeholder='Ex: 100000'/>
          </div>
          <div class="grid-container">
            <label for="category">Category:</label>
            <input id='category' type="text" name="category" value={newExpense.category} onChange={handleInputChange} required placeholder='Ex: Income'/>
          </div>
          <div class="grid-container">
            <label for="type">Type:</label>
            <div className="custom-select">
              <div className={`select-selected ${isOpen ? 'select-arrow-active' : ''}`} onClick={toggleSelect}>
                {newExpense.type}
              </div>
              <div className={`select-items ${isOpen ? '' : 'select-hide'}`}>
                <div className="select-item" onClick={() => handleOptionSelect('Debit')}>
                  Debit
                </div>
                <div className="select-item" onClick={() => handleOptionSelect('Credit')}>
                  Credit
                </div>
              </div>
            </div>
          </div>
          <div class="grid-container">
            <button className='submit-btn' type="submit">Add Transaction</button>
          </div>
        </div>
      </form>
      <h2>Transactions: </h2>
      <ul className='expense-list'>
        {expenses.slice().reverse().map(expense => (
          <li key={expense._id}>
            <div className='exp-title'>
              {expense.title}
            </div>
            <div id='expAmount' className={`exp-amount ${expense.type === 'Credit' ? 'credit' : 'debit'}`}>
              ₹ {expense.amount}
            </div>
            <div className='exp-edit'>
              <Edit2 onClick={() => handleEdit(expense._id)}/>
            </div>
            <div className='exp-delete'>
              <Trash2 onClick={() => handleDelete(expense._id)}/>
            </div>
             {/* - ₹ - {expense.category} - {expense.type}  onLoad={getExpenseType(expense.type)}*/}
          </li>
        ))}
      </ul>
      <Modal className='edit-modal' isOpen={modalIsOpen} onRequestClose={closeModal} ariaHideApp={false}>
        <form  onSubmit={handleEditSubmit}>
        <div className="main-edit-form">
          <div className='edit-expense-title'>
            <h2 className='edit-title'>Edit Transaction</h2>
            <div className='close-form'>
              <XCircle onClick={closeModal}/>
            </div>
          </div>
          <div class="grid-container">
            <label for="title">Title:</label>
            <input type="text" name="newTitle" value={newValues.newTitle} onChange={handleEditInputChange} required/>
          </div>
          <div class="grid-container">
            <label for="amount">Amount: (in ₹ )</label>
            <input  type="number" name="newAmount" value={newValues.newAmount} onChange={handleEditInputChange} required/>
          </div>
          <div class="grid-container">
            <label for="category">Category:</label>
            <input type="text" name="newCategory" value={newValues.newCategory} onChange={handleEditInputChange} required/>
          </div>
          <div class="grid-container">
            <label for="type">Type:</label>
            <div className="custom-select">
              <div className={`select-selected ${isOpen ? 'select-arrow-active' : ''}`} onClick={toggleSelect}>
                {newValues.newType}
              </div>
              <div className={`select-items ${isOpen ? '' : 'select-hide'}`}>
                <div className="select-item" onClick={() => handleOptionSelect('Debit')}>
                  Debit
                </div>
                <div className="select-item" onClick={() => handleOptionSelect('Credit')}>
                  Credit
                </div>
              </div>
            </div>
          </div>
          <div class="grid-container">
            <button className='submit-btn' type="submit">Add Transaction</button>
          </div>
        </div>
        </form>
      </Modal>
    </div>
  );
}

export default App;


// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import axios from 'axios';
// import HomePage from './components/HomePage';
// // import NewExpenseForm from './components/NewExpense';
// import EditExpenseForm from './components/EditExpense';

// const App = () => {
//   const [expenses, setExpenses] = useState([]);

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/expenses');
//       setExpenses(response.data);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//     }
//   };
  
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage expenses={expenses} fetchExpenses={fetchExpenses} />} />
//         {/* {<Route path="/new" element={<NewExpenseForm fetchExpenses={fetchExpenses} />} />} */}
//         <Route path="/edit/:id" element={<EditExpenseForm expenses={expenses} fetchExpenses={fetchExpenses} />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

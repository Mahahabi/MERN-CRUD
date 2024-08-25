import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const addItem = async () => {
    if (name && contact && email) {
      if (contact.length !== 10 || isNaN(contact)) {
        alert('Contact number only 10 digits.');
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/items', { name, contact, email });
        setName('');
        setContact('');
        setEmail('');
        setItems([...items, response.data]); // Update state with the new item
      } catch (error) {
        console.error('Error adding item:', error);
      }
    } else {
      alert('Both name and contact are required');
    }
  };

  const updateItem = async (id) => {
    const updatedName = prompt('Enter new name:');
    const updatedContact = prompt('Enter new contact number:');
    const updatedEmail = prompt('Enter email id:');
    if (updatedName || updatedContact || updatedEmail) {
      try {
        await axios.put(`http://localhost:5000/items/${id}`, { name: updatedName, contact: updatedContact, email: updatedEmail });
        fetchItems();
      } catch (error) {
        console.error('Error updating item:', error);
      }
    } else {
      alert('Name or contact must be provided');
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/items/${id}`);
      setItems(items.filter(item => item._id !== id)); // Remove the item from the state
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="App">
      <h1>CRUD Application</h1>
      
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter item name"
        />
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Enter contact number"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email id"
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <br></br>

      <div>
        <table border="2px" cellSpacing={0} width={900} height={250}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.contact}</td>
                <td>{item.email}</td>
                <td>
                  <button className='update'   onClick={() => updateItem(item._id)} >Update</button>
                  <button className='delete' onClick={() => deleteItem(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

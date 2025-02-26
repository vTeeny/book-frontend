import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', image_url: ''});
  const [editBook, setEditBook] = useState(null);
  const [error, setError] = useState('');
  const uri = 'https://ominous-train-9774xq9p6qqgc769g-5001.app.github.dev/'

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${uri}/books`);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setError(''); // Clear error when user starts typing
    if (editBook) {
      setEditBook({ ...editBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const validateForm = (book) => {
    if (!book.title.trim() || !book.author.trim() || !book.image_url.trim()) {
      setError('All fields are required. Please fill out the form completely.');
      return false;
    }
    return true;
  };

  const handleCreateBook = async () => {
    if (!validateForm(newBook)) return;

    try {
      const response = await axios.post(`${uri}/books`, newBook);
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', image_url: '' }); // Clear the form
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleEditBook = (book) => {
    setEditBook({ ...book });
    setError(''); // Clear error when editing starts
  };

  const handleUpdateBook = async () => {
    if (!validateForm(editBook)) return;

    try {
      const response = await axios.put(`${uri}/books/${editBook.id}`, editBook);
      const updatedBooks = books.map((book) =>
        book.id === editBook.id ? response.data : book
      );
      setBooks(updatedBooks);
      setEditBook(null); // Clear edit mode
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${uri}/books/${bookId}`);
      const filteredBooks = books.filter((book) => book.id !== bookId);
      setBooks(filteredBooks);
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div>
      <h1>Book List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message display */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>
                {editBook && editBook.id === book.id ? (
                  <input
                    type="text"
                    name="image_url"
                    value={editBook.image_url}
                    onChange={handleInputChange}
                  />
                ) : (
                  <img src={book.image_url} alt={book.title} width="50" /> 
                )}
              </td>
              <td>
                {editBook && editBook.id === book.id ? (
                  <input
                    type="text"
                    name="title"
                    value={editBook.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.title
                )}
              </td>
              <td>
                {editBook && editBook.id === book.id ? (
                  <input
                    type="text"
                    name="author"
                    value={editBook.author}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.author
                )}
              </td>
              <td>
                {editBook && editBook.id === book.id ? (
                  <button onClick={handleUpdateBook}>Update</button>
                ) : (
                  <button onClick={() => handleEditBook(book)}>Edit</button>
                )}
                <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Book</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newBook.title}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={newBook.author}
        onChange={handleInputChange}
      />
      <input  
        type="text"
        name="image_url"
        placeholder="Image URL"
        value={newBook.image_url}
        onChange={handleInputChange}
      />
      <button onClick={handleCreateBook}>Create</button>
    </div>
  );
};

export default App;

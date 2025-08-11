import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// Create an axios instance with the base URL set
const api = axios.create({
  baseURL: 'http://localhost:8081' // No trailing slash!
});

function App() {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    os: '',
    price: ''
  });

  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put('/update', product);
        alert('Update successful');
        setIsEditing(false);
      } else {
        await api.post('/insert', product);
        alert('Insert successful');
      }
      setProduct({ id: '', name: '', os: '', price: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert('Operation failed');
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/display');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const editProduct = (p) => {
    setProduct(p);
    setIsEditing(true);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/delete/${id}`);
        alert('Delete successful');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container mt-4">
      <div className="form-container">
        <h2 className="text-center mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group row">
            <label htmlFor="id" className="col-sm-3 col-form-label form-label">ID:</label>
            <div className="col-sm-9">
              <input
                type="number"
                name="id"
                id="id"
                className="form-control"
                value={product.id}
                onChange={handleChange}
                required
                disabled={isEditing}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="name" className="col-sm-3 col-form-label form-label">Name:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="os" className="col-sm-3 col-form-label form-label">OS:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="os"
                id="os"
                className="form-control"
                value={product.os}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="price" className="col-sm-3 col-form-label form-label">Price:</label>
            <div className="col-sm-9">
              <input
                type="text"
                name="price"
                id="price"
                className="form-control"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="text-center mt-3">
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update' : 'Insert'}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => {
                  setIsEditing(false);
                  setProduct({ id: '', name: '', os: '', price: '' });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="text-center">Product List</h3>
      <table className="table table-bordered table-striped mt-3">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>OS</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.os}</td>
              <td>{p.price}</td>
              <td className="actions-cell">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => editProduct(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

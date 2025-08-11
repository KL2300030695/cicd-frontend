import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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
const BASE_URL = 'http://localhost:8081';
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${BASE_URL}/update`, product);
        alert('Update successful');
        setIsEditing(false);
      } else {
        await axios.post(`${BASE_URL}/insert`, product);
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
    const res = await axios.get(`${BASE_URL}/display`);
    setProducts(res.data);
  };

  const editProduct = (p) => {
    setProduct(p);
    setIsEditing(true);
  };

  
  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await axios.delete(`${BASE_URL}/delete/${id}`);
      alert('Delete successful');
      fetchProducts();
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
                {
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(p.id)}
                >
                  Delete
                </button>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

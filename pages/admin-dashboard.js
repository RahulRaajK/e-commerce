import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });
  const [productLoading, setProductLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    if (typeof window === 'undefined') return;
    
    const token = sessionStorage.getItem('adminToken');
    try {
      const response = await fetch('/api/admin/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    
    const token = sessionStorage.getItem('adminToken');
    setProductLoading(true);
    
    try {
      let imageUrl = productForm.image;
      
      if (selectedFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setProductLoading(false);
          return;
        }
      }
      
      const productData = {
        ...productForm,
        image: imageUrl
      };
      
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? '/api/admin/products' : '/api/admin/products';
      
      if (editingProduct) {
        productData.productId = editingProduct._id;
      }
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        const data = await response.json();
        if (editingProduct) {
          setProducts(prev => prev.map(p => p._id === editingProduct._id ? data.product : p));
          alert('Product updated successfully!');
        } else {
          setProducts(prev => [...prev, data.product]);
          alert('Product added successfully!');
        }
        resetForm();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setProductLoading(false);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      image: '',
      category: '',
      stock: ''
    });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stock: product.stock
    });
    setImagePreview(null);
    setSelectedFile(null);
    setShowProductForm(true);
  };

  const deleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }
    
    const token = sessionStorage.getItem('adminToken');
    try {
      const response = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId));
        alert('Product deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Product Management - e-commerce Store</title>
        <meta name="description" content="Admin dashboard for managing products" />
      </Head>
      
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Store
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('adminToken');
                  router.push('/admin');
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Products ({products.length})</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAllProducts(!showAllProducts)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  {showAllProducts ? 'Hide All' : 'View All Products'}
                </button>
                <button
                  onClick={() => {
                    if (editingProduct) {
                      resetForm();
                    } else {
                      setShowProductForm(!showProductForm);
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {showProductForm ? 'Cancel' : 'Add Product'}
                </button>
              </div>
            </div>

            {showProductForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={addProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Wireless Mouse"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={productForm.category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home">Home</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      placeholder="Describe the product features and benefits..."
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                      <input
                        type="number"
                        placeholder="9999"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={productForm.stock}
                        onChange={(e) => setProductForm(prev => ({ ...prev, stock: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                    <div className="space-y-3">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload an image file (JPG, PNG, GIF - Max 5MB)</p>
                      </div>
                      
                      {imagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="h-32 w-32 object-cover rounded-md border border-gray-300"
                          />
                        </div>
                      )}
                      
                      <div className="text-center text-gray-500">OR</div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Alternative)</label>
                        <input
                          type="url"
                          placeholder="https://example.com/product-image.jpg"
                          value={productForm.image}
                          onChange={(e) => setProductForm(prev => ({ ...prev, image: e.target.value }))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {productForm.image && !imagePreview && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600 mb-2">URL Preview:</p>
                            <img
                              src={productForm.image}
                              alt="Product preview"
                              className="h-32 w-32 object-cover rounded-md border border-gray-300"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={productLoading || uploading}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      {uploading ? 'Uploading Image...' : productLoading ? (editingProduct ? 'Updating Product...' : 'Adding Product...') : (editingProduct ? 'Update Product' : 'Add Product')}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {showAllProducts && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">All Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {products.map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-32 w-full object-cover rounded-md border border-gray-300 mb-3"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center&auto=format&q=60';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">₹{product.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mb-2">Stock: {product.stock}</p>
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mb-3 inline-block">
                            {product.category}
                          </span>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editProduct(product)}
                              className="flex-1 bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="flex-1 bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {products.slice(0, showAllProducts ? 0 : 5).map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-md border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop&crop=center&auto=format&q=60';
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">₹{product.price.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {product.category}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => editProduct(product)}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProduct(product._id)}
                              className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

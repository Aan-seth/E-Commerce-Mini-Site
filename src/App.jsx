import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Category from './Category';

function App() {
  const [finalCategory, setFinalCategory] = useState([]);
  const [finalProduct, setFinalProduct] = useState([]);
  const [catName, setCatname] = useState('');
  const [error, setError] = useState(null);

  const getCategory = useCallback(() => {
    axios
      .get('https://dummyjson.com/products/category-list')
      .then((res) => res.data)
      .then((finalRes) => {
        setFinalCategory(finalRes);
      })
      .catch((err) => {
        setError('Failed to fetch categories');
        console.error(err);
      });
  }, []);

  const getProduct = useCallback(() => {
    axios
      .get('https://dummyjson.com/products')
      .then((prores) => prores.data)
      .then((finalRes) => {
        setFinalProduct(finalRes.products);
      })
      .catch((err) => {
        setError('Failed to fetch products');
        console.error(err);
      });
  }, []);

  useEffect(() => {
    getCategory();
    getProduct();
  }, [getCategory, getProduct]);

  useEffect(() => {
    if (catName !== '') {
      axios
        .get(`https://dummyjson.com/products/category/${catName}`)
        .then((prores) => prores.data)
        .then((finalRes) => {
          setFinalProduct(finalRes.products);
        })
        .catch((err) => {
          setError('Failed to fetch products for the selected category');
          console.error(err);
        });
    }
  }, [catName]);

  const Pitems = finalProduct.map((products, index) => (
    <ProductItem key={index} pdata={products} />
  ));

  return (
    <div className="py-[40px] bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
      <div className="max-w-[1320px] mx-auto">
        <h1 className="text-center text-[30px] font-extrabold mb-[30px] text-white">Our Products</h1>
        
        {/* Error message */}
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}
        
        <div className="grid grid-cols-[30%_auto] gap-[20px]">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <Category finalcategory={finalCategory} setCatname={setCatname} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {finalProduct.length >= 1 ? Pitems : <div className="col-span-full text-center text-xl text-gray-500">No Product Found</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

function ProductItem({ pdata }) {
  return (
    <div className="shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition-all ease-in-out duration-300">
      <img src={pdata.thumbnail} className="w-full h-[250px] object-cover" alt={pdata.title} />
      <div className="p-4">
        <h4 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-300">{pdata.title}</h4>
        <p className="text-sm text-gray-500">{pdata.description?.slice(0, 60)}...</p>
        <div className="mt-2 flex items-center justify-between">
          <b className="text-xl text-blue-600">{pdata.price}$</b>
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 text-white py-1 px-4 rounded-md transition duration-200 shadow-md hover:shadow-xl">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

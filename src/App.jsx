import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [search, Setallsearch] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Adjust as needed

  const fetchData = async () => {
    try {
      const resp = await fetch('https://dummyjson.com/products');
      const result = await resp.json();
      setData(result.products.filter(el => 
        (String(el.title).toLowerCase().includes(search.toLowerCase()) ||
        (String(el.category).toLowerCase().includes(search.toLowerCase()) ||
        (String(el.price).toLowerCase().includes(search.toLowerCase()))
      ))))
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  function hdlSearch(e) {
    Setallsearch(e);
    setCurrentPage(1); // Reset to first page on new search
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Product Search</h1>
      
      <input 
        className="m-4 outline-none h-12 w-full max-w-md px-4 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
        placeholder="Search Here..."
        onChange={(e) => hdlSearch(e.target.value)}
      />
      
      <ul className="w-full max-w-md bg-gray-50 rounded-lg shadow-sm mt-6">
        {paginatedData.map((el) => (
          <li key={el.id} className="leading-9 text-lg p-3 text-gray-700 hover:bg-gray-300 border-b border-gray-300 last:border-none transition-all duration-200">
            <span className="font-medium text-gray-900">{el.title}</span> 
            <span className="text-gray-500"> | {el.category}</span> 
            <span className="text-blue-500"> | ${el.price}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-4">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-l-lg disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;

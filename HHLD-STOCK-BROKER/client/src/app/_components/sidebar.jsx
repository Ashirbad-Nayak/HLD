"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useWatchlistsDataStore } from '../zustand/useWatchlistsDataStore';
import { useCurrentStockDataStore } from '../zustand/useCurrentStockDataStore';
import io from "socket.io-client";
import Modal from './modal';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('watchlists');
  const [activeWatchlist, setActiveWatchlist] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [newStock, setNewStock] = useState({ name: '', instrumentKey: '' });
  const [socket, setSocket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [watchlistTitle, setwatchlistTitle] = useState('');
  const [mdActiveWatchlist, setmdActiveWatchlist] = useState([]);

  const { watchlists, updateWatchlists, updateWatchlistWithTitle } = useWatchlistsDataStore();
  const { updateCurrentStock } = useCurrentStockDataStore();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleWatchlistClick = (watchlist) => {
    setActiveTab('watchlist');
    setActiveWatchlist(watchlist);
    wsConnectToBE(watchlist.stocks);
  };

  const handleAddWatchlist = async (watchlistTitleText) => {
    try {
      setwatchlistTitle(watchlistTitleText);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/add`, { title: watchlistTitleText });
      updateWatchlists([...watchlists, res.data]);
    } catch (error) {
      console.log('Error in adding watchlist ', error.message);
    }
  };

  const handleStockClick = (stock) => updateCurrentStock(stock);

  const handleAddStock = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/addStock`, {
        watchlist: activeWatchlist.title,
        stock: newStock
      });
      updateWatchlistWithTitle(activeWatchlist.title, newStock);
      setActiveWatchlist(watchlists[0]);
      setNewStock({ name: '', instrumentKey: '' });
    } catch (error) {
      console.log('Error in adding stock');
    }
  };

  const getWatchlists = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/get`);
      updateWatchlists(res.data);
      if (res.data.length !== 0) {
        setActiveTab('watchlist');
        setActiveWatchlist(res.data[0]);
        wsConnectToBE(res.data[0].stocks);
      }
    } catch (error) {
      console.log('Error in getting watchlists', error.message);
    }
  };

  const searchStocks = async (e) => {
    setNewStock({ name: e.target.value });
    const stockNameToBeSearched = e.target.value;
    if (stockNameToBeSearched.length > 2) {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_AG_URI}`, { params: { q: stockNameToBeSearched } });
        const stockDetails = res.data.map(stock => ({
          name: stock._source.name,
          instrumentKey: stock._source.instrumentKey
        }));
        setSuggestions(stockDetails);
      } catch (error) {
        console.log("Error in searching : ", error.message);
      }
    } else {
      setSuggestions([]);
    }
  };

  const wsConnectToBE = (activeWatchlistStocks) => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_MD_BE_URI}`);
    setSocket(newSocket);
    const instrumentKeys = activeWatchlistStocks?.map(item => item.instrumentKey);
    if (instrumentKeys) {
      newSocket.emit('market data', instrumentKeys);
    }
    newSocket.on('market data', (msg) => {
      setmdActiveWatchlist(msg);
    });
  };

  useEffect(() => {
    getWatchlists();
  }, []);

  return (
    <div className="flex flex-col bg-gray-200  dark:bg-gray-800 h-screen border-r border-gray-300">
      <div className="px-2 py-4">
      <div className="flex justify-between items-center mb-4 px-2 py-3 bg-white shadow rounded-lg">
  <h1 className="text-xl font-bold text-gray-800">📈 Watchlists</h1>

  {!isModalOpen && (
    <button
      onClick={openModal}
      className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white text-xl font-bold rounded-full shadow-md hover:bg-blue-600 transition duration-200"
      title="Add Watchlist"
    >
      +
    </button>
  )}

  {isModalOpen && (
    <Modal onClose={closeModal} onSubmit={handleAddWatchlist} />
  )}
</div>

<ul className="flex overflow-x-auto gap-3 py-2 px-1">
  {watchlists.map((watchlist, index) => (
    <li
      key={index}
      onClick={() => handleWatchlistClick(watchlist)}
      className={`cursor-pointer px-4 py-2 rounded-full text-sm whitespace-nowrap shadow-sm transition duration-200
        ${
          activeWatchlist === watchlist
            ? 'bg-blue-600 text-white font-semibold'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
      {watchlist.title}
    </li>
  ))}
</ul>

      </div>

      {activeTab === 'watchlist' && (
       <div className="p-6 bg-white  dark:bg-gray-800 h-full overflow-y-auto rounded-lg shadow-inner">
       <div className="flex justify-between items-center mb-6">
         <h1 className="text-xl font-semibold text-gray-800">{activeWatchlist.title}</h1>
         <div className="flex items-center gap-2 relative">
           <input
             type="text"
             className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
             placeholder="Search stock"
             value={newStock.name}
             onChange={searchStocks}
           />
           <button
             className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
             onClick={handleAddStock}
             title="Add stock"
           >
             +
           </button>
           {suggestions.length > 0 && (
             <ul className="absolute top-full left-0 mt-2 w-64 max-h-48 overflow-auto border border-gray-300 bg-white z-20 rounded shadow-lg">
               {suggestions.map((suggestion, index) => (
                 <li
                   key={index}
                   className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
                   onClick={() => {
                     setNewStock({
                       name: suggestion.name,
                       instrumentKey: suggestion.instrumentKey,
                     });
                     setSuggestions([]);
                   }}
                 >
                   <div>
                     <div className="font-medium">{suggestion.name}</div>
                     <div className="text-xs text-gray-500">
                       {suggestion.instrumentKey}
                     </div>
                   </div>
                 </li>
               ))}
             </ul>
           )}
         </div>
       </div>
     
       <ul className="space-y-3">
         {activeWatchlist?.stocks.map((stock, index) => (
           <li
             key={index}
             className="p-3 border rounded-lg hover:bg-green-50 cursor-pointer shadow-sm transition"
             onClick={() => handleStockClick(stock)}
           >
             <div className="flex justify-between items-center">
               <div>
                 <div className="text-base font-medium text-gray-800">{stock.name}</div>
                 <div className="text-xs text-gray-500">{stock.instrumentKey}</div>
               </div>
               <div className="text-green-700 font-semibold text-sm">
                 {mdActiveWatchlist.find(
                   (item) => item.instrumentKey === stock.instrumentKey
                 )?.ltp ?? '--'}
               </div>
             </div>
           </li>
         ))}
       </ul>
     </div>
     
      )}
    </div>
  );
};

export default Sidebar;

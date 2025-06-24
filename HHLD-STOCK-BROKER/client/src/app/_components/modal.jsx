import { useState } from 'react';

const Modal = ({ onClose, onSubmit }) => {
  const [text, setText] = useState('');

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 max-w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Create New Watchlist</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            placeholder="Watchlist Name"
            className="flex-grow px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Modal;

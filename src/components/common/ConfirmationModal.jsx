import React from 'react';

function ConfirmationModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-slide-up">
        
        {/* Ikon Peringatan */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <i className="fa-solid fa-triangle-exclamation text-red-600 text-xl"></i>
        </div>

        {/* Judul & Pesan */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 font-serif">
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            {message}
          </p>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition font-medium"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition font-bold"
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
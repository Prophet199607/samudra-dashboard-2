import React from "react";
import { FaTimes } from "react-icons/fa";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(17,25,40,0.70)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div className="relative p-8 bg-white bg-opacity-90 rounded-lg shadow-lg max-w-[95vw] max-h-[95vh] flex flex-col items-end">
        <button
          type="button"
          className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-gray-200 focus:outline-none transition"
          aria-label="Close"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <img
          src={imageUrl}
          alt="Full size preview"
          className="max-w-[90vw] max-h-[80vh] rounded-lg mx-auto"
        />
      </div>
    </div>
  );
};

export default ImageModal;

import React from "react";

interface ModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed backdrop-blur-[2px] inset-0 flex items-center justify-center  shadow-4xl  bg-opacity-50 z-50">
      <div className="bg-white rounded-xl  p-6 rounded shadow-2xs w-80">
        {title && <h2 className="text-lg font-bold mb-4">{title}</h2>}
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md shadow-md shadow-gray-100 hover:scale-103 transition-all duration-300 cursor-pointer   rounded border border-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md shadow-md shadow-red-100 hover:scale-103 transition-all duration-300 cursor-pointer rounded bg-red-500 text-white"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

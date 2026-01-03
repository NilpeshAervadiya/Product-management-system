import React, { useState } from "react";

const DeleteConfirmationModal = ({
  modalId,
  productTitle,
  onConfirm,
  onCancel,
}) => {
  const [confirmText, setConfirmText] = useState("");
  const isDeleteEnabled = confirmText.toLowerCase() === "delete";

  const handleConfirm = () => {
    if (isDeleteEnabled) {
      onConfirm();
      setConfirmText(""); // Reset on confirm
    }
  };

  const handleCancel = () => {
    setConfirmText(""); // Reset on cancel
    onCancel();
  };

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box max-w-md bg-white p-5">
        <form method="dialog">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            ✕
          </button>
        </form>
        <div>
          {/* Warning Icon */}
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Delete Product?
          </h3>

          {/* Message */}
          <p className="text-sm text-gray-600 text-center mb-4 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900">
              "{productTitle}"
            </span>
            ? This action cannot be undone.
          </p>

          {/* Confirmation Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="font-semibold text-red-600">"delete"</span>{" "}
              to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-red-500 focus:border-red-500 text-sm bg-white text-gray-900"
              placeholder="Type 'delete' to confirm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-200 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-300 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isDeleteEnabled}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop bg-gray-900/70">
        <button type="button" onClick={handleCancel}>
          close
        </button>
      </form>
    </dialog>
  );
};

export default DeleteConfirmationModal;

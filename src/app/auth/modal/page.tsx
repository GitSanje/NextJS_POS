"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

interface ModalProps {
  dialougeTitle: string;
  dialougePlaceholder: string;
  showModal: () =>void;
  onSubmit: (value: string) => void;
}

const Modal: React.FC<ModalProps>= ({
  dialougeTitle,
  dialougePlaceholder,
  showModal,
  onSubmit,
}) => {
  const [open, setOpen] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/; // Example for 10-digit phone numbers
    return phoneRegex.test(phone);
  };


  const handleAdd = () => {
    // Validate the input based on modalType
    if (dialougeTitle.includes("Email")) {
      if (!validateEmail(inputValue)) {
        setError("Please enter a valid email address.");
        return;
      }
    } else if (dialougeTitle.includes("Mobile Number")) {
      if (!validatePhone(inputValue)) {
        setError("Please enter a valid 10-digit phone number.");
        return;
      }
    }

    // If no validation errors, submit the input
    onSubmit(inputValue);
    setOpen(false); // Close the modal
  };

  const handleCancel = () => {
    setOpen(false);
    showModal();
  };

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto justify-center items-center">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    {dialougeTitle}
                  </DialogTitle>
                  <div className="mt-2">
                    <div className="w-full">
                      <input
                        className="flex h-10 w-full rounded-md border border-black/30 bg-transparent px-3 py-2 text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-black/30 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                        type="text"
                        placeholder={dialougePlaceholder}
                        id="name"
                        value={inputValue}
                        onChange={(e) => {
                          setInputValue(e.target.value);
                          setError(""); // Clear error when user starts typing
                        }}
                      />
                      {error && (
                        <p className="mt-1 text-xs text-red-500">{error}</p>
                      )}
                     
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
              >
                Add
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Modal;

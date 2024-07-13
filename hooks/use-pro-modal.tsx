import { create } from "zustand";

// Define the state and actions for the useProModalStore
interface useProModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

// Create a store using Zustand for managing the ProModal state
export const useProModal = create<useProModalStore>((set) => ({
  isOpen: false,
  // Function to open the modal
  onOpen: () => set({ isOpen: true }),
  // Function to close the modal
  onClose: () => set({ isOpen: false }),
}));

import { create } from "zustand";

export type InputType = "text" | "number" | "email" | "password" | "date" | "checkbox" | "radio" | "textarea" | "select";

export interface InputField {
  id: string;
  type: InputType;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[]; // For select and radio inputs
}

interface FormStore {
  formTitle: string;
  inputs: InputField[];
  setFormTitle: (title: string) => void;
  setInputs: (inputs: InputField[]) => void;
  addInput: (type: InputType) => void;
  updateInput: (id: string, updates: Partial<InputField>) => void;
  deleteInput: (id: string) => void;
  moveInput: (fromIndex: number, toIndex: number) => void;
  saveForm: () => void;
}

export const useFormStore = create<FormStore>((set, get) => ({
  formTitle: "Untitled Form",
  inputs: [],
  setFormTitle: (title) => set({ formTitle: title }),
  setInputs: (inputs) => set({ inputs }),
  addInput: (type) =>
    set((state) => ({
      inputs: [
        ...state.inputs,
        {
          id: Date.now().toString(),
          type,
          label: `New ${type} field`,
          placeholder: "",
          required: false,
          options: type === "select" || type === "radio" ? ["Option 1"] : undefined,
        },
      ],
    })),
  updateInput: (id, updates) =>
    set((state) => ({
      inputs: state.inputs.map((input) => (input.id === id ? { ...input, ...updates } : input)),
    })),
  deleteInput: (id) =>
    set((state) => ({
      inputs: state.inputs.filter((input) => input.id !== id),
    })),
  moveInput: (fromIndex, toIndex) =>
    set((state) => {
      const newInputs = [...state.inputs];
      if (fromIndex < 0 || toIndex < 0 || fromIndex >= newInputs.length || toIndex >= newInputs.length) return state;
      const [movedItem] = newInputs.splice(fromIndex, 1);
      newInputs.splice(toIndex, 0, movedItem);
      return { inputs: newInputs };
    }),
  saveForm: () => {
    const { formTitle, inputs } = get();
    const formData = { formTitle, inputs };
    console.log("Form saved:", formData);
    alert("Form saved successfully!");
  },
}));

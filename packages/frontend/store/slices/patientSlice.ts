import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PatientFormState } from "../types";

const initialState: PatientFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneCountryCode: "",
  phone: "",
  documentPhoto: null,
};

const patientSlice = createSlice({
  name: "patient",
  initialState,
  reducers: {
    setFirstName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    setLastName(state, action: PayloadAction<string>) {
      state.lastName = action.payload;
    },
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPhone(state, action: PayloadAction<string>) {
      state.phone = action.payload;
    },
    setPhoneCountryCode(state, action: PayloadAction<string>) {
      state.phoneCountryCode = action.payload;
    },
    setDocumentPhoto(state, action: PayloadAction<string | null>) {
      state.documentPhoto = action.payload;
    },
    resetPatient() {
      return initialState;
    },
  },
});

export const { setFirstName, setLastName, setEmail, setPhone, setPhoneCountryCode, setDocumentPhoto, resetPatient } =
  patientSlice.actions;

export default patientSlice.reducer;

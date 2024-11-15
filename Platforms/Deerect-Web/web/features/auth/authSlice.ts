import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
//import { auth } from '@/app/firebase/config'; // Adjust your Firebase configuration import
import { createUserWithEmailAndPassword, User } from 'firebase/auth';

// Define the types for the state
interface AuthState {
  isSignedIn: Boolean;
  supabaseJWT: String | null;
  userID: String | null;
  email: String | null;
  phoneNumber: String | null;
}

// Define the initial state
const initialState: AuthState = {
    isSignedIn: false,
    supabaseJWT: null,
    userID: null,
    email: null,
    phoneNumber: null
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action){
      state.isSignedIn = true;
      state.userID = action.payload.userID;
      state.supabaseJWT = action.payload.supabaseJWT;
      state.email = action.payload.email;
      state.phoneNumber = action.payload.phoneNumber;
    },
    signOut(state) {
      state.isSignedIn = false;
      state.userID = null;
      state.supabaseJWT = null;
      state.email = null;
      state.phoneNumber = null;
    },
  },
  
});

export const { signOut, signIn } = authSlice.actions;
export default authSlice.reducer;

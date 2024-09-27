import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
//import { auth } from '@/app/firebase/config'; // Adjust your Firebase configuration import
import { createUserWithEmailAndPassword, User } from 'firebase/auth';

// Define the types for the state
interface AuthState {
  isSignedIn: Boolean;
  userID: String | null;
  displayName: String | null;
  fullName: String | null;
  photoURL: String | null;
  email: boolean;
}

// Define the initial state
const initialState: AuthState = {
    isSignedIn: false,
    userID: null,
    displayName: null,
    fullName: null,
    photoURL: null,
    email: null
};

// Define async thunk for user registration
export const registerUser = createAsyncThunk<User, { email: string; password: string }, { rejectValue: string }>(
  'auth/registerUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      //const response = await createUserWithEmailAndPassword(auth, email, password);
      //return response.user;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      //state.user = null;
    },
    resetError(state) {
      //state.error = null;
    },
  },
  
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer;

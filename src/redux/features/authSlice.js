import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  API from "../api";

export const login = createAsyncThunk(
  "auth/login",
  async ({ formValue,navigate ,toast }, { rejectWithValue }) => {
    try {
      const response = await API.get("/users", formValue);
      const users = JSON.parse(JSON.stringify(response.data))
     const loggedUser = users.filter(user=> (user.email === formValue.email && user.password === formValue.password))
      if(loggedUser.length > 0 ){
        toast.success("Login Successfully");
        localStorage.setItem("loggedUser" , JSON.stringify(loggedUser[0]))
        navigate("/dashboard");
      }else{
        toast.error('User is not registered');
        navigate('/')
      }
      return response.data;
    } catch (err) {
      console.log('13', err);
      return rejectWithValue(err.response.data);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ formValue, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await  API.post("/users", formValue);
      toast.success("Register Successfully");
       navigate("/");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    error: "",
    loading: false,
  },
  
  extraReducers: {
    [login.pending]: (state, action) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [login.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [register.pending]: (state, action) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      state.loading = false;
      localStorage.setItem("profile", JSON.stringify({ ...action.payload }));
      state.user = action.payload;
    },
    [register.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
});


export default authSlice.reducer;

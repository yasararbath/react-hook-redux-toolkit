import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../api";

export const createTour = createAsyncThunk(
  "tour/createTour",
  async ({ updatedTourData, navigate, toast }, { rejectWithValue }) => {
    try {
      const response = await API.post("/tour", updatedTourData);
      toast.success("Added Successfully");
      navigate("/dashboard");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const getToursByUser = createAsyncThunk(
  "tour/getToursByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/tour`);
      // const allTours = JSON.parse(JSON.stringify(response.data));
      // console.log(allTours);
      // const LoggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      // const response = allTours.filter(res=> res.userId === LoggedUser.id)
      return response;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


export const updateTour = createAsyncThunk(
  "tour/updateTour",
  async ({ id, updatedTourData, toast, navigate }, { rejectWithValue }) => {
    try {
      const response = await API.put(`/tour/${id}`, updatedTourData);
      toast.success("Tour Updated Successfully");
      navigate("/dashboard");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteTour = createAsyncThunk(
  "tour/deleteTour",
  async ({ id, toast }, { rejectWithValue }) => {
    try {
      const response = await API.delete(`/tour/${id}`);
      toast.success("Tour Deleted Successfully");
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const tourSlice = createSlice({
  name: "tour",
  initialState: {
    tour: {},
    tours: [],
    userTours: [],
    tagTours: [],
    relatedTours: [],
    currentPage: 1,
    numberOfPages: null,
    error: "",
    loading: false,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: {
    [createTour.pending]: (state, action) => {
      state.loading = true;
    },
    [createTour.fulfilled]: (state, action) => {
      state.loading = false;
      state.tours = [action.payload];
    },
    [createTour.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    [getToursByUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getToursByUser.fulfilled]: (state, action) => {
      state.loading = false;
      const LoggedUser = JSON.parse(localStorage.getItem("loggedUser"));
      const userTours = action.payload.data.filter(res=> res.userId === LoggedUser.id)
      state.userTours = userTours;
    },
    [getToursByUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [updateTour.pending]: (state, action) => {
      state.loading = true;
    },
    [updateTour.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userTours = state.userTours.map((item) =>
          item.id === id ? action.payload : item
        );
        state.tours = state.tours.map((item) =>
          item.id === id ? action.payload : item
        );
      }
    },
    [updateTour.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
    ,
    [deleteTour.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteTour.fulfilled]: (state, action) => {
      state.loading = false;
      const {
        arg: { id },
      } = action.meta;
      if (id) {
        state.userTours = state.userTours.filter((item) => item.id !== id);
        state.tours = state.tours.filter((item) => item.id !== id);
      }
    },
    [deleteTour.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
   
  },
});

export const { setCurrentPage } = tourSlice.actions;

export default tourSlice.reducer;
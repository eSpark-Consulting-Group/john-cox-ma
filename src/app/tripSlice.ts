import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Trip {
  name: string;
  startTime: Date | null;
  displayDistance: number;
  elapsedTime: string;
  initialFuelData: number[];
  fuelUsed: number[];
  efficiency: number;
}

export interface TripsState {
  Trips: {
    1: Trip;
    2: Trip;
    3: Trip;
  };
}

const initialState: TripsState = {
  Trips: {
    1: {
      name: '',
      startTime: null,
      displayDistance: 0,
      elapsedTime: '',
      initialFuelData: [],
      fuelUsed: [],
      efficiency: 0,
    },
    2: {
      name: '',
      startTime: null,
      displayDistance: 0,
      elapsedTime: '',
      initialFuelData: [],
      fuelUsed: [],
      efficiency: 0,
    },
    3: {
      name: '',
      startTime: null,
      displayDistance: 0,
      elapsedTime: '',
      initialFuelData: [],
      fuelUsed: [],
      efficiency: 0,
    },
  },
};

const tripsSlice = createSlice({
  name: 'Trips',
  initialState,
  reducers: {
    setTrip: (
      state,
      action: {payload: {tripId: keyof TripsState['Trips']; data: TripsState}},
    ) => {
      const {tripId, data} = action.payload;
      state.Trips[tripId] = data.Trips[tripId];
    },
  },
});

export const {setTrip} = tripsSlice.actions;

export default tripsSlice.reducer;

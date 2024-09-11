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
    setTripName: (
      state,
      action: {payload: {tripId: keyof TripsState['Trips']; name: string}},
    ) => {
      const {tripId, name} = action.payload;
      state.Trips[tripId].name = name;
    },
    startTrip: (
      state,
      action: {payload: {tripId: keyof TripsState['Trips']; startTime: Date}},
    ) => {
      const {tripId, startTime} = action.payload;
      state.Trips[tripId].startTime = startTime;
    },
    updateDistance: (
      state,
      action: {payload: {tripId: keyof TripsState['Trips']; distance: number}},
    ) => {
      const {tripId, distance} = action.payload;
      state.Trips[tripId].displayDistance = distance;
    },
    updateElapsedTime: (
      state,
      action: {
        payload: {tripId: keyof TripsState['Trips']; elapsedTime: string};
      },
    ) => {
      const {tripId, elapsedTime} = action.payload;
      state.Trips[tripId].elapsedTime = elapsedTime;
    },
    setInitialFuelData: (
      state,
      action: {
        payload: {tripId: keyof TripsState['Trips']; initialFuelData: number[]};
      },
    ) => {
      const {tripId, initialFuelData} = action.payload;
      state.Trips[tripId].initialFuelData = initialFuelData;
    },
    updateFuelUsed: (
      state,
      action: {
        payload: {tripId: keyof TripsState['Trips']; fuelUsed: number[]};
      },
    ) => {
      const {tripId, fuelUsed} = action.payload;
      state.Trips[tripId].fuelUsed = fuelUsed;
    },
  },
});

export const {
  setTrip,
  setTripName,
  startTrip,
  updateDistance,
  updateElapsedTime,
  setInitialFuelData,
  updateFuelUsed,
} = tripsSlice.actions;

export default tripsSlice.reducer;

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Trip {
  name: string;
  startTime: Date | null;
  displayDistance: number;
  elapsedTime: string;
  initialFuelData: number[];
  fuelUsed: number[];
}

interface TripsState {
  trips: {
    1: Trip;
    2: Trip;
    3: Trip;
  };
}

const initialState: TripsState = {
  trips: {
    1: {
      name: '',
      startTime: null,
      displayDistance: 0,
      elapsedTime: '',
      initialFuelData: [],
      fuelUsed: [],
    },
    2: {
      name: '',
      startTime: null,
      displayDistance: 0,
      elapsedTime: '',
      initialFuelData: [],
      fuelUsed: [],
    },
    3: {
      name: '',
      startTime: null,
      displayDistance: 0,
      elapsedTime: '',
      initialFuelData: [],
      fuelUsed: [],
    },
  },
};

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    setTrip: (
      state,
      action: {payload: {tripId: keyof TripsState['trips']; data: TripsState}},
    ) => {
      const {tripId, data} = action.payload;
      state.trips[tripId] = data.trips[tripId];
    },
    setTripName: (
      state,
      action: {payload: {tripId: keyof TripsState['trips']; name: string}},
    ) => {
      const {tripId, name} = action.payload;
      state.trips[tripId].name = name;
    },
    startTrip: (
      state,
      action: {payload: {tripId: keyof TripsState['trips']; startTime: Date}},
    ) => {
      const {tripId, startTime} = action.payload;
      state.trips[tripId].startTime = startTime;
    },
    updateDistance: (
      state,
      action: {payload: {tripId: keyof TripsState['trips']; distance: number}},
    ) => {
      const {tripId, distance} = action.payload;
      state.trips[tripId].displayDistance = distance;
    },
    updateElapsedTime: (
      state,
      action: {
        payload: {tripId: keyof TripsState['trips']; elapsedTime: string};
      },
    ) => {
      const {tripId, elapsedTime} = action.payload;
      state.trips[tripId].elapsedTime = elapsedTime;
    },
    setInitialFuelData: (
      state,
      action: {
        payload: {tripId: keyof TripsState['trips']; initialFuelData: number[]};
      },
    ) => {
      const {tripId, initialFuelData} = action.payload;
      state.trips[tripId].initialFuelData = initialFuelData;
    },
    updateFuelUsed: (
      state,
      action: {
        payload: {tripId: keyof TripsState['trips']; fuelUsed: number[]};
      },
    ) => {
      const {tripId, fuelUsed} = action.payload;
      state.trips[tripId].fuelUsed = fuelUsed;
    },
  },
});

export const {
  setTripName,
  startTrip,
  updateDistance,
  updateElapsedTime,
  setInitialFuelData,
  updateFuelUsed,
} = tripsSlice.actions;

export default tripsSlice.reducer;

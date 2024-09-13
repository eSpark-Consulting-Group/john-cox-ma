import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TripData} from '../types';

export interface TripsState {
  Trips: {
    1: TripData;
    2: TripData;
    3: TripData;
  };
}

const initialState: TripsState = {
  Trips: {
    1: {
      id: 1,
      name: '',
      tripStarted: false,
      startingTime: null, // set to null initially
      distanceCovered: 0,
      tripTime: '0.00',
      initialFuel: [0, 0, 0, 0],
      fuelConsumption: [0, 0, 0, 0],
      tripEfficiency: 0,
    },
    2: {
      id: 2,
      name: '',
      tripStarted: false,
      startingTime: null, // set to null initially
      distanceCovered: 0,
      tripTime: '0.00',
      initialFuel: [0, 0, 0, 0],
      fuelConsumption: [0, 0, 0, 0],
      tripEfficiency: 0,
    },
    3: {
      id: 3,
      name: '',
      tripStarted: false,
      startingTime: null, // set to null initially
      distanceCovered: 0,
      tripTime: '0.00',
      initialFuel: [0, 0, 0, 0],
      fuelConsumption: [0, 0, 0, 0],
      tripEfficiency: 0,
    },
  },
};

const tripsSlice = createSlice({
  name: 'Trips',
  initialState,
  reducers: {
    startTrip: (
      state,
      action: {
        payload: {
          tripId: keyof TripsState['Trips'];
          name: string;
          startTime: Date;
          initialFuelData: number[];
        };
      },
    ) => {
      const {tripId, name, startTime, initialFuelData} = action.payload;
      state.Trips[tripId].tripStarted = true;
      state.Trips[tripId].name = name;
      state.Trips[tripId].startingTime = startTime;
      state.Trips[tripId].initialFuel = initialFuelData;
    },
    endTrip: (
      state,
      action: {
        payload: {
          tripId: keyof TripsState['Trips'];
        };
      },
    ) => {
      const {tripId} = action.payload;
      state.Trips[tripId].tripStarted = false;
      //yehan se filesystem mein log krwana hey data
      state.Trips[tripId] = initialState.Trips[tripId];
    },
    setTrip: (
      state,
      action: {payload: {tripId: keyof TripsState['Trips']; data: TripsState}},
    ) => {
      const {tripId, data} = action.payload;
      state.Trips[tripId] = data.Trips[tripId];
    },
  },
});

export const {setTrip, startTrip, endTrip} = tripsSlice.actions;

export default tripsSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import { eventsApi } from './eventsApi';

export const makeStore = () =>
  configureStore({
    reducer: {
      [eventsApi.reducerPath]: eventsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(eventsApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
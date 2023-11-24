import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE, PERSIST, PURGE, REGISTER,
  REHYDRATE,
  persistReducer, persistStore,
} from 'redux-persist';
import hardSet from 'redux-persist/lib/stateReconciler/hardSet';
import storage from 'redux-persist/lib/storage';
import alertReducer from './alertSlice';
import userReducer from './user/userSlice';

// https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/
const persistConfig = {
  key: 'user-persist',
  storage,
  stateReconciler: hardSet,
}

const persistUserReducer = persistReducer(persistConfig, userReducer);

// https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using
// important here reducer: { key: reducerValue, ... }
export const store = configureStore({
  reducer: {
    user: persistUserReducer,
    alert: alertReducer
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

import authRedux from "./slices/auth";
import transactionRedux from "./slices/transaction";
import customerRedux from './slices/customer';
import cardRedux from './slices/card';
import kycRedux from './slices/kyc';
import kycV2Redux from './slices_v2/kyc';
import searchRedux from './slices/search';

const createNoopStorage = () => {
  return {
    getItem(_key:any) {
      return Promise.resolve(null);
    },
    setItem(_key:any, value:any) {
      return Promise.resolve(value);
    },
    removeItem(_key:any) {
      return Promise.resolve();
    },
  };
};

// const storage = typeof window === "undefined" ? createNoopStorage() : createWebStorage();
const storage = typeof window === "undefined" ? createNoopStorage() : createWebStorage("session");  //"local" // "session"


const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ['transaction', 'customer', 'card', 'kyc', 'kyc_v2', 'search']
};


const rootReducer = combineReducers({
    auth: authRedux,
    transaction: transactionRedux,
    search: searchRedux,
    customer: customerRedux,
    card: cardRedux,
    kyc: kycRedux,
    kyc_v2: kycV2Redux,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);

// export function useStores(initialState) {
//   const store = initializeStore(initialState);
//   return store;
// }


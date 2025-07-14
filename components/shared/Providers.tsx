"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { AppProvider } from "../../contexts/AppContext";
import ResponsiveProvider from "./ResponsiveProvider";

interface ProvidersProps {
  children: ReactNode;
}
// Add PersistGate if you want to support persisted state
// import { PersistGate } from 'redux-persist/integration/react';

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <AppProvider>
        <ResponsiveProvider>{children}</ResponsiveProvider>
      </AppProvider>
      {/* </PersistGate> */}
    </Provider>
  );
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { persistor, store } from './app/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import App from './app/App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  //<React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter basename={process.env.NX_APP_BASEPATH || ''}>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  //</React.StrictMode>
);

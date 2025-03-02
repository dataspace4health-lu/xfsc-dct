import React from 'react';
import { useDispatch, useSelector } from './redux/store';

import { AppRoutes } from './routes';

import './App.scss';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/layout/layout.scss';

function App() {
    return <AppRoutes />
}

export default App;

import React from 'react';
import { useDispatch, useSelector } from './redux/store';

import { AppRoutes } from './routes';

import './App.scss';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import './assets/layout/layout.scss';
import { setAuthToken } from './redux/slices/auth.slice';

function App() {
    const { token } = useSelector((store) => store.auth);
    const dispatch = useDispatch();

    const onSignOut = () => {
        dispatch(setAuthToken());
    };

    return <AppRoutes isAuthenticated={!!token} onSignOut={onSignOut} />;
}

export default App;

import React, { useState } from 'react';
import Todo from './components/Todo';
import Header from './components/Header';
import Auth from './components/Auth';

const App = props => {
    const [page, setPage] = useState('auth');


    return (
        <div className="App">
            <Header/>
            <hr/>
            <Todo/>
            <Auth/>
        </div>
    );
};

export default App;

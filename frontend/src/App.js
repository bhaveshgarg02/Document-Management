import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import './App.css';
import Documents from './components/Documents';


function App() {
  return (
    <Router>
      <div className="App">
      <h1>Document Management</h1>
        <header className="App-header">
          <Routes> 
            <Route path="/" element={<Documents />} /> 
            
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

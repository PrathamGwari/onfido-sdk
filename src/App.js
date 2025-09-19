import React from 'react';
import './App.css';
import OnfidoComponent from './OnfidoComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Identity Verification</h1>
        <p>Secure and fast identity verification process</p>
      </header>
      <main>
        <OnfidoComponent />
      </main>
    </div>
  );
}

export default App;
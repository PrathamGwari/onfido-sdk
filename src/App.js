import React from 'react';
// import './App.css';
import OnfidoComponent from './OnfidoComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Onfido Demo Application</h1>
        <p>Identity Verification with Onfido Web SDK</p>
      </header>
      <main>
        <OnfidoComponent />
      </main>
    </div>
  );
}

export default App;
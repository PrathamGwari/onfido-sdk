
import React, { useEffect, useRef, useState } from 'react';
import { Onfido } from 'onfido-sdk-ui';

const OnfidoComponent = () => {
  const onfidoRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    const initializeOnfido = async () => {
      try {
        // Paste your SDK token here
        const sdkToken = 'eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3NTgyNjE1NDcsInBheWxvYWQiOnsiYXBwIjoiMTEzYjAxMjMtMmEwZS00YzIxLWFkNWYtMDMyNDNhZDZkNzAyIiwiY2xpZW50X3V1aWQiOiJhM2JkMDA0Ny1mN2E4LTQ0NmUtOWFhYS1mODMyMTJmMjA2MDciLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOnRydWUsImlzX3RyaWFsIjp0cnVlLCJyZWYiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvKiIsInNhcmRpbmVfc2Vzc2lvbiI6ImM3OTNjNDFiLTc3NDktNGY5Zi04MWZkLWEzOWQ2NjliYTJhZSJ9LCJ1dWlkIjoicGxhdGZvcm1fc3RhdGljX2FwaV90b2tlbl91dWlkIiwidXJscyI6eyJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9zZGsub25maWRvLmNvbSIsInN5bmNfdXJsIjoiaHR0cHM6Ly9zeW5jLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQub25maWRvLmNvbSIsImF1dGhfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSIsIm9uZmlkb19hcGlfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSIsInRlbGVwaG9ueV91cmwiOiJodHRwczovL2FwaS5vbmZpZG8uY29tIn19.MIGIAkIBxMR6pWmy7EzFSE0jOOYfp5zqZSOkabg1RjVlMrQm8ZOpBXsSQMD-AxzWcBPuEA2D0XEmEkUPa7nybRs7V5JCka4CQgGydbGq3XResyZqS6ypx34X74aD4Dnc13rbft9i8cJxvgmQmbefhwCOHvB7lD44OtaKsEZ3yZJ04UeSi90CSSBxCA';
        
        setDebugInfo(`Initializing Onfido SDK with token: ${sdkToken.substring(0, 20)}...`);

        // Initialize Onfido SDK
        onfidoRef.current = Onfido.init({
          token: sdkToken,
          containerId: 'onfido-mount',
          onComplete: (data) => {
            console.log('Onfido flow completed:', data);
            setDebugInfo('Onfido flow completed successfully!');
          },
          onError: (error) => {
            console.error('Onfido error:', error);
            setError(`Onfido error: ${error.message || 'Unknown error'}`);
            setDebugInfo(`Error details: ${JSON.stringify(error, null, 2)}`);
          }
        });

        setDebugInfo('Onfido SDK initialized successfully!');
        setIsInitialized(true);
        
      } catch (err) {
        console.error('Failed to initialize Onfido:', err);
        setError(`Failed to initialize Onfido: ${err.message}`);
        setDebugInfo(`Exception details: ${err.toString()}`);
      }
    };

    initializeOnfido();

    // Cleanup function
    return () => {
      if (onfidoRef.current) {
        onfidoRef.current.tearDown();
      }
    };
  }, []);

  const handleStartVerification = () => {
    // In Onfido SDK v14, the flow starts automatically when initialized
    // The button is just for UI purposes - the flow should already be visible
    setDebugInfo('Verification flow should be visible in the container below');
  };

  return (
    <div className="onfido-container">
      <h2>Onfido Identity Verification</h2>
      <p>Workflow ID: 69d58a08-e219-4b9c-85ab-4fb5b5202beb</p>
      
      {debugInfo && (
        <div style={{ background: '#e7f3ff', padding: '10px', margin: '10px 0', borderRadius: '5px' }}>
          <strong>Debug Info:</strong> {debugInfo}
        </div>
      )}
      
      {error ? (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <button 
            onClick={handleStartVerification}
            disabled={!isInitialized}
            className="start-verification-btn"
          >
            {isInitialized ? 'Verification Ready' : 'Initializing...'}
          </button>
          <div id="onfido-mount" className="onfido-mount"></div>
        </div>
      )}
    </div>
  );
};

export default OnfidoComponent;
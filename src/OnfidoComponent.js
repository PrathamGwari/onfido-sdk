
import React, { useEffect, useRef, useState } from 'react';
import { Onfido } from 'onfido-sdk-ui';

const OnfidoComponent = () => {
  const onfidoRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [verificationData, setVerificationData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const getSdkToken = async () => {
    try {
      setDebugInfo('Getting SDK token...');
      
      const apiToken = 'api_sandbox.qECN4r_PMIB.Cic7z8zI_o57N-wJUvuTKy6zmCr4eEdH';
      const applicantId = '113b0123-2a0e-4c21-ad5f-03243ad6d702';
      
      const response = await fetch('https://api.eu.onfido.com/v3.6/sdk_token', {
        method: 'POST',
        headers: {
          'Authorization': `Token token=${apiToken}`,
          'Content-Type': 'application/json',
          'Referer': 'http://localhost:3000/'
        },
        body: JSON.stringify({
          applicant_id: applicantId,
          referrer: 'http://localhost:3000/*'
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      setDebugInfo(`SDK token received: ${data.token.substring(0, 20)}...`);
      return data.token;
      
    } catch (err) {
      console.error('Failed to get SDK token:', err);
      throw new Error(`Failed to get SDK token: ${err.message}`);
    }
  };

  useEffect(() => {
    const initializeOnfido = async () => {
      try {
        const sdkToken = "eyJhbGciOiJFUzUxMiJ9.eyJleHAiOjE3NTgyNjE1NDcsInBheWxvYWQiOnsiYXBwIjoiMTEzYjAxMjMtMmEwZS00YzIxLWFkNWYtMDMyNDNhZDZkNzAyIiwiY2xpZW50X3V1aWQiOiJhM2JkMDA0Ny1mN2E4LTQ0NmUtOWFhYS1mODMyMTJmMjA2MDciLCJpc19zYW5kYm94Ijp0cnVlLCJpc19zZWxmX3NlcnZpY2VfdHJpYWwiOnRydWUsImlzX3RyaWFsIjp0cnVlLCJyZWYiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvKiIsInNhcmRpbmVfc2Vzc2lvbiI6ImM3OTNjNDFiLTc3NDktNGY5Zi04MWZkLWEzOWQ2NjliYTJhZSJ9LCJ1dWlkIjoicGxhdGZvcm1fc3RhdGljX2FwaV90b2tlbl91dWlkIiwidXJscyI6eyJkZXRlY3RfZG9jdW1lbnRfdXJsIjoiaHR0cHM6Ly9zZGsub25maWRvLmNvbSIsInN5bmNfdXJsIjoiaHR0cHM6Ly9zeW5jLm9uZmlkby5jb20iLCJob3N0ZWRfc2RrX3VybCI6Imh0dHBzOi8vaWQub25maWRvLmNvbSIsImF1dGhfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSIsIm9uZmlkb19hcGlfdXJsIjoiaHR0cHM6Ly9hcGkub25maWRvLmNvbSIsInRlbGVwaG9ueV91cmwiOiJodHRwczovL2FwaS5vbmZpZG8uY29tIn19.MIGIAkIBxMR6pWmy7EzFSE0jOOYfp5zqZSOkabg1RjVlMrQm8ZOpBXsSQMD-AxzWcBPuEA2D0XEmEkUPa7nybRs7V5JCka4CQgGydbGq3XResyZqS6ypx34X74aD4Dnc13rbft9i8cJxvgmQmbefhwCOHvB7lD44OtaKsEZ3yZJ04UeSi90CSSBxCA"
        
        setDebugInfo('Initializing Onfido SDK...');

        onfidoRef.current = Onfido.init({
          token: sdkToken,
          containerId: 'onfido-mount',
          steps: [
            {
              type: 'welcome',
              options: {
                title: 'Verify Your Identity',
                descriptions: [
                  'Please have a valid government-issued ID ready',
                  'Ensure you have good lighting for face capture',
                  'The process takes about 2-3 minutes'
                ],
                nextButton: 'Start Verification'
              }
            },
            {
              type: 'document',
              options: {
                documentTypes: {
                  passport: true,
                  driving_licence: true,
                  national_identity_card: true
                },
                forceCrossDevice: false
              }
            },
            {
              type: 'face',
              options: {
                requestedVariant: 'motion',
              }
            },
            {
              type: 'complete',
              options: {
                message: 'Verification Complete!',
                submessage: 'Your identity has been successfully verified. Thank you!'
              }
            }
          ],
          onComplete: (data) => {
            console.log('Onfido flow completed:', data);
            setVerificationData(data);
            setIsCompleted(true);
            setDebugInfo('Verification completed successfully!');
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

    return () => {
      if (onfidoRef.current) {
        onfidoRef.current.tearDown();
      }
    };
  }, []);

  const handleSubmitToBackend = async () => {
    if (!verificationData) return;
    
    try {
      setDebugInfo('Submitting verification data to backend...');
      console.log('verificationData', verificationData);
    } catch (err) {
      setDebugInfo(`Error submitting data: ${err.message}`);
    }
  };

  return (
    <div className="onfido-container">
      <h2>Identity Verification</h2>
      <p>Secure verification process using Onfido</p>
      
      {debugInfo && (
        <div className="debug-info">
          <strong>Status:</strong> {debugInfo}
        </div>
      )}
      
      {error ? (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          {isCompleted && verificationData && (
            <div className="success-message">
              <h3>✅ Verification Complete!</h3>
              <p>Your identity has been successfully verified.</p>
              <button onClick={handleSubmitToBackend} className="submit-btn">
                Submit Data
              </button>
              <details className="data-details">
                <summary>View Verification Data</summary>
                <pre className="data-preview">
                  {JSON.stringify(verificationData, null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          <div id="onfido-mount" className="onfido-mount"></div>
        </div>
      )}
    </div>
  );
};

export default OnfidoComponent;
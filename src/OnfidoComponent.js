
import React, { useEffect, useRef, useState } from 'react';
import { Onfido } from 'onfido-sdk-ui';

const OnfidoComponent = () => {
  const onfidoRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');
  const [verificationData, setVerificationData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [sdkToken, setSdkToken] = useState('');
  const [isTokenEntered, setIsTokenEntered] = useState(false);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    if (sdkToken.trim()) {
      setIsTokenEntered(true);
      setDebugInfo('SDK token entered. Ready to initialize...');
    }
  };

  const initializeOnfido = async () => {
    try {
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
              forceCrossDevice: false
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

  useEffect(() => {
    if (isTokenEntered && sdkToken) {
      initializeOnfido();
    }

    return () => {
      if (onfidoRef.current) {
        onfidoRef.current.tearDown();
      }
    };
  }, [isTokenEntered, sdkToken]);

  const handleSubmitToBackend = async () => {
    if (!verificationData) return;
    
    try {
      setDebugInfo('Submitting verification data to backend...');
      console.log('verificationData', verificationData);
    } catch (err) {
      setDebugInfo(`Error submitting data: ${err.message}`);
    }
  };

  const resetVerification = () => {
    if (onfidoRef.current) {
      onfidoRef.current.tearDown();
    }
    setIsInitialized(false);
    setIsCompleted(false);
    setVerificationData(null);
    setError(null);
    setDebugInfo('');
    setIsTokenEntered(false);
    setSdkToken('');
  };

  return (
    <div className="onfido-container">
      <h2>Identity Verification</h2>
      <p>Secure verification process using Onfido</p>
      
      {!isTokenEntered ? (
        <div className="token-input-section">
          <h3>Enter SDK Token</h3>
          <p>Please enter your Onfido SDK token to start the verification process.</p>
          <form onSubmit={handleTokenSubmit} className="token-form">
            <div className="input-group">
              <label htmlFor="sdk-token">SDK Token:</label>
              <input
                id="sdk-token"
                type="text"
                value={sdkToken}
                onChange={(e) => setSdkToken(e.target.value)}
                placeholder="Enter your SDK token here..."
                className="token-input"
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Initialize Verification
            </button>
          </form>
          <div className="token-help">
            <details>
              <summary>How to get SDK token?</summary>
              <div className="help-content">
                <p>You can get an SDK token by making a POST request to:</p>
                <code>https://api.eu.onfido.com/v3.6/sdk_token</code>
                <p>With the following payload:</p>
                <pre>{JSON.stringify({
                  applicant_id: "your-applicant-id",
                  referrer: "http://localhost:3000/*"
                }, null, 2)}</pre>
              </div>
            </details>
          </div>
        </div>
      ) : (
        <>
          {debugInfo && (
            <div className="debug-info">
              <strong>Status:</strong> {debugInfo}
            </div>
          )}
          
          {error ? (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={resetVerification} className="submit-btn">
                Try Again
              </button>
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
              
              <div className="verification-controls">
                <button onClick={resetVerification} className="reset-btn">
                  Reset Verification
                </button>
              </div>
              
              <div id="onfido-mount" className="onfido-mount"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OnfidoComponent;
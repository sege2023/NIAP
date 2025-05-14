import {  useState } from 'react'
import styles from '../styles/landing.module.css'
// import {  useNavigate } from 'react-router-dom';
import { fetchAPI } from '../utils/api';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
// interface userData{
//   email:string
// }
interface ApiResponse {
  ok?: boolean;
  success?: boolean;
  message?: string;
}
const Landing = () =>{
    const [code, setCode] = useState("");
    const[email, setEmail] = useState('')
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const [isResending, setIsResending] = useState(false);
    // const [timer,setTimer] = useState(0)
    const [verified, setVerified] = useState(false)
    const [verificationSent, setVerificationSent] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const handleSendCode = async () => {
        try {
            const data:ApiResponse  = await fetchAPI('/api/v1/requestcode',{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body:{email}
            })
            if(data.ok){
              setMessage('Verification code sent check your email')
            }
            else {
              setMessage(data.message || "Failed to send verification code. Please try again.");
            }
        } catch (error) {

        }
        setTimeout(() => {
          setIsLoading(false);
          setVerificationSent(true);
          setStep(2);
        }, 1000);  
    }

    const handleVerifyCode = async () => {
        setMessage('Verifying Code')
        if (!code || code.length !== 6) {
          setMessage("Please enter a 6-digit verification code");
          return;
        }
        const result:ApiResponse = await fetchAPI("/api/v1/verifycode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { email:email, code:code },
        });
    
        // const result:ApiResponse = await response.json();
        if (result.success) {
          setMessage("Verification successful!");
          // setTimeout(() => navigate("/home"), 1000); 
        } else {
          setMessage("Invalid code. Please try again.");
        }
        setTimeout(() => {
          setIsLoading(false);
          setVerified(true);
        }, 1000);
    };
        
    const handleResendCode = async () => {
        if (isResending) return;
    
        setIsResending(true);
        setMessage("Resending verification code...");
        await fetch("/api/v1/resend-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email:email }),
        });
        setMessage("A new verification code has been sent to your email.");
        setTimeout(() => setMessage(""), 5000); 
    
        // setTimeout(() => {
        //   setIsResending(false); 
        // }, 60000);
        // setTimer(60); // 60-second cooldown
      //  const interval = setInterval(() => {
      //   setTimer((prevTimer) => {
      //     if (prevTimer <= 1) {
      //       clearInterval(interval);
      //       setIsResending(false);
      //       return 0;
      //     }
      //     return prevTimer - 1;
      //   });
      // }, 1000);
      };

    return(
      <div className={styles.authContainer}>
          <div className={styles.authCard}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: verified ? '100%' : step === 1 ? '50%' : '75%' }}
                />
              </div>
              <div className={styles.authContent}>
              {verified ?(
                    <div className={styles.successContainer}>
                      <div className={styles.successIcon}>
                        <CheckCircle size={40} />
                      </div>
                      <h2 className={styles.successTitle}>Verification Complete</h2>
                      <p className={styles.successMessage}>Your account has been successfully verified</p>
                      <button 
                        className={styles.authButton}
                        onClick={() => window.location.href = '/home'}
                      >
                        Continue to Dashboard
                      </button>
                    </div>
                ) : step === 1 ?(
                    <>
                    <h2 className={styles.authTitle}>Welcome</h2>
                    <p className={styles.authSubtitle}>Enter your email to continue</p>
                    
                    <div className={styles.inputGroup}>
                      <div className={styles.inputIcon}>
                        <Mail size={20} />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={styles.authInput}
                      />
                    </div>
                    
                    <button
                      disabled={!email || isLoading}
                      onClick={handleSendCode}
                      className={styles.authButton}
                      style={{ opacity: !email || isLoading ? 0.6 : 1 }}
                    >
                      <span>Send Verification Code</span>
                      {isLoading ? (
                        <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                          <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <ArrowRight size={20} />
                      )}
                    </button>
                  </>
                ) :verificationSent?(
                      <>
                      <h2 className={styles.authTitle}>Verification</h2>
                      <p className={styles.authSubtitle}>Enter the 6-digit code sent to {email}</p>
                      
                      <div className={styles.inputGroup}>
                        <div className={styles.inputIcon}>
                          <Lock size={20} />
                        </div>
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            if (value.length <= 6) setCode(value);
                          }}
                          placeholder="Enter 6 digit code"
                          className={styles.authInput}
                          maxLength={6}
                        />
                      </div>
                      
                      <button
                        disabled={!code || code.length !== 6 || isLoading}
                        onClick={handleVerifyCode}
                        className={styles.authButton}
                        style={{ opacity: !code || code.length !== 6 || isLoading ? 0.6 : 1 }}
                      >
                        <span>Verify</span>
                        {isLoading ? (
                          <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                            <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <ArrowRight size={20} />
                        )}
                      </button>
                      
                      <div>
                        <button
                          onClick={handleResendCode}
                          disabled={isLoading}
                          className={styles.resendLink}
                        >
                          Resend Code
                        </button>
                      </div>
                    </>
                  ) :(step === 1)        
              }
              {message && (
                <div className={styles.message}>
                  {message}
                </div>
              )}
              </div>
          </div>
      </div>
    )
}

export default Landing
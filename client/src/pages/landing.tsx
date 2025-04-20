import { ChangeEvent, useState } from 'react'
import styles from '../styles/landing.module.css'
import {  useNavigate } from 'react-router-dom';
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
    const [message, setMessage] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [timer,setTimer] = useState(0)
    const navigate = useNavigate()
    // const isValidEmail = (email: string) =>
    //     /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // const validateEmail = (value: string) => {
      
    //   if (!isValidEmail(value)) {
    //     setMessage("Please enter a valid email address");
    //     return false; 
    //   }
    // }

    const handleEmailChange = (e:ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);
      // validateEmail(value);
    };
    const handleCodeChange = (e:ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCode(value);
      // validateEmail(value);
    };
    const sendEmail = async () => {
      // if (!validateEmail(email)) {
      //   return;
      // }
        try {
            const response  = await fetch('/api/v1/requestcode',{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email
                })
            })
            const data:ApiResponse = await response.json()
            if(data.ok){
              setMessage('Verification code sent check your email')
            }
            else {
              setMessage(data.message || "Failed to send verification code. Please try again.");
            }
        } catch (error) {

        }
            
    }

    const verifyCodeSent = async () => {
        setMessage('Verifying Code')
        if (!code || code.length !== 6) {
          setMessage("Please enter a 6-digit verification code");
          return;
        }
        const response = await fetch("/api/v1/verifycode", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email:email, code:code }),
        });
    
        const result:ApiResponse = await response.json();
        if (result.success) {
          setMessage("Verification successful!");
          setTimeout(() => navigate("/home"), 1000); 
        } else {
          setMessage("Invalid code. Please try again.");
        }
    };
        
    const handleResend = async () => {
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
       const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResending(false);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      };

    return(
        <>
        <div>
            <div className={styles.email}>
                <input type="email" 
                value={email}
                onChange={handleEmailChange}
                placeholder='enter your email'/>
                <button onClick={sendEmail}>send</button>
            </div>
            <div className={styles.inputCode}>
                <input type="text" 
                inputMode='numeric'
                maxLength={6}
                value={code}
                // onChange={(e: ChangeEvent<HTMLInputElement>) => setCode(e.target)}
                onChange={handleCodeChange}
                placeholder='enter 6 digit code'
                />
                <button onClick={verifyCodeSent}
                disabled={!code ||code.length !== 6}>Verify</button>
            </div>
            <button onClick={handleResend}
             disabled={isResending}>{isResending ? `Resend in ${timer}s` : 'Resend Code'}</button>

            {message && (
                <div className={`${styles.messageContainer} ${message.includes("successful") ? styles.success : ""}`}>
                  <p>{message}</p>
                </div>
              )}
        </div>
        </>
    )
}

export default Landing
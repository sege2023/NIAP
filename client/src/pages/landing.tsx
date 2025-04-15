import { ChangeEvent, useState } from 'react'
import styles from '../styles/landing.module.css'
import { useLocation, useNavigate } from 'react-router-dom';
// interface userData{
//   email:string
// }
const Landing = () =>{
    // const[send, isSend] = useState
    const [code, setCode] = useState("");
    const[email, setEmail] = useState('')
    const [message, setMessage] = useState("");
    // const [emailMessage, setemailMessage] = useState('')
    const [isResending, setIsResending] = useState(false);
    const [timer,setTimer] = useState(0)
    const navigate = useNavigate()
    // const location = useLocation()
    // const email_front = location.state?.email_front;
    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const validateEmail = (value: string) => {
      
      if (!isValidEmail(value)) {
        setMessage("Please enter a valid email address");
        return false; 
      }
    }

    const handleEmailChange = (e:ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setEmail(value);
      validateEmail(value);
    };

    const send = async () => {
      if (!validateEmail(email)) {
        return;
      }
        try {
            const response  = await fetch('/api/register',{
                method: "POST",
                headers:{
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email
                })
            })
            const data = await response.json()
            if(data.ok){
              setMessage('Verification code sent check your email')
            }
            else {
              setMessage(data.message || "Failed to send verification code. Please try again.");
            }
        } catch (error) {

        }
            
    }

    const handleSubmit = async () => {
        setMessage('Verifying Code')
        if (!code || code.length !== 6) {
          setMessage("Please enter a 5-digit verification code");
          return;
        }
        const response = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email:email, verificationCode:code }),
        });
    
        const result = await response.json();
        if (result.success) {
          setMessage("Verification successful!");
          setTimeout(() => navigate("/landing"), 1000); 
        } else {
          setMessage("Invalid code. Please try again.");
        }
    };
        
    const handleResend = async () => {
        if (isResending) return;
    
        setIsResending(true);
        setMessage("Resending verification code...");
        await fetch("/api/resend-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email:email }),
        });
        setMessage("A new verification code has been sent to your email.");
        setTimeout(() => setMessage(""), 5000); 
    
        setTimeout(() => {
          setIsResending(false); 
        }, 60000);
      };

    return(
        <>
        <div>
            <div className={styles.email}>
                <input type="email" />
                <button onClick={send}>send</button>
            </div>
            <div>
                <input type="text" 
                inputMode='numeric'/>
                <button onClick={handleSubmit}>Verify</button>
            </div>
            <button onClick={handleResend}>Resend</button>
        </div>
        </>
    )
}

export default Landing
// import styles from '../styles/home.module.css'
import { fetchAPI } from '../utils/api'
import { useEffect, useState } from 'react'
import styles from '../styles/home.module.css'
import { useLocation } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'
const Home = () =>{
    const [userId, setUserId] = useState('loading ...')
    const[balance, setBalance] = useState(0)
    // const [transactions, setTransactions] = useState([])
    const [amount, setAmount] = useState(0)
    const [message, setMessage] = useState("")
    const [isopen, setIsOpen] = useState(false)

    const location  = useLocation()

    const fetchUserData = async () => {
            try {
                const data = await fetchAPI('/api/v1/dashboard', );
                // const data = await response.json();
                setUserId(data.userId || 'USER_123');
                setBalance(data.balance);
            } catch (error) {
                setMessage("Failed to fetch user data");
                console.error("Error fetching user data:", error);
            }
        }
    useEffect(() => {
        
        fetchUserData()

        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('trxref') && queryParams.get('status') === 'success') {
            setTimeout(() => {
                fetchUserData
            },2000)
        }
    }, [location.search])
    // useEffect(() => {
    //     const fetchHomeData = async () => {
    //       try {
    //         const res = await fetch('/api/v1/home', {
    //           credentials: 'include' // Send cookies
    //         });
            
    //         if (!res.ok) {
    //           throw new Error('Unauthorized');
    //         }
            
    //         const data = await res.json();
    //         console.log('User data:', data.user);
            
    //       } catch (err) {
    //         navigate('/'); // Redirect if unauthorized
    //       }
    //     };
        
    //     fetchHomeData();
    //   }, [navigate]);

    const handleTopup = async() =>{
        try {
            const data = await  fetchAPI('/api/v1/topup', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}`
                },
                body:{ amount: amount }
            })
            // const data = await res.json()
            if (data.authorization_url) {
                window.location.href = data.authorization_url;
                
            }
            else{
                console.error("Failed to redirect to payment page")
                setMessage(data.message || "Failed to redirect to payment page")
            }
        } catch (error) {
            console.error("Payment initiation failed:", error);
        }
    }
return(
    <div className={styles.container}>
        <div className={styles.containerwrapper}>
            <div className={styles.customerboard}>
                <div className={styles.header}>
                    <button className={styles.userId}>{userId}</button>
                    <div>
                        <button onClick={() => setIsOpen(true)} className={styles.topUpButton}>+ TOP UP</button>
                        {isopen &&  (
                            <div className={styles.modaloverlay} onClick={() => setIsOpen(false)}>
                                <div className={styles.modal} onClick={(e => e.stopPropagation())}>
                                    <h2>Top Up</h2>
                                    <input type="amount" placeholder='Enter amount' value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                                    <button onClick={handleTopup}>Top Up</button>
                                    <button onClick={() => setIsOpen(false)}>Close</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <p>Available balance</p>
                    <p>{balance.toLocaleString()}</p>
                </div>
                <div>
                </div>
                {/* <div className={styles.topup}>
                    <button>+ top up</button>
                </div> */}
            </div>
            {message && (
                <div className={styles.message}>
                    {message}
                </div>
            )}
            <div className={styles.transaction}>

            </div>
        </div>
    </div>
)
}
export default Home
// import styles from '../styles/home.module.css'
import styles from '../styles/home.module.css'
// import styles from '../styles/nav.module.css'
const Home = () =>{
return(
    <>
    <div>
        <div className={styles.customerboard}>
            <button>user id</button>
            <div>
                <p>Available balance</p>
            </div>
            <div>
                <p>13000</p>
            </div>
            <div>
                <button>+ top up</button>
            </div>
        </div>
    </div>
    </>
)
}
export default Home
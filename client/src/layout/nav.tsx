import styles from "../styles/nav.module.css"
import { Home,Activity,User } from "lucide-react"
const Navbar =()=>{
    return(
        <>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <a href="" className={styles.navItem}><Home/></a>
                    {/* <a href="" className={`${styles.navItem} ><Activity/></a> */}
                    <a href="/transaction" className={styles.navItem}><Activity/></a>
                    <a href="" className={styles.navItem}><User/></a>
                    {/* <a href="/transaction" className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}><User/></a> */}
                </div>
            </nav>

            {/* <button className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}>
                {icon}
                <span className={styles.navLabel}>{label}</span>
            </button> */}
        </>
    )
}
export default Navbar
import styles from "../styles/nav.module.css"
// import { Home,Activity,User } from "lucide-react"
const Navbar =()=>{
    return(
        <>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                {/* <NavItem icon={<Home size={24} />} label="Home" active />
                <NavItem icon={<Activity size={24} />} label="Transactions" />
                <NavItem icon={<User size={24} />} label="Profile" /> */}
                </div>
            </nav>
        </>
    )
}
export default Navbar
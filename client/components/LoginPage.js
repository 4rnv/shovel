import styles from "../styles/room.module.scss";
import Link from 'next/link';
import { PiBackspace } from "react-icons/pi";
import Login from "./Login";
import CreateUser from "./CreateUser";

export default function LoginPage() {
    return (
        <div className={styles.loggedOut}>
            <div className={styles.backButton}>
                <Link href="/">    
                    <PiBackspace />
                </Link>
            </div>
            <Login />
            <CreateUser />
        </div>
    )
}
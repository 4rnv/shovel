import { useState, useContext } from 'react';
import styles from "../styles/room.module.scss";
import UserContext from '../contexts/UserContext';

function CreateUser() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [color, setColor] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {setUserInfo} = useContext(UserContext);

    function submitForm(e) {
        e.preventDefault();
        if (!firstName || !lastName || !username || !password || !color) {
            setErrorMessage("All fields must be filled");
            return;
        }

        if (firstName.length > 50 || lastName.length > 50 || username.length > 50 || password.length > 50) {
            setErrorMessage("Input exceeds maximum length of 50 characters");
            return;
        }

        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!hexColorRegex.test(color)) {
            setErrorMessage("Invalid color format. Please use hex color code.");
            return;
        }
        if (password !== passwordConfirm) {
            setErrorMessage("Passwords do not match");
            return;
        }

        fetch('/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                password,
                color
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setUserInfo({...data.user});
                setErrorMessage("");
            } else {
                setErrorMessage(data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            setErrorMessage("An error occurred while creating the user");
        });
    }

    return (
        <div className={styles.createUser}>
            <h2>Create User</h2>
            <form>
                <label>
                    First Name:
                    <input type="text" value={firstName} maxLength={50} onChange={e => setFirstName(e.target.value)} />
                </label>
                <label>
                    Last Name:
                    <input type="text" value={lastName} maxLength={50} onChange={e => setLastName(e.target.value)} />
                </label>
                <label>
                    Username:
                    <input type="text" value={username} maxLength={50} onChange={e => setUsername(e.target.value)} />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} maxLength={50} onChange={e => setPassword(e.target.value)} />
                </label>
                <label>
                    Confirm Password:
                    <input type="password" value={passwordConfirm} maxLength={50} onChange={e => setPasswordConfirm(e.target.value)} />
                </label>
                <label>
                    Color:
                    <input type="color" value={color} onChange={e => setColor(e.target.value)} />
                </label>
                <input className={styles.submitForm} type="submit" value="Create Account" onClick={submitForm} />
                <div className={styles.errorMessage}>
                    {errorMessage}
                </div>
            </form>
        </div>
    )
}
export default CreateUser;
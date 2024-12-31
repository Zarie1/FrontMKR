import axios from "axios";
import {useState} from "react";
import { useNavigate } from "react-router-dom";

export function Registration() {
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')
    const [name, setName] = useState('')

    let navigate = useNavigate();

    async function handleRegistration() {
        try{
            const response
                = await axios.post('http://localhost:8000/api/register', {username: user, password: pass, full_name: name})
            console.log(response)
            navigate('/login');
        }
        catch (error) {
            if (error.response.status === 409) {
                alert("This username is already in use")
            }
            if (error.response.status === 422) {
                alert("Validation error: Please check your inputs.")
            }
        }
    }

    return(<>
        <form>
            <p>Login: </p>
            <input value={user}
                   onChange={(e) => setUser(e.target.value)}
                   type='text'
                   id='username'/>
            <p>Password: </p>
            <input value={pass}
                   onChange={(e) => setPass(e.target.value)}
                   type='password'
                   id='password'/>
            <p>Name: </p>
            <input value={name}
                   onChange={(e) => setName(e.target.value)}
                   type='text'
                   id='full_name'/>
        </form>
        <button onClick={handleRegistration}>Register</button>
        <button onClick={e => navigate('/login')}>To Login page</button>
    </>)
}
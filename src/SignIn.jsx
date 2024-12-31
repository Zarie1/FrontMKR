import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function SignIn() {
    const [user, setUser] = useState('')
    const [pass, setPass] = useState('')

    let navigate = useNavigate();

    async function handleSignIn() {
        try{
            const response
                = await axios.post('http://localhost:8000/api/login', {username: user, password: pass})
            const encodedCredentials = btoa(`${user}:${pass}`);
            localStorage.setItem("credentials", encodedCredentials);
            console.log(response);
            navigate('/me');
        }
        catch(error){
            if (error.response.status === 401) {
                alert("Wrong login or password")
            }
            if (error.response.status === 422) {
                alert("Invalid characters in login")
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
        </form>
        <button onClick={handleSignIn}>Login</button>
    </>)
}
import '../loginpage/loginpage.css';
import bigUser from '../../assets/login-img/big-user-icon.png';
import userIcon from '../../assets/login-img/user-icon.png';
import lock from '../../assets/login-img/lock.png';
import oxford from '../../assets/login-img/oxford.png';
import bigben from '../../assets/login-img/big-ben.png';
import tree from '../../assets/login-img/tree.png';
import background from '../../assets/login-img/loginscreen.png';
import React, {useState} from 'react';
import { useLoginUser } from './login-linking.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const loginUser = useLoginUser(state => state.loginUser);
    const navigate = useNavigate();

    const notifySuccess = (msg) => toast.success(msg, { autoClose: 3000 });
    const notifyError = (msg) => toast.error(msg, { autoClose: 3000 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await loginUser({username, password});

        if (res.success) {
            if (res.userData){
            localStorage.setItem("user", JSON.stringify(res.userData));
        }
            notifySuccess("Welcome back!");
            setTimeout(() => navigate('/logged-in-home-page'), 1500);
        } else {
            notifyError(res.message);
        }
    };
    return (
        <div
            className="login-page"
            style={{
                background: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width:'100vw'
            }}
        >
            <div className="login-page-content">
                <div className='login-left'>
                    <ToastContainer position="top-center" />
                    <img src={bigUser} className='bigUser'/>
                    <form onSubmit={handleSubmit}>
                        <div className='login-inputs'>
                            <div className='login-username'>
                                <img src={userIcon}/>
                                <input type="text" placeholder='Enter your username...'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}/>
                            </div>
                            <div className='login-password'>
                                <img src={lock}/>
                                <input type="password" placeholder='Enter your password...'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>
                        <a href="/resetting-pass-email" className='forgot-pass'>Forgot Password?</a>
                        <button className='login-btn' type='submit'>LOGIN</button>
                    </form>
                    <h1 className='sign-up-other'>Not a user yet? <a href='/signup' className='signup'>Sign up</a></h1>
                </div>
                <div className="right-shaded-box">
                    <div className='images-login'>
                        <img src={oxford} className='oxford'/>
                        <div className='stacked-img'>
                            <img src={bigben} className='bigben'/>
                            <img src={tree} className='tree'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default LoginPage;
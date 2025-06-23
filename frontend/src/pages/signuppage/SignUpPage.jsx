import '../signuppage/signup.css';
import bigUser from '../../assets/login-img/big-user-icon.png';
import userIcon from '../../assets/login-img/user-icon.png';
import lock from '../../assets/login-img/lock.png';
import oxford from '../../assets/login-img/oxford.png';
import bigben from '../../assets/login-img/big-ben.png';
import tree from '../../assets/login-img/tree.png';
import mail from '../../assets/login-img/mail.png';
import background from '../../assets/login-img/loginscreen.png';
import React, { useState } from 'react';
import { useCreateUser } from "./signup-linking.js";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [inputName, setName] = useState('');
    const [inputUsername, setUsername] = useState('');
    const [inputEmail, setEmail] = useState('');
    const [inputPassword, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const createUser = useCreateUser(state => state.createUser);
    
    const notifySuccess = (msg) => toast.success(msg, { autoClose: 5000 });
    const notifyError = (msg) => toast.error(msg, { autoClose: 6000 });
    
        const handleSubmit= async (e) => {
            e.preventDefault();
    
        if (!inputName.trim() || !inputUsername.trim() || !inputEmail.trim() || !inputPassword.trim()) {
            alert("Please fill in all fields");
            return;
        }

        if (inputPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    
      const { success, message } = await createUser({
        name: inputName,
        username: inputUsername,
        email: inputEmail,
        password: inputPassword,
        confirmpass: confirmPassword,
    });
    
      if (success) {
        notifySuccess("Signup successful!");
        setTimeout(() => {
            navigate("/login");
        }, 2500);
      } else {
        notifyError(message);
      }

    }
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
                    <div className="signup-page-content">
                        <div className='signup-left'>
                             <ToastContainer position="top-center" />
                            <img src={bigUser} className='bigUser'/>
                            <form onSubmit={handleSubmit}>
                                <div className='inputs'>
                                    <div className='top-inputs'>
                                        <div className='name-inputs'>
                                            <div className='username'>
                                                <img src={userIcon}/>
                                                <input type="text" placeholder='Enter your name...'
                                                value={inputName}
                                                onChange={(e) => setName(e.target.value)}/>
                                            </div>
                                            <div className='username'>
                                        
                                                <input type="text" placeholder='Enter your username...'
                                                value={inputUsername}
                                                onChange={(e) => setUsername(e.target.value)}/>
                                            </div>
                                        </div>
                                        <div className='username'>
                                            <img src={mail}/>
                                            <input type="text" placeholder='Enter your email...'
                                            value={inputEmail}
                                            onChange={(e) => setEmail(e.target.value)}/>
                                        </div>
                                    </div>
                                    <div className='bottom-inputs'>
                                        <div className='password'>
                                            <img src={lock}/>
                                            <input type="password" placeholder='Enter your password...'
                                            value={inputPassword}
                                            onChange={(e) => setPassword(e.target.value)}/>
                                        </div>
                                        <div className='password'>
                                            <img src={lock}/>
                                            <input type="password" placeholder='Confirm your password...'
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}/>
                                        </div>
                                    </div>
                                </div>
                                
                                <button className='signup-btn' type='submit'>SIGN UP</button>
                            </form>
                        </div>
                        <div className="right-shaded-box">
                            <div className='images-signup'>
                                <img src={oxford} className='oxford'/>
                                <div className='stacked-img'>
                                    <img src={bigben} className='bigben'/>
                                    <img src={tree} className='tree'/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        
    )
}

export default SignUpPage;
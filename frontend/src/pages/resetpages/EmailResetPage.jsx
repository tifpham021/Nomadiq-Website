import '../resetpages/emailreset.css';
import background from '../../assets/login-img/reset-background.png';
import topBackground from '../../assets/login-img/reset-above.png';
import bigMail from '../../assets/login-img/big-mail-icon.png';
import React, {useState} from 'react';
import { useEmailReset } from './emailReset-linking.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const EmailResetPage = () => {
    const [email, setEmail] = useState('');
    const resetEmail = useEmailReset(state => state.resetEmail);
    const navigate = useNavigate();

    const notifySuccess = (msg) => toast.success(msg, { autoClose: 3000 });
    const notifyError = (msg) => toast.error(msg, {autoClose: 2500});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {success, message} = await resetEmail({email});
        
        if(success) {
            notifySuccess("An email was sent to reset your password!");
            setTimeout(() => navigate("/login"), 4000);
        } else {
            notifyError(message);
        }
    }
    return (
        <div className="email-reset-page"
        style={{
                background: `url(${background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '100vh',
                width:'100vw'
        }}>
            <div className='box'
            style={{
                background: `url(${topBackground})`,
            }}>
                <ToastContainer position="top-center"/>
            <form onSubmit={handleSubmit}>
                <img src={bigMail} className='big-mail-icon'/>
                <h1 className='email-header'>Please Enter the Email you Registered with</h1>
                <input type='email' placeholder='Enter your email...'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}/>
                <button className='enter-btn' type='submit'>ENTER</button>
            </form>
        </div>

        </div>
    )
}

export default EmailResetPage;
import '../resetpages/passreset.css';
import background from '../../assets/login-img/reset-background.png';
import topBackground from '../../assets/login-img/reset-above.png';
import bigLock from '../../assets/login-img/big-lock-icon.png';
import React, {useState} from 'react';
import { usePassReset } from './passReset-linking.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';

const PassResetPage = () => {
    const { token } = useParams();
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const resetPass = usePassReset(state => state.resetPass);
    const navigate = useNavigate();

    const notifySuccess = (msg) => toast.success(msg, { autoClose: 3000 });
    const notifyError = (msg) => toast.error(msg, {autoClose: 2500});

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pass.trim() || !confirmPass.trim()) {
            notifyError("Please fill in all fields");
            return;
        }

        if (pass !== confirmPass) {
            notifyError("Passwords do not match");
            return;
        }
        const {success, message} = await resetPass({pass, token});
        
        if(success) {
            notifySuccess("Your password has successfully reset!");
            setTimeout(() => navigate("/login"), 4000);
        } else {
            notifyError(message);
        }
    }
    return (
        <div className="pass-reset-page"
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
                <img src={bigLock} className='big-lock-icon'/>
                <h1 className='pass-header'>Please Enter your New Password</h1>
                <div className='pass-inputs'>
                    <input type='password' placeholder='Enter your new password...'
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}/>
                    <input type='password' placeholder='Confirm your new password...'
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}/>
                </div>
                <button className='enter-btn' type='submit'>ENTER</button>
            </form>
        </div>

        </div>
    )
}

export default PassResetPage;
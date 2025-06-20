import '../resetpages/emailreset.css';
import background from '../../assets/login-img/reset-background.png';
import topBackground from '../../assets/login-img/reset-above.png';
import bigMail from '../../assets/login-img/big-mail-icon.png';
const EmailResetPage = () => {
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
            <img src={bigMail} className='big-mail-icon'/>
            <h1 className='email-header'>Please Enter the Email you Registered with</h1>
            <input type='text' placeholder='Enter your email...'/>
            <a href="/resetting-pass"><button className='enter-btn'>ENTER</button></a>
        </div>

        </div>
    )
}

export default EmailResetPage;
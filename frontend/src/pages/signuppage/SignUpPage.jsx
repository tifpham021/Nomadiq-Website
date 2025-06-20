import '../signuppage/signup.css';
import bigUser from '../../assets/login-img/big-user-icon.png';
import userIcon from '../../assets/login-img/user-icon.png';
import lock from '../../assets/login-img/lock.png';
import oxford from '../../assets/login-img/oxford.png';
import bigben from '../../assets/login-img/big-ben.png';
import tree from '../../assets/login-img/tree.png';
import mail from '../../assets/login-img/mail.png';
import background from '../../assets/login-img/loginscreen.png';

const SignUpPage = () => {
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
                            <img src={bigUser} className='bigUser'/>
                            <div className='inputs'>
                                <div className='top-inputs'>
                                    <div className='username'>
                                        <img src={userIcon}/>
                                        <input type="text" placeholder='Enter your username...'/>
                                    </div>
                                    <div className='username'>
                                        <img src={mail}/>
                                        <input type="text" placeholder='Enter your email...'/>
                                    </div>
                                </div>
                                <div className='bottom-inputs'>
                                    <div className='password'>
                                        <img src={lock}/>
                                        <input type="password" placeholder='Enter your password...'/>
                                    </div>
                                    <div className='password'>
                                        <img src={lock}/>
                                        <input type="password" placeholder='Confirm your password...'/>
                                    </div>
                                </div>
                            </div>
                            <a href="/login"><button className='signup-btn'>SIGN UP</button></a>
                        
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
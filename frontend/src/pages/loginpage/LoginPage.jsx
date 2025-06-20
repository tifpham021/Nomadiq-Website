import '../loginpage/loginpage.css';
import bigUser from '../../assets/login-img/big-user-icon.png';
import userIcon from '../../assets/login-img/user-icon.png';
import lock from '../../assets/login-img/lock.png';
import oxford from '../../assets/login-img/oxford.png';
import bigben from '../../assets/login-img/big-ben.png';
import tree from '../../assets/login-img/tree.png';
import background from '../../assets/login-img/loginscreen.png';


const LoginPage = () => {
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
                    <img src={bigUser} className='bigUser'/>
                    <div className='inputs'>
                        <div className='username'>
                            <img src={userIcon}/>
                            <input type="text" placeholder='Enter your username...'/>
                        </div>
                        <div className='password'>
                            <img src={lock}/>
                            <input type="password" placeholder='Enter your password...'/>
                        </div>
                    </div>
                    <a href="/forgot-pass" className='forgot-pass'>Forgot Password?</a>
                    <a href="/logged-in-home-page"><button className='login-btn'>LOGIN</button></a>
                    <h1 className='sign-up-other'>Not a user yet? <span className='signup'>Sign up</span></h1>
                </div>
                <div className="right-shaded-box">
                    <img src={oxford}/>
                    <img src={bigben}/>
                    <img src={tree}/>
                </div>
            </div>
        </div>

    );
}

export default LoginPage;
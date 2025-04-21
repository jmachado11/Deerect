import { useState } from 'react';
import '../../public/assets/scss/waitlist.css'
function Hero(){
  const [email, setEmail] = useState('');
  const handleEmailChange=(e)=>{
    setEmail(e.target.value);
  }
  const submitEmail=()=>{
    setEmail("");
  }
  return(
  <div className="hero-container">
    <div className='hero-image'></div>
    <div className='hero-text'>
      <h1>
      The Future of Tax Lien Investing <br className='hero-h1-break'></br>
      Starts with <span className='hero-name'>Deerect</span>
      </h1>
      <h2>Join the waitlist to access smarter tools, exclusive<br className='hero-h2-break'></br>listings,and a seamless investing experience.</h2>
    </div>
    <div className='hero-action'>
      <div className='hero-input'>
        <img src='/assets/images/waitlist/mail.png'></img>
      <input onChange={handleEmailChange} value={email} placeholder="Your email address" style={email.length!==0?{backgroundColor:"#31313170"}:{}}></input>
      </div>
      
      <button onClick={submitEmail}>Join the waitlist</button>
    </div>
  </div>)

}

export default Hero;
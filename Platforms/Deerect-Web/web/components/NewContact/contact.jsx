import Footer from "../footer/Footer";
import Header from "../waitlist/Header";
import "../../public/assets/scss/contact.css";
function Contact() {
  return (
    <>
      <div className="contact-page">
        <div className="contact-title">
          <h1>Send us a message</h1>
          <h2>
            Feel free to send us a message, and we’ll get back to you as soon as
            possible.
          </h2>
        </div>
        <div className="contact-inputs">
          <div className="contact-information">
            <div className="contact-input-container">
              <p>First name</p>
              <input placeholder="Jane"></input>
            </div>
            <div className="contact-input-container">
              <p>Last name</p>
              <input placeholder="Doe"></input>
            </div>
          </div>
          <div className="contact-information">
            <div className="contact-input-container">
              <p>Email address</p>
              <input placeholder="example123@gmail.com"></input>
            </div>
            <div className="contact-input-container">
              <p>Phone number</p>
              <input placeholder="+1 (555)-555-5555"></input>
            </div>
          </div>
          <div className="contact-message">
            <div className="contact-input-container">
              <p>Message</p>
              <textarea placeholder="Write your message..."></textarea>
            </div>
          </div>
          <button className="send-message-button">Send message</button>
        </div>
      </div>
    </>
  );
}

export default Contact;

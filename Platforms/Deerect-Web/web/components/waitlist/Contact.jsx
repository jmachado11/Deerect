import { useState } from "react";

function Contact({ toggleContact }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const handleFName = (e) => {
    setFirstName(e.target.value);
  };
  const handleLName = (e) => {
    setLastName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="waitlist-contact-page">
      <div className="waitlist-contact-container">
        <div className="waitlist-contact-title">
          <h2>Send us a message</h2>
          <h3>
            Feel free to send us a message, and we’ll get back to you as soon as
            possible.
          </h3>
        </div>
        <div className="waitlist-contact-inputs">
          <div className="waitlist-contact-name">
            <div className="waitlist-contact-input">
              <p>First name</p>
              <input
                value={firstName}
                onChange={handleFName}
                className="waitlist-contact-name-input"
                placeholder="Jane"
              ></input>
            </div>
            <div className="waitlist-contact-input">
              <p>Last name</p>
              <input
                value={lastName}
                onChange={handleLName}
                className="waitlist-contact-name-input"
                placeholder="Doe"
              ></input>
            </div>
          </div>
          <div className="waitlist-contact-input">
            <p>Email address</p>
            <input
              value={email}
              onChange={handleEmail}
              placeholder="example123@gmail.com"
            ></input>
          </div>
          <div className="waitlist-contact-input">
            <p>Phone number</p>
            <input
              value={phone}
              onChange={handlePhone}
              placeholder="+1 (555)-555-5555"
            ></input>
          </div>
          <div className="waitlist-contact-input">
            <p>Message</p>
            <textarea
              value={message}
              onChange={handleMessage}
              placeholder="Write your message..."
            ></textarea>
          </div>
          <div className="waitlist-contact-action">
            <button className="waitlist-contact-send-message">
              Send message
            </button>
            <button onClick={toggleContact} className="waitlist-contact-cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Contact;

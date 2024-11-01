import { useState } from "react";
import { api } from "../../../api/api";
import './UserContact.sass';



  function UserContactForm() {
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [, setErrorMessage] = useState<string>("");



    const hasChanges = firstName !== "" && lastName !== "" && title !== "" && message !== "" && email !== "";

    const lastNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
      };
      const messageChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
      };
    const titleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    };
    const firstNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFirstName(e.target.value);
    };
    const emailChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
    };

    const payload = {
        firstName,
        lastName,
        title,
        message,
        email,
    };

    const doAddMessage = (e: any) => {
      api(
        "put",
        "/api/message",
        payload
      )
        .then((res) => {
          if (res.status !== "ok") {
            throw new Error("Could not send this message!");
          }
          return res.data;
        })
        .catch((error) => {
          setErrorMessage(error?.message ?? "Unknown error!");
        });
    };


    return (

        
        <div className="UserContactForm">
        <form id="contact-form" onSubmit={doAddMessage}>
          <div className="form-group">
            <label htmlFor="name">First name</label>
            <input type="text" className="form-control"  value={firstName || ""} onChange={(e) => firstNameChanged(e)} />
          </div>
          <div className="form-group">
            <label htmlFor="name">Last name</label>
            <input type="text" className="form-control"  value={lastName || ""} onChange={(e) => lastNameChanged(e)} />
          </div>
          <div className="form-group">
            <label htmlFor="name">Title</label>
            <input type="text" className="form-control"  value={title || ""} onChange={(e) => titleChanged(e)} />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" aria-describedby="emailHelp" value={email || ""} onChange={(e) => emailChanged(e)} />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea className="form-control" value={message|| ""} onChange={(e) => messageChanged(e)} />
          </div>

         <button type="submit" disabled={!hasChanges}>
          Submit
        </button>
        </form>
      </div>

 
    

      
    );
  }
  export default UserContactForm;

  


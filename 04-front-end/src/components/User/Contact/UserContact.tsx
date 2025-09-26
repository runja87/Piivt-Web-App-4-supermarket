import { useState } from "react";
import { api } from "../../../api/api";
import "./UserContact.sass";

function UserContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const hasChanges =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    title.trim() !== "" &&
    message.trim() !== "" &&
    email.trim() !== "";

  const doAddMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccess("");
    if (!hasChanges) return;

    setLoading(true);
    try {
      const payload = { firstName, lastName, title, message, email };
      const res = await api("post", "/api/message", payload);
      if (res.status !== "ok") {
        throw new Error(
          typeof res.data === "string"
            ? res.data
            : "Could not send this message!"
        );
      }
      setSuccess("Your message has been sent.");

      setFirstName("");
      setLastName("");
      setTitle("");
      setMessage("");
      setEmail("");
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Unknown error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="UserContactForm">
      <form id="contact-form" onSubmit={doAddMessage} noValidate>
        <div className="form-group">
          <label htmlFor="contact-firstName" className="form-label">
            First name
          </label>
          <input
            id="contact-firstName"
            name="firstName"
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-lastName" className="form-label">
            Last name
          </label>
          <input
            id="contact-lastName"
            name="lastName"
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-title" className="form-label">
            Title
          </label>
          <input
            id="contact-title"
            name="title"
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-email" className="form-label">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="form-control"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="contact-message" className="form-label">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            className="form-control"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={!hasChanges || loading}>
          {loading ? "Sending..." : "Submit"}
        </button>

        {errorMessage && (
          <div className="error" role="alert">
            {errorMessage}
          </div>
        )}
        {success && (
          <div className="alert alert-success" role="status">
            {success}
          </div>
        )}
      </form>
    </div>
  );
}

export default UserContactForm;

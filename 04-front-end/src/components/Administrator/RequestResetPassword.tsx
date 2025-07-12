import { useState } from "react";
import { api } from "../../api/api";

export default function RequestResetPassword() {
  const [email, setEmail] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const doSend = () => {
    api("post", "/api/administrator/requestpasswordreset", { email })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Reason: " + JSON.stringify(res.data)
          );
        }
        window.location.href = "/check-email";
      })
      .catch((error) => {
        if (error.message.includes("format")) {
          setErrorMessage("Please enter a valid email address.");
        } else if (
          error.message.includes("required") ||
          error.message.includes("empty")
        ) {
          setErrorMessage(
            "Please enter an email associated with your account."
          );
        } else {
          setErrorMessage(
            error.message || "An error occurred. Please try again."
          );
        }
      });
  };

  return (
    <section className="vh-100 gradient-custom">
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">
                    Send password reset link
                  </h2>
                  <p className="text-white-50 mb-5">
                    Please enter an email asociated with your account
                  </p>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      id="typeEmailX"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typeEmailX">
                      email
                    </label>
                  </div>

                  <button
                    className="btn btn-outline-light btn-lg px-5"
                    type="submit"
                    onClick={() => doSend()}
                  >
                    Send Reset Link
                  </button>

                  <div className="d-flex justify-content-center text-center mt-4 pt-1">
                    <a href="#!" className="text-white">
                      <i className="fab fa-facebook-f fa-lg"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-twitter fa-lg mx-4 px-2"></i>
                    </a>
                    <a href="#!" className="text-white">
                      <i className="fab fa-google fa-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

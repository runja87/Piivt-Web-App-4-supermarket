import { useState } from "react";
import { api } from "../../api/api";
import { useParams } from "react-router-dom";

export default function ResetPassword() {
  const [passwordNew, setPasswordNew] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const {code} = useParams(); 
  const [errorMessage, setErrorMessage] = useState<string>("");
  const doSave = () => {
    api("post", `/api/administrator/resetpassword/${code}`, {password1: passwordNew, password2: passwordConfirm })
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Error! Reason: " + JSON.stringify(res.data)
          );
        }
        window.location.href = "/admin/dashboard";
      })
      .catch((error) => {
        if (error.message.includes("password2")) {
          setErrorMessage(
            "Please confirm your new password."
          );
        } else if (error.message.includes("match")
          
        ) {
          setErrorMessage("Passwords do not match!");
       
        }else if (error.message.includes("must match pattern")
          
        ) {
          setErrorMessage("Please enter a valid password. At least 8 char and one capital letter, number, space and one spec char!");
       
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
                  <h2 className="fw-bold mb-2 text-uppercase">Change password</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your new password!
                  </p>

            
                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      value={passwordNew}
                      onChange={(e) => setPasswordNew(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typeEmailX">
                      New Password
                    </label>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typePasswordX">
                      Confirm New Password
                    </label>
                  </div>
                  <div className="form-group mb-3">
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="button"
                      onClick={doSave}
                    >
                      Save
                    </button>
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

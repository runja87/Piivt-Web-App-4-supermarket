import { useState } from "react";
import { api } from "../../../api/api";
import AuthStore from "../../../stores/AuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  
  const payload = {
    username,
    password,
  };
  const doLogin = () => {
    api("post", "/api/auth/administrator/login", payload)
      .then((res) => {
        if (res.status !== "ok") {
          throw new Error(
            "Could not log in. Reason: " + JSON.stringify(res.data)
          );
        }
        return res.data;
      })
      .then((data) => {
        AuthStore.dispatch({
          type: "update",
          key: "authToken",
          value: data?.authToken,
        });
        AuthStore.dispatch({
          type: "update",
          key: "refreshToken",
          value: data?.refreshToken,
        });
        AuthStore.dispatch({
          type: "update",
          key: "identity",
          value: username,
        });
        AuthStore.dispatch({ type: "update", key: "id", value: +data?.id });
        AuthStore.dispatch({
          type: "update",
          key: "role",
          value: "administrator",
        });
        navigate("/admin/dashboard", { replace: true });
      })
      .catch((error) => {
        setError(error?.message ?? "Could not log in!");
        setTimeout(() => {
          setError("");
        }, 3500);
      });
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div
              className="card bg-dark text-white"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Admin login</h2>
                  <p className="text-white-50 mb-5">
                    Please enter your username and password!
                  </p>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      id="typeEmailX"
                      className="form-control form-control-lg"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typeEmailX">
                      Username
                    </label>
                  </div>

                  <div className="form-outline form-white mb-4">
                    <input
                      type="password"
                      id="typePasswordX"
                      className="form-control form-control-lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label className="form-label" htmlFor="typePasswordX">
                      Password
                    </label>
                  </div>
                  <p className="small mb-5 pb-lg-2">
                    <a className="text-white-50" href="/auth/request-password-reset">
                      Forgot password?
                    </a>
                  </p>
                  <div className="form-group mb-3">
                    <button
                      className="btn btn-outline-light btn-lg px-5"
                      type="button"
                      onClick={doLogin}
                    >
                      Login
                    </button>
                  </div>
                </div>
                {error && <p className="alert alert-danger">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

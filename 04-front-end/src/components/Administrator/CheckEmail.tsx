export default function CheckEmail() {
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
                  <h2 className="fw-bold mb-2 text-uppercase">Check your email</h2>
                  <p className="text-white-50 mb-5">
                    Password reset link has been sent to your email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
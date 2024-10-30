import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { api } from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminAdministratorAdd() {
    const [ username, setUsername ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");
    const [ password, setPassword] = useState<string>("");
    const [ errorMessage, setErrorMessage ] = useState<string>("");
    const navigate = useNavigate();
    

    function doAddAdministrator(){
        api("post", "/api/administrator", {username,email,password})
        .then(() => {
            navigate("/admin/dashboard/administrator/list");
        })
        .catch(error => {
          console.log("error")
          if (error.response && error.response.data && error.response.data.data && error.response.data.data.error) {
              const errorData = error.response.data.data.error;
              console.log("error")
              if (errorData.code === 'ER_DUP_ENTRY') {
                  setErrorMessage("This username is already taken. Please choose another one.");
              } else {
                  setErrorMessage("An error occurred while creating the administrator. Please try again.");
              }
          } else {
              setErrorMessage("An error occurred. Please check your internet connection and try again.");
          }
      });
      
    }
  return (
    <div className="row">
      <div className="col-12 col-md-8 offset-md-2 col-lg-7 offset-lg-3">
        <div className="card ">
          <div className="card-body">
            <div className="card-title">
                <h1 className="h4">Add new administrator</h1>
            </div>
            <div className="card-text p-2">
                <div className="form-group mb-2">
                    <label htmlFor="input-username">Username</label>
                    <input type="text" id="input-username" className="form-control" value={username} onChange={ e => setUsername(e.target.value)}/>
                </div>

                <div className="form-group mb-2">
                    <label htmlFor="input-email">Email</label>
                    <input type="text" id="input-email" className="form-control" value={email} onChange={ e => setEmail(e.target.value)}/>
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="input-password">Password</label>
                    <input type="password" id="input-password" className="form-control" value={password} onChange={ e => setPassword(e.target.value)}/>
                </div>
                <div className="form-group">
                    <button className="btn btn-dark" onClick={ () => doAddAdministrator() }>
                        <FontAwesomeIcon icon={ faSave }/>
                        &nbsp; Add New 
                    </button>
                    <button className="btn btn-black" onClick={ () => navigate("/admin/dashboard")}>
                        Cancel
                    </button>
                </div>
                { errorMessage && <p className="mt04 alert alert-danger">{ errorMessage }</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

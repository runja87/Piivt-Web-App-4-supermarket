import React, { useEffect, useState, useCallback } from "react";
import IAdministrator from "../../../models/IAdministrator.model";
import { api } from "../../../api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquare, faSquareCheck } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
interface IAdministratorRowProperties {
  administrator: IAdministrator;
  onAdministratorUpdated: () => void;
}


  function AdminAdministratorList() {
  const [administrators, setAdministrators] = useState<IAdministrator[]>([]);
  const admins = Array.isArray(administrators) ? administrators : [];
  const [errorMessage, setErrorMessage] = useState<string>("");

  const loadAdministrators = useCallback(() => {
    api("get", "/api/administrator").then((res) => {
      if (res.status === "error") {
        return setErrorMessage(res.data + "");
      }
  
      setAdministrators(res.data);
    });
  }, []); 

  useEffect(() => {
    loadAdministrators();
  }, [loadAdministrators]); 

  function AdminAdministratorRow(props: IAdministratorRowProperties) {
    const [editPasswordVisible, setEditPasswordVisible] =
      useState<boolean>(false);
    const [editNamePartsVisible, setEditNamePartsVisible] =
      useState<boolean>(false);
    const [newPassword, setNewPassword] = useState<string>("");
    const [newUsername, setNewUsername] = useState<string>(
      props.administrator.username
    );
    const [newEmail, setNewEmail] = useState<string>(props.administrator.email);

    const activeSideClass = props.administrator.isActive
      ? "btn-primary"
      : "btn-light";
    const inactiveSideClass = !props.administrator.isActive
      ? "btn-primary"
      : "btn-light";
    function refreshList() {
      props.onAdministratorUpdated();
    }
    function doToggleAdministratorActiveState() {
      api("put", "/api/administrator/" + props.administrator.administratorId, {
        isActive: !props.administrator.isActive,
      })
        .then((res) => {
          if (res.status === "error") {
            return setErrorMessage("test");
          } else {
            refreshList();
          }
        })
        .catch((error) => {
          if (error.response) {
           
            setErrorMessage(error.response.data.message);
          } else if (error.request) {
           
            setErrorMessage(
              "No response from the server. Please try again later."
            );
          } else {
           
            setErrorMessage("An error occurred. Please try again.");
          }
        });
    }
    function doChangePassword() {
      api("put", "/api/administrator/" + props.administrator.administratorId, {
        password: newPassword,
      }).then((res) => {
        if (res.status === "error") {
          return setErrorMessage(
            res.data.message ||
              "Password must be at least 8 character long with one Capital letter, number and special char!"
          );
        }
        setAdministrators(res.data);
      });
    }
    function doEditUsernameAndEmail() {
      api("put", "/api/administrator/" + props.administrator.administratorId, {
        username: newUsername,
        email: newEmail,
      })
        .then((res) => {
          if (res.status === "error") {
            return setErrorMessage(
              res.data.message || "Username or email already exists!"
            );
          } else {
            setAdministrators(res.data);
            setErrorMessage("");
          }
          refreshList();
        })
        .catch((error) => {
          setErrorMessage(error.message || "Failed to load administrators.");
        });
    }
    function changePassword(e: React.ChangeEvent<HTMLInputElement>) {
      setNewPassword(e.target.value);
    }
    return (
      <tr>
        <td>{props.administrator.username}</td>
        <td>{props.administrator.email}</td>
        <td>
          {!editNamePartsVisible && (
            <div className="input-group">
              <button
                className="btn btn-dark btn=sm"
                onClick={() => setEditNamePartsVisible(true)}
              >
                Edit
              </button>
            </div>
          )}
          {editNamePartsVisible && (
            <div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              {(newUsername !== props.administrator.username ||
                newEmail !== props.administrator.email) && (
                <button
                  className="btn btn-sm btn-dark"
                  onClick={() => doEditUsernameAndEmail()}
                >
                  Save
                </button>
              )}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setNewUsername(props.administrator.username);
                  setNewEmail(props.administrator.email);
                  setEditNamePartsVisible(false);
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
        <td>
          <div
            className="btn-group"
            onClick={() => {
              doToggleAdministratorActiveState();
            }}
          >
            <div className={"btn btn-sm " + activeSideClass}>
              <FontAwesomeIcon icon={faSquareCheck} />
            </div>
            <div className={"btn btn-sm " + inactiveSideClass}>
              <FontAwesomeIcon icon={faSquare} />
            </div>
          </div>
        </td>
        <td>
          {!editPasswordVisible && (
            <button
              className="btn btn-dark btn-sm"
              onClick={() => {
                setEditPasswordVisible(true);
              }}
            >
              Change password
            </button>
          )}
          {editPasswordVisible && (
            <div className="input-group">
              <input
                type="password"
                className="form-control form-control-sm"
                value={newPassword}
                onChange={(e) => changePassword(e)}
              />
              <button
                className="btn btn-success btn-sm"
                onClick={() => doChangePassword()}
              >
                Save
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  setEditPasswordVisible(false);
                  setNewPassword("");
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  }

  return (
    <div>
      <Link className="btn btn-dark btn-sm" to="/admin/dashboard">
        &laquo; Back to AdminDashboard
      </Link>
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-sm table-hover admin-list">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Edit</th>
              <th>Status</th>
              <th>Change password</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <AdminAdministratorRow
                key={"administrator" + admin.administratorId}
                administrator={admin}
                onAdministratorUpdated={loadAdministrators}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default React.memo(AdminAdministratorList);


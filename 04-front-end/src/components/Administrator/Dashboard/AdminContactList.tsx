import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../../api/api";
import IContact from "../../../models/IContact.model";
import { Button, Modal } from "react-bootstrap";
import moment from "moment";
import "./AdminContactList.sass";
import { Link } from "react-router-dom";

interface IAdminContactListRowProperties {
  contact: IContact;
}

interface DeleteWarningProps {
  show: boolean;
  handleClose: () => void;
  handleDelete: (mid: number) => void;
  contact: IContact;
}

export default function AdminContactList() {
  const [contact, setContactData] = useState<IContact[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  function AdminContactListRow(props: IAdminContactListRowProperties) {
    const [firstName] = useState<string>(props.contact.firstName);
    const [lastName] = useState<string>(props.contact.lastName);
    const [title] = useState<string>(props.contact.title);
    const [message] = useState<string>(props.contact.message);
    const [email] = useState<string>(props.contact.email);
    const [sentAt] = useState<string>(props.contact.createdAt);

    function formatDateTime(dateString: moment.MomentInput) {
      return moment(dateString).format("DD.MM.YYYY HH:mm:ss");
    }

    const dateTime = formatDateTime(sentAt);

    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const handleClose = () => setShowDeleteWarning(false);

    const handleDelete = () => {
      api("delete", `/api/message/${props.contact.messageId}`)
        .then((res) => {
          if (res.status !== "ok") {
            return setErrorMessage("Could not delete this message!");
          }
          loadMessages();
        })
        .catch((err) => {
          setErrorMessage("An error occurred: " + err.message);
        });

      setShowDeleteWarning(false);
    };

    return (
      <tr>
        <td>{firstName}</td>
        <td>{lastName}</td>
        <td>{title}</td>
        <td>{email}</td>
        <td className="message-column">{message}</td>
        <td>{dateTime}</td>

        <td className="delete-column">
          <button
            className="btn btn-danger btn-sm"
            onClick={() => setShowDeleteWarning(true)}
          >
            Delete
          </button>
          <DeleteWarning
            show={showDeleteWarning}
            handleClose={handleClose}
            handleDelete={handleDelete}
            contact={props.contact}
          />
        </td>
      </tr>
    );
  }


  const loadMessages = useCallback(() => {
    api("get", "/api/message")
      .then(res => {
        if (res.status !== 'ok') {
          setErrorMessage(res.data + "");
        } else {
          setContactData(res.data);
        }
      })
      .catch(error => {
        setErrorMessage("An error occurred: " + errorMessage);
      });
  }, [errorMessage]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);


  return (
    <div>
      <Link className="btn btn-dark btn-sm" to="/admin/dashboard">
        &laquo; Back to AdminDashboard
      </Link>
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Surname</th>
            <th>Title</th>
            <th>email</th>
            <th>Message</th>
            <th>Sent at</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {contact?.map((contact) => (
            <AdminContactListRow
              key={"contact" + contact.messageId}
              contact={contact}
            />
          ))}
        </tbody>
      </table>
    </div>
  );


}

const DeleteWarning: React.FC<DeleteWarningProps> = ({
  show,
  handleClose,
  handleDelete,
  contact,
}) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Warning</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete {contact.title}?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDelete(contact.messageId)}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

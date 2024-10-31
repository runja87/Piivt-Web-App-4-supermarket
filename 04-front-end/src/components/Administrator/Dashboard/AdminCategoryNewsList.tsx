import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ICategory from "../../../models/ICategory.model";
import { api, apiForm } from "../../../api/api";
import { Button, Modal } from "react-bootstrap";
import AdminAddNewNews from "./AdminAddNewNews";
import INews from "../../../models/INews.model";
import IConfig from "../../../common/IConfig.interface";
import DevConfig from "../../../configs";

export interface IAdminCategoryNewsListUrlParams
  extends Record<string, string | undefined> {
  cid: string;
}

interface IAdminNewsListRowProperties {
  news: INews;
  category: ICategory;
}

interface DeleteWarningProps {
  show: boolean;
  handleClose: () => void;
  handleDelete: (cid: number, nid: number) => void;
  news: INews;
  category: ICategory;
}

export default function AdminCategoryNewsList() {
  const params = useParams<IAdminCategoryNewsListUrlParams>();
  const [category, setCategoryData] = useState<ICategory>();
  const categoryId = params.cid;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const config: IConfig = DevConfig;

  useEffect(() => {
    loadNews(+(categoryId ?? 0));
  }, [categoryId]);

  function loadNews(categoryId: number) {
    if (!categoryId) {
      return;
    }

    api("get", "/api/category/" + categoryId).then((res) => {
      if (res.status !== "ok") {
        return setErrorMessage(res.data + "");
      }
      setCategoryData(res.data);
    });
  }

  const [showAddProduct, setShowAddNews] = useState(false);
  const handleShowAddNews = () => {
    setShowAddNews(true);
  };

  const handleCloseAddNews = () => {
    setShowAddNews(false);
  };

  function AdminNewsListRow(props: IAdminNewsListRowProperties) {
    const params = useParams<IAdminCategoryNewsListUrlParams>();
    const [title, setTitle] = useState<string>(props.news.title);
    const [content, setContent] = useState<string>(props.news.content);
    const [altText, setAlt] = useState<string | undefined>(props.news?.altText);
    const [file, setFile] = useState<File | undefined>();
    const [, setErrorMessage] = useState<string>("");

    const navigate = useNavigate();

    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const handleClose = () => setShowDeleteWarning(false);
    const hasChanges =
      props.news.title !== title ||
      props.news.content !== content ||
      props.news.altText !== altText ||
      file !== undefined;

    const DeleteWarning: React.FC<DeleteWarningProps> = ({
      show,
      handleClose,
      handleDelete,
      news,
      category,
    }) => {
      return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete {news.title}?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(category.categoryId, news.newsId)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

    const titleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    };
    const contentChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    };
    const altChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAlt(e.target.value);
    };

    const payload = {
      title,
      content,
      altText,
    };

    const doEditNews = (e: any) => {
      api(
        "put",
        "/api/category/" +
          props.category.categoryId +
          "/news/" +
          props.news.newsId,
        payload
      )
        .then((res) => {
          if (res.status !== "ok") {
            throw new Error("Could not edit this news!");
          }
          return res.data;
        })
        .then((news) => {
          if (!news?.newsId) {
            throw new Error("Could not fetch new news data!");
          }
          return news;
        })
        .then((news) => {
          if (!file) {
            loadNews(props.category.categoryId);
            throw new Error("No news photo selected!");
          }
          return { news, file };
        })
        .then(({ file, news }) => {
          const data = new FormData();
          data.append("photo", file);
          return apiForm(
            "put",
            "/api/category/" +
              props.category.categoryId +
              "/news/" +
              news.newsId +
              "/photo/" + props.news.photos[0]?.photoId,
            data
          ).then((res) => {
            if (res.status !== "ok") {
              throw new Error(
                "Could not upload news photo! Reason: " +
                  res?.data
                    ?.map(
                      (error: any) => error?.instancePath + " " + error?.message
                    )
                    .join(", ")
              );
            }
            return res.data;
          });
        })
        .then(() => {
          navigate(
            "/admin/dashboard/category/" +
              props.category.categoryId +
              "/news/list",
            { replace: true }
          );
          loadNews(+(params.cid ?? 0));
          handleClose();
        })
        .catch((error) => {
          setErrorMessage(error?.message ?? "Unknown error!");
        });
    
    };

    const handleDelete = (cid: number) => {
      if (params.cid) {
        api("delete", `/api/category/${cid}/news/${props.news.newsId}`)
          .then((res) => {
            if (res.status !== "ok") {
              return setErrorMessage("Could not delete this news!");
            }else {
              loadNews(+(params.cid ?? 0));
            }
           
          })
          .catch((error) => {
            setErrorMessage(error?.message ?? "Unknown error!");
          });
      }
    };

    return (
      <tr>
        <td>
          {props.news.photos.length > 0 ? (
            <img
              alt={props.news.photos[0]?.altText}
              src={
               `${config.domain.name}:${config.domain.port}/assets/${
                props.news.photos[0].filePath.replace(
                  props.news.photos[0].name,
                  "small-" + props.news.photos[0].name
                )}`
              }
            />
          ) : (
            <p>No image</p>
          )}
        </td>
        <td>
          <div className="input-group align">
            <input
              className="form-control form-control-sm "
              type="text"
              onChange={(e) => titleChanged(e)}
              value={title !== null ? title : ""}
            />
          </div>
        </td>
        <td>
          <div className="input-group align">
            <input
              className="form-control form-control-sm "
              type="text"
              onChange={(e) => altChanged(e)}
              value={altText !== null ? altText : ""}
            />
          </div>
        </td>
        <td>
          <div className="input-group align">
            <textarea
              className="form-control form-control-sm "
              onChange={(e) => contentChanged(e)}
              value={content !== null ? content : ""}
            />
          </div>
        </td>

        <td>
          <div className="form-group mb-3">
            <div className="input-group">
              <input
                type="file"
                accept=".jpg,.png"
                className="form-control form-control-sm"
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        </td>

        <td>
          {hasChanges ? (
            <Button
              className="btn btn-dark btn-sm"
              onClick={(e) => doEditNews(e)}
            >
              Save
            </Button>
          ) : (
            ""
          )}
        </td>

        <td>
          <div>
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
              news={props.news}
              category={props.news.category}
            />
          </div>
        </td>
      </tr>
    );
  }

  function renderNewsTable(category: ICategory) {
    return (
      <div>
        <Link
          className="btn btn-dark btn-sm"
          to="/admin/dashboard/category/list"
        >
          &laquo; Back to categories 
        </Link>
        <div>
          <button
            className="btn btn-primary btn-sm me-10"
            onClick={handleShowAddNews}
          >
            Add New News
          </button>

          {showAddProduct && (
            <AdminAddNewNews
              category={category}
              news={category.news}
              show={showAddProduct}
              handleClose={handleCloseAddNews}
              loadNews={loadNews}
            />
          )}
        </div>

        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Title</th>
              <th>Alt</th>
              <th>Content</th>
              <th>Upload new photo</th>
              <th>Save</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {category.news?.map((news) => (
              <AdminNewsListRow
                key={"news" + news.newsId}
                news={news}
                category={category}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div>
      {errorMessage && <p className="alert-danger mb-3">{errorMessage}</p>}
      {category && renderNewsTable(category)}
    </div>
  );
}

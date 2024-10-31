import React, { useEffect, useState } from "react";
import { api } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import { Button, Modal } from "react-bootstrap";
import AdminAddNewCategory from "./AdminAddNewCategory";
import { Link } from "react-router-dom";
import "./AdminCategoryList.sass";

interface RecursiveCategoryParams {
  category: ICategory;
  level: number;
}

interface DeleteWarningProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  category: ICategory;
}

export default function AdminCategoryList() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<ICategory | null>(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const handleConfirm = () => {
    if (selectedCategoryToDelete && selectedCategoryToDelete.threeLevelStructure.length === 0) {
      api("delete", `/api/category/${selectedCategoryToDelete.categoryId}`).then((res) => {
        if (res.status !== "ok") {
          return setErrorMessage("Could not delete this category!");
        }
        loadCategories();
        
        setShowDeleteWarning(false);
        setSelectedCategoryToDelete(null);
      });
    }
  };
  

  const RecursiveCategoryTable: React.FC<RecursiveCategoryParams> = ({ category, level }) => {
    const [name, setName] = useState<string>(category.name);
    const [categoryType, setCategoryType] = useState<string>(category.categoryType);
    const [isExpanded, setIsExpanded] = useState(false); 
    const [showAddCategory, setShowAddCategory] = useState(false);

    const hasChanges = category.name !== name || category.categoryType !== categoryType;

    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };

    const handleShowAddCategory = () => {
      setShowAddCategory(true);
    };

    const handleCloseAddCategory = () => {
      setShowAddCategory(false);
    };

    const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    };
    const categoryTypeChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCategoryType(e.target.value);
    };

    const payload = { name, categoryType };

    const doEditCategory = (e: any) => {
      api("put", "/api/category/" + category.categoryId, payload).then((res) => {
        if (res.status !== "ok") {
          return setErrorMessage("Could not edit this category!");
        }
        loadCategories();
      });
    };

    return (
      <>
        <tr>
          <td style={{ paddingLeft: `${level * 20}px` }}>
            {category.threeLevelStructure?.length > 0 && (
              <button onClick={toggleExpand} className="btn btn-link btn-sm">
                {isExpanded ? "−" : "+"}
              </button>
            )}
            <input
              className="form-control form-control-sm d-inline-block"
              style={{ width: "auto" }}
              type="text"
              onChange={(e) => nameChanged(e)}
              value={name}
            />
          </td>
          <td>
          {(category.parentCategoryId !== 1) && (
            <select value={categoryType} onChange={categoryTypeChanged} className="form-control form-control-sm">
              <option value="product">product</option>
              <option value="news">news</option>
              <option value="root">root</option>
            </select>
               )}
          </td>
       
          <td>
  {(category.parentCategoryId !== 1 && category.threeLevelStructure?.length === 0) && (
    <Link
      className="btn btn-dark btn-sm"
      to={`/admin/dashboard/category/${category.categoryId}/${category.categoryType === "news" ? "news" : "product"}/list`}
    >
      List sub-category
    </Link>
  )}
</td>

          <td>
          {(category.parentCategoryId === 1 || category.threeLevelStructure?.length !== 0 || category.products === null || category.news === null) && (
            <button onClick={handleShowAddCategory}>Add New Category</button>
          )}
            {showAddCategory && (
              <AdminAddNewCategory
                category={category}
                show={showAddCategory}
                handleClose={handleCloseAddCategory}
                loadCategories={handleShowAddCategory}
              />
            )}
          </td>
          <td>
  {category.threeLevelStructure?.length === 0 && (
    <>
      <button
        className="btn btn-danger btn-sm"
        onClick={() => {
          setShowDeleteWarning(true);
          setSelectedCategoryToDelete(category);
        }}
      >
        Delete Item
      </button>

      {selectedCategoryToDelete && (
        <DeleteWarning
          show={showDeleteWarning}
          handleClose={() => {
            setShowDeleteWarning(false);
            setSelectedCategoryToDelete(null);
          }}
          handleConfirm={handleConfirm}
          category={selectedCategoryToDelete}
        />
      )}
    </>
  )}
</td>

          <td>
            {hasChanges && (
              <Button className="btn btn-dark btn-sm" onClick={(e) => doEditCategory(e)}>
                Save
              </Button>
            )}
          </td>
        </tr>

        {isExpanded && category.threeLevelStructure?.length > 0 && (
          <>
            {category.threeLevelStructure.map((subCategory) => (
              <RecursiveCategoryTable key={subCategory.categoryId} category={subCategory} level={level + 1} />
            ))}
          </>
        )}
      </>
    );
  };

  const DeleteWarning: React.FC<DeleteWarningProps> = ({ show, handleClose, handleConfirm, category }) => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete {category.name}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const loadCategories = () => {
    api("get", "/api/category")
      .then((apiResponce) => {
        if (apiResponce.status === "ok") {
          return setCategories(apiResponce.data);
        }
        throw new Error("Unknown error while loading categories...");
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error while loading categories...");
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      <Link className="btn btn-dark btn-sm" to="/admin/dashboard">
        &laquo; Back to AdminDashboard
      </Link>
      {errorMessage && <p>Error: {errorMessage}</p>}
      {!errorMessage && (
        <table className="table table-striped table-hover table-sm">
          <thead>
            <tr>
              <th>Edit category name</th>
              <th>Edit type</th>
              <th>List sub-category</th>
              <th>Add new category</th>
              <th>Delete</th>
              <th>Save</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <RecursiveCategoryTable key={category.categoryId} category={category} level={0} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

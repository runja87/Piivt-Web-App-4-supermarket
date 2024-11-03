import React, { useState } from "react";
import { api } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import { Button, Modal } from "react-bootstrap";

interface IAddCategoryProps {
  category: ICategory;
  show: boolean;
  handleClose: () => void;
  loadCategories: () => void;
}
interface ICategoryFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  categoryType: string;
  setCategoryType: React.Dispatch<React.SetStateAction<any>>;
  parentCategoryId: number;
  setParentCategoryId: React.Dispatch<React.SetStateAction<number>>;
}

const AddNewCategory: React.FC<IAddCategoryProps> = ({
  show,
  category,
  handleClose,
  loadCategories,
}) => {
  const [name, setName] = useState<string>("");
  const [categoryType, setCategoryType] = useState<any>(category.categoryType);
  const [errorMessage,setErrorMessage ] = useState<any>();
  var   [parentCategoryId, setParentCategoryId] = useState<number>(category.categoryId);
  
  if(categoryType === "root"){
    parentCategoryId = 1;
  }  

  const doAddCategory = () => {
    api("post", "/api/category", {name, categoryType, parentCategoryId})
    .then(
      (res) => {
        if (res.status !== "ok") {
          throw new Error("Could not add the category");
        }
        loadCategories();
        handleClose();
      }
      
    )
      .catch(error => {
        setErrorMessage(error?.message ?? "Unknown error!");
      })
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Subcategory to {category.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CategoryForm
          name={name}
          setName={setName}
          categoryType={categoryType}
          setCategoryType={setCategoryType}
          parentCategoryId={parentCategoryId}
          setParentCategoryId={setParentCategoryId}
        />
         {errorMessage}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {name.trim().length >= 4 && name.trim().length <= 64 ? (
          <Button variant="primary" onClick={doAddCategory}>
          Save
          </Button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
};

const CategoryForm: React.FC<ICategoryFormProps> = ({
  name,
  setName,
  categoryType,
  setCategoryType,
  parentCategoryId,
  setParentCategoryId,
}) => (
  <>
    <div className="form-group col-lg-7 col-md-6">
      <label>Name:</label>
      <input
        type="text"
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className="form-group col-lg-3 col-md-6">
      <label>Type:</label>
      <select
        className="form-control"
        value={categoryType}
        onChange={(e) => setCategoryType(e.target.value)}
        onChangeCapture={() => setParentCategoryId(parentCategoryId)}
      >
        <option value="root">root</option>
        <option value="product">product</option>
        <option value="news">news</option>
      </select>
    </div>
  </>
);

export default AddNewCategory;

import React, { useState } from "react";
import { api, apiForm } from "../../../api/api";
import ICategory from "../../../models/ICategory.model";
import { Button, Modal } from "react-bootstrap";
import IProduct from "../../../models/IProduct.model";
import { useNavigate } from "react-router-dom";


interface IAddProductProps {
  category: ICategory;
  product?: IProduct[];
  show: boolean;
  handleClose: () => void;
  loadProducts: (categoryId: number) => void;
}
interface IProductFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  altText: string;
  setAlt: React.Dispatch<React.SetStateAction<string>>;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  supply: number;
  setSupply: React.Dispatch<React.SetStateAction<number>>;
  sku: number;
  setSku: React.Dispatch<React.SetStateAction<number>>;
  file: File | undefined;
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
}

const AddNewProduct: React.FC<IAddProductProps> = ({
  show,
  category,
  handleClose,
  loadProducts,
}) => {
  const [, setErrorMessage ] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [altText, setAlt] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [supply, setSupply] = useState<number>(0);
  const [sku, setSku] = useState<number>(0);
  const [file, setFile] = useState<File>();
  const navigate = useNavigate();

  const payload = {
    name,
    description,
    price,
    supply,
    sku,
    altText: altText || "#enteralt"
};

console.log(payload);
  const doAddProduct = () => {
    api("post", "/api/category/" + category.categoryId + "/product",payload)
    .then(res => {
        if (res.status !== "ok") {
          throw new Error("Could not add this product!");
        }
        return res.data;
      })
      .then(product =>{
        if(!product?.productId){
          throw new Error("Could not fetch new product data!");
        }
        return product;
      })
      .then(product => {
        if(!file){
          throw new Error("No product photo selected!");
        }
        return {
          file,
          product
        };

      })
      .then(({file, product}) => {
        const data = new FormData();
        data.append("photo", file)
       return apiForm("post", "/api/category/"+ category.categoryId + "/product/" + product?.productId + "/photo", data)
       .then(res => {
        if (res.status !== "ok") {
          throw new Error("Could not upload photo! Reason: " + res?.data?.map((error: any) => error?.instancePath + " " + error?.message).join(", "));
        }
        return res.data;
       })
      })
      .then(() => {
        navigate("/admin/dashboard/category/" + category.categoryId + "/product/list", {replace: true,});
        loadProducts(category.categoryId);
        handleClose();
      })
      .catch(error => {
        setErrorMessage(error?.message ?? "Unknown error!");
      })


  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Product to {category.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <CategoryForm
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}    
          altText={altText}
          setAlt={setAlt}
          price={price}
          setPrice= {setPrice}
          supply={supply}
          setSupply={setSupply}
          sku={sku}
          setSku={setSku}
          file={file}
          setFile={setFile}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {name.trim().length >= 4 && name.trim().length <= 64 ? (
          <Button variant="primary" onClick={doAddProduct}>
            Save
          </Button>
        ) : (
          ""
        )}
      </Modal.Footer>
    </Modal>
  );
};

const CategoryForm: React.FC<IProductFormProps> = ({
  name,
  setName,
  description,
  setDescription,
  altText,
  setAlt,
  price,
  setPrice,
  supply,
  setSupply,
  sku,
  setSku,
  setFile,
}) => (
  <>
    <div className="form-group col-md-6">
      <label>Name:</label>
      <input
        type="text"
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className="form-group">
      <label>Description:</label>
      <textarea
        className="form-control"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
    <div className="form-group">
      <label>Alt:</label>
      <input
        type="text"
        className="form-control"
        value={altText}
        onChange={(e) => setAlt(e.target.value)}
      />
    </div>
    <div className="form-group col-md-3">
      <label>Price:</label>
      <input
        type="number"
        min="0.00"
        step="0.01"
        onInput={(e) => e.preventDefault()}
        className="form-control"
        value={price}
        onChange={(e) => setPrice(+e.target.value)}
      />
    </div>
    <div className="form-group col-md-4">
      <label>Sku:</label>
      <input
        type="number"
        className="form-control"
        value={sku}
        onChange={(e) => setSku(+e.target.value)}
      />
    </div>
    <div className="form-group col-md-3">
      <label>Supply:</label>
      <input
        type="number"
        className="form-control"
        value={supply}
        onChange={(e) => setSupply(+e.target.value)}
      />
    </div>
    <div className="form-group mb-3">
      <label>Upload product images</label>
      <div className="input-group">
      <input type="file" accept=".jpg,.png" className="form-control form-control-sm" onChange = { e => { if (e.target.files) {setFile(e.target.files[0])}}}/>
      </div>
    </div>
  </>
);
export default AddNewProduct;



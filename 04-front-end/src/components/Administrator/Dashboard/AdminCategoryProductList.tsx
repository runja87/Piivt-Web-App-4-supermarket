import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ICategory from "../../../models/ICategory.model";
import { api, apiForm } from "../../../api/api";
import IProduct from "../../../models/IProduct.model";
import { Button, Modal } from "react-bootstrap";
import AdminAddNewProduct from "./AdminAddNewProduct";
import IConfig from "../../../common/IConfig.interface";
import DevConfig from "../../../configs";

export interface IAdminCategoryProductListUrlParams
  extends Record<string, string | undefined> {
  cid: string;
}

interface IAdminProductListRowProperties {
  product: IProduct;
  category: ICategory;
}
interface DeleteWarningProps {
  show: boolean;
  handleClose: () => void;
  handleDelete: (cid: number, pid: number) => void;
  product: IProduct;
  category: ICategory;
}

export default function AdminCategoryProductList() {
  const params = useParams<IAdminCategoryProductListUrlParams>();
  const [category, setCategoryData] = useState<ICategory>();
  const categoryId = params.cid;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const config: IConfig = DevConfig;

  useEffect(() => {
    loadProduct(+(categoryId ?? 0));
  }, [categoryId]);

  function loadProduct(categoryId: number) {
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

  function AdminProductListRow(props: IAdminProductListRowProperties) {
    const [name, setName] = useState<string>(props.product.name);
    const [description, setDescription] = useState<string>(
      props.product.description
    );
    const [price, setPrice] = useState<number>(props.product.price);
    const [sku, setSku] = useState<number>(props.product.sku);
    const [supply, setSupply] = useState<number>(props.product.supply);
    const [altText, setAlt] = useState<string | undefined>(props.product.altText);
    const [discount, setDiscount] = useState<string>(props.product.discount);
    const [file, setFile] = useState<File | undefined>();
    const [isOnDiscount, setDiscountOnOf] = useState<number>(
      +props.product.isOnDiscount
    );
    const navigate = useNavigate();
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const handleClose = () => setShowDeleteWarning(false);
    const hasChanges =
      props.product.description !== description ||
      props.product.name !== name ||
      props.product.price !== price ||
      props.product.sku !== sku ||
      props.product.supply !== supply ||
      props.product.altText !== altText ||
      props.product.discount !== discount ||
     +props.product.isOnDiscount !== isOnDiscount || file !== undefined;
      ;

    const nameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    };
    const descriptionChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value);
    };
    const altChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAlt(e.target.value);
    };
    const priceChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPrice(+e.target.value);
    };
    const skuChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSku(+e.target.value);
    };
    const supplyChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSupply(+e.target.value);
    };
    const discountChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDiscount(e.target.value);
    };
    const setDiscountOnOfChanged = (
      e: React.ChangeEvent<HTMLSelectElement>
    ) => {
      setDiscountOnOf(+e.target.value);
    };

    const payload = {
      name,
      description,
      price,
      supply,
      sku,
      altText,
      discount,
      isOnDiscount,
    };


    const doEditProduct = (e: any) => {
      api(
        "put",
        "/api/category/" +
          props.category.categoryId +
          "/product/" +
          props.product.productId,
        payload
      ).then((res) => {
        if (res.status !== "ok") {
          return setErrorMessage("Could not edit this product");
        }
        return res.data;
        
      })

      .then((product) => {
        if (!product?.productId) {
          throw new Error("Could not fetch new product data!");
        }
        return product;
      })
      .then((product) => {
        if (!file) {
         loadProduct(+(params.cid ?? 0));
          throw new Error("No product photo selected!");
        }
        return { product, file };
      })
      .then(({ file, product }) => {
        const data = new FormData();
        data.append("photo", file);
        return apiForm(
          "put",
          "/api/category/" +
            props.category.categoryId +
            "/product/" +
                product.productId +
            "/photo/" + props.product.photos[0].photoId,
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
            "/product/list",
          { replace: true }
        );
        loadProduct(props.category.categoryId);
        handleClose();
      })
      .catch((error) => {
        setErrorMessage(error?.message ?? "Unknown error!");
      });
    
  };
    const handleDelete = (cid: number) => {
      if (params.cid) {
        api(
          "delete",
          `/api/category/${cid}/product/${props.product.productId}`
        ).then((res) => {
          if (res.status !== "ok") {
            return setErrorMessage("Could not delete this product!");
          }
          loadProduct(+(params.cid ?? 0));
        });
        console.log("Item deleted");
        setShowDeleteWarning(false);
      }
    };

    return (
      <tr>
        <td>
          {props.product.photos.length > 0 ? (
            <img
              alt={props.product.photos[0]?.altText}
              src={
               `${config.domain.name}:${config.domain.port}/assets/${
                props.product.photos[0].filePath.replace(
                  props.product.photos[0].name,
                  "small-" + props.product.photos[0].name
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
              onChange={(e) => nameChanged(e)}
              value={name !== null ? name : ""}
            />
          </div>
        </td>
        <td>
          <div className="input-group align">
            <textarea
              className="form-control form-control-sm "
              onChange={(e) => descriptionChanged(e)}
              value={description !== null ? description : ""}
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
          <div className="col-lg-9 col-md-9">
            <input
              className="form-control form-control-sm "
              type="number"
              onChange={(e) => priceChanged(e)}
              value={price !== null ? price : 0}
              min="0.00"
              step="0.01"
              onInput={(e) => e.preventDefault()}
            />
          </div>
        </td>
        <td>
          <div className="col-lg-11 col-md-9">
            <input
              className="form-control form-control-sm "
              type="number"
              onChange={(e) => skuChanged(e)}
              value={sku !== null ? sku : 0}
            />
          </div>
        </td>

        <td>
          <div className="col-lg-8 col-md-8">
            <input
              className="form-control form-control-sm "
              type="number"
              onChange={(e) => supplyChanged(e)}
              value={supply !== null ? supply : 0}
            />
          </div>
        </td>
        <td>
          <select
            value={isOnDiscount !== null ? isOnDiscount : ""}
            onChange={setDiscountOnOfChanged}
            className="form-control form-control-sm"
          >
            <option value="0">Off</option>
            <option value="1">On</option>
          </select>
        </td>
        <td>
          <select
            value={discount !== null ? discount : ""}
            onChange={discountChanged}
            className="form-control form-control-sm"
          >
            <option value="0.1">10%</option>
            <option value="0.2">20%</option>
            <option value="0.3">30%</option>
            <option value="0.4">40%</option>
            <option value="0.5">50%</option>
            <option value="0.6">60%</option>
            <option value="0.7">70%</option>
            <option value="0.8">80%</option>
            <option value="0.9">90%</option>
          </select>
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
              onClick={(e) => doEditProduct(e)}
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
              product={props.product}
              category={props.product.category}
            />
          </div>
        </td>
      </tr>
    );
  }

  const DeleteWarning: React.FC<DeleteWarningProps> = ({
    show,
    handleClose,
    handleDelete,
    product,
    category,
  }) => {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete {product.name}?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(category.categoryId, product.productId)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const [showAddProduct, setShowAddProduct] = useState(false);
  const handleShowAddProduct = () => {
    setShowAddProduct(true);
  };

  const handleCloseAddProduct = () => {
    setShowAddProduct(false);
  };

  function renderProductTable(category: ICategory) {
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
            onClick={handleShowAddProduct}
          >
            Add New Product
          </button>

          {showAddProduct && (
            <AdminAddNewProduct
              category={category}
              product={category.products}
              show={showAddProduct}
              handleClose={handleCloseAddProduct}
              loadProducts={loadProduct}
            />
          )}
        </div>

        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Description</th>
              <th>Alt</th>
              <th>Price</th>
              <th>SKU</th>
              <th>Supply</th>
              <th>Activate</th>
              <th>discount</th>
              <th>Edit photo</th>
              <th>Save</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {category.products?.map((product) => (
              <AdminProductListRow
                key={"product" + product.productId}
                product={product}
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
      {category && renderProductTable(category)}
    </div>
  );
}

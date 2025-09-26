import React, { useState, useEffect } from "react";
import { api } from "../../../api/api";
import IProduct from "../../../models/IProduct.model";
import ICategory from "../../../models/ICategory.model";
import "./UserHomePageList.sass";
import DevConfig from "../../../configs";
import IConfig from "../../../common/IConfig.interface";

const UserHomePageList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [productCategories, setCategories] = useState<ICategory[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const config: IConfig = DevConfig;

  useEffect(() => {
    api("get", "/api/category")
      .then((response) => {
        if (response.status === "ok") {
          const productCategories = response.data.filter(
            (cat: ICategory) => cat.categoryType === "product"
          );
          const flattenCategories = (categories: ICategory[]): ICategory[] => {
            let flatCategories: ICategory[] = [];
            categories.forEach((category) => {
              if (category.threeLevelStructure.length === 0) {
                flatCategories.push(category);
              }
              if (
                category.threeLevelStructure &&
                category.threeLevelStructure.length > 0
              ) {
                flatCategories = [
                  ...flatCategories,
                  ...flattenCategories(category.threeLevelStructure),
                ];
              }
            });
            return flatCategories;
          };
          const allCategories = flattenCategories(productCategories);
          setCategories(allCategories);
        } else {
          setErrorMessage("Error fetching categories");
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response && error.response.status
            ? `Error: ${error.response.status}`
            : "An unexpected error occurred. Please check your network connection.";
        setErrorMessage(errorMessage);
      });
  }, []);

  const handleSearch = () => {
    setProducts([]);
    setRelatedProducts([]);
    setErrorMessage(null);
    setSelectedProduct(null);

    const queryParams = new URLSearchParams({
      search: searchTerm,
      category,
      minPrice: minPrice?.toString() ?? "",
      maxPrice: maxPrice?.toString() ?? "",
    }).toString();

    api("get", `/api/category/product/search?${queryParams}`)
      .then((response) => {
        if (response.status === "ok" && response.data) {
          let products = response.data.products || [];
          let relatedProducts = response.data.relatedProducts || [];
          if (products.length > 0) {
            const productIds = new Set(
              products.map(
                (product: { productId: IProduct }) => product.productId
              )
            );
            relatedProducts = relatedProducts.filter(
              (relatedProduct: { productId: IProduct }) =>
                !productIds.has(relatedProduct.productId)
            );

            setProducts(products);
            setRelatedProducts(relatedProducts);
          } else {
            setErrorMessage("No products found");
          }
        } else {
          setErrorMessage("Error fetching products");
        }
      })
      .catch((error) => {
        const errorMessage =
          error.response && error.response.status
            ? `Error: ${error.response.status}`
            : "An unexpected error occurred. Please check your network connection.";
        setErrorMessage(errorMessage);
      });
  };
  const handleViewMore = (product: IProduct) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="user-home-page">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Product Category</option>
          {productCategories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice ?? ""}
          onChange={(e) =>
            setMinPrice(
              e.target.value && Number(e.target.value) >= 0
                ? Number(e.target.value)
                : null
            )
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice ?? ""}
          onChange={(e) =>
            setMaxPrice(
              e.target.value && Number(e.target.value) >= 0
                ? Number(e.target.value)
                : null
            )
          }
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="content">
        <h1>Product Search</h1>
        {selectedProduct ? (
          <div className="product-details">
            <div className="title-back">
              <h2>Product Detals</h2>
              <button onClick={handleBack}>&lt; Back to Results</button>
            </div>
            {selectedProduct.photos && selectedProduct.photos.length > 0 ? (
              <img
                alt={
                  selectedProduct.altText ||
                  selectedProduct.photos[0]?.altText ||
                  "No description available"
                }
                src={`${config.domain.name}:${
                  config.domain.port
                }/assets/${selectedProduct.photos[0].filePath.replace(
                  selectedProduct.photos[0].name,
                  "medium-" + selectedProduct.photos[0].name
                )}`}
                className="product-image"
              />
            ) : (
              <div className="no-image-placeholder">
                <p>No image available</p>
              </div>
            )}
            <h3>{selectedProduct.name}</h3>
            <p className="description">
              {" "}
              Description: {selectedProduct.description}
            </p>
            <p>Regular price: {selectedProduct.price}$</p>
            {selectedProduct.isOnDiscount && (
              <p>
                Discounted Price:{" "}
                {(
                  selectedProduct.price -
                  selectedProduct.price * +selectedProduct.discount
                ).toFixed(2)}
                $ Discount applied: - {100 * +selectedProduct.discount} %
              </p>
            )}
            <p> </p>
            <p>Sku no: {selectedProduct.sku}</p>
            <p>Supply: {selectedProduct.supply}</p>
            <p className="metadata">
              Metadata: {selectedProduct.altText || "No metadata available"}
            </p>
            <h3>Related Products</h3>
            <div className="related-products">
              {relatedProducts && relatedProducts.length > 0 ? (
                relatedProducts.map((productRelated) => (
                  <div key={productRelated.productId} className="product-item">
                    {productRelated.photos &&
                    productRelated.photos.length > 0 ? (
                      <img
                        alt={
                          productRelated.altText ||
                          productRelated.photos[0]?.altText ||
                          "No description available"
                        }
                        src={
                          `${config.domain.name}:${config.domain.port}/assets/` +
                          productRelated.photos[0].filePath.replace(
                            productRelated.photos[0].name,
                            "small-" + productRelated.photos[0].name
                          )
                        }
                        className="product-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <p>No image available</p>
                      </div>
                    )}
                    <h2>{productRelated.name}</h2>
                    <p>{productRelated.price} Rsd</p>
                    <button onClick={() => handleViewMore(productRelated)}>
                      View more
                    </button>
                  </div>
                ))
              ) : (
                <p>No related products available</p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="search-results">
              {errorMessage && <p>{errorMessage}</p>}
              {products && products.length > 0 ? (
                products.map((productSearch) => (
                  <div key={productSearch.productId} className="product-item">
                    {productSearch.photos && productSearch.photos.length > 0 ? (
                      <img
                        alt={
                          productSearch.altText ||
                          productSearch.photos[0]?.altText ||
                          "No description available"
                        }
                        src={
                          `${config.domain.name}:${config.domain.port}/assets/` +
                          productSearch.photos[0].filePath.replace(
                            productSearch.photos[0].name,
                            "small-" + productSearch.photos[0].name
                          )
                        }
                        className="product-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <p>No image available</p>
                      </div>
                    )}
                    <h2>{productSearch.name}</h2>
                    <p>Regular price: {productSearch.price}$</p>
                    <button onClick={() => handleViewMore(productSearch)}>
                      View more
                    </button>
                  </div>
                ))
              ) : (
                <p>No products found</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserHomePageList;

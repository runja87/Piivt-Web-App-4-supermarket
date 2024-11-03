import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import IProduct from '../../../models/IProduct.model';
import { api } from '../../../api/api';
import './UserProductList.sass'; 
import DevConfig from "../../../configs";
import IConfig from '../../../common/IConfig.interface';

const ProductList = () => {
  const { id } = useParams(); 
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const config: IConfig = DevConfig;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api('get', `/api/category/${id}/product`); 
        if (response.status === 'ok') {
          setProducts(response.data || []);
        } else {
          setErrorMessage('No products found.');
        }
      } catch (error) {
        setErrorMessage('Error fetching products.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  return (
    <div className="ProductList">
      {isLoading ? (
        <p>Loading products...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : products.length > 0 ? (
        <ul>
          {products.map(product => (
            <li key={product.productId} className="product-item">
              {product.photos && product.photos.length > 0 ? (
                <img
                  alt={product.photos[0]?.altText}
                  src={
                    config.domain.name+":"+config.domain.port+"/assets/" +
                    product.photos[0].filePath.replace(
                      product.photos[0].name,
                      "medium-" + product.photos[0].name
                    )
                  }
                  className="product-image" 
                />
              ) : (
                <div className="no-image-placeholder">
                  <p>No image available</p>
                </div>
              )}
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <p>Regular price: ${product.price.toFixed(2)}</p>
              {Boolean(product.isOnDiscount) && (
              <p>Discounted Price: ${ (product.price - product.price * +product.discount).toFixed(2) }</p>)}
              <p>Sku no: {product.sku}</p>
              <p>Supply: {product.supply}</p>
              <p className="metadata">Metadata: {product.altText || "No metadata available"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
}  
export default ProductList;

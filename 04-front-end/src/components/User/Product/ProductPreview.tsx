import IProduct from "../../../models/IProduct.model";

export interface IProductPreviewProperties{
product: IProduct;
}

export default function IProductPreview(props: IProductPreviewProperties){
    return(
        <div>
            <p>Product name: </p>
        <h2>
            { props.product.name }
        </h2>
        <p>Product description: </p>
        <p>
            { props.product.description }
        </p>
        <p>
            { props.product.altText }
        </p>
        <p>Product SKU number: </p>
        <p>
            { props.product.sku }
        </p>
        <p>Product supply: </p>
        <p>
            { props.product.supply }
        </p>
        <p>Price: </p>
        <p>
        if { !props.product.isOnDiscount }{
              props.product.price + "RSD"
            }
            
        </p>
        <p>Discounted price: </p>
        <p>
            if { props.product.isOnDiscount }{
              props.product.price - (props.product.price) + "RSD"
            }
        </p>
       
    </div>


    );
   
}
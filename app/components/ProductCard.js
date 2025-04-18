import styles from "./ProductCard.module.css";

const ProductCard = ({ product, addToCart }) => {


  return (
    <div  className={styles.productCard}>
      <div  className={styles.productCardImageDiv}>
      <img
        src={product.image}
        alt={product.name}
        className={styles.productCardImage}
      /></div>
      <div className={styles.productCardContent}>
      <del className={styles.productCardPriceDel}>${product.price}</del>
        <p className={styles.productCardPrice}>${product.price}</p>
        <h3 className={styles.productCardTitle}>{product.name}</h3>
        <p className={styles.productCardDescription}>{product.description}</p>
        
        <button className={styles.productCardButton} >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

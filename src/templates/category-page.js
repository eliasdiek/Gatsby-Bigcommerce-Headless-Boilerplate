import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import ProductCard from '../components/bigcommerce/ProductCard';

export const CategoryPageTemplate = ({
  image,
  title,
  heading,
  description,
  products
}) => (
  <div className="content">
    <div
      className="full-width-image-container margin-top-0"
      style={{
        backgroundImage: `url(${
          !!image.childImageSharp ? image.childImageSharp.fluid.src : image
        })`
      }}>
      <h2
        className="has-text-weight-bold is-size-1"
        style={{
          boxShadow:
            '0.5rem 0 0 rgba(0, 0, 0, 0.75), -0.5rem 0 0 rgba(0, 0, 0, 0.75)',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: 'white',
          padding: '1rem'
        }}>
        {title}
      </h2>
    </div>
    <section className="section section--gradient">
      <div className="container">
        <div className="section bc-product-grid bc-product-grid--archive bc-product-grid--4col">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

CategoryPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  description: PropTypes.string,
  products: PropTypes.array
};

const CategoryPage = props => {
//   const { frontmatter } = data.markdownRemark;
  const products = props.data.allBigCommerceProducts.nodes;
  let catImage;
  if(props.pageContext.catImg && props.pageContext.catImg !== '') {
    catImage = props.pageContext.catImg;
  }
  else {
    catImage = "/img/boutique-bright-business.jpg";
  }

  return (
    <Layout>
      <CategoryPageTemplate
        image={catImage}
        title={props.pageContext.catName}
        heading={props.pageContext.catName}
        description={props.pageContext.catDes}
        products={products}
      />
    </Layout>
  );
};

CategoryPage.propTypes = {
  data: PropTypes.shape({
    // markdownRemark: PropTypes.shape({
    //   frontmatter: PropTypes.object
    // }),
    allBigCommerceProducts: PropTypes.shape({
      nodes: PropTypes.array
    })
  })
};

export default CategoryPage;

export const categoryPageQuery = graphql`
  query CategoryPage($catId: [Int]) {
    allBigCommerceProducts(filter: {categories: {in: $catId}}) {
      nodes {
        id
        brand_id
        name
        sku
        price
        calculated_price
        retail_price
        sale_price
        map_price
        bigcommerce_id
        custom_url {
          url
        }
        images {
          url_thumbnail
          url_standard
        }
        variants {
          product_id
          id
          option_values {
            label
            option_display_name
          }
          sku
        }
      }
    }
  }
`;

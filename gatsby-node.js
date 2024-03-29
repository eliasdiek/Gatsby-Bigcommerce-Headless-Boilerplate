const _ = require('lodash');
const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { fmImagesToRelative } = require('gatsby-remark-relative-images');

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
      allBigCommerceProducts {
        nodes {
          id
          name
          custom_url {
            url
          }
        }
      }
      allBigCommerceCategories {
        edges {
          node {
            id
            name
            bigcommerce_id
            description
            image_url
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    result.errors.forEach(e => console.error(e.toString()));
    return Promise.reject(result.errors);
  }

  const posts = result.data.allMarkdownRemark.edges;
  const products = result.data.allBigCommerceProducts.nodes;
  const categories = result.data.allBigCommerceCategories.edges;

  products.forEach(({ custom_url, id }) => {
    createPage({
      path: `/products${custom_url.url}`,
      component: path.resolve(`src/templates/product-details.js`),
      context: {
        productId: id
      }
    });
  });

  posts.forEach(edge => {
    const id = edge.node.id;
    createPage({
      path: edge.node.fields.slug,
      tags: edge.node.frontmatter.tags,
      component: path.resolve(
        `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
      ),
      // additional data can be passed via context
      context: {
        id
      }
    });
  });

  categories.forEach(({ node }) => {
    const id = node.id;
    createPage({
      path: node.fields.slug,
      component: path.resolve(`./src/templates/category-page.js`),
      context: {
        // Data passed to context is available
        // in page queries as GraphQL variables.
        id: node.id,
        catId: node.bigcommerce_id,
        catName: node.name,
        catDes: node.description,
        catImg: node.image_url
      },
    });
  });

  // Tag pages:
  let tags = [];
  // Iterate through each post, putting all found tags into `tags`
  posts.forEach(edge => {
    if (_.get(edge, `node.frontmatter.tags`)) {
      tags = tags.concat(edge.node.frontmatter.tags);
    }
  });
  // Eliminate duplicate tags
  tags = _.uniq(tags);

  // Make tag pages
  tags.forEach(tag => {
    const tagPath = `/tags/${_.kebabCase(tag)}/`;

    createPage({
      path: tagPath,
      component: path.resolve(`src/templates/tags.js`),
      context: {
        tag
      }
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;
  fmImagesToRelative(node); // convert image paths for gatsby images

  if(node.internal.type === `BigCommerceCategories`) {
    const slug = node.name.toLowerCase().split(' ').join('-');
    console.log('[Node type: Categories]', slug);

    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  }

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value
    });
  }
};
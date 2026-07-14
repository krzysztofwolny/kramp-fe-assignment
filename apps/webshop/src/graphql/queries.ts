export const GET_PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      imageUrl
      stock
      createdAt
    }
  }
`;

export const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($q: String!) {
    searchProducts(query: $q) {
      id
      name
      price
      imageUrl
      category
      description
      stock
      createdAt
    }
  }
`;

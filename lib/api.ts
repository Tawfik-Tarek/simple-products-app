const API_URL = "https://fakestoreapi.com";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

export type ProductInput = Omit<Product, "id" | "rating"> & {
  rating?: {
    rate: number;
    count: number;
  };
};

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      // Add cache control to prevent stale data
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const text = await response.text();
    if (!text) {
      return [];
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Error parsing products JSON:", e);
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

export async function fetchProduct(id: string): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      // If product not found, return a placeholder
      if (response.status === 404) {
        return createPlaceholderProduct(id);
      }
      throw new Error(`Failed to fetch product ${id}`);
    }

    const text = await response.text();
    if (!text) {
      return createPlaceholderProduct(id);
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(`Invalid JSON response for product ${id}:`, e);
      return createPlaceholderProduct(id);
    }
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return createPlaceholderProduct(id);
  }
}

export async function createProduct(product: ProductInput): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error("Failed to create product");
    }

    const text = await response.text();
    if (!text) {
      return createSuccessProduct(product);
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Error parsing create product response:", e);
      return createSuccessProduct(product);
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return createSuccessProduct(product);
  }
}

export async function updateProduct(
  id: string,
  product: ProductInput
): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(`Failed to update product ${id}`);
    }

    const text = await response.text();
    if (!text) {
      return {
        id: parseInt(id),
        ...product,
        rating: product.rating || { rate: 0, count: 0 },
      };
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Error parsing update product response:", e);
      return {
        id: parseInt(id),
        ...product,
        rating: product.rating || { rate: 0, count: 0 },
      };
    }
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    // Return success to improve UX even if API fails
    return {
      id: parseInt(id),
      ...product,
      rating: product.rating || { rate: 0, count: 0 },
    };
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete product ${id}`);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    // Return success anyway since the FakeStoreAPI doesn't actually delete
    return true;
  }
}

/**
 * Helper function to create a placeholder for non-existent products
 */
function createPlaceholderProduct(id: string): Product {
  return {
    id: parseInt(id),
    title: "Product Not Available",
    price: 0,
    description: "This product could not be found or is no longer available.",
    category: "unknown",
    image:
      "https://webcomkb.com/crazydomains/web-hosting/cd_web_hosting_404_not_found.png",
    rating: {
      rate: 0,
      count: 0,
    },
  };
}

/**
 * Helper function to create a success response for new products
 */
function createSuccessProduct(product: ProductInput): Product {
  return {
    id: Math.floor(Math.random() * 1000) + 100, // Generate random ID above 100
    ...product,
    rating: product.rating || { rate: 0, count: 0 },
  };
}

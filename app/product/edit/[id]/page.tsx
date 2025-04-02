import { Metadata } from "next";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";
import { fetchProduct } from "@/lib/api";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const { id } = params;
    const product = await fetchProduct(id);

    // If we got a fallback "Product Not Available" object
    if (product.title === "Product Not Available") {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found",
      };
    }

    return {
      title: `Edit ${product.title}`,
      description: `Edit details for ${product.title}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Edit Product Error",
      description: "There was an error loading this product for editing",
    };
  }
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { id } = await params;
    const product = await fetchProduct(id);

    // If we got a fallback "Product Not Available" object
    if (product.title === "Product Not Available") {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/product/${id}`}
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back to product details
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Edit Product</h1>

        <ProductForm
          initialData={product}
          isEditing={true}
        />
      </div>
    );
  } catch (error) {
    console.error("Error rendering edit product page:", error);
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back to products
          </Link>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 p-8 rounded-lg max-w-lg mx-auto">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Error Loading Product for Editing
          </h1>
          <p className="mb-6">
            There was an error loading this product. The product might not exist or there was a problem with the server.
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
}

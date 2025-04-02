import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchProduct } from "@/lib/api";
import DeleteButton from "@/components/DeleteButton";
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
      title: `${product.title} | Product Details`,
      description: product.description.substring(0, 160),
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Product Error",
      description: "There was an error loading this product",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const { id } = params;
    const product = await fetchProduct(id);

    // If we got a fallback "Product Not Available" object
    if (product.title === "Product Not Available") {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            ← Back to products
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center items-center bg-white dark:bg-gray-800 p-4 rounded-lg">
            <div className="relative h-80 w-full">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {product.title}
            </h1>

            <p className="text-blue-600 dark:text-blue-400 text-2xl font-semibold mb-4">
              ${product.price.toFixed(2)}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="text-yellow-400"
                  >
                    {i < Math.floor(product.rating.rate) ? "★" : "☆"}
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {product.rating.rate} ({product.rating.count} reviews)
              </span>
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full inline-block mb-6">
              <span className="text-sm capitalize">{product.category}</span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300">
                {product.description}
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href={`/product/edit/${product.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Product
              </Link>
              <DeleteButton id={product.id.toString()} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering product page:", error);
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
            Error Loading Product
          </h1>
          <p className="mb-6">
            There was an error loading this product. The product might not exist
            or there was a problem with the server.
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

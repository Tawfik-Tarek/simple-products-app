import Link from "next/link";
import Image from "next/image";
import { fetchProducts } from "@/lib/api";

export default async function Home() {
  const products = await fetchProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Products Catalog</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Browse our latest products
        </p>
        <Link
          href="/product/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block"
        >
          Add New Product
        </Link>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            href={`/product/${product.id}`}
            key={product.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow dark:border-gray-700"
          >
            <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: "contain",
                  padding: "1rem",
                }}
                priority={false}
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold line-clamp-2 mb-2">
                {product.title}
              </h2>
              <p className="text-blue-600 dark:text-blue-400 font-medium text-xl">
                ${product.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                {product.category}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

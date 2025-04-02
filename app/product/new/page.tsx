import { Metadata } from "next";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";

export const metadata: Metadata = {
  title: "Add New Product",
  description: "Create a new product in our catalog",
};

export default function NewProductPage() {
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

      <h1 className="text-2xl font-bold mb-6 text-center">Add New Product</h1>

      <ProductForm />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product, ProductInput, createProduct, updateProduct } from "@/lib/api";

type ProductFormProps = {
  initialData?: Product;
  isEditing?: boolean;
};

export default function ProductForm({
  initialData,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<ProductInput>({
    title: initialData?.title || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    category: initialData?.category || "",
    image: initialData?.image || "",
    rating: initialData?.rating || { rate: 0, count: 0 },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "price") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (isEditing && initialData) {
        await updateProduct(initialData.id.toString(), formData);
        router.push(`/product/${initialData.id}`);
      } else {
        await createProduct(formData);
        router.push("/");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl mx-auto"
    >
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-1"
        >
          Product Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium mb-1"
        >
          Price ($)
        </label>
        <input
          type="number"
          id="price"
          name="price"
          min="0"
          step="0.1"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium mb-1"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        ></textarea>
      </div>

      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium mb-1"
        >
          Image URL
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : isEditing
            ? "Update Product"
            : "Add Product"}
        </button>
      </div>
    </form>
  );
}

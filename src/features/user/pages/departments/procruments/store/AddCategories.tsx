

import { useEffect, useState } from "react";
import axios from "axios";

interface RootCategory {
  id: number;
  code: string;
  name: string;
}

interface Category {
  id: number;
  code: string;
  name: string;
  root_category_id: number;
}

interface Product {
  id: number;
  code: string;
  name: string;
  category_id: number;
}

interface Variant {
  id: number;
  code: string;
  name: string;
  product_id: number;
}

interface SubVariant {
  id: number;
  code: string;
  name: string;
  variant_id: number;
}

export default function AddCategories() {
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/categories`;

  const [rootName, setRootName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [productName, setProductName] = useState("");
  const [variantName, setVariantName] = useState("");
  const [subVariantName, setSubVariantName] = useState("");

  const [selectedRoot, setSelectedRoot] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  const [roots, setRoots] = useState<RootCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [subVariants, setSubVariants] = useState<SubVariant[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    {
      rootName: string;
      categoryName: string;
      productName: string;
      variantName: string;
      subVariantName: string;
    }[]
  >([]);

  useEffect(() => {
    fetchRoots();
  }, []);

  const fetchRoots = async () => {
    const res = await axios.get(`${API_BASE}/root-category`);
    setRoots(res.data || []);
  };

  const fetchCategories = async (rootId: number) => {
    const res = await axios.get(`${API_BASE}/list?root_id=${rootId}`);
    setCategories(res.data || []);
    setProducts([]);
    setVariants([]);
    setSubVariants([]);
  };

  const fetchProducts = async (categoryId: number) => {
    const res = await axios.get(
      `${API_BASE}/products?category_id=${categoryId}`
    );
    setProducts(res.data || []);
    setVariants([]);
    setSubVariants([]);
  };

  const fetchVariants = async (productId: number) => {
    const res = await axios.get(
      `${API_BASE}/variants?product_id=${productId}`
    );
    setVariants(res.data || []);
    setSubVariants([]);
  };

  const fetchSubVariants = async (variantId: number) => {
    const res = await axios.get(
      `${API_BASE}/sub-variants?variant_id=${variantId}`
    );
    setSubVariants(res.data || []);
  };

  const addRootCategory = async () => {
    if (!rootName) return alert("Enter root category name");
    await axios.post(`${API_BASE}/root-category`, { name: rootName });
    setRootName("");
    fetchRoots();
  };

  const addCategory = async () => {
    if (!selectedRoot || !categoryName)
      return alert("Select root and enter category name");

    await axios.post(`${API_BASE}/category`, {
      name: categoryName,
      root_category_id: selectedRoot,
    });

    setCategoryName("");
    fetchCategories(selectedRoot);
  };

  const addProduct = async () => {
    if (!selectedCategory || !productName)
      return alert("Select category and enter product name");

    await axios.post(`${API_BASE}/product`, {
      name: productName,
      category_id: selectedCategory,
    });

    setProductName("");
    fetchProducts(selectedCategory);
  };

  const addVariant = async () => {
    if (!selectedProduct || !variantName)
      return alert("Select product and enter variant name");

    await axios.post(`${API_BASE}/variant`, {
      name: variantName,
      product_id: selectedProduct,
    });

    setVariantName("");
    fetchVariants(selectedProduct);
  };

  const addSubVariant = async () => {
    if (!selectedVariant || !subVariantName)
      return alert("Select variant and enter sub-variant name");

    await axios.post(`${API_BASE}/sub-variant`, {
      name: subVariantName,
      variant_id: selectedVariant,
    });

    setSubVariantName("");
    fetchSubVariants(selectedVariant);
  };

  const handleSearch = async () => {
    if (!searchQuery) return setSearchResults([]);
    const res = await axios.get(`${API_BASE}/search?query=${searchQuery}`);

    const mappedResults = (res.data.data || res.data || []).map((item: any) => ({
      rootName: item.root_category?.name || "",
      categoryName: item.category?.name || "",
      productName: item.product?.name || "",
      variantName: item.variant?.name || "",
      subVariantName: item.sub_variant?.name || "",
    }));

    setSearchResults(mappedResults);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-full text-black">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-gray-800">
        Manage Categories, Products & Variants
      </h1>

      <Section
        title="Add Root Category"
        inputValue={rootName}
        onInputChange={setRootName}
        buttonLabel="Add Root"
        onSubmit={addRootCategory}
      />

      {/* CATEGORY */}
      <FormSection title="Add Category">
        <Select
          placeholder="-- Select Root Category --"
          value={selectedRoot}
          options={roots}
          onChange={(id: number) => {
            setSelectedRoot(id);
            fetchCategories(id);
          }}
        />
        <Input value={categoryName} onChange={setCategoryName} placeholder="Category Name" />
        <Button onClick={addCategory} color="green">Add Category</Button>
      </FormSection>

      {/* PRODUCT */}
      <FormSection title="Add Product">
        <Select
          placeholder="-- Select Category --"
          value={selectedCategory}
          options={categories}
          onChange={(id: number) => {
            setSelectedCategory(id);
            fetchProducts(id);
          }}
        />
        <Input value={productName} onChange={setProductName} placeholder="Product Name" />
        <Button onClick={addProduct} color="blue">Add Product</Button>
      </FormSection>

      {/* VARIANT */}
      <FormSection title="Add Variant">
        <Select
          placeholder="-- Select Product --"
          value={selectedProduct}
          options={products}
          onChange={(id: number) => {
            setSelectedProduct(id);
            fetchVariants(id);
          }}
        />
        <Input value={variantName} onChange={setVariantName} placeholder="Variant Name" />
        <Button onClick={addVariant} color="yellow">Add Variant</Button>
      </FormSection>

      {/* SUB VARIANT */}
      <FormSection title="Add Sub Variant">
        <Select
          placeholder="-- Select Variant --"
          value={selectedVariant}
          options={variants}
          onChange={(id: number) => {
            setSelectedVariant(id);
            fetchSubVariants(id);
          }}
        />
        <Input value={subVariantName} onChange={setSubVariantName} placeholder="Sub Variant Name" />
        <Button onClick={addSubVariant} color="purple">Add Sub Variant</Button>
      </FormSection>

      {/* SEARCH */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-2">Search</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input value={searchQuery} onChange={setSearchQuery} placeholder="Search..." />
          <Button onClick={handleSearch} color="gray">Search</Button>
        </div>

        <div className="mt-4">
          {searchResults.map((r, i) => (
            <div key={i} className="border p-3 rounded mb-2 bg-gray-50 text-sm sm:text-base">
              <p><strong>Root:</strong> {r.rootName}</p>
              <p><strong>Category:</strong> {r.categoryName}</p>
              <p><strong>Product:</strong> {r.productName}</p>
              <p><strong>Variant:</strong> {r.variantName}</p>
              <p><strong>Sub Variant:</strong> {r.subVariantName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable UI ---------- */

const FormSection = ({ title, children }: any) => (
  <div className="mb-6 p-4 bg-white rounded shadow">
    <h2 className="font-semibold mb-2">{title}</h2>
    <div className="flex flex-col sm:flex-row gap-2">{children}</div>
  </div>
);

const Select = ({ placeholder, value, options, onChange }: any) => (
  <select
    className="border p-2 rounded w-full sm:w-auto"
    value={value || ""}
    onChange={(e) => onChange(Number(e.target.value))}
  >
    <option value="">{placeholder}</option>
    {options.map((o: any) => (
      <option key={o.id} value={o.id}>
        {o.name}
      </option>
    ))}
  </select>
);

const Input = ({ value, onChange, placeholder }: any) => (
  <input
    type="text"
    className="border p-2 rounded w-full sm:flex-1"
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const Button = ({ children, onClick, color }: any) => {
  const colors: any = {
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    yellow: "bg-yellow-600 hover:bg-yellow-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    gray: "bg-gray-600 hover:bg-gray-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${colors[color]} text-white px-4 py-2 rounded w-full sm:w-auto`}
    >
      {children}
    </button>
  );
};

const Section = ({ title, inputValue, onInputChange, buttonLabel, onSubmit }: any) => (
  <div className="mb-6 p-4 bg-white rounded shadow">
    <h2 className="font-semibold mb-2">{title}</h2>
    <div className="flex flex-col sm:flex-row gap-2">
      <Input value={inputValue} onChange={onInputChange} placeholder={title} />
      <Button onClick={onSubmit} color="blue">{buttonLabel}</Button>
    </div>
  </div>
);

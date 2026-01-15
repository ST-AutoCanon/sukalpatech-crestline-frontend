import { useEffect, useState } from "react";
import axios from "axios";

/* ================= TYPES ================= */
interface RootCategory {
  id: number;
  name: string;
}
interface Category {
  id: number;
  name: string;
  root_category_id: number;
}
interface Product {
  id: number;
  name: string;
  category_id: number;
}
interface Variant {
  id: number;
  name: string;
  product_id: number;
}
interface SubVariant {
  id: number;
  name: string;
  variant_id: number;
}

type TabType = "root" | "category" | "product" | "variant" | "subvariant";

export default function AddCategories() {
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/categories`;

  /* ================= STATES ================= */
  const [activeTab, setActiveTab] = useState<TabType>("root");

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
  const [searchResults, setSearchResults] = useState<any[]>([]);

  /* ================= TAB LABEL MAPPING ================= */
  const tabMapping: Record<string, TabType> = {
    "Create Root Category": "root",
    "Create Category": "category",
    "Create Product": "product",
    "Create Variant": "variant",
    "Create sub-variant": "subvariant",
  };

  /* ================= LOAD ROOTS ================= */
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
    const res = await axios.get(`${API_BASE}/variants?product_id=${productId}`);
    setVariants(res.data || []);
    setSubVariants([]);
  };

  const fetchSubVariants = async (variantId: number) => {
    const res = await axios.get(
      `${API_BASE}/sub-variants?variant_id=${variantId}`
    );
    setSubVariants(res.data || []);
  };

  /* ================= CREATE ================= */
  const addRootCategory = async () => {
    if (!rootName) return alert("Enter Root Category");
    await axios.post(`${API_BASE}/root-category`, { name: rootName });
    setRootName("");
    fetchRoots();
  };

  const addCategory = async () => {
    if (!selectedRoot || !categoryName)
      return alert("Select Root & Enter Category");
    await axios.post(`${API_BASE}/category`, {
      name: categoryName,
      root_category_id: selectedRoot,
    });
    setCategoryName("");
    fetchCategories(selectedRoot);
  };

  const addProduct = async () => {
    if (!selectedRoot || !selectedCategory || !productName)
      return alert("Select Root & Category");
    await axios.post(`${API_BASE}/product`, {
      name: productName,
      category_id: selectedCategory,
    });
    setProductName("");
    fetchProducts(selectedCategory);
  };

  const addVariant = async () => {
    if (!selectedRoot || !selectedCategory || !selectedProduct || !variantName)
      return alert("Select Root, Category & Product");
    await axios.post(`${API_BASE}/variant`, {
      name: variantName,
      product_id: selectedProduct,
    });
    setVariantName("");
    fetchVariants(selectedProduct);
  };

  const addSubVariant = async () => {
    if (
      !selectedRoot ||
      !selectedCategory ||
      !selectedProduct ||
      !selectedVariant ||
      !subVariantName
    )
      return alert("Complete Full Hierarchy");
    await axios.post(`${API_BASE}/sub-variant`, {
      name: subVariantName,
      variant_id: selectedVariant,
    });
    setSubVariantName("");
    fetchSubVariants(selectedVariant);
  };

  /* ================= SEARCH ================= */
  const handleSearch = async () => {
    if (!searchQuery) return setSearchResults([]);
    const res = await axios.get(`${API_BASE}/search?query=${searchQuery}`);
    const mapped = (res.data.data || res.data || []).map((item: any) => ({
      root: item.root_category?.name || "",
      category: item.category?.name || "",
      product: item.product?.name || "",
      variant: item.variant?.name || "",
      subVariant: item.sub_variant?.name || "",
    }));
    setSearchResults(mapped);
  };

  /* ================= UI ================= */
  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-6 text-black">

      {/* Tabs */}
      <div className="flex gap-6 text-white mb-6 border-b border-white/20">
        {Object.keys(tabMapping).map((label) => (
          <button
            key={label}
            onClick={() => setActiveTab(tabMapping[label])}
            className={`pb-2 ${activeTab === tabMapping[label] ? "border-b-2 border-cyan-400" : ""
              }`}
          >
            {label.charAt(0).toUpperCase() + label.slice(1)}

          </button>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-xl">

        {/* Root */}
        {activeTab === "root" && (
          <div className="w-full">
            <input
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="w-full p-2 bg-white text-black placeholder-black rounded"
              placeholder="Enter Root Name"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={addRootCategory}
                className="bg-cyan-500 text-white px-4 py-2 rounded"
              >
                + Create
              </button>
            </div>
          </div>
        )}

        {/* Category */}
        {activeTab === "category" && (
          <div className="w-full">
            <div className="flex gap-4">
              <select
                className="flex-1 p-2 bg-white text-black rounded"
                value={selectedRoot || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedRoot(id);
                  fetchCategories(id);
                  setSelectedCategory(null);
                }}
              >
                <option value="">Select Root</option>
                {roots.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex-1 p-2 bg-white text-black placeholder-black rounded"
                placeholder="Category"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={addCategory}
                className="bg-cyan-500 text-white px-4 py-2 rounded"
              >
                + Create Category
              </button>
            </div>
          </div>
        )}

        {/* Product */}
        {activeTab === "product" && (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedRoot || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedRoot(id);
                  fetchCategories(id);
                  setSelectedCategory(null);
                }}
              >
                <option value="">Select Root</option>
                {roots.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedCategory || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedCategory(id);
                  fetchProducts(id);
                }}
                disabled={!selectedRoot}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 bg-white text-black rounded"
                placeholder="Product"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={addProduct}
                className="bg-cyan-500 text-white px-4 py-2 rounded"
              >
                + Create Product
              </button>
            </div>
          </div>
        )}

        {/* Variant */}
        {activeTab === "variant" && (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedRoot || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedRoot(id);
                  fetchCategories(id);
                  setSelectedCategory(null);
                  setSelectedProduct(null);
                }}
              >
                <option value="">Select Root</option>
                {roots.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedCategory || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedCategory(id);
                  fetchProducts(id);
                  setSelectedProduct(null);
                }}
                disabled={!selectedRoot}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedProduct || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedProduct(id);
                  fetchVariants(id);
                }}
                disabled={!selectedCategory}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="w-full min-w-0 p-2 bg-white text-black rounded"
                placeholder="Variant"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={addVariant}
                className="bg-cyan-500 text-white px-4 py-2 rounded"
              >
                + Create Variant
              </button>
            </div>
          </div>
        )}

        {/* SubVariant */}
        {activeTab === "subvariant" && (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedRoot || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedRoot(id);
                  fetchCategories(id);
                  setSelectedCategory(null);
                  setSelectedProduct(null);
                  setSelectedVariant(null);
                }}
              >
                <option value="">Select Root</option>
                {roots.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedCategory || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedCategory(id);
                  fetchProducts(id);
                  setSelectedProduct(null);
                  setSelectedVariant(null);
                }}
                disabled={!selectedRoot}
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedProduct || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedProduct(id);
                  fetchVariants(id);
                  setSelectedVariant(null);
                }}
                disabled={!selectedCategory}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                className="w-full p-2 bg-white text-black rounded"
                value={selectedVariant || ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedVariant(id);
                  fetchSubVariants(id);
                }}
                disabled={!selectedProduct}
              >
                <option value="">Select Variant</option>
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>

              <input
                value={subVariantName}
                onChange={(e) => setSubVariantName(e.target.value)}
                className="w-full min-w-0 p-2 bg-white text-black rounded"
                placeholder="Sub Variant"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={addSubVariant}
                className="bg-cyan-500 text-white px-4 py-2 rounded"
              >
                + Create Sub Variant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="flex justify-end mt-10 mb-6">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-96 px-4 py-2 rounded-lg bg-white text-black placeholder-gray-500 shadow"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-medium shadow hover:opacity-90"
          >
            🔍 Search
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white mt-4 rounded overflow-x-auto">
        <table className="w-full text-black">
          <thead>
            <tr>
              <th className="p-2 border">SI</th>
              <th className="p-2 border">Root</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Variant</th>
              <th className="p-2 border">Sub Variant</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((r, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">{r.root}</td>
                <td className="p-2 border">{r.category}</td>
                <td className="p-2 border">{r.product}</td>
                <td className="p-2 border">{r.variant}</td>
                <td className="p-2 border">{r.subVariant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

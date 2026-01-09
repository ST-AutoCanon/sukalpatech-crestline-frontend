import { useEffect, useState } from "react";
import axios from "axios";

/* ===== INTERFACES ===== */
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
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    fetchRoots();
  }, []);

  const fetchRoots = async () => {
    const res = await axios.get(`${API_BASE}/root-category`);
    setRoots(res.data || []);
  };

  const fetchCategories = async (id: number) => {
    const res = await axios.get(`${API_BASE}/list?root_id=${id}`);
    setCategories(res.data || []);
    setProducts([]);
    setVariants([]);
    setSubVariants([]);
  };

  const fetchProducts = async (id: number) => {
    const res = await axios.get(`${API_BASE}/products?category_id=${id}`);
    setProducts(res.data || []);
    setVariants([]);
    setSubVariants([]);
  };

  const fetchVariants = async (id: number) => {
    const res = await axios.get(`${API_BASE}/variants?product_id=${id}`);
    setVariants(res.data || []);
    setSubVariants([]);
  };

  const fetchSubVariants = async (id: number) => {
    const res = await axios.get(`${API_BASE}/sub-variants?variant_id=${id}`);
    setSubVariants(res.data || []);
  };

  const handleSearch = async () => {
    if (!searchQuery) return setSearchResults([]);
    const res = await axios.get(`${API_BASE}/search?query=${searchQuery}`);
    const mapped = (res.data.data || []).map((i: any) => ({
      root: i.root_category?.name,
      category: i.category?.name,
      product: i.product?.name,
      variant: i.variant?.name,
      subVariant: i.sub_variant?.name,
    }));
    setSearchResults(mapped);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-4 py-6">

      {/* FORM CARD */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* ROOT */}
          <div>
            <p className="text-sm mb-1 text-white">Root Category</p>
            <input
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              placeholder="Enter Root"
              className="w-full p-2 rounded bg-white text-black placeholder-black"
            />
            <button className="mt-2 w-full py-2 rounded bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
              Create
            </button>
          </div>

          {/* CATEGORY */}
          <div>
            <p className="text-sm mb-1 text-white">Category</p>
            <select
              value={selectedRoot ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedRoot(id);
                fetchCategories(id);
              }}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="" disabled>
                Select Root
              </option>
              {roots.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category"
              className="w-full p-2 mt-2 rounded bg-white text-black placeholder-black"
            />
          </div>

          {/* PRODUCT */}
          <div>
            <p className="text-sm mb-1 text-white">Product</p>
            <select
              value={selectedCategory ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedCategory(id);
                fetchProducts(id);
              }}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Product"
              className="w-full p-2 mt-2 rounded bg-white text-black placeholder-black"
            />
          </div>

          {/* VARIANT */}
          <div>
            <p className="text-sm mb-1 text-white">Variant</p>
            <select
              value={selectedProduct ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedProduct(id);
                fetchVariants(id);
              }}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="" disabled>
                Select Product
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              placeholder="Variant"
              className="w-full p-2 mt-2 rounded bg-white text-black placeholder-black"
            />
          </div>

          {/* SUB VARIANT */}
          <div>
            <p className="text-sm mb-1 text-white">Sub Variant</p>
            <select
              value={selectedVariant ?? ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedVariant(id);
                fetchSubVariants(id);
              }}
              className="w-full p-2 rounded bg-white text-black"
            >
              <option value="" disabled>
                Select Variant
              </option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            <input
              value={subVariantName}
              onChange={(e) => setSubVariantName(e.target.value)}
              placeholder="Sub Variant"
              className="w-full p-2 mt-2 rounded bg-white text-black placeholder-black"
            />
          </div>

        </div>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 justify-end mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          className="p-2 rounded bg-white text-black placeholder-black w-1/3"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 rounded bg-gradient-to-r from-sky-500 to-purple-500 text-white"
        >
          Search
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded overflow-x-auto">
        <table className="min-w-[800px] w-full text-black">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">SI</th>
              <th className="p-2">Root</th>
              <th className="p-2">Category</th>
              <th className="p-2">Product</th>
              <th className="p-2">Variant</th>
              <th className="p-2">Sub Variant</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((r, i) => (
              <tr key={i} className="border-t">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{r.root}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2">{r.product}</td>
                <td className="p-2">{r.variant}</td>
                <td className="p-2">{r.subVariant}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

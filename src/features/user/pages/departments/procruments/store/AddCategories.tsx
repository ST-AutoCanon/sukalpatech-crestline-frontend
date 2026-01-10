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
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    fetchRoots();
  }, []);

  const fetchRoots = async () => {
    try {
      const res = await axios.get(`${API_BASE}/root-category`);
      setRoots(res.data || []);
    } catch (err) {
      console.error("Error fetching roots:", err);
    }
  };

  const fetchCategories = async (rootId: number) => {
    try {
      const res = await axios.get(`${API_BASE}/list?root_id=${rootId}`);
      setCategories(res.data || []);
      setProducts([]);
      setVariants([]);
      setSubVariants([]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchProducts = async (categoryId: number) => {
    try {
      const res = await axios.get(
        `${API_BASE}/products?category_id=${categoryId}`
      );
      setProducts(res.data || []);
      setVariants([]);
      setSubVariants([]);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchVariants = async (productId: number) => {
    try {
      const res = await axios.get(
        `${API_BASE}/variants?product_id=${productId}`
      );
      setVariants(res.data || []);
      setSubVariants([]);
    } catch (err) {
      console.error("Error fetching variants:", err);
    }
  };

  const fetchSubVariants = async (variantId: number) => {
    try {
      const res = await axios.get(
        `${API_BASE}/sub-variants?variant_id=${variantId}`
      );
      setSubVariants(res.data || []);
    } catch (err) {
      console.error("Error fetching subvariants:", err);
    }
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
      return alert("Select variant and enter subvariant name");
    await axios.post(`${API_BASE}/sub-variant`, {
      name: subVariantName,
      variant_id: selectedVariant,
    });
    setSubVariantName("");
    fetchSubVariants(selectedVariant);
  };

  const handleSearch = async () => {
    if (!searchQuery) return setSearchResults([]);

    try {
      const res = await axios.get(`${API_BASE}/search?query=${searchQuery}`);
      const mapped = (res.data.data || res.data || []).map((item: any) => ({
        root: item.root_category?.name || "",
        category: item.category?.name || "",
        product: item.product?.name || "",
        variant: item.variant?.name || "",
        subVariant: item.sub_variant?.name || "",
      }));
      setSearchResults(mapped);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-2 sm:px-6">
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

          {/* ROOT */}
          <div>
            <p className="text-sm mb-1 text-white">Root Category</p>
            <input
              value={rootName}
              onChange={(e) => setRootName(e.target.value)}
              className="w-full p-2 rounded text-black bg-white"
              placeholder="Enter Root Name"
            />
            <button
              onClick={addRootCategory}
              className="mt-2 w-full py-2 rounded bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
            >
              Create Category
            </button>
          </div>

          {/* CATEGORY */}
          <div>
            <p className="text-sm mb-1 text-white">Category</p>
            <select
              className="w-full p-2 rounded text-black bg-white"
              value={selectedRoot || ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedRoot(id);
                fetchCategories(id);
              }}
            >
              <option value="">Select Root Category</option>
              {roots.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <div className="flex gap-2 mt-2">
              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full p-2 rounded text-black bg-white"
                placeholder="Category"
              />
              <button
                onClick={addCategory}
                className="px-4 rounded bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* PRODUCT */}
          <div>
            <p className="text-sm mb-1 text-white">Product</p>
            <select
              className="w-full p-2 rounded text-black bg-white"
              value={selectedCategory || ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedCategory(id);
                fetchProducts(id);
              }}
            >
              <option>Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="flex gap-2 mt-2">
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full p-2 rounded text-black bg-white"
                placeholder="Product"
              />
              <button
                onClick={addProduct}
                className="px-4 rounded bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* VARIANT */}
          <div>
            <p className="text-sm mb-1 text-white">Variant</p>
            <select
              className="w-full p-2 rounded text-black bg-white"
              value={selectedProduct || ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedProduct(id);
                fetchVariants(id);
              }}
            >
              <option>Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <div className="flex gap-2 mt-2">
              <input
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                className="w-full p-2 rounded text-black bg-white"
                placeholder="Variant"
              />
              <button
                onClick={addVariant}
                className="px-4 rounded bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* SUB VARIANT */}
          <div>
            <p className="text-sm mb-1 text-white">Sub Variant</p>
            <select
              className="w-full p-2 rounded text-black bg-white"
              value={selectedVariant || ""}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedVariant(id);
                fetchSubVariants(id);
              }}
            >
              <option>Select Variant</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>

            <div className="flex gap-2 mt-2">
              <input
                value={subVariantName}
                onChange={(e) => setSubVariantName(e.target.value)}
                className="w-full p-2 rounded text-black bg-white"
                placeholder="Sub Variant"
              />
              <button
                onClick={addSubVariant}
                className="px-4 rounded bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mb-4">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 rounded text-black w-full sm:w-1/3 bg-white"
          placeholder="Search"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 rounded bg-gradient-to-r from-sky-500 to-purple-500 text-white"
        >
          🔍 Search
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded text-black overflow-x-auto">
        <table className="min-w-[800px] w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">SI</th>
              <th className="p-2 text-left">Root Category</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Product</th>
              <th className="p-2 text-left">Variant</th>
              <th className="p-2 text-left">Sub Variant</th>
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

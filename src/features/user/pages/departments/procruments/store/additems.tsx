import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";

interface RootCategory {
  id: string;
  name: string;
}
interface Category {
  id: string;
  name: string;
}
interface Product {
  id: string;
  name: string;
}
interface Variant {
  id: string;
  name: string;
}
interface SubVariant {
  id: string;
  name: string;
}
interface Vendor {
  vendor_id: number;
  vendor_name: string;
}

export default function AddItem() {
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

  const [roots, setRoots] = useState<RootCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [subVariants, setSubVariants] = useState<SubVariant[]>([]);

  const [selectedRoot, setSelectedRoot] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSubVariant, setSelectedSubVariant] = useState("");

  const [itemName, setItemName] = useState("");
  const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
  const [vendorList, setVendorList] = useState<Vendor[]>([]);

  const [search, setSearch] = useState("");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetchRoots();
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/vendor/vendors`);
      setVendorList(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setVendorList([]);
    }
  };

  const fetchRoots = async () => {
    const res = await axios.get(`${API_BASE}/categories/root-category`);
    setRoots(res.data.map((r: any) => ({ ...r, id: String(r.id) })));
  };

  const fetchCategories = async (rootId: string) => {
    const res = await axios.get(`${API_BASE}/categories/list?root_id=${rootId}`);
    setCategories(res.data.map((c: any) => ({ ...c, id: String(c.id) })));
  };

  const fetchProducts = async (categoryId: string) => {
    const res = await axios.get(
      `${API_BASE}/categories/products?category_id=${categoryId}`
    );
    setProducts(res.data.map((p: any) => ({ ...p, id: String(p.id) })));
  };

  const fetchVariants = async (productId: string) => {
    const res = await axios.get(
      `${API_BASE}/categories/variants?product_id=${productId}`
    );
    setVariants(res.data.map((v: any) => ({ ...v, id: String(v.id) })));
  };

  const fetchSubVariants = async (variantId: string) => {
    const res = await axios.get(
      `${API_BASE}/categories/sub-variants?variant_id=${variantId}`
    );
    setSubVariants(res.data.map((sv: any) => ({ ...sv, id: String(sv.id) })));
  };

  const handleAddItem = async () => {
    if (!selectedRoot || !itemName) {
      alert("Root category and item name required");
      return;
    }

    await axios.post(`${API_BASE}/items/items`, {
      item_name: itemName,
      vendors: selectedVendors.map((v) => ({ vendor_id: v.vendor_id })),
      root_category_id: selectedRoot,
      category_id: selectedCategory || null,
      product_id: selectedProduct || null,
      variant_id: selectedVariant || null,
      sub_variant_id: selectedSubVariant || null,
    });

    alert("Item added successfully");

    setItemName("");
    setSelectedVendors([]);
    setSelectedRoot("");
    setSelectedCategory("");
    setSelectedProduct("");
    setSelectedVariant("");
    setSelectedSubVariant("");
    setCategories([]);
    setProducts([]);
    setVariants([]);
    setSubVariants([]);
  };

  const handleSearch = async () => {
    if (!search) return;
    const res = await axios.get(`${API_BASE}/items/search?query=${search}`);
    setItems(res.data?.data || []);
  };

  const getVendorName = (id: number) => {
    const v = vendorList.find((x) => x.vendor_id === id);
    return v ? v.vendor_name : `Vendor ${id}`;
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ADD ITEM */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
          <h1 className="text-xl font-semibold text-white mb-6">Add Item</h1>

          {/* DROPDOWNS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-black">
            <select className="p-2 rounded bg-white" value={selectedRoot}
              onChange={(e) => {
                setSelectedRoot(e.target.value);
                setSelectedCategory("");
                setSelectedProduct("");
                setSelectedVariant("");
                setSelectedSubVariant("");
                fetchCategories(e.target.value);
              }}>
              <option value="">Select Root Category</option>
              {roots.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>

            <select className="p-2 rounded bg-white" value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedProduct("");
                setSelectedVariant("");
                setSelectedSubVariant("");
                fetchProducts(e.target.value);
              }}>
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select className="p-2 rounded bg-white" value={selectedProduct}
              onChange={(e) => {
                setSelectedProduct(e.target.value);
                setSelectedVariant("");
                setSelectedSubVariant("");
                fetchVariants(e.target.value);
              }}>
              <option value="">Select Product</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <select className="p-2 rounded bg-white" value={selectedVariant}
              onChange={(e) => {
                setSelectedVariant(e.target.value);
                setSelectedSubVariant("");
                fetchSubVariants(e.target.value);
              }}>
              <option value="">Select Variant</option>
              {variants.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>

            <select className="p-2 rounded bg-white" value={selectedSubVariant}
              onChange={(e) => setSelectedSubVariant(e.target.value)}>
              <option value="">Select Sub Variant</option>
              {subVariants.map(sv => <option key={sv.id} value={sv.id}>{sv.name}</option>)}
            </select>
          </div>

          {/* VENDOR + ITEM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Select
              isMulti
              options={vendorList.map(v => ({ value: v.vendor_id, label: v.vendor_name }))}
              value={selectedVendors.map(v => ({ value: v.vendor_id, label: v.vendor_name }))}
              onChange={(s: any) =>
                setSelectedVendors((s || []).map((x: any) => ({
                  vendor_id: x.value,
                  vendor_name: x.label,
                })))
              }
              placeholder="Select Vendors"
              menuPortalTarget={document.body}
            />

            <input
              className="p-2 rounded bg-white text-black"
              placeholder="Enter Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddItem}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg text-white font-semibold"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
          <h1 className="text-xl font-semibold text-white mb-6">Search Item</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input
              className="p-2 rounded bg-white text-black"
              placeholder="Search Item"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-cyan-400 to-purple-500 rounded text-white"
            >
              Search
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full bg-white rounded">
              <thead>
                <tr className="bg-gray-600">
                  <th className="p-3 border">SI</th>
                  <th className="p-3 border">Item Code</th>
                  <th className="p-3 border">Item Name</th>
                  <th className="p-3 border">Vendors</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id}>
                    <td className="p-3 border">{i + 1}</td>
                    <td className="p-3 border">{item.code}</td>
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border">
                      {item.vendors?.map((v: number) => getVendorName(v)).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

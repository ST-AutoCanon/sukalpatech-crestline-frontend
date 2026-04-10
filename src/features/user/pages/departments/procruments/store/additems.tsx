import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Aleart from "../../../../components/Aleartmessage";

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
  const [qty, setQty] = useState<number | "">("");

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [activeVendors, setActiveVendors] = useState<number[]>([]);

  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const token = localStorage.getItem("token"); // fetch once




  const api = axios.create({
  baseURL: `${API_BASE}`,
  withCredentials: true, // ✅ sends HTTP-only cookie automatically
  });
  
  // Fetch all items
  const fetchAllItems = async () => {
    try {
const res = await api.get("/items/items");
      const normalized = (res.data?.data || []).map((item: any) => ({
        id: item.id,
        code: item.item_code,
        name: item.item_name,
        qty: item.qty,
        vendors: item.vendors || [],
      }));
      setItems(normalized);
    } catch {
      setItems([]);
    }
  };

  // Fetch vendors
  const fetchVendors = async () => {
    try {
const res = await api.get("/vendor/vendors");
      setVendorList(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch {
      setVendorList([]);
    }
  };

  // Fetch roots
  const fetchRoots = async () => {
    try {
const res = await api.get("/categories/root-category");
      setRoots(res.data.map((r: any) => ({ ...r, id: String(r.id) })));
    } catch {
      setRoots([]);
    }
  };

  // Fetch categories for a root
  const fetchCategories = async (rootId: string) => {
    setSelectedCategory("");
    setProducts([]);
    setVariants([]);
    setSubVariants([]);
    try {
const res = await api.get(`/categories/list?root_id=${rootId}`);
      setCategories(res.data.map((c: any) => ({ ...c, id: String(c.id) })));
    } catch {
      setCategories([]);
    }
  };

  const fetchProducts = async (categoryId: string) => {
    setSelectedProduct("");
    setVariants([]);
    setSubVariants([]);
    try {
// Fetch products for a category
const res = await api.get(`/categories/products?category_id=${categoryId}`);
      setProducts(res.data.map((p: any) => ({ ...p, id: String(p.id) })));
    } catch {
      setProducts([]);
    }
  };

  const fetchVariants = async (productId: string) => {
    setSelectedVariant("");
    setSubVariants([]);
    try {
const res = await api.get(`/categories/variants?product_id=${productId}`);
      setVariants(res.data.map((v: any) => ({ ...v, id: String(v.id) })));
    } catch {
      setVariants([]);
    }
  };

  const fetchSubVariants = async (variantId: string) => {
    setSelectedSubVariant("");
    try {
const res = await api.get(`/categories/sub-variants?variant_id=${variantId}`);
      setSubVariants(res.data.map((sv: any) => ({ ...sv, id: String(sv.id) })));
    } catch {
      setSubVariants([]);
    }
  };

  // Add item
  const handleAddItem = async () => {
    if (!selectedRoot || !itemName) {
      setAlert({ type: "error", message: "Root category and item name required" });
      return;
    }

    try {
const res = await api.post("/items/items", {
  item_name: itemName,
  qty,
  vendors: selectedVendors.map((v) => ({ vendor_id: v.vendor_id })),
  root_category_id: selectedRoot,
  category_id: selectedCategory || null,
  product_id: selectedProduct || null,
  variant_id: selectedVariant || null,
  sub_variant_id: selectedSubVariant || null,
});

      if (res.data?.data) {
        const addedItem = {
          id: res.data.data.id,
          code: res.data.data.item_code || res.data.data.id,
          name: res.data.data.item_name,
          qty: res.data.data.qty,
          vendors: selectedVendors.map((v) => v.vendor_id),
        };
        setItems((prev) => [addedItem, ...prev]);
        setAlert({ type: "success", message: "Item added successfully" });
      }
    } catch {
      setAlert({ type: "error", message: "Failed to add item" });
    }

    // Reset form
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
    setQty("");
  };

  // Search items
  const handleSearch = async () => {
    
    // if (!search) return;
      if (!search.trim()) {
        await fetchAllItems(); // 👈 important
        return;
      }
    try {
const res = await api.get(`/items/search?query=${search}`);
      setItems(res.data?.data || []);
    } catch {
      setItems([]);
    }
  };

  const getVendorName = (id: number) => {
    const v = vendorList.find((v) => v.vendor_id === id);
    return v ? v.vendor_name : `Vendor ${id}`;
  };

  useEffect(() => {
    fetchRoots();
    fetchVendors();
    fetchAllItems();
  }, []);




  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c] p-4 sm:p-8">
      {alert && (
        <Aleart
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="max-w-7xl mx-auto"></div>
      <div className="max-w-7xl mx-auto">
        {/* ===== Add Item Card ===== */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-white/20">
          <h1 className="text-xl font-semibold mb-4 text-white">Add Item</h1>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 text-black">
            <select
              className="p-2 rounded-lg w-full bg-white text-black"
              value={selectedRoot}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedRoot(id);
                setSelectedCategory("");
                setSelectedProduct("");
                setSelectedVariant("");
                setSelectedSubVariant("");
                fetchCategories(id);
              }}
            >
              <option value="">Select Root Category</option>
              {roots.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <select
              className="p-2 rounded-lg w-full bg-white text-black"
              value={selectedCategory}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedCategory(id);
                setSelectedProduct("");
                setSelectedVariant("");
                setSelectedSubVariant("");
                fetchProducts(id);
              }}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              className="p-2 rounded-lg w-full bg-white text-black"
              value={selectedProduct}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedProduct(id);
                setSelectedVariant("");
                setSelectedSubVariant("");
                fetchVariants(id);
              }}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              className="p-2 rounded-lg w-full bg-white text-black"
              value={selectedVariant}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedVariant(id);
                setSelectedSubVariant("");
                fetchSubVariants(id);
              }}
            >
              <option value="">Select Variant</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            <select
              className="p-2 rounded-lg w-full bg-white text-black"
              value={selectedSubVariant}
              onChange={(e) => setSelectedSubVariant(e.target.value)}
            >
              <option value="">Select Sub Variant</option>
              {subVariants.map((sv) => (
                <option key={sv.id} value={sv.id}>
                  {sv.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vendor + Item Name */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Select
              isMulti
              closeMenuOnSelect={false}
              controlShouldRenderValue={false} // hides selected vendor names
              options={vendorList.map((v) => ({
                value: v.vendor_id,
                label: v.vendor_name,
              }))}
              value={selectedVendors.map((v) => ({
                value: v.vendor_id,
                label: v.vendor_name,
              }))}
              onChange={(selected: any) =>
                setSelectedVendors(
                  (selected || []).map((s: any) => ({
                    vendor_id: s.value,
                    vendor_name: s.label,
                  })),
                )
              }
              placeholder="" // 👈 empty placeholder
              menuPortalTarget={document.body}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "42px",
                  height: "42px",
                }),
                valueContainer: (base) => ({ ...base, paddingTop: 6 }),
              }}
            />

            <input
              className="p-2 rounded-lg w-full bg-white text-black"
              placeholder="Enter Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <input
              type="number"
              className="p-2 rounded-lg bg-white text-black"
              placeholder="Enter Quantity"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
          </div>

          {/* Vendor Chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedVendors.map((v) => (
              <span
                key={v.vendor_id}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-2"
              >
                {v.vendor_name}
                <button
                  className="text-red-500"
                  onClick={() =>
                    setSelectedVendors(
                      selectedVendors.filter(
                        (x) => x.vendor_id !== v.vendor_id,
                      ),
                    )
                  }
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Add Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddItem}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg text-white font-semibold shadow-lg hover:opacity-90"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* ===== Search & Table ===== */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-white/20 mt-8 text-black">
          <h1 className="text-xl font-semibold text-white mb-6">Search Item</h1>

          {/* Search Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input
              className="p-2 rounded-lg w-full bg-white text-black"
              placeholder="Search Item"
              value={search}
              // onChange={(e) => setSearch(e.target.value)}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);

                if (value === "") {
                  fetchAllItems(); // 👈 reload all items when cleared
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg text-white font-semibold shadow-lg hover:opacity-90 w-full sm:w-auto"
            >
              Search
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="bg-white w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border">SI</th>
                  <th className="p-3 border">Item Code</th>
                  <th className="p-3 border">Item Name</th>
                  <th className="p-3 border">Qty</th>
                  <th className="p-3 border">Vendors</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="p-3 border">{index + 1}</td>
                      <td className="p-3 border">{item.code}</td>
                      <td className="p-3 border">{item.name}</td>
                      <td className="p-3 border">{item.qty}</td>
                      <td className="p-3 border">
                        {item.vendors?.length ? (
                          <button
                            onClick={() => {
                              setActiveVendors(item.vendors);
                              setShowVendorModal(true);
                            }}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg"
                          >
                            More info
                          </button>
                        ) : (
                          <span className="text-gray-500">No Vendors</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-400">
                      No records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showVendorModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative">
            <button
              onClick={() => setShowVendorModal(false)}
              className="absolute top-3 right-3 text-xl font-bold text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4 text-black">Vendors</h2>

            <div className="flex flex-wrap gap-2">
              {activeVendors.map((v) => (
                <span
                  key={v}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full"
                >
                  {getVendorName(v)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
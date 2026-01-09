

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Select from "react-select";

// interface RootCategory {
//   id: string;
//   name: string;
// }

// interface Category {
//   id: string;
//   name: string;
//   root_category_id: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   category_id: string;
// }

// interface Variant {
//   id: string;
//   name: string;
//   product_id: string;
// }

// interface SubVariant {
//   id: string;
//   name: string;
//   variant_id: string;
// }

// interface Vendor {
//   vendor_id: number;
//   vendor_name: string;
// }

// export default function AddItem() {
//   const API_BASE = "http://localhost:5001/api";

//   const [roots, setRoots] = useState<RootCategory[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [variants, setVariants] = useState<Variant[]>([]);
//   const [subVariants, setSubVariants] = useState<SubVariant[]>([]);

//   const [selectedRoot, setSelectedRoot] = useState<string>("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedProduct, setSelectedProduct] = useState<string>("");
//   const [selectedVariant, setSelectedVariant] = useState<string>("");
//   const [selectedSubVariant, setSelectedSubVariant] = useState<string>("");

//   const [itemName, setItemName] = useState("");
//   const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
//   const [vendorList, setVendorList] = useState<Vendor[]>([]);

//   useEffect(() => {
//     fetchRoots();
//     fetchVendors();
//   }, []);

//   const fetchVendors = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/vendor/vendors`);
//       const vendors = Array.isArray(res.data?.data) ? res.data.data : [];
//       setVendorList(vendors);
//     } catch {
//       setVendorList([]);
//     }
//   };

//   const fetchRoots = async () => {
//     const res = await axios.get(`${API_BASE}/categories/root-category`);
//     setRoots(res.data.map((r: any) => ({ ...r, id: String(r.id) })));
//   };

//   const fetchCategories = async (rootId: string) => {
//     const res = await axios.get(
//       `${API_BASE}/categories/list?root_id=${rootId}`
//     );
//     setCategories(res.data.map((c: any) => ({ ...c, id: String(c.id) })));
//   };

//   // 🔥 NEW — FETCH PRODUCTS
//   const fetchProducts = async (categoryId: string) => {
//      const res = await axios.get(
//        `${API_BASE}/categories/products?category_id=${categoryId}`
//      );
//     setProducts(res.data.map((p: any) => ({ ...p, id: String(p.id) })));
    
//     // try {
//     //   const res = await axios.get(
//     //     `${API_BASE}/categories/products?category_id=${categoryId}`
//     //   );
//     //   setProducts(res.data.map((p: any) => ({ ...p, id: String(p.id) })));
//     // } catch (err) {
//     //   console.log("Fetch product error", err);
//     //   setProducts([]);
//     // }
//   };

//   const fetchVariants = async (productId: string) => {
//     const res = await axios.get(
//       `${API_BASE}/categories/variants?product_id=${productId}`
//     );
//     setVariants(res.data.map((v: any) => ({ ...v, id: String(v.id) })));
//   };

//   const fetchSubVariants = async (variantId: string) => {
//     const res = await axios.get(
//       `${API_BASE}/categories/sub-variants?variant_id=${variantId}`
//     );
//     setSubVariants(res.data.map((sv: any) => ({ ...sv, id: String(sv.id) })));
//   };

//   const handleAddItem = async () => {
//     if (!selectedRoot || !itemName)
//       return alert("Root category and item name required");

//     const vendorsArray = selectedVendors.map((v) => ({
//       vendor_id: v.vendor_id,
//     }));

//     await axios.post(`${API_BASE}/items/items`, {
//       item_name: itemName,
//       vendors: vendorsArray,
//       root_category_id: selectedRoot,
//       category_id: selectedCategory || null,
//       product_id: selectedProduct || null, // ✅ ADDED
//       variant_id: selectedVariant || null,
//       sub_variant_id: selectedSubVariant || null,
//     });

//     alert("Item added successfully");
//     setItemName("");
//     setSelectedVendors([]);
//   };

//   return (
//     <div className="p-10  mx-auto bg-gray-100 min-h-screen text-black">
//       <h1 className="text-2xl font-bold mb-4">Add Item</h1>

//       <div className="overflow-x-auto">
//         <table className="min-w-[1300px] bg-white rounded shadow text-sm">
//           <thead>
//             <tr className="bg-gray-200 text-left text-sm">
//               <th className="p-2">Root Category</th>
//               <th className="p-2">Category</th>
//               <th className="p-2">Product</th> {/* ✅ NEW */}
//               <th className="p-2">Variant</th>
//               <th className="p-2">Sub-Variant</th>
//               <th className="p-2">Item Name</th>
//               <th className="p-2">Vendors</th>
//               <th className="p-2">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             <tr>
//               {/* ROOT */}
//               <td className="p-1">
//                 <select
//                   className="border p-1 rounded w-36 text-sm"
//                   value={selectedRoot}
//                   onChange={(e) => {
//                     const id = e.target.value;
//                     setSelectedRoot(id);
//                     setSelectedCategory("");
//                     setSelectedProduct("");
//                     setSelectedVariant("");
//                     setSelectedSubVariant("");
//                     fetchCategories(id);
//                   }}
//                 >
//                   <option value="">--Select--</option>
//                   {roots.map((r) => (
//                     <option key={r.id} value={r.id}>
//                       {r.name}
//                     </option>
//                   ))}
//                 </select>
//               </td>

//               {/* CATEGORY */}
//               <td className="p-1">
//                 <select
//                   className="border p-1 rounded w-36 text-sm"
//                   value={selectedCategory}
//                   onChange={(e) => {
//                     const id = e.target.value;
//                     setSelectedCategory(id);
//                     setSelectedProduct("");
//                     setSelectedVariant("");
//                     setSelectedSubVariant("");
//                     fetchProducts(id); // ✅ Fetch Product
//                     // fetchVariants(id);
//                   }}
//                 >
//                   <option value="">--Select--</option>
//                   {categories.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//                 </select>
//               </td>

//               {/* ✅ PRODUCT DROPDOWN */}
//               <td className="p-1">
//                 <select
//                   className="border p-1 rounded w-36 text-sm"
//                   value={selectedProduct}
//                   // onChange={(e) => setSelectedProduct(e.target.value)}
//                   onChange={(e) => {
//                     const id = e.target.value;
//                     setSelectedProduct(id);
//                     setSelectedVariant("");
//                     setSelectedSubVariant("");
//                     // fetchProducts(id); // ✅ Fetch Product
//                     fetchVariants(id);
//                   }}
//                 >
//                   <option value="">--Select--</option>
//                   {products.map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//               </td>

//               {/* VARIANT */}
//               <td className="p-1">
//                 <select
//                   className="border p-1 rounded w-36 text-sm"
//                   value={selectedVariant}
//                   onChange={(e) => {
//                     const id = e.target.value;
//                     setSelectedVariant(id);
//                     setSelectedSubVariant("");
//                     fetchSubVariants(id);
//                   }}
//                 >
//                   <option value="">--Select--</option>
//                   {variants.map((v) => (
//                     <option key={v.id} value={v.id}>
//                       {v.name}
//                     </option>
//                   ))}
//                 </select>
//               </td>

//               {/* SUB VARIANT */}
//               <td className="p-1">
//                 <select
//                   className="border p-1 rounded w-36 text-sm"
//                   value={selectedSubVariant}
//                   onChange={(e) => setSelectedSubVariant(e.target.value)}
//                 >
//                   <option value="">--Select--</option>
//                   {subVariants.map((sv) => (
//                     <option key={sv.id} value={sv.id}>
//                       {sv.name}
//                     </option>
//                   ))}
//                 </select>
//               </td>

//               {/* ITEM NAME */}
//               <td className="p-1">
//                 <input
//                   type="text"
//                   className="border p-1 rounded w-48 text-sm"
//                   placeholder="Item Name"
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                 />
//               </td>

//               {/* VENDORS */}
//               <td className="p-1 w-64">
//                 <Select
//                   isMulti
//                   options={vendorList.map((v) => ({
//                     value: v.vendor_id,
//                     label: v.vendor_name,
//                   }))}
//                   value={selectedVendors.map((v) => ({
//                     value: v.vendor_id,
//                     label: v.vendor_name,
//                   }))}
//                   onChange={(selected: any) =>
//                     setSelectedVendors(
//                       (selected || []).map((s: any) => ({
//                         vendor_id: s.value,
//                         vendor_name: s.label,
//                       }))
//                     )
//                   }
//                   placeholder="Select Vendors"
//                   menuPortalTarget={document.body}
//                 />
//               </td>

//               {/* ACTION */}
//               <td className="p-1">
//                 <button
//                   className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
//                   onClick={handleAddItem}
//                 >
//                   Add
//                 </button>
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


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

  useEffect(() => {
    fetchRoots();
    fetchVendors();
  }, []);

  const fetchRoots = async () => {
    const res = await axios.get(`${API_BASE}/categories/root-category`);
    setRoots(res.data.map((r: any) => ({ ...r, id: String(r.id) })));
  };

  const fetchVendors = async () => {
    const res = await axios.get(`${API_BASE}/vendor/vendors`);
    setVendorList(res.data?.data || []);
  };

  const fetchCategories = async (rootId: string) => {
    setSelectedCategory("");
    setProducts([]);
    setVariants([]);
    setSubVariants([]);

    const res = await axios.get(
      `${API_BASE}/categories/list?root_id=${rootId}`
    );
    setCategories(res.data.map((c: any) => ({ ...c, id: String(c.id) })));
  };

  const fetchProducts = async (categoryId: string) => {
    setSelectedProduct("");
    setVariants([]);
    setSubVariants([]);

    const res = await axios.get(
      `${API_BASE}/categories/products?category_id=${categoryId}`
    );
    setProducts(res.data.map((p: any) => ({ ...p, id: String(p.id) })));
  };

  const fetchVariants = async (productId: string) => {
    setSelectedVariant("");
    setSubVariants([]);

    const res = await axios.get(
      `${API_BASE}/categories/variants?product_id=${productId}`
    );
    setVariants(res.data.map((v: any) => ({ ...v, id: String(v.id) })));
  };

  const fetchSubVariants = async (variantId: string) => {
    setSelectedSubVariant("");

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
      vendors: selectedVendors.map(v => ({ vendor_id: v.vendor_id })),
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
    setCategories([]);
    setProducts([]);
    setVariants([]);
    setSubVariants([]);
  };

  return (
    <div className="p-4 md:p-10 bg-gray-100 min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">Add Item</h1>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[1300px] bg-white rounded shadow text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Root</th>
              <th className="p-2">Category</th>
              <th className="p-2">Product</th>
              <th className="p-2">Variant</th>
              <th className="p-2">Sub Variant</th>
              <th className="p-2">Item</th>
              <th className="p-2">Vendors</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-1">
                <select
                  className="border p-1 w-36"
                  value={selectedRoot}
                  onChange={(e) => {
                    setSelectedRoot(e.target.value);
                    fetchCategories(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {roots.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </td>

              <td className="p-1">
                <select
                  className="border p-1 w-36"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    fetchProducts(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </td>

              <td className="p-1">
                <select
                  className="border p-1 w-36"
                  value={selectedProduct}
                  onChange={(e) => {
                    setSelectedProduct(e.target.value);
                    fetchVariants(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </td>

              <td className="p-1">
                <select
                  className="border p-1 w-36"
                  value={selectedVariant}
                  onChange={(e) => {
                    setSelectedVariant(e.target.value);
                    fetchSubVariants(e.target.value);
                  }}
                >
                  <option value="">Select</option>
                  {variants.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </td>

              <td className="p-1">
                <select
                  className="border p-1 w-36"
                  value={selectedSubVariant}
                  onChange={(e) => setSelectedSubVariant(e.target.value)}
                >
                  <option value="">Select</option>
                  {subVariants.map(sv => (
                    <option key={sv.id} value={sv.id}>{sv.name}</option>
                  ))}
                </select>
              </td>

              <td className="p-1">
                <input
                  className="border p-1 w-48"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </td>

              <td className="p-1 w-64">
                <Select
                  isMulti
                  options={vendorList.map(v => ({
                    value: v.vendor_id,
                    label: v.vendor_name
                  }))}
                  value={selectedVendors.map(v => ({
                    value: v.vendor_id,
                    label: v.vendor_name
                  }))}
                  onChange={(s: any) =>
                    setSelectedVendors(
                      (s || []).map((x: any) => ({
                        vendor_id: x.value,
                        vendor_name: x.label
                      }))
                    )
                  }
                />
              </td>

              <td className="p-1">
                <button
                  className="bg-indigo-600 text-white px-4 py-1 rounded"
                  onClick={handleAddItem}
                >
                  Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


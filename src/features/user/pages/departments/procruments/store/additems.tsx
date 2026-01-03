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

// interface Variant {
//   id: string;
//   name: string;
//   category_id: string;
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
//   const [variants, setVariants] = useState<Variant[]>([]);
//   const [subVariants, setSubVariants] = useState<SubVariant[]>([]);

//   const [selectedRoot, setSelectedRoot] = useState<string>("");
//   const [selectedCategory, setSelectedCategory] = useState<string>("");
//   const [selectedVariant, setSelectedVariant] = useState<string>("");
//   const [selectedSubVariant, setSelectedSubVariant] = useState<string>("");

//   const [itemName, setItemName] = useState("");
//   const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
//   const [vendorList, setVendorList] = useState<Vendor[]>([]);

//   useEffect(() => {
//     fetchRoots();
//     fetchVendors();
//   }, []);

//   // Fetch vendors
//   const fetchVendors = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/vendor/vendors`);
//       console.log("Vendor API Response:", res.data);

//       const vendors = Array.isArray(res.data?.data) ? res.data.data : [];
//       setVendorList(vendors);
//     } catch (err) {
//       console.error("Fetch vendors error:", err);
//       setVendorList([]);
//     }
//   };

//   // Fetch roots
//   const fetchRoots = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/categories/root-category`);
//       setRoots(res.data.map((r: any) => ({ ...r, id: String(r.id) })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchCategories = async (rootId: string) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/categories/list?root_id=${rootId}`
//       );
//       setCategories(res.data.map((c: any) => ({ ...c, id: String(c.id) })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchVariants = async (categoryId: string) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/categories/variants?category_id=${categoryId}`
//       );
//       setVariants(res.data.map((v: any) => ({ ...v, id: String(v.id) })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchSubVariants = async (variantId: string) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/categories/sub-variants?variant_id=${variantId}`
//       );
//       setSubVariants(res.data.map((sv: any) => ({ ...sv, id: String(sv.id) })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Add Item
//   const handleAddItem = async () => {
//     if (!selectedRoot || !itemName)
//       return alert("Root category and item name required");

//     // const vendorsArray = selectedVendors.map((v) => ({
//     //   vendor_id: v.vendor_id,
//     //   vendor_name: v.vendor_name,
//     // }));
// const vendorsArray = selectedVendors.map((v) => ({
//   vendor_id: v.vendor_id, // will now have actual numbers
// }));
//     console.log("Posting Vendors:", vendorsArray);

//     try {
//       await axios.post(`${API_BASE}/items/items`, {
//         item_name: itemName,
//         vendors: vendorsArray,
//         root_category_id: selectedRoot,
//         category_id: selectedCategory || null,
//         variant_id: selectedVariant || null,
//         sub_variant_id: selectedSubVariant || null,
//       });

//       setItemName("");
//       setSelectedVendors([]);
//       alert("Item added successfully");
//     } catch (err) {
//       console.error("Add item error:", err);
//       alert("Failed to add item");
//     }
//   };

//   return (
//     <div className="p-10  mx-auto bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Add Item</h1>

//       <div className="overflow-x-auto">
//         <table className="min-w-[1200px] bg-white rounded shadow text-sm">
//           <thead>
//             <tr className="bg-gray-200 text-left text-sm">
//               <th className="p-2">Root Category</th>
//               <th className="p-2">Category</th>
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
//                     setSelectedVariant("");
//                     setSelectedSubVariant("");
//                     fetchVariants(id);
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
//                     value: v.vendor_id, // the ID
//                     label: v.vendor_name, // the name
//                   }))}
//                   value={selectedVendors.map((v) => ({
//                     value: v.vendor_id,
//                     label: v.vendor_name,
//                   }))}
//                   onChange={(selected: any) =>
//                     setSelectedVendors(
//                       (selected || []).map((s: any) => ({
//                         vendor_id: s.value, // 👈 this is important
//                         vendor_name: s.label, // optional, only for display
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
//   category_id: string;
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
//   const [selectedProduct, setSelectedProduct] = useState<string>(""); // 👈 New
//   const [selectedVariant, setSelectedVariant] = useState<string>("");
//   const [selectedSubVariant, setSelectedSubVariant] = useState<string>("");

//   const [itemName, setItemName] = useState("");
//   const [selectedVendors, setSelectedVendors] = useState<Vendor[]>([]);
//   const [vendorList, setVendorList] = useState<Vendor[]>([]);

//   useEffect(() => {
//     fetchRoots();
//     fetchVendors();
//   }, []);

//   // Fetch vendors
//   const fetchVendors = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/vendor/vendors`);
//       const vendors = Array.isArray(res.data?.data) ? res.data.data : [];
//       setVendorList(vendors);
//     } catch (err) {
//       console.error(err);
//       setVendorList([]);
//     }
//   };

//   // Fetch roots
//   const fetchRoots = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/categories/root-category`);
//       setRoots(res.data.map((r: any) => ({ ...r, id: String(r.id) })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchCategories = async (rootId: string) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/categories/list?root_id=${rootId}`
//       );
//       setCategories(res.data.map((c: any) => ({ ...c, id: String(c.id) })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

// const fetchProducts = async (categoryId: string) => {
//   try {
//     const res = await axios.get(
//       `${API_BASE}/products?category_id=${categoryId}`
//     );
//     setProducts(res.data.map((p: any) => ({ ...p, id: String(p.id) })));
//   } catch (err) {
//     console.error("Fetch products error:", err);
//     setProducts([]);
//   }
// };


//   const fetchVariants = async (categoryId: string) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/categories/variants?category_id=${categoryId}`
//       );
//       setVariants(res.data.map((v: any) => ({ ...v, id: String(v.id) })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchSubVariants = async (variantId: string) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/categories/sub-variants?variant_id=${variantId}`
//       );
//       setSubVariants(res.data.map((sv: any) => ({ ...sv, id: String(sv.id) })));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Add Item
//   const handleAddItem = async () => {
//     if (!selectedRoot || !itemName)
//       return alert("Root category and item name required");

//     const vendorsArray = selectedVendors.map((v) => ({
//       vendor_id: v.vendor_id,
//     }));

//     try {
//       await axios.post(`${API_BASE}/items/items`, {
//         item_name: itemName,
//         vendors: vendorsArray,
//         root_category_id: selectedRoot,
//         category_id: selectedCategory || null,
//         product_id: selectedProduct || null, // 👈 Added product_id
//         variant_id: selectedVariant || null,
//         sub_variant_id: selectedSubVariant || null,
//       });

//       setItemName("");
//       setSelectedVendors([]);
//       alert("Item added successfully");
//     } catch (err) {
//       console.error(err);
//       alert("Failed to add item");
//     }
//   };

//   return (
//     <div className="p-10 mx-auto bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-4">Add Item</h1>

//       <div className="overflow-x-auto">
//         <table className="min-w-[1200px] bg-white rounded shadow text-sm">
//           <thead>
//             <tr className="bg-gray-200 text-left text-sm">
//               <th className="p-2">Root Category</th>
//               <th className="p-2">Category</th>
//               <th className="p-2">Product</th> {/* 👈 New */}
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
//                     setSelectedProduct(""); // reset
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
//                     setSelectedProduct(""); // reset product
//                     setSelectedVariant("");
//                     setSelectedSubVariant("");
//                     fetchProducts(id); // 👈 fetch products
//                     fetchVariants(id);
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

//               {/* PRODUCT */}
//               <td className="p-1">
//                 <select
//                   className="border p-1 rounded w-36 text-sm"
//                   value={selectedProduct}
//                   onChange={(e) => setSelectedProduct(e.target.value)}
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
  const API_BASE = "http://localhost:5001/api";

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
      const vendors = Array.isArray(res.data?.data) ? res.data.data : [];
      setVendorList(vendors);
    } catch {
      setVendorList([]);
    }
  };

  const fetchRoots = async () => {
    const res = await axios.get(`${API_BASE}/categories/root-category`);
    setRoots(res.data.map((r: any) => ({ ...r, id: String(r.id) })));
  };

  const fetchCategories = async (rootId: string) => {
    const res = await axios.get(
      `${API_BASE}/categories/list?root_id=${rootId}`
    );
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
    if (!selectedRoot || !itemName)
      return alert("Root category and item name required");

    const vendorsArray = selectedVendors.map((v) => ({
      vendor_id: v.vendor_id,
    }));

    await axios.post(`${API_BASE}/items/items`, {
      item_name: itemName,
      vendors: vendorsArray,
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

     // Reset dependent lists
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
    const v = vendorList.find((v) => v.vendor_id === id);
    return v ? v.vendor_name : `Vendor ${id}`;
  };

  return (
    // <div className="min-h-screen bg-gradient-to-b from-[#0F1B90] to-[#1B2FA8] p-8 text-white">
    <div className="w-full h-full min-h-screen bg-gradient-to-r from-[#4b1b7a] to-[#2d2a8c]">
      <div className="max-w-7xl mx-auto">
        {/* Top Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
          <h1 className="text-xl font-semibold mb-4">Add Item</h1>

          {/* Dropdown Grid */}
          <div className="grid grid-cols-5 gap-4 text-black">
            {/* Root */}
            <select
              className="p-2 rounded-lg w-full bg-white text-black bg-white text-black bg-white text-black"
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

            {/* Category */}
            <select
              className="p-2 rounded-lg w-full bg-white text-black bg-white text-black"
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

            {/* Product */}
            <select
              className="p-2 rounded-lg w-full bg-white text-black bg-white text-black"
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

            {/* Variant */}
            <select
              className="p-2 rounded-lg w-full bg-white text-black bg-white text-black"
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

            {/* Sub Variant */}
            <select
              className="p-2 rounded-lg w-full bg-white text-black bg-white text-black"
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

          {/* Vendor + Item Inputs */}
          {/* GRID — only Select + Input */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <Select
                isMulti
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
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
                    }))
                  )
                }
                placeholder="Select Vendor"
                menuPortalTarget={document.body}
                components={{
                  MultiValue: () => null,
                  MultiValueRemove: () => null,
                }}
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "42px",
                    height: "42px",
                    overflow: "hidden",
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    paddingTop: 6,
                  }),
                }}
              />
            </div>

            <input
              className="p-2 rounded-lg bg-white text-black"
              placeholder="Enter Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          {/* Chips OUTSIDE grid so they don't stretch row */}
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
                      selectedVendors.filter((x) => x.vendor_id !== v.vendor_id)
                    )
                  }
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          {/* Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleAddItem}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg text-white font-semibold shadow-lg hover:opacity-90"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 mt-8 text-black">
        <h1 className="text-xl font-semibold text-white mb-6">Search Item</h1>

        {/* Search Bar */}
        <div className="grid grid-cols-2 gap-4">
          <input
            className="p-2 rounded-lg bg-white text-black"
            placeholder="Search Item"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg text-white font-semibold shadow-lg hover:opacity-90"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg mt-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 border">SI</th>
                <th className="p-3 border">Item Code</th>
                <th className="p-3 border">Item Name</th>
                <th className="p-3 border">Vendors</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{item.code}</td>
                  <td className="p-3 border">{item.name}</td>

                  <td className="p-3 border">
                    <div className="flex flex-wrap gap-2">
                      {item.vendors?.length > 0 ? (
                        item.vendors.map((v: number) => (
                          <span
                            key={v}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-2"
                          >
                            {getVendorName(v)}
                            <span className="text-sm">✕</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No Vendors</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
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
  );
}

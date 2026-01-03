// import { useEffect, useState } from "react";
// import axios from "axios";

// interface RootCategory {
//   id: number;
//   code: string;
//   name: string;
// }

// interface Category {
//   id: number;
//   code: string;
//   name: string;
//   root_category_id: number;
// }

// interface Variant {
//   id: number;
//   code: string;
//   name: string;
//   category_id: number;
// }

// interface SubVariant {
//   id: number;
//   code: string;
//   name: string;
//   variant_id: number;
// }

// export default function AddCategories() {
//   const API_BASE = "http://localhost:5001/api/categories";

//   // Form states
//   const [rootName, setRootName] = useState("");
//   const [categoryName, setCategoryName] = useState("");
//   const [variantName, setVariantName] = useState("");
//   const [subVariantName, setSubVariantName] = useState("");

//   const [selectedRoot, setSelectedRoot] = useState<number | null>(null);
//   const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
//   const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

//   // Data lists
//   const [roots, setRoots] = useState<RootCategory[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [variants, setVariants] = useState<Variant[]>([]);
//   const [subVariants, setSubVariants] = useState<SubVariant[]>([]);

//   // Search
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<
//     {
//       rootName: string;
//       categoryName: string;
//       variantName: string;
//       subVariantName: string;
//     }[]
//   >([]);

//   // Fetch roots on load
//   useEffect(() => {
//     fetchRoots();
//   }, []);

//   const fetchRoots = async () => {
//     try {
//       const res = await axios.get(`${API_BASE}/root-category`);
//       setRoots(res.data || []);
//     } catch (err) {
//       console.error("Error fetching roots:", err);
//     }
//   };

//   const fetchCategories = async (rootId: number) => {
//     try {
//       const res = await axios.get(`${API_BASE}/list?root_id=${rootId}`);
//       setCategories(res.data || []);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//     }
//   };

//   const fetchVariants = async (categoryId: number) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/variants?category_id=${categoryId}`
//       );
//       setVariants(res.data || []);
//     } catch (err) {
//       console.error("Error fetching variants:", err);
//     }
//   };

//   const fetchSubVariants = async (variantId: number) => {
//     try {
//       const res = await axios.get(
//         `${API_BASE}/sub-variants?variant_id=${variantId}`
//       );
//       setSubVariants(res.data || []);
//     } catch (err) {
//       console.error("Error fetching sub-variants:", err);
//     }
//   };

//   // Add handlers
//   const addRootCategory = async () => {
//     if (!rootName) return alert("Enter root category name");
//     await axios.post(`${API_BASE}/root-category`, { name: rootName });
//     setRootName("");
//     fetchRoots();
//   };

//   const addCategory = async () => {
//     if (!selectedRoot || !categoryName)
//       return alert("Select root and enter category name");
//     await axios.post(`${API_BASE}/category`, {
//       name: categoryName,
//       root_category_id: selectedRoot,
//     });
//     setCategoryName("");
//     fetchCategories(selectedRoot);
//   };

//   const addVariant = async () => {
//     if (!selectedCategory || !variantName)
//       return alert("Select category and enter variant name");
//     await axios.post(`${API_BASE}/variant`, {
//       name: variantName,
//       category_id: selectedCategory,
//     });
//     setVariantName("");
//     fetchVariants(selectedCategory);
//   };

//   const addSubVariant = async () => {
//     if (!selectedVariant || !subVariantName)
//       return alert("Select variant and enter sub-variant name");
//     await axios.post(`${API_BASE}/sub-variant`, {
//       name: subVariantName,
//       variant_id: selectedVariant,
//     });
//     setSubVariantName("");
//     fetchSubVariants(selectedVariant);
//   };

//   // Search handler
//   const handleSearch = async () => {
//     if (!searchQuery) return setSearchResults([]);
//     try {
//       const res = await axios.get(`${API_BASE}/search?query=${searchQuery}`);
//       // Map API response to only keep names
//       const mappedResults = (res.data.data || res.data || []).map(
//         (item: any) => ({
//           rootName: item.root_category?.name || "",
//           categoryName: item.category?.name || "",
//           variantName: item.variant?.name || "",
//           subVariantName: item.sub_variant?.name || "",
//         })
//       );
//       setSearchResults(mappedResults);
//     } catch (err) {
//       console.error("Search error:", err);
//     }
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">
//         Manage Categories & Variants
//       </h1>

//       {/* Add Root Category */}
//       <div className="mb-6 p-4 bg-white rounded shadow">
//         <h2 className="font-semibold mb-2">Add Root Category</h2>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="border p-2 rounded flex-1"
//             placeholder="Root Category Name"
//             value={rootName}
//             onChange={(e) => setRootName(e.target.value)}
//           />
//           <button
//             onClick={addRootCategory}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Add Root
//           </button>
//         </div>
//       </div>

//       {/* Add Category */}
//       <div className="mb-6 p-4 bg-white rounded shadow">
//         <h2 className="font-semibold mb-2">Add Category</h2>
//         <div className="flex gap-2 mb-2">
//           <select
//             className="border p-2 rounded"
//             value={selectedRoot || ""}
//             onChange={(e) => {
//               const id = Number(e.target.value);
//               setSelectedRoot(id);
//               fetchCategories(id);
//             }}
//           >
//             <option value="">-- Select Root Category --</option>
//             {roots.map((r) => (
//               <option key={r.id} value={r.id}>
//                 {r.name}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             className="border p-2 rounded flex-1"
//             placeholder="Category Name"
//             value={categoryName}
//             onChange={(e) => setCategoryName(e.target.value)}
//           />
//           <button
//             onClick={addCategory}
//             className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//           >
//             Add Category
//           </button>
//         </div>
//       </div>

//       {/* Add Variant */}
//       <div className="mb-6 p-4 bg-white rounded shadow">
//         <h2 className="font-semibold mb-2">Add Variant</h2>
//         <div className="flex gap-2 mb-2">
//           <select
//             className="border p-2 rounded"
//             value={selectedCategory || ""}
//             onChange={(e) => {
//               const id = Number(e.target.value);
//               setSelectedCategory(id);
//               fetchVariants(id);
//             }}
//           >
//             <option value="">-- Select Category --</option>
//             {categories.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             className="border p-2 rounded flex-1"
//             placeholder="Variant Name"
//             value={variantName}
//             onChange={(e) => setVariantName(e.target.value)}
//           />
//           <button
//             onClick={addVariant}
//             className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
//           >
//             Add Variant
//           </button>
//         </div>
//       </div>

//       {/* Add Sub-Variant */}
//       <div className="mb-6 p-4 bg-white rounded shadow">
//         <h2 className="font-semibold mb-2">Add Sub-Variant</h2>
//         <div className="flex gap-2 mb-2">
//           <select
//             className="border p-2 rounded"
//             value={selectedVariant || ""}
//             onChange={(e) => {
//               const id = Number(e.target.value);
//               setSelectedVariant(id);
//               fetchSubVariants(id);
//             }}
//           >
//             <option value="">-- Select Variant --</option>
//             {variants.map((v) => (
//               <option key={v.id} value={v.id}>
//                 {v.name}
//               </option>
//             ))}
//           </select>
//           <input
//             type="text"
//             className="border p-2 rounded flex-1"
//             placeholder="Sub Variant Name"
//             value={subVariantName}
//             onChange={(e) => setSubVariantName(e.target.value)}
//           />
//           <button
//             onClick={addSubVariant}
//             className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
//           >
//             Add Sub-Variant
//           </button>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="mb-6 p-4 bg-white rounded shadow">
//         <h2 className="font-semibold mb-2">Search Categories/Variants</h2>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             className="border p-2 rounded flex-1"
//             placeholder="Search by name..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//           <button
//             onClick={handleSearch}
//             className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
//           >
//             Search
//           </button>
//         </div>

//         <div className="mt-4">
//           {searchResults.length === 0 ? (
//             <p>No results found</p>
//           ) : (
//             searchResults.map((r, i) => (
//               <div key={i} className="border p-2 rounded mb-2 bg-gray-50">
//                 <p>
//                   <strong>Root Category:</strong> {r.rootName}
//                 </p>
//                 <p>
//                   <strong>Category:</strong> {r.categoryName}
//                 </p>
//                 <p>
//                   <strong>Variant:</strong> {r.variantName}
//                 </p>
//                 <p>
//                   <strong>Sub-Variant:</strong> {r.subVariantName}
//                 </p>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



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
  const API_BASE = "http://localhost:5001/api/categories";

  // Form states
  const [rootName, setRootName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [productName, setProductName] = useState("");
  const [variantName, setVariantName] = useState("");
  const [subVariantName, setSubVariantName] = useState("");

  const [selectedRoot, setSelectedRoot] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

  // Data lists
  const [roots, setRoots] = useState<RootCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [subVariants, setSubVariants] = useState<SubVariant[]>([]);

  // Search
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
      console.error("Error fetching sub-variants:", err);
    }
  };

  // Add handlers
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

  // Search handler
  const handleSearch = async () => {
    if (!searchQuery) return setSearchResults([]);

    try {
      const res = await axios.get(`${API_BASE}/search?query=${searchQuery}`);
      const mappedResults = (res.data.data || res.data || []).map(
        (item: any) => ({
          rootName: item.root_category?.name || "",
          categoryName: item.category?.name || "",
          productName: item.product?.name || "",
          variantName: item.variant?.name || "",
          subVariantName: item.sub_variant?.name || "",
        })
      );

      setSearchResults(mappedResults);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-scree text-black">
      <h1 className="text-3xl font-bold mb-6 text-g-800">
        Manage Categories, Products & Variants
      </h1>

      {/* ROOT */}
      <Section
        title="Add Root Category"
        inputValue={rootName}
        onInputChange={setRootName}
        buttonLabel="Add Root"
        onSubmit={addRootCategory}
      />

      {/* CATEGORY */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-2">Add Category</h2>
        <div className="flex gap-2 mb-2">
          <Select
            placeholder="-- Select Root Category --"
            value={selectedRoot}
            options={roots}
            onChange={(id) => {
              setSelectedRoot(id);
              fetchCategories(id);
            }}
          />

          <Input
            value={categoryName}
            onChange={setCategoryName}
            placeholder="Category Name"
          />

          <Button onClick={addCategory} color="green">
            Add Category
          </Button>
        </div>
      </div>

      {/* PRODUCT */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-2">Add Product</h2>
        <div className="flex gap-2 mb-2">
          <Select
            placeholder="-- Select Category --"
            value={selectedCategory}
            options={categories}
            onChange={(id) => {
              setSelectedCategory(id);
              fetchProducts(id);
            }}
          />

          <Input
            value={productName}
            onChange={setProductName}
            placeholder="Product Name"
          />

          <Button onClick={addProduct} color="blue">
            Add Product
          </Button>
        </div>
      </div>

      {/* VARIANT */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-2">Add Variant</h2>
        <div className="flex gap-2 mb-2">
          <Select
            placeholder="-- Select Product --"
            value={selectedProduct}
            options={products}
            onChange={(id) => {
              setSelectedProduct(id);
              fetchVariants(id);
            }}
          />

          <Input
            value={variantName}
            onChange={setVariantName}
            placeholder="Variant Name"
          />

          <Button onClick={addVariant} color="yellow">
            Add Variant
          </Button>
        </div>
      </div>

      {/* SUB VARIANT */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-2">Add Sub Variant</h2>
        <div className="flex gap-2 mb-2">
          <Select
            placeholder="-- Select Variant --"
            value={selectedVariant}
            options={variants}
            onChange={(id) => {
              setSelectedVariant(id);
              fetchSubVariants(id);
            }}
          />

          <Input
            value={subVariantName}
            onChange={setSubVariantName}
            placeholder="Sub Variant Name"
          />

          <Button onClick={addSubVariant} color="purple">
            Add Sub Variant
          </Button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-2">Search</h2>
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search..."
          />
          <Button onClick={handleSearch} color="gray">
            Search
          </Button>
        </div>

        <div className="mt-4">
          {searchResults.length === 0 ? (
            <p>No results found</p>
          ) : (
            searchResults.map((r, i) => (
              <div key={i} className="border p-2 rounded mb-2 bg-gray-50">
                <p>
                  <strong>Root:</strong> {r.rootName}
                </p>
                <p>
                  <strong>Category:</strong> {r.categoryName}
                </p>
                <p>
                  <strong>Product:</strong> {r.productName}
                </p>
                <p>
                  <strong>Variant:</strong> {r.variantName}
                </p>
                <p>
                  <strong>Sub Variant:</strong> {r.subVariantName}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Small UI Helper Components ----
const Select = ({ placeholder, value, options, onChange }: any) => (
  <select
    className="border p-2 rounded"
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
    className="border p-2 rounded flex-1"
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
      className={`${colors[color]} text-white px-4 py-2 rounded`}
    >
      {children}
    </button>
  );
};

const Section = ({
  title,
  inputValue,
  onInputChange,
  buttonLabel,
  onSubmit,
}: any) => (
  <div className="mb-6 p-4 bg-white rounded shadow">
    <h2 className="font-semibold mb-2">{title}</h2>
    <div className="flex gap-2">
      <Input value={inputValue} onChange={onInputChange} placeholder={title} />
      <Button onClick={onSubmit} color="blue">
        {buttonLabel}
      </Button>
    </div>
  </div>
);

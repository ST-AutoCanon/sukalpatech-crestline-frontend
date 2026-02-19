// import { Outlet } from "react-router-dom";

// export default function AuthLayout() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

import { Outlet } from "react-router-dom";


export default function AuthLayout() {
  return (
    <>
      {/* Centered Login Section */}
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-16">
        {/* pt-16 prevents overlap with fixed navbar */}
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </>
  );
}

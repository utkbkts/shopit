import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useUserRoutes from "./route/UserRoutes";
import useAdminRoutes from "./route/AdminRoutes";
import NotFound from "./components/notfound/NotFound";

const App = () => {
  const userRoutes = useUserRoutes();
  const AdminRoutes = useAdminRoutes();
  return (
    <>
      <div>
        <Routes>
          {userRoutes}
          {AdminRoutes}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Toaster position="top-right" />
    </>
  );
};

export default App;

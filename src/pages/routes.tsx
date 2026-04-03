import { createBrowserRouter } from "react-router-dom";
import HomePage from "./HomePage";
import Layout from "../components/layout/Layout";
import CourseDetailsPage from "./CourseDetailsPage";
import CatalogPage from "./CatalogPage";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/courses",
        element: <CatalogPage />,
      },
      {
        path: "/courses/:id",
        element: <CourseDetailsPage />,
      },
    ],
  },
]);

export default router;

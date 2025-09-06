import { Navigate, useRoutes } from "react-router-dom";
import { Layout } from "../layouts/main";
import NotFound from "../screens/404";
import Persons from "../screens/persons/list";
import Person from "../screens/persons/details";

export default function Router() {
  return useRoutes([
    {
      path: "/",
      element: (
        <Layout />
      ),
      children: [
        {
          path: "/",
          element: <Persons />,
        },
        {
          path: "/:id",
          element: <Person />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
  ]);
}

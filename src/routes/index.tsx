import { Navigate, useRoutes, useLocation } from "react-router-dom";
import { Layout } from "../layouts/main";
import { Suspense, lazy } from "react";
import { Box, CircularProgress } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

const NotFound = lazy(() => import("../screens/404"));
const Persons = lazy(() => import("../screens/persons/list"));
const Person = lazy(() => import("../screens/persons/details"));

const Loader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const MotionWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
    style={{ width: "100%" }}
  >
    {children}
  </motion.div>
);

export default function Router() {
  const location = useLocation();

  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<Loader />}>
              <MotionWrapper>
                <Persons />
              </MotionWrapper>
            </Suspense>
          ),
        },
        {
          path: "/:id",
          element: (
            <Suspense fallback={<Loader />}>
              <MotionWrapper>
                <Person />
              </MotionWrapper>
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
    {
      path: "/404",
      element: (
        <Suspense fallback={<Loader />}>
          <MotionWrapper>
            <NotFound />
          </MotionWrapper>
        </Suspense>
      ),
    },
  ]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Box key={location.pathname}>{routes}</Box>
    </AnimatePresence>
  );
}

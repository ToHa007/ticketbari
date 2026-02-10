import { RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { router } from "./routes/router";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0b0d10",
            color: "#2dd4bf",
            borderRadius: "16px",
            border: "1px solid #0d9488",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
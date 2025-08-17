import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index";
function App() {
    return (
        <>
            <RouterProvider router={router} />
            <Toaster position="top-center" reverseOrder={false} />
        </>
    );
}

export default App;

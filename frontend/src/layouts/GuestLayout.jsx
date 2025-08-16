import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import Footer from "./Footer";
import Header from "./Header";

export default function GuestLayout() {
    const authUser = useAuthStore((state) => state.authUser);
    const fetchAuthUser = useAuthStore((state) => state.fetchAuthUser);
    const authUserLoading = useAuthStore((state) => state.authUserLoading);

    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser]);

    if (authUserLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="animate-spin text-blue-500" size={32} />
            </div>
        );
    }

    if (!authUserLoading && authUser) {
        return <Navigate to="/conversations" />;
    }

    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
}

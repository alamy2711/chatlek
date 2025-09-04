import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import Header from "./Header";

export default function ChatLayout() {
    const authUser = useAuthStore((state) => state.authUser);
    const fetchAuthUser = useAuthStore((state) => state.fetchAuthUser);
    const authUserLoading = useAuthStore((state) => state.authUserLoading);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser]);

    if (!token || (!authUserLoading && !authUser)) {
        alert(authUser);
        return <Navigate to="/signup" />;
    }
    if (authUserLoading && !authUser) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}

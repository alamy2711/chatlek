import { createBrowserRouter } from 'react-router-dom';
// Layouts
import ChatLayout from '../layouts/ChatLayout.jsx';
import DefaultLayout from '../layouts/DefaultLayout.jsx';
import GuestLayout from '../layouts/GuestLayout.jsx';
// Pages
import About from '../pages/About.jsx';
import Contact from '../pages/Contact.jsx';
import Home from '../pages/Home.jsx';
import Login from '../pages/Login.jsx';
import NotFound from '../pages/NotFound.jsx';
import Signup from '../pages/Signup.jsx';
import Conversations from '../pages/Conversations.jsx';
import Preferences from '../pages/Preferences.jsx';
import Profile from '../pages/Profile.jsx';

export const router = createBrowserRouter([
    // Default routes
    {
        path: '/',
        element: <DefaultLayout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/about',
                element: <About />,
            },
            {
                path: '/contact',
                element: <Contact />,
            },
            {
                path: '/preferences',
                element: <Preferences />,
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },

    // Guest routes for unauthenticated users (logged out)
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/signup',
                element: <Signup />,
            },
        ],
    },

    // User routes for authenticated users (logged in)
    {
        path: '/',
        element: <ChatLayout />,
        children: [
            {
                path: '/conversations',
                element: <Conversations />,
            },
            {
                path: '/profile',
                element: <Profile />,
            }
            // Will add more user-specific routes here
        ],
    },
]);

import './App.css'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import {Registration} from "./Registration.jsx";
import {SignIn} from "./SignIn.jsx";
import {Profile} from "./Profile.jsx";
import {ReadPost} from "./ReadPost.jsx";
import {UsersPosts} from "./UsersPosts.jsx";

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <Registration />,
        },
        {
            path: "/login",
            element: <SignIn />
        },
        {
            path: "/me",
            element: <Profile />
        },
        {
            path: `me/:postId/read`,
            element: <ReadPost />
        },
        {
            path: `:username/:postId/read`,
            element: <ReadPost />
        },
        {
            path: `:username`,
            element: <UsersPosts />
        }
    ]);

    return (
        <RouterProvider router={router}/>
    )
}


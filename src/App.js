import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Account from './components/Account';
import Login from './components/Login';
import SignUp from './components/SignUp';

// import Home from './components/Home';

function App() {
  return (
    <RouterProvider Router router={route} />
  );
}
const BlogLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}

const route = createBrowserRouter([
  {
    path: "/",
    element: <BlogLayout />,
    children: [
      {
        path: 'signup',
        element: <SignUp />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: '',
        element: <Home />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'account',
        element: <Account />
      },
    ]
  }
])
export default App;

import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import PrivateRoute from "./PrivateRoute";

import Vendor from "../pages/Vendor/Vendeor";
import AllTickets from "../pages/AllTickets/AllTickets";

// Dashboards
import DashboardVendor from "../Layouts/DashboardVendor"; 

// Pages
import AddTicket from "../pages/AddTicket";
import VendorHome from "../pages/Vendor/VendorHome";
import MyTickets from "../pages/Vendor/MyTickets";
import TicketDetails from "../pages/TicketDetails/TicketDetails";
import MyBookings from "../pages/MyBookings/MyBookings";
import UserDashboardLayout from "../Layouts/UserDashboardLayout";
import UserProfile from "../pages/User/UserProfile";
import ManageBookings from "../pages/Vendor/ManageBookings";
import UpdateTicket from "../pages/Vendor/UpdateTicket";
import Payment from "../pages/Payment/Payment"; 
import TransactionHistory from "../pages/TransictionHistory/TransactionHistory";
import AdminRoute from "./AdminRoute";
import ManageUsers from "../pages/ManageUsers/ManageUsers";
import ManageTickets from "../pages/ManageTickets/ManageTickets";
import AdvertiseTickets from "../pages/AdvertiseTickets/AdvertiseTickets";
import AboutUS from "../pages/AboutUS/AboutUs";
import FAQ from "../pages/FAQ/FAQ";





export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'all-tickets', element: <PrivateRoute><AllTickets /></PrivateRoute> },
      { path: 'ticket-details/:id', element: <PrivateRoute><TicketDetails /></PrivateRoute> },
      { path: 'beAVendor', element: <PrivateRoute><Vendor /></PrivateRoute> },
      {path:'about-us',element:<AboutUS></AboutUS>},
      {path:'faq',element:<FAQ></FAQ>}
    ]
  },

  // --- USER & ADMIN DASHBOARD ROUTES ---
  {
    path: '/user-dashboard',
    element: <PrivateRoute><UserDashboardLayout /></PrivateRoute>,
    children: [
      {
        index: true, 
        element: <UserProfile />
      },
      {
        path: 'my-booked-tickets',
        element: <MyBookings />
      },
      {
        path: 'transiction-history',
        element: <TransactionHistory />
      },
      {
        path: 'payment/:id',
        element: <Payment />
      },

  
      {
        path: 'manage-users',
        element: <AdminRoute><ManageUsers></ManageUsers></AdminRoute>
      },
      {
        path: 'manage-tickets',
        element: <AdminRoute><ManageTickets /></AdminRoute>
      },
      {
        path: 'advertise',
        element: <AdminRoute><AdvertiseTickets /></AdminRoute>
      }
    ]
  },

  // --- VENDOR DASHBOARD ROUTES ---
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardVendor /></PrivateRoute>,
    children: [
      { index: true, element: <VendorHome /> },
      { path: 'add-ticket', element: <AddTicket /> },
      { path: 'my-tickets', element: <MyTickets /> },
      { path: 'manage-bookings', element: <ManageBookings /> },
      { path: 'update-ticket/:id', element: <UpdateTicket /> }
    ]
  },

  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ]
  }
]);
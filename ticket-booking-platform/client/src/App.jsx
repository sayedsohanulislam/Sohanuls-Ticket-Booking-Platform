import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

import { useAuth } from "./context/AuthContext.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import AllTickets from "./pages/AllTickets.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

// User dashboard
import UserProfile from "./pages/user/Profile.jsx";
import MyBookedTickets from "./pages/user/MyBookedTickets.jsx";
import TransactionHistory from "./pages/user/TransactionHistory.jsx";

// Vendor dashboard
import VendorProfile from "./pages/vendor/Profile.jsx";
import AddTicket from "./pages/vendor/AddTicket.jsx";
import MyTickets from "./pages/vendor/MyTickets.jsx";
import RequestedBookings from "./pages/vendor/RequestedBookings.jsx";
import RevenueOverview from "./pages/vendor/Revenue.jsx";

// Admin dashboard
import AdminProfile from "./pages/admin/Profile.jsx";
import ManageTickets from "./pages/admin/ManageTickets.jsx";
import ManageUsers from "./pages/admin/ManageUsers.jsx";
import AdvertiseTickets from "./pages/admin/AdvertiseTickets.jsx";

function useUserRole() {
  const { user } = useAuth();
  return user?.role || "user";
}

function RoleBasedRedirect({ map }) {
  const role = useUserRole();
  return <Navigate to={map[role] || "/dashboard/profile"} replace />;
}

function RoleProfileRouter() {
  const role = useUserRole();
  if (role === "vendor") return <VendorProfile />;
  if (role === "admin") return <AdminProfile />;
  return <UserProfile />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="tickets" element={<AllTickets />} />
        <Route path="tickets/:id" element={<TicketDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Dashboard — protected */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <RoleBasedRedirect
                map={{
                  user: "/dashboard/bookings",
                  vendor: "/dashboard/my-tickets",
                  admin: "/dashboard/manage-tickets",
                }}
              />
            }
          />

          {/* Profile (role-aware) */}
          <Route path="profile" element={<RoleProfileRouter />} />

          {/* User pages */}
          <Route
            path="bookings"
            element={
              <ProtectedRoute roles={["user"]}>
                <MyBookedTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="transactions"
            element={
              <ProtectedRoute roles={["user"]}>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />

          {/* Vendor pages */}
          <Route
            path="add-ticket"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <AddTicket />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-tickets"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <MyTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="requests"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <RequestedBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="revenue"
            element={
              <ProtectedRoute roles={["vendor"]}>
                <RevenueOverview />
              </ProtectedRoute>
            }
          />

          {/* Admin pages */}
          <Route
            path="manage-tickets"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ManageTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="manage-users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="advertise"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdvertiseTickets />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

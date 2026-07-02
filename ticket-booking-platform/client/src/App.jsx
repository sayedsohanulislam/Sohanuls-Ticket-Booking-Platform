import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

import { useAuth } from "./context/AuthContext.jsx";

// Public views
import Home from "./views/Home.jsx";
import AllTickets from "./views/AllTickets.jsx";
import TicketDetails from "./views/TicketDetails.jsx";
import Login from "./views/Login.jsx";
import Register from "./views/Register.jsx";
import NotFound from "./views/NotFound.jsx";
import About from "./views/About.jsx";
import Contact from "./views/Contact.jsx";

// User dashboard
import UserProfile from "./views/user/Profile.jsx";
import MyBookedTickets from "./views/user/MyBookedTickets.jsx";
import TransactionHistory from "./views/user/TransactionHistory.jsx";

// Vendor dashboard
import VendorProfile from "./views/vendor/Profile.jsx";
import AddTicket from "./views/vendor/AddTicket.jsx";
import MyTickets from "./views/vendor/MyTickets.jsx";
import RequestedBookings from "./views/vendor/RequestedBookings.jsx";
import RevenueOverview from "./views/vendor/Revenue.jsx";

// Admin dashboard
import AdminProfile from "./views/admin/Profile.jsx";
import ManageTickets from "./views/admin/ManageTickets.jsx";
import ManageUsers from "./views/admin/ManageUsers.jsx";
import AdvertiseTickets from "./views/admin/AdvertiseTickets.jsx";

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

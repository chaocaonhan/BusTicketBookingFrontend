import React from "react";
import AdminDashBoard from "../components/AdminDashboard/AdminDashboard";
import Layout from "./Layout";

export const AdminPage = () => {
  return (
    <Layout>
      <AdminDashBoard></AdminDashBoard>
    </Layout>
  );
};

export default AdminPage;

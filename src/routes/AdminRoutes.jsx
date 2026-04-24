import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/modules/admin/layout/AdminLayout";

import { Home } from "@/modules/admin/pages/home/Home";
import { Login } from "@/modules/admin/pages/login/Login";

import { EditUser } from "@/modules/admin/pages/user/EditUser";
import { NewUser } from "@/modules/admin/pages/user/NewUser";
import { Users } from "@/modules/admin/pages/user/Users";

import { Cryptocurrencies } from "@/modules/admin/pages/cryptocurrency/Cryptocurrencies";
import { NewCryptocurrency } from "@/modules/admin/pages/cryptocurrency/NewCryptocurrency";
import { EditCryptocurrency } from "@/modules/admin/pages/cryptocurrency/EditCryptocurrency";

import { Services } from "@/modules/admin/pages/service/Services";
import { NewService } from "@/modules/admin/pages/service/NewService";
import { EditService } from "@/modules/admin/pages/service/EditService";

import { CatalogCategories } from "@/modules/admin/pages/catalogCategory/CatalogCategories";
import { NewCatalogCategory } from "@/modules/admin/pages/catalogCategory/NewCatalogCategory";
import { EditCatalogCategory } from "@/modules/admin/pages/catalogCategory/EditCatalogCategory";

import { Catalog } from "@/modules/admin/pages/catalog/Catalog";
import { NewCatalog } from "@/modules/admin/pages/catalog/NewCatalog";
import { EditCatalog } from "@/modules/admin/pages/catalog/EditCatalog";

import { ElectricityPrices } from "@/modules/admin/pages/electricityPrice/ElectricityPrices";
import { NewElectricityPrice } from "@/modules/admin/pages/electricityPrice/NewElectricityPrice";
import { EditElectricityPrice } from "@/modules/admin/pages/electricityPrice/EditElectricityPrice";

import { Settings } from "@/modules/admin/pages/settings/Settings";

import { Faqs } from "@/modules/admin/pages/faq/Faqs";
import { NewFaq } from "@/modules/admin/pages/faq/NewFaq";
import { EditFaq } from "@/modules/admin/pages/faq/EditFaq";

import { Orders } from "@/modules/admin/pages/order/Orders";
import { OrderDetail } from "@/modules/admin/pages/order/OrderDetail";

import PropTypes from "prop-types";
import { Navigate, Route, Routes } from "react-router-dom";

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Componente para rutas públicas
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return <Navigate to="/admin/home" replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AdminRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      

      {/* Rutas protegidas dentro del AdminLayout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/nuevo-usuario" element={<NewUser />} />
        <Route path="/usuarios/:id" element={<EditUser />} />
        <Route path="/criptomonedas" element={<Cryptocurrencies />} />
        <Route path="/nueva-criptomoneda" element={<NewCryptocurrency />} />
        <Route path="/criptomonedas/:id" element={<EditCryptocurrency />} />
        <Route path="/servicios" element={<Services />} />
        <Route path="/nuevo-servicio" element={<NewService />} />
        <Route path="/servicios/:id" element={<EditService />} />
        <Route path="/categorias" element={<CatalogCategories />} />
        <Route path="/nueva-categoria" element={<NewCatalogCategory />} />
        <Route path="/categorias/:id" element={<EditCatalogCategory />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/nuevo-producto" element={<NewCatalog />} />
        <Route path="/catalogo/:id" element={<EditCatalog />} />
        <Route path="/precios-electricidad" element={<ElectricityPrices />} />
        <Route path="/nuevo-precio-electricidad" element={<NewElectricityPrice />} />
        <Route path="/precios-electricidad/:id" element={<EditElectricityPrice />} />
        <Route path="/preguntas-frecuentes" element={<Faqs />} />
        <Route path="/nueva-pregunta-frecuente" element={<NewFaq />} />
        <Route path="/preguntas-frecuentes/:id" element={<EditFaq />} />
        <Route path="/pedidos" element={<Orders />} />
        <Route path="/pedidos/:id" element={<OrderDetail />} />
        <Route path="/configuraciones" element={<Settings />} />
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/admin/home" replace />} />
    </Routes>
  );
};

/** Public API for the admin slice. */
export { getAdminUser } from "./auth";
export { AdminNotConfigured } from "./components/admin-not-configured";
export { AdminLoginForm } from "./components/admin-login-form";
export { SignOutButton } from "./components/sign-out-button";
export { ProductTable } from "./components/product-table";
export { ProductForm } from "./components/product-form";
export { OrderTable } from "./components/order-table";
export { OrderStatusForm } from "./components/order-status-form";
export { getOrders, getOrder } from "./orders";
export type { Order, OrderItem, OrderStatus } from "./orders";

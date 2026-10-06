import {
  Circle,
  DollarSign,
  Headphones,
  LayoutDashboard,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  Truck,
  UserCircle,
  Users,
} from "lucide-react";

const icons = {
  DollarSign,
  Headphones,
  LayoutDashboard,
  LineChart,
  Package,
  Settings,
  ShoppingCart,
  TrendingUp,
  Truck,
  UserCircle,
  Users,
};

export function NavIcon({ name, className }) {
  const Icon = icons[name] || Circle;
  return <Icon className={className} aria-hidden />;
}

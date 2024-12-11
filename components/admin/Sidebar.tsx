import Link from 'next/link'
import { Users, ShoppingBag, ShoppingCart, ClipboardList, Package, Truck, CreditCard, FileText } from 'lucide-react'

const navItems = [
  { name: 'Users', href: '/admin/dashboard/users', icon: Users },
  { name: 'Products', href: '/admin/dashboard/products', icon: ShoppingBag },
  { name: 'Categories', href: '/admin/dashboard/categories', icon: Package },
  { name: 'Orders', href: '/admin/dashboard/orders', icon: ClipboardList },
  { name: 'Carts', href: '/admin/dashboard/carts', icon: ShoppingCart },
  { name: 'Inventory', href: '/admin/inventory', icon: Package },
  { name: 'Suppliers', href: '/admin/dashboard/suppliers', icon: Truck },
  { name: 'Payment Types', href: '/admin/payment-types', icon: CreditCard },
  { name: 'Invoices', href: '/admin/dashboard/invoices', icon: FileText },
]

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-gray-800">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl font-bold text-white">Admin</h1>
      </div>
      <nav className="flex-grow">
        <ul className="flex flex-col py-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center px-6 py-2 text-gray-100 hover:bg-gray-700">
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}


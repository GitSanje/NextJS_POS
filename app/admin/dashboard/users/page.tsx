
import { DataTable } from '@/components/admin/DataTable'
import { columns } from './columns'
import { getUsers } from '@/server-actions/user/index'

// async function getUsers() {
//   // This is where you'd fetch users from your database
//   // For now, we'll return mock data
//   return [
//     { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER' },
//     { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'ADMIN' },
//   ]
// }

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <DataTable columns={columns} data={users} />
    </div>
  )
}


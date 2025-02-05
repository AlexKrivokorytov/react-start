import { Suspense, useState, useEffect, useTransition } from "react"
import { createUser, fetchUsers, deleteUser } from "../../shared/api"

type User = {
  id: string
  email: string
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isPending, startTransition] = useTransition()

  const refetchUsers = () => {
    startTransition(() => {
      fetchUsers().then(setUsers)
    })
  }

  useEffect(() => {
    refetchUsers()
  }, [])

  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm refetchUsers={refetchUsers} />
      <Suspense fallback={<div>Loading...</div>}>
        <UsersList users={users} refetchUsers={refetchUsers} />
      </Suspense>
    </main>
  )
}

export function CreateUserForm({ refetchUsers }: { refetchUsers: () => void }) {
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    startTransition(async () => {
      await createUser({
        email,
        id: crypto.randomUUID(),
      })
      refetchUsers()
      setEmail("")
      setIsLoading(false)
    })
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        className="border p-2 rounded"
        value={email}
        disabled={isPending || isLoading}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        disabled={isPending || isLoading}
        type="submit"
      >
        {isLoading ? "Adding..." : "Add"}
      </button>
    </form>
  )
}

export function UsersList({ users, refetchUsers }: { users: User[], refetchUsers: () => void }) {
  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCard key={user.id} user={user} refetchUsers={refetchUsers} />
      ))}
    </div>
  )
}

export function UserCard({ user, refetchUsers }: { user: User, refetchUsers: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    startTransition(async () => {
      await deleteUser(user.id)
      refetchUsers()
      setIsLoading(false)
    })
  }

  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {user.email}
      <button
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400"
        type="button"
        onClick={handleDelete}
        disabled={isPending || isLoading}
      >
        {isLoading ? "Deleting..." : "Delete"}
      </button>
    </div>
  )
}

import { Suspense, useActionState, useOptimistic } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useUsers } from "./use-users";
import { CreateUserAction, DeleteUserAction } from "./actions";

type User = {
  id: string;
  email: string;
};

export function UsersPage() {
  const { useUsersList, createUserAction, deleteUserAction } = useUsers();
  return (
    <main className="container mx-auto p-4 pt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold underline">Users</h1>
      <CreateUserForm createUserAction={createUserAction} />
      <ErrorBoundary
        fallbackRender={(e) => (
          <div className="text-red-500">
            Something went wrong: {JSON.stringify(e)}
          </div>
        )}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <UsersList
            deleteUserAction={deleteUserAction}
            useUsersList={useUsersList}
          />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}

export function CreateUserForm({
  createUserAction,
}: {
  createUserAction: CreateUserAction;
}) {
  const [state, dispatch] = useActionState(createUserAction, {
    email: "",
  });

  const [optimisticState] = useOptimistic(state);

  return (
    <form className="flex gap-2" action={dispatch}>
      <input
        name="email"
        type="email"
        className="border p-2 rounded"
        defaultValue={optimisticState.email}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
      >
        Add
      </button>
      {optimisticState.error && <div className="text-red-500">{optimisticState.error}</div>}
    </form>
  );
}

function UsersList({
  deleteUserAction,
  useUsersList,
}: {
  useUsersList: () => User[];
  deleteUserAction: DeleteUserAction;
}) {
  const users = useUsersList();

  if (!users || users.length === 0) {
    return <div>No users found.</div>;
  }

  return (
    <div className="flex flex-col">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          deleteUserAction={deleteUserAction}
        />
      ))}
    </div>
  );
}

export function UserCard({
  user,
  deleteUserAction,
}: {
  user: User;
  deleteUserAction: DeleteUserAction;
}) {
  const [state, handleDelete] = useActionState(deleteUserAction, {});

  return (
    <div className="border p-2 m-2 rounded bg-gray-100 flex gap-2">
      {user.email}

      <form className="ml-auto">
        <input type="hidden" name="id" value={user.id} />
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto disabled:bg-gray-400"
          formAction={handleDelete}
        >
          Delete
          {state.error && <div className="text-red-500">{state.error}</div>}
        </button>
      </form>
    </div>
  );
}

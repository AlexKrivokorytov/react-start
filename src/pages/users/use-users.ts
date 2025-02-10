import { useState, startTransition, useOptimistic, use } from "react";
import { fetchUsers, User } from "../../shared/api";
import { deleteUserAction, CreateUserAction } from "./actions";

const defaultUsersPromise = fetchUsers();
export function useUsers() {
  const [usersPromise, setUsersPromise] = useState(defaultUsersPromise);
  const refetchUsers = () =>
    startTransition(() => setUsersPromise(fetchUsers()));

  const [createdUser, optimisticCreate] = useOptimistic(
    [] as User[],
    (createdUsers, user: User) => [...createdUsers, user]
  );

  const [deletedUserIds, optimisticDelete] = useOptimistic(
    [] as string[],
    (deletedUsers, id: string) => deletedUsers.concat(id)
  );

	const useUsersList = () => {
		const users = use(usersPromise);
		
		return users 
			.concat(createdUser)
			.filter((user) => !deletedUserIds.includes(user.id));
		
	}

  return {
    createUserAction: CreateUserAction({ refetchUsers, optimisticCreate }),
    deleteUserAction: deleteUserAction({ refetchUsers, optimisticDelete }),
		useUsersList,
    usersPromise,
  } as const;
}

import { createUser, deleteUser, User } from "../../shared/api";

type CreateActionState = {
  error?: string;
  email?: string;
};

export type CreateUserAction = (
  state: CreateActionState,
  formData: FormData
) => Promise<CreateActionState>;

export function CreateUserAction({
  refetchUsers,
  optimisticCreate,
}: {
  refetchUsers: () => void;
  optimisticCreate: (user: User) => void;
}): CreateUserAction {
  return async (_, formData) => {
    const email = formData.get("email") as string;

    if (email === "admin@gmail.com") {
      return { error: "Cannot create admin user", email };
    }

    try {
      const user = await createUser({ email, id: crypto.randomUUID() });
      optimisticCreate(user);
      await createUser(user);
      refetchUsers();
      return {
        email: "",
      };
    } catch (error) {
      return {
        email,
        error: "error while creating user",
      };
    }
  };
}

type deleteUserActionState = {
  error?: string;
};

export type DeleteUserAction = (
  state: deleteUserActionState,
  formData: FormData
) => Promise<deleteUserActionState>;

export function deleteUserAction({
  refetchUsers,
  optimisticDelete,
}: {
  refetchUsers: () => void;
  optimisticDelete: (id: string) => void;
}): DeleteUserAction {
  return async (_, formData) => {
    const id = formData.get("id") as string;
    try {
			optimisticDelete(id);
      await deleteUser(id);
      refetchUsers();
      return {};
    } catch (error) {
      return {
        error: "error while deleting user",
      };
    }
  };
}

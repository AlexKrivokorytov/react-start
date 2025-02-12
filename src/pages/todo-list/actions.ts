import { createTask, deleteTask, Task } from "../../shared/api";

type CreateActionState = {
	error?: string;
	title?: string;
};

export type CreateTaskAction = (
	state: CreateActionState,
	formData: FormData
) => Promise<CreateActionState>;

export function CreateTaskAction({
	refetchTasks,
	userId,
}: {
	userId: string;
	refetchTasks: () => void;
}): CreateTaskAction {
	return async (_, formData) => {
		const title = formData.get("title") as string;

		try {
			const task : Task = ({ 
			createdAt: Date.now(), 
			done: false,
			userId, 
			title, 
			id: crypto.randomUUID()
		 });
			await createTask(task);
			refetchTasks();
			return {
				title: "",
			};
		} catch (error) {
			return {
				title,
				error: "error while creating task",
			};
		}
	};
}

type deleteTaskActionState = {
	error?: string;
};

export type DeleteTaskAction = (
	state: deleteTaskActionState,
	formData: FormData
) => Promise<deleteTaskActionState>;

export function deleteTaskAction({
	refetchTasks,
}: {
	refetchTasks: () => void;
}): DeleteTaskAction {
	return async (_, formData) => {
		const id = formData.get("id") as string;
		try {
			await deleteTask(id);
			refetchTasks();
			return {};
		} catch (error) {
			return {
				error: "error while deleting task",
			};
		}
	};
}


import fs from "fs-extra"
import { spinner } from "./spinner.js"
import { tasksPath } from "./tasksPath.js"

export async function removeAllTasks() {
	spinner.start({ text: "Removing all tasks..." })
	const fileExists = fs.existsSync(tasksPath)

	if (!fileExists) {
		await fs.writeFile(tasksPath, "[]")
		return spinner.warn({
			text: "There was no tasks.json file to start with!",
		})
	}

	await fs.remove(tasksPath)
	await fs.writeFile(tasksPath, "[]")
	return spinner.success({ text: "Tasks removed with success!" })
}

import fs from "fs-extra"
import { tasksPath } from "./tasksPath.js"
import { spinner } from "./spinner.js"

export async function addTask(task, date, desc) {
	try {
		spinner.start({ text: "Adding task..." })
		// ter certeza de que o arquivo existe
		if (!fs.existsSync(tasksPath)) {
			await fs.writeFile(tasksPath, "[]")
		}

		// pegar objeto de tarefas
		const rawData = await fs.readFile(tasksPath)
		const taskList = JSON.parse(rawData)

		// adicionar tarefa nova
		const newTask = {
			task,
			date,
			desc,
		}

		taskList.push(newTask)
		// adicionar a lista modificada ao arquivo original
		await fs.writeFile(tasksPath, JSON.stringify(taskList, null, 2))
		spinner.success({ text: "Task added!" })
	} catch (error) {
		console.log(error)
		spinner.error({ text: "Oops! There was an error creating a new task." })
		process.exit(1)
	}
}

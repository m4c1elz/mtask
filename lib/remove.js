import fs from "fs-extra"
import chalk from "chalk"
import { spinner } from "./spinner.js"
import { tasksPath } from "./tasksPath.js"

export async function removeTask(id) {
	spinner.start()

	if (!fs.existsSync(tasksPath)) {
		await fs.writeFile(tasksPath, "[]")
	}

	const rawData = await fs.readFile(tasksPath)
	const taskList = await JSON.parse(rawData)

	if (!taskList[id]) {
		spinner.stop({
			text: "This task does not exist.",
			mark: chalk.yellow("!"),
		})
		return
	}

	delete taskList[id]
	// a função delete ainda deixa o espaço vazio do objeto apagado, então filtramos
	const result = taskList.filter((item) => item != null)

	await fs.writeFile(tasksPath, JSON.stringify(result, null, 2))
	spinner.success({ text: "Task removed!" })
}

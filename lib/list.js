import fs from "fs-extra"
import chalk from "chalk"
import { tasksPath } from "./tasksPath.js"

function formatDateString(data) {
	let dia = data.split("/")[0]
	let mes = data.split("/")[1]
	let ano = data.split("/")[2]

	return ano + "-" + ("0" + mes).slice(-2) + "-" + ("0" + dia).slice(-2)
	// Utilizo o .slice(-2) para garantir o formato com 2 digitos.
}

export async function listTasks() {
	// verificando se existe arquivo
	if (!fs.existsSync(tasksPath)) {
		await fs.writeFile(tasksPath, "[]")
	}
	// ler arquivo
	const rawData = await fs.readFile(tasksPath)
	// converter para objeto
	const taskList = JSON.parse(rawData)

	if (!taskList.length > 0) {
		console.log(chalk.green("There are no tasks ;)"))
		return
	}

	taskList.forEach((item, index) => {
		// pegar duas datas
		const today = new Date()
		const taskDate = new Date(formatDateString(item.date))

		// calcular a diferença em ms
		const diff = Math.abs(today.getTime() - taskDate.getTime())

		// converter pra dias
		const days = Math.ceil(diff / (1000 * 3600 * 24))

		console.log(`\nTask ID: ${index}`)
		console.log(`\nTask: ${chalk.underline.yellow.bold(item.task)}`)
		console.log(`Info: ${chalk.blue(item.desc)}`)
		console.log(chalk.bgGreen.bold(`Due to: ${item.date}`))
		console.log(`Faltam ${days} dias para a tarefa!`)
	})
	console.log("")
}

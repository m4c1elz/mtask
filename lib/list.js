import fs from "fs-extra"
import chalk from "chalk"
import { tasksPath } from "./tasksPath.js"

function formatDateString(data) {
	let day = data.split("/")[0]
	let month = data.split("/")[1]
	let year = data.split("/")[2]

	return year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2)
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
		const diff = taskDate.getTime() - today.getTime()

		// converter pra dias
		const days = Math.ceil(diff / (1000 * 3600 * 24))

		// função que define a mensagem a enviar
		function daysMessage() {
			if (days == 0) {
				return "A tarefa é para hoje!"
			}
			if (days < 0) {
				const passedDays = Math.abs(days)
				return `A tarefa já passou da data de entrega por ${
					passedDays > 1
						? `${passedDays} dias.`
						: `${passedDays} dia.`
				}`
			}

			return `Restam ${days} dias para a entrega da tarefa!`
		}

		const result = daysMessage()

		console.log(`\nTask ID: ${index}`)
		console.log(`\nTask: ${chalk.underline.yellow.bold(item.task)}`)
		console.log(`Info: ${chalk.blue(item.desc)}`)
		console.log(chalk.bgGreen.bold(`Due to: ${item.date}`))
		console.log(result)
	})
	console.log("")
}

import fs from "fs-extra"
import chalk from "chalk"
import { tasksPath } from "./tasksPath.js"
import { formatDateString } from "./formatDateString.js"

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

		const result = setDayMessage(days)

		console.log(`\nTask ID: ${index}`)
		console.log(`\nTask: ${chalk.underline.yellow.bold(item.task)}`)
		console.log(`Info: ${chalk.blue(item.desc)}`)
		logDayDiff(days, item)
		console.log(chalk.bold.magenta.underline(result))
	})
	console.log("")
}

// função que define a mensagem a enviar
function setDayMessage(dayCount) {
	// se for hoje
	if (dayCount == 0) {
		return "Today's the assingment day!"
	}
	// se já passou
	if (dayCount < 0) {
		const passedDays = Math.abs(dayCount)
		return `Assignment is ${
			passedDays > 1 ? `${passedDays} days` : `${passedDays} day`
		} late.`
	}

	// se ainda há tempo
	return `${dayCount} days left to assignment!`
}

// função que define a cor do fundo da data
function logDayDiff(dayCount, item) {
	if (dayCount <= 0) {
		console.log(chalk.bgRed.bold(`Due to: ${item.date}`))
	} else if (dayCount < 3) {
		console.log(chalk.bgYellow.bold(`Due to: ${item.date}`))
	} else {
		console.log(chalk.bgGreen.bold(`Due to: ${item.date}`))
	}
}

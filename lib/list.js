import fs from "fs-extra"
import chalk from "chalk"
import { tasksPath } from "./tasksPath.js"

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
        console.log(`\nTask ID: ${index}`)
        console.log(`\nTask: ${chalk.underline.yellow.bold(item.task)}`)
        console.log(`Info: ${chalk.blue(item.desc)}`)
        console.log(chalk.bgGreen.bold(`Due to: ${item.date}`))
    })
    console.log("")
}

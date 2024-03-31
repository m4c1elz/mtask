import fs from "fs-extra"
import { spinner } from "./spinner.js"
import { tasksPath } from "./tasksPath.js"

export async function editTask(id, info) {
    try {
        spinner.start({ text: "Editing task..." })
        if (!fs.existsSync(tasksPath)) {
            await fs.writeFile(tasksPath, "[]")
        }

        const rawData = await fs.readFile(tasksPath)

        const taskList = JSON.parse(rawData)

        if (taskList[id]) {
            Object.keys(info).forEach(key => {
                if (typeof info[key] !== undefined) {
                    taskList[id][key] = info[key]
                }
            })
        }

        await fs.writeFile(tasksPath, JSON.stringify(taskList, null, 2))
        spinner.success({ text: "Task edited!" })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

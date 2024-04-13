import fs from "fs-extra"
import { tasksPath } from "./tasksPath.js"
import { formatDateString } from "./formatDateString.js"
import { removeTask } from "./remove.js"

export async function syncTasks() {
    if (!fs.existsSync(tasksPath)) {
        // criar de novo
        await fs.writeFile(tasksPath, "[]")
    }

    const rawData = await fs.readFile(tasksPath)
    const taskList = JSON.parse(rawData)

    taskList.forEach((item, index) => {
        // verificar diferença entre hoje e a data da entrega
        const today = new Date()
        const taskDate = new Date(formatDateString(item.date))

        const diff = taskDate.getTime() - today.getTime()

        const dayDiff = Math.ceil(diff / (1000 * 3600 * 24))
        
        if (dayDiff > 0) {
          return
        }
        
        delete taskList[index]
    })
    
    const result = taskList.filter((item) => item != null)
    await fs.writeFile(tasksPath, JSON.stringify(result, null, 2))
}

#! /usr/bin/env node
import { Command } from "commander"
import { input } from "@inquirer/prompts"

import { addTask } from "../lib/add.js"
import { listTasks } from "../lib/list.js"
import { removeTask } from "../lib/remove.js"
import { removeAllTasks } from "../lib/removeAll.js"
import { editTask } from "../lib/edit.js"

const program = new Command()
program.name("mtask").description("Add school tasks.").version("0.2.0")

program
	.command("list")
	.alias("ls")
	.description("list all available tasks")
	.action(() => listTasks())

program
	.command("add")
	.alias("a")
	.description("add a new task")
	.argument("<task>", "task to deliver")
	.option("--date <date>", "specify date to assignment")
	.option("--desc <string>", "more detailed information about the assignment")
	.action(async (task, options) => {
		let { date, desc } = options

		if (!desc) {
			desc = await input({ message: "Insert task description:" })
		}

		if (!date) {
			date = await input({
				message: "Insert date to assignment (dd/mm/yyyy):",
			})
		}

		await addTask(task, date, desc)
	})

program
	.command("remove")
	.alias("rm")
	.description("removes a task")
	.argument("<id>", "the ID of the task to remove")
	.action(async (id, options) => {
		await removeTask(id)
	})

program
	.command("removeall")
	.alias("rmall")
	.description("remove all tasks")
	.action(async () => {
		await removeAllTasks()
	})

program
	.command("edit")
	.alias("e")
	.description("edit an existing task")
	.argument("<id>", "ID of desired task to edit")
	.option("-t, --task <title>", "new title for the task")
	.option("--date <date>", "new date for assignment")
	.option("--desc <string>", "new description for assignment")
	.action(async (id, options) => {
		await editTask(id, options)
	})

program.parse()

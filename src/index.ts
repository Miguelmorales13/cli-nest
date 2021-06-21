#!/usr/bin/env node
import inquirer from "inquirer";
import * as path from "path"

const logical = require("./logical");
const info = inquirer.prompt([
    {
        name: "crudClass",
        type: "input",
        message: "what is the class name to crud service?",
        default: "SequelizeCrudService"
    }, {
        name: "singularObject",
        type: "input",
        message: "what is the singular name to crud",
    }, {
        name: "pluralObject",
        type: "input",
        message: "what is the plural name to crud",
    }, {
        name: "path",
        type: "input",
        message: "what is the path where the files are located",
        default: "/"
    },
])
const generate = async () => {
    let other = true;
    const fields = []
    do {
        const answers = await inquirer.prompt({
            type: 'confirm',
            name: 'name',
            message: 'Do you want to add another field?',
            default: true
        })
        other = answers.name
        if (other) {
            fields.push(await generateQuestion())
        }

    } while (other);
    return fields
}
const generateQuestion = async () => {
    const questions = [
        {
            type: 'input',
            name: 'field',
            message: 'Field without spaces',
            filter: function (val: string) {
                return val.toLowerCase();
            },
            validate(value: string) {
                return value != ""
            }
        },
        {
            type: 'list',
            name: 'type',
            message: 'Type field',
            choices: ['number', 'string', 'boolean', 'Date',]
        },
        {
            type: 'confirm',
            name: 'required',
            message: 'Is required?',
            default: true
        }
    ]
    return await inquirer.prompt(questions)
}
const init = async () => {
    const {path: pathRelattive, pluralObject, singularObject, crudClass} = await info
    // console.log(configuration)
    const fields = await generate()
    logical.writeProvider(path.join(pathRelattive, `${pluralObject}.provider.ts`), singularObject, pluralObject)
    logical.writeService(path.join(pathRelattive, `${pluralObject}.service.ts`), singularObject, pluralObject, crudClass)
    logical.writeEntity(path.join(pathRelattive, 'entities', `${singularObject}.entity.ts`), singularObject, fields)
    logical.writeCreateDto(path.join(pathRelattive, 'dto', `create-${singularObject}.dto.ts`), singularObject, fields)
    logical.writeUpdateDto(path.join(pathRelattive, 'dto', `update-${singularObject}.dto.ts`), singularObject)
    logical.writeModule(path.join(pathRelattive, `${pluralObject}.module.ts`), pluralObject)
    // const fileContent = await files.readFile(path.join(`${configuration.path}${configuration.pluralObject}.controller.ts`))
    // console.log(fileContent)
    // files.writeFile(path.join(`${configuration.path}${configuration.pluralObject}.provider.ts`), "kjdsbfuhdsvbuhfsdvbiuhfbdsihbfuysdbfyubvuysdbfyubdsyufbyu")
}

init().then()
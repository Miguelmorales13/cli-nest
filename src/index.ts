#!/usr/bin/env node
import inquirer from "inquirer";
import * as path from "path"
import logical from "./logical";

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
    const {path: pathRelative, pluralObject, singularObject, crudClass} = await info
    // console.log(configuration)
    const fields = await generate()
    logical.writeProvider(path.join(process.cwd(), pathRelative, `${pluralObject}.provider.ts`), singularObject, pluralObject)
    logical.writeService(path.join(process.cwd(), pathRelative, `${pluralObject}.service.ts`), singularObject, pluralObject, crudClass)
    logical.writeEntity(path.join(process.cwd(), pathRelative, 'entities', `${singularObject}.entity.ts`), singularObject, fields)
    logical.writeCreateDto(path.join(process.cwd(), pathRelative, 'dto', `create-${singularObject}.dto.ts`), singularObject, fields)
    logical.writeUpdateDto(path.join(process.cwd(), pathRelative, 'dto', `update-${singularObject}.dto.ts`), singularObject)
    await logical.writeModule(path.join(process.cwd(), pathRelative, `${pluralObject}.module.ts`), pluralObject)
    // const fileContent = await files.readFile(path.join(`${configuration.path}${configuration.pluralObject}.controller.ts`))
    // console.log(fileContent)
    // files.writeFile(path.join(`${configuration.path}${configuration.pluralObject}.provider.ts`), "kjdsbfuhdsvbuhfsdvbiuhfbdsihbfuysdbfyubvuysdbfyubdsyufbyu")
}

init().then()
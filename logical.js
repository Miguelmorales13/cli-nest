const files = require("./files")
const helpers = require("./helpers")
module.exports = {
    writeProvider(path, singular, plural) {
        files.writeFile(path, `
import { ${helpers.capitalize(singular)} } from './entities/${singular}.entity';

export const ${plural}Providers = [
    {
        provide: '${plural.toUpperCase()}_PROVIDER',
        useValue: ${helpers.capitalize(singular)},
    },
];
        `, (err) => {
            if (err) console.log(err)
        })
    },
    writeService(path,singular,plural,className){
        files.writeFile(path, `
import { Inject, Injectable } from '@nestjs/common';
import { Create${helpers.capitalize(singular)}Dto } from './dto/create-${singular}.dto';
import { Update${helpers.capitalize(singular)}Dto } from './dto/update-${singular}.dto';
import { ${className} } from '../crud/${className}';
import { ${helpers.capitalize(singular)} } from './entities/${singular}.entity';

@Injectable()
export class ${helpers.capitalize(plural)}Service extends ${className}<
  ${helpers.capitalize(singular)},
  Create${helpers.capitalize(singular)}Dto,
  Update${helpers.capitalize(singular)}Dto
> {
  constructor(
    @Inject('${plural.toUpperCase()}_PROVIDER') private readonly ${plural}: typeof ${helpers.capitalize(singular)},
  ) {
    super(${plural});
  }
}
`,(err) => {
    if (err) console.log(err)
})

    },
    writeEntity(path,singular,fields){
        const fieldsGenerated=fields.map(field=>{
            return `
    @Column${fields.required?'({allowNull:false})':''}
    ${field.field}?: ${field.type};`
        }).join("")
        files.writeFile(path, `
import { Column, Table } from 'sequelize-typescript';
import { Base } from '../../../databases/entities/base';

@Table({
  underscored: true,
  paranoid: true,
  timestamps: true,
})
export class ${helpers.capitalize(singular)} extends Base<${helpers.capitalize(singular)}> {
  ${fieldsGenerated}
}`,
(err) => {
    if (err) console.log(err)
})      

    },
    writeCreateDto(path,singular,fields){
        const hasRequiredNumber=fields.find(field=>field.required&&field.type=='number')
        const hasRequiredString=fields.find(field=>field.required&&field.type=='string')
        const hasRequiredBoolean=fields.find(field=>field.required&&field.type=='boolean')
        const fieldsGenerated=fields.map(field=>{
            return `
    ${field.required? '@Is'+helpers.capitalize(field.type)+'()':''}
    @ApiProperty()
    ${field.field}?: ${field.type};`
        }).join("")
        files.writeFile(path, `
import { Create${helpers.capitalize(singular)}Dto } from './create-${singular}.dto';
import { 
    ${hasRequiredNumber?'IsNumber,':''}
    ${hasRequiredString?'IsString,':''}
    ${hasRequiredBoolean?'IsBoolean':''} 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Create${helpers.capitalize(singular)}Dto  {
    ${fieldsGenerated}
}
        `,
(err) => {
    if (err) console.log(err)
})      

    },
    writeUpdateDto(path,singular){
        files.writeFile(path, `
import { Create${helpers.capitalize(singular)}Dto } from './create-${singular}.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Update${helpers.capitalize(singular)}Dto extends Create${helpers.capitalize(singular)}Dto {
    @IsNumber()
    @ApiProperty()
    id?: number;
    createdAt?: string;
    updatedAt?: string;
}
        `,
(err) => {
    if (err) console.log(err)
})      

    },
    async writeModule(path,plural){
        let content = await files.readFile(path)
        content =content.replace(/.controller';/g, `.controller';
import { ${plural}Providers } from './${plural}.provider';`)
        content =content.replace(/Service\]/g, `Service,...${plural}Providers]`)
        files.writeFile(path, content,
        (err) => {
            if (err) console.log(err)
        }) 
    }
}
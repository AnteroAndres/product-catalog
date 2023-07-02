import { registerEnumType } from "@nestjs/graphql";


export enum ValidRoles{
    admin = 'admin',
    user = 'user',
    superUser = 'superUser'

}

registerEnumType(ValidRoles, {name:'ValidRoles', description:'estos son los roles permitidos'})
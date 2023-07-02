import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

import { Item } from './../items/entities/item.entity';
import { User } from './../users/entities/user.entity';
import { ListItem } from './../list-item/entities/list-item.entity';
import { List } from './../lists/entities/list.entity';

import { UsersService } from './../users/users.service';
import { ItemsService } from './../items/items.service';
import { ListsService } from './../lists/lists.service';
import { ListItemService } from './../list-item/list-item.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService:ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository:Repository<Item>,
        @InjectRepository(User)
        private readonly usersRepository:Repository<User>,
        @InjectRepository(ListItem)
        private readonly listItemsRepository:Repository<ListItem>,
        @InjectRepository(List)
        private readonly listsRepository:Repository<List>,

        private readonly usersService:UsersService,
        private readonly itemsService:ItemsService,
        private readonly listsService:ListsService,
        private readonly listItemsService:ListItemService,


    ){
        this.isProd = configService.get('STATE') ==='prod';
    }

    async executeSeed(){
        
        if(this.isProd){
            throw new UnauthorizedException('We cannot run Seed on prod');
        }
     //Borrar todo, limpiar la base de datos
        await this.deleteDatabase();
     //Cargar usuarios
       const user =  await this.loadUsers();
     
     //crear items
        await this.loadItems(user);
    //crear listas
        const list = await this.loadLists(user);
    //crearlistitems
        const items = await this.itemsService.findAll(user, { limit: 15,offset:0},{});
        await this.loadListItems(list,items)
        return true;
    }

    async deleteDatabase(){
        //LISTITEMS 
        await this.listItemsRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
        //LISTs
        await this.listsRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
        //borrar items
        await this.itemsRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
        //borrar users
        await this.usersRepository.createQueryBuilder()
        .delete()
        .where({})
        .execute();
    }
    async loadUsers():Promise<User>{
        const users =[];
        for(const user of SEED_USERS){
            users.push(await this.usersService.create(user))
        }
        return users[0];
    }

    async loadItems(user :User):Promise<void>{
        const itemsPromises =[];

        for (const item of SEED_ITEMS) {
            itemsPromises.push(this.itemsService.create(item, user));

        }
        await Promise.all(itemsPromises)

    }

    async loadLists(user:User):Promise<List>{
        const lists =[];
        for(const list of SEED_LISTS){
            lists.push(await this.listsService.create(list, user))
        }
        return lists[0];
    }

    async loadListItems(list:List, items:Item[]){
        for (const item of items) {
            this.listItemsService.create({
                quantity: Math.round(Math.random() *10),
                completed: Math.round(Math.random() *1) === 0 ? false:true,
                listId: list.id,
                itemId: item.id
            })
        }
    }
}

#!/usr/bin/env node

import chalk from 'chalk';
import { input, select, checkbox } from '@inquirer/prompts';
import gradient from 'gradient-string';
import chalkAnimation from 'chalk-animation';
import figlet from 'figlet';
import { createSpinner } from 'nanospinner';
import fs from 'fs';
import { db } from './db.mjs';

// let content = `{
//     "data" : [
//     ]
// }`;
 



function updateDB(jsonContent){
    try {
        fs.writeFileSync('./db.json', jsonContent, 'utf-8');
        // file written successfully
    } catch (err) {
        console.error(err);
    }
}

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function app () {

    const op = await select({
        message : `Select operation`,
        choices : [
            {
                name: 'create',
                value: 'create'
            },
            {
                name: 'read',
                value: 'read'
            },
            {
                name: 'update',
                value: 'update'
            },
            {
                name: 'delete',
                value: 'delete'
            },
            {
                name: 'exit',
                value: 'exit'
            }
        ]
    })

    switch (op) {
        case "create" : await createOp();
        case "read" : await readOp();
        case "delete" : await deleteOp();
        case "exit" : {
            console.log(`\n${chalk.bgBlue('~ See you soon ~')}\n`)
            process.exit(1);
        }
    }

}

async function welcome () {
    figlet("Movies CRUD", function (err,data) {
        if(err) {
            console.log("Something went wrong");
            console.error(err);
            process.exit(1);
        }
        console.log(gradient.rainbow(data));
    })

    await sleep();
}

async function createOp () {
    const name = await input({message : "Enter movie name"});

    const description = await input({message : "Enter movie description"});

    const category = await checkbox({
        message : `Select movie category of ${name}`,
        choices : [
            {
                name: 'romantic',
                value: 'romantic'
            },
            {
                name: 'comedy',
                value: 'comedy'
            },
            {
                name: 'action',
                value: 'action'
            }
        ]
    })

    const newMovie = {
        name : name,
        description : description,
        category : category
    }

    const spinner = createSpinner('Loading').start();
    await sleep();

    if(db.data.push(newMovie)){
        spinner.success({text: `${name} is successfully saved.`})
    }

    const jsonContent = JSON.stringify(db);
    updateDB(jsonContent);

    await app();
}

async function readOp () {
    console.log(db.data);
    await app();
}

async function deleteOp () {
    const nameList = db.data.map((obj) => {
        return {name: obj.name, value:obj.name}
    });
    const selectedMovie = await select({
        message : `Select movie you want to delete`,
        choices : nameList
    })

    const foundIndex = db.data.findIndex((obj) => obj.name === selectedMovie );

    if(foundIndex !== -1) {
        const spinner = createSpinner('Loading').start();
        await sleep();

        if(db.data.splice(foundIndex,1)){
            spinner.success({text: `${selectedMovie} is successfully deleted.`})
        }
    }
    
    const jsonContent = JSON.stringify(db);
    updateDB(jsonContent);

    await app();
}

await welcome();
await app();

#!/usr/bin/env node
/* eslint-disable no-console*/
'use strict'
const shell = require('shelljs')
const path = require('path')
const figlet = require('figlet')
const chalk = require('chalk')

const pkjson = require('./package.json')

const positionOfArg = 2
const args = process.argv.slice(positionOfArg).join(' ')
const script = path.resolve(__dirname, '../cli-scripts/addTaxInfo.js')
const path2bunyan = path.resolve(__dirname, '..', 'node_modules/.bin/bunyan')

const splash = figlet.textSync('bitkJS.addTaxInfo', {horizontalLayout: 'fitted'})
console.log(chalk.cyan(splash))
console.log(`\t\t\t\t\t\t\t            ${chalk.cyan('bitkJS-' + pkjson.version)}`)
console.log(chalk.red('\t\t\t\t\t\t\t\t\t   by Davi Ortega'))
shell.exec('node ' + script + ' ' + args + ' | ' + path2bunyan + ' --color')

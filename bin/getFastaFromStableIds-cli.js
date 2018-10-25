#!/usr/bin/env node
'use strict'
const shell = require('shelljs')
const path = require('path')
const figlet = require('figlet')
const chalk = require('chalk')

const args = process.argv.slice(2).join(' ')
const script = path.resolve(__dirname, '../cli-scripts/getFasta.js')
const path2bunyan = path.resolve(__dirname, '..', 'node_modules/.bin/bunyan')

const splash = figlet.textSync('bitkJS-getFasta', {horizontalLayout: 'fitted'})
console.log(chalk.cyan(splash))
console.log(chalk.red('\t\t\t\t\t\t\t   by Davi Ortega'))

shell.exec('node ' + script + ' ' + args + ' | ' + path2bunyan + ' --color')

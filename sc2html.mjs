#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs'

let input_file = process.argv[2]
let input_content = readFileSync(input_file, {encoding: 'utf8'})
let input_lines = input_content.split('\n')

let output_lines = []
for (let line of input_lines) {
	if (!line) continue
	if (line.startsWith('Date')) continue

	let fields = line.split(', ')
	let date = fields[0]
	let time = fields[1].slice(0, 5)
	let last = fields[5]

	output_lines.push(`${date} ${time} ${last}`)
}

let output_content = `\
<!DOCTYPE html>
<style>body {font-size: 8px;}
@media print {#content {column-count: 6;}}
</style>
<pre id="content">
${output_lines.join('\n')}
</pre>
`

let output_file = `${input_file}.html`
writeFileSync(output_file, output_content)

#!/usr/bin/env node

import {readFileSync, writeFileSync} from 'node:fs'

let input_file = process.argv[2]
let input_content = readFileSync(input_file, {encoding: 'utf8'})
let input_lines = input_content.split('\n')

let output_years = {}
for (let line of input_lines) {
	if (!line) continue
	if (line.startsWith('Date')) continue

	let fields = line.split(', ')
	let date = fields[0]
	let time = fields[1].slice(0, 5)
	let last = fields[5]

	let year = date.slice(0, 4)

	if (!output_years[year]) output_years[year] = []
	output_years[year].push(`${date} ${time} ${last}`)
}

let output_content_pre = `\
<!DOCTYPE html>
<style>body {font-size: 8px;}
@media print {#content {column-count: 6;}}
</style>
<pre id="content">
`
let output_content_post = `\
</pre>
`

for (let year in output_years) {
	let output_file = `${input_file}.${year}.html`
	let output_content = output_content_pre + output_years[year].join('\n') + output_content_post
	writeFileSync(output_file, output_content)
}

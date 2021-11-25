const fs = require('fs')
const papa = require('papaparse')

function parse (input_stream) {
    return new Promise(function (resolve) {
        papa.parse(input_stream, { header: true, complete: resolve })
    })
}

function transform (parse_result) {
    let transform = []
    for (let i of parse_result.data) {
        const date = i["Date"]
        const time = i[" Time"]
        const quote = i[" Last"]

        const date_transform = date.trim()
        const time_transform = time.trim().slice(0, -3)
        const quote_transform = quote.trim()

        transform.push({
            date: date_transform,
            time: time_transform,
            quote: quote_transform,
        })
    }
    return transform
}

function template (transform_result) {
    const template = `\
<!doctype html>
<style>
body {
    font-family: monospace;
    font-size: 10px;
}
tr {
    line-height: 0.8em;
}
td:last-child {
    padding-left: 1em;
}
@media print {
    #content {
        column-count: 4;
    }
}
</style>
<div id="content">
<table>
${transform_result.map(i => `<tr><td>${i.date}</td><td>${i.time}</td><td>${i.quote}</td></tr>`).join("\n")}
</table>
</div>
`
    return template
}

async function main () {
    const input_path = process.argv[2]
    const input_stream = fs.createReadStream(input_path)
    const parse_result = await parse(input_stream)
    const transform_result = transform(parse_result)
    const template_result = template(transform_result)
    const output_path = input_path + ".html"
    const output_stream = fs.writeFileSync(output_path, template_result)
}

main()

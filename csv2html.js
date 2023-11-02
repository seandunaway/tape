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
    font-size: 8px;
}
@media print {
    #content {
        column-count: 6;
    }
}
</style>
<pre id="content">
${transform_result.map(i => `${i.date} ${i.time} ${i.quote}`).join("\n")}
</pre>
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

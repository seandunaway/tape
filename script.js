function yf_config (object) {
    let config = {
        symbol: "ES=F",
        interval: "1d",
        range: "10y",
    }
    for (i in object) {
        if (object.i)
            config.i = object.i
    }
    return config
}

function yf_url (yf_config) {
    const url = [
        "https://query1.finance.yahoo.com/v8/finance/chart/", yf_config.symbol, "?",
        "&interval=", yf_config.interval,
        "&range=", yf_config.range,
    ]
    const url_join = url.join("")
    return url_join
}

async function yf_response (yf_url) {
    const response = await fetch(yf_url)
    return response
}

async function yf_json (yf_response) {
    const json = await yf_response.json()
    return json
}

function yf_result (yf_json) {
    if (!yf_json["chart"]["result"])
        return { symbol: yf_json["chart"]["error"]["code"], length: 0, }

    const root = yf_json["chart"]["result"][0]
    const result = {
        symbol: root["meta"]["symbol"],
        length: root["timestamp"].length,
        timestamp: root["timestamp"],
        quote: root["indicators"]["quote"][0]["close"],
        pricehint: root["meta"]["priceHint"],
    }
    return result
}

function yf_map (yf_result) {
    let map = new Map()
    for (let i = 0; i < yf_result.length; i++) {
        const date = new Date(yf_result.timestamp[i] * 1000)
        const quote = yf_result.quote[i]

        if (!date || !quote)
            continue

        map.set(date, quote)
    }
    return map
}

function util_date_format (date) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()

    const month_pad = month.toString().padStart(2, "0")
    const day_pad = day.toString().padStart(2, "0")

    const date_format = `${month_pad}/${day_pad}/${year}`
    return date_format
}

function util_quote_format (quote, yf_result_pricehint = 2) {
    const quote_format = quote.toFixed(yf_result_pricehint)
    return quote_format
}

function horizontal_scroll (selector) {
    const element = document.querySelector(selector)
    element.scrollLeft = element.scrollWidth
    element.addEventListener("wheel", function (event) {
        element.scrollLeft += event.deltaY < 0 ? -window.innerWidth : window.innerWidth
    })
}


window.addEventListener("load", async function main () {
    const search = location.search.substring(1)
    const config = yf_config({ symbol: search })
    const url = yf_url(config)
    const response = await yf_response(url)
    const json = await yf_json(response)
    const result = yf_result(json)
    const map = yf_map(result)

    document.title = result.symbol

    let table_data = ""
    for (let i of map.entries()) {
        const date = i[0]
        const quote = i[1]

        const date_format = util_date_format(date)
        const quote_format = util_quote_format(quote, result.pricehint)

        table_data += `<tr><td>${date_format}</td><td>${quote_format}</td></tr>\n`
    }
    const table = document.querySelector("table")
    table.innerHTML = `<tbody>${table_data}</tbody>`

    horizontal_scroll("#content")
})

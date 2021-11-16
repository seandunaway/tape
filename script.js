function yf_config (object) {
	const config = {
		symbol: "",
		interval: "1d",
		range: "1y",
		...object,
	}
    return config
}

function yf_url (yf_config) {
	const url = [
	    "https://query1.finance.yahoo.com/v8/finance/chart/", yf_config.symbol,
	    "?interval=", yf_config.interval,
	    "&range=", yf_config.range,
	].join("")
	return url
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
	const root = yf_json["chart"]["result"][0]
	const result = {
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
		const key = new Date(yf_result.timestamp[i] * 1000)
        const value = yf_result.quote[i].toFixed(yf_result.pricehint)
		map.set(key, value)
	}
	return map
}

// @todo: yf_map_format


function date_format (date) {
    const month = date.getMonth() + 1
    const day = date.getDate()
    const year = date.getFullYear()

    const month_pad = month.toString().padStart(2, "0")
    const day_pad = day.toString().padStart(2, "0")

    return `${month_pad}/${day_pad}/${year}`
}


(async function main () {
    const config = yf_config({ symbol: "AAPL" })
    const url = yf_url(config)
    const response = await yf_response(url)
    const json = await yf_json(response)
    const result = yf_result(json)
    const map = yf_map(result)

    const table = document.querySelector("#table tbody")
    for (let i of map.entries()) {
		const date = date_format(i[0])
		const quote = i[1]
        table.innerHTML += `<tr><td>${date}</td><td>${quote}</td></tr>\n`
    }

	console.log(map)
})()

(async function () {
	const response = await fetch("https://query1.finance.yahoo.com/v8/finance/chart/TSLA?interval=1d&range=10y");
	console.log(response);
})()
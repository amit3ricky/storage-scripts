let axios = require("axios");
let goldStorage = require('./storageContainers/gold.js');

async function getPricesUrl(url){
	try {
		const {data} = await axios.get("https://steamcommunity.com/market/priceoverview/?appid=730&country=IN&currency=24&market_hash_name=" + encodeURI(url));
		return data;
	} catch (err) {
		console.log("hello error--->",err);
	}
}

async function getPrices(hashArray){
	let finalArray = [];

	for (i = 0; i < hashArray.length; i++) {
		let data = await getPricesUrl(hashArray[i].hashName);
		console.log("Data fetched for ",hashArray[i].hashName);
		let tempObject = {
			'name' : hashArray[i].hashName,
			'price': data?priceFormat(data.lowest_price):0,
			'quantity': hashArray[i].quantity,
			'totalPrice' : data?priceFormat(data.lowest_price)*hashArray[i].quantity:0,
			'afterTaxTotal' : data?priceFormat(data.lowest_price)*hashArray[i].quantity*0.87:0
		}
		finalArray.push(tempObject)
	}
	return finalArray;
}

function priceFormat(priceString){
	let numberArray  = priceString.split(" ");
	let numberPrice = numberArray[1];
	let newString = numberPrice.replace(',', '');
	let floatValue = parseFloat(newString);
	return floatValue;
}

async function backend(){
	let hashArray = goldStorage.hashArray
	let storageData = await getPrices(hashArray);
	let total = 0;
	let totalval = 0;
	storageData.forEach(x=>{
		total+=x.totalPrice
		totalval+=x.quantity
	})
	let finalData = {
		StorageValue : parseInt(total),
		AfterTax: parseInt(total*0.87),
		Count: totalval,
		Items: storageData
	}
	console.log("Final data--->", finalData);
}

backend();


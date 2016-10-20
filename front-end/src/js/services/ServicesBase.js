import Promise from 'bluebird';
import ENV from '../../config.js';
import request from 'superagent';
import qs from 'qs'

export default class ServicesBase {
	callPostServices(path, data) {
		//todo: call reject on the promise when something is going bad.

		let sendingData = data;
		return new Promise((resolve, reject) => {
			var urlFinal = ENV().baseServicesURL + path;
			return request.post(urlFinal).withCredentials().send(sendingData).then(function(response) {
				let dataR = JSON.parse(response.text);
				if (response.statusCode == 200) {
					resolve(dataR.data);
				}
				else {
					reject(dataR.data);
				}
			});
		});
	}

	callGetServices(path, query) {
		var urlFinal = ENV().baseServicesURL + path;

		let queryData = query;
		return new Promise((resolve, reject) => {
			return request.get(urlFinal).withCredentials().query(qs.stringify(queryData, { encode: false })).then(function(response) {
				let dataR = JSON.parse(response.text);
				if (response.statusCode == 200) {
					if (dataR.hasOwnProperty('data'))
						resolve(dataR.data);
					else
						resolve();
				} else {
					if (dataR.hasOwnProperty('data'))
						reject(dataR.data);
					else
						reject();
				}
			})
		});
	}

	callDeleteServices(path, query) {
		var urlFinal = ENV().baseServicesURL + path;

		let queryData = query;
		return new Promise((resolve, reject) => {
			return request.del(urlFinal).withCredentials().send(queryData).then(function(response) {
				let dataR = JSON.parse(response.text);
				if (response.statusCode == 200) {
					if (dataR.hasOwnProperty('data'))
						resolve(dataR.data);
					else
						resolve();
				} else {
					if (dataR.hasOwnProperty('data'))
						reject(dataR.data);
					else
						reject();
				}
			})
		});
	}

	callPutServices(path, data) {
		//todo: call reject on the promise when something is going bad.

		let sendingData = data;
		return new Promise((resolve, reject) => {
			var urlFinal = ENV().baseServicesURL + path;
			return request.put(urlFinal).withCredentials().send(sendingData).then(function(response) {
				let dataR = JSON.parse(response.text);
				if (response.statusCode == 200) {
					resolve(dataR.data);
				}
				else {
					reject(dataR.data);
				}
			});
		});
	}
}
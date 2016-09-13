import Promise from 'bluebird';
import ENV from '../../config.js';
import request from 'superagent';

export default class ServicesBase {
	callPostServices(path, data) {
		//todo: call reject on the promise when something is going bad.

		let sendingData = data;
		return new Promise((resolve, reject) => {
			var urlFinal = ENV().baseServicesURL + path;
			return request.post(urlFinal).send(sendingData).then(function(response) {
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

	callGetServices(path) {
		var urlFinal = ENV().baseServicesURL + path;

		return new Promise((resolve, reject) => {
			return request.get(urlFinal).withCredentials().then(function(response) {
				console.log("Response", response);

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
}
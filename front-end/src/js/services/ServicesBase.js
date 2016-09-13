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
				data = JSON.parse(response.text);
				if (response.statusCode == 200) {
					resolve(data.data);
				}
				else {
					reject(data.data);
				}
			});
		});
	}

	callGetServices(path) {
		var urlFinal = ENV().baseServicesURL + path;

		return new Promise((resolve, reject) => {
			return request.get(urlFinal).withCredentials().then(function(response) {
				console.log("Response", response);

				data = JSON.parse(response.text);
				if (response.statusCode == 200) {
					resolve(data.data);
				} else {
					reject(data.data);
				}
			})
		});
	}
}
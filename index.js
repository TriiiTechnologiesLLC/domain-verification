const metafetch = require('metafetch');
const dns = require("dns");
const parser = require('getdomain');
const axios = require('axios');

const DomainVerification = (function() {
	let htmlVerification = function (domain_url, domain_html_name, hash_value) {
		const original_args = arguments;
		return new Promise(function (resolve, reject) {
			if (original_args.length === 3) {

				const obj = {};
				obj.verified = "htmlVerification";
				const url = domain_url + '/' + domain_html_name + '.html';

				axios.get(url)
					.then(response => {
						if (hash_value === response.data) {
							obj.status = true;
						} else {
							obj.status = false;
						}
						resolve(obj);
					})
					.catch(error => {
						obj.status = false;
						resolve(obj);
					});
			} else {
				reject('Mismatch arguments');
			}
		});
	};

	const txtVerification = function (domain_url, domain_key, domain_value) {
		const original_args = arguments;
		return new Promise(function (resolve, reject) {
			if (original_args.length === 3) {
				const obj = {};
				obj.verified = "txtVerification";
				const domain = parser.hostname(domain_url);
				dns.resolveTxt(domain, function (error, records) {
					if (records === undefined) {
						obj.status = false;
						resolve(obj);
					} else {
						const success = [];

						let expected = domain_key + '=' + domain_value;

						if(domain_key === "@") {
							expected = domain_value;
						}

						records.forEach(function (record) {
							if (expected === record[0]) {
								success.push(obj.status);
							}
						});

						if (success.length > 0) {
							obj.status = true;
							resolve(obj);
						} else {
							obj.status = false;
							resolve(obj);
						}
					}
				});
			} else {
				reject('Mismatch arguments')
			}
		});
	};

	const metaTagVerification = function (domain_url, domain_key, domain_value) {
		const original_args = arguments;
		return new Promise(function (resolve, reject) {
			const obj = {};
			obj.verified = "metaTagVerification";

			if (original_args.length === 3) {
				metafetch.fetch(domain_url, function (err, result) {
					if (err) {
						obj.status = false;
						resolve(obj);
					} else {
						const check_key = result.meta[domain_key];
						if (check_key !== undefined) {
							if (check_key === domain_value) {
								obj.status = true;
								resolve(obj);
							} else {
								obj.status = false;
								resolve(obj);
							}
						} else {
							obj.status = false;
							resolve(obj);
						}
					}
				});
			} else {
				reject('Mismatch arguments');
			}
		});
	};

	const verifyAll = function (domain_url, domain_key, domain_value, domain_html_name, hash_value) {
		const original_args = arguments;
		return new Promise(function (resolve, reject) {
			const obj = {};
			const success = [];
			const failure = [];
			if (original_args.length === 5) {
				Promise.all([
					htmlVerification(domain_url, domain_html_name, hash_value),
					txtVerification(domain_url, domain_key, domain_value),
					metaTagVerification(domain_url, domain_key, domain_value)
				]).then(results_data => {
					results_data.forEach(data => {
						if (data.status) {
							success.push(data.verified);
						} else {
							failure.push(data.verified);
						}
					});
					if (success.length > 0) {
						obj.status = true;
						obj.verified = success;
					} else {
						obj.status = false;
						obj.verified = [];
					}
					resolve(obj);
				}).catch(error => {
					reject(error);
				});
			} else {
				reject('Mismatch arguments');
			}
		});
	};


	return {
		html: htmlVerification,
		txt: txtVerification,
		metatag: metaTagVerification,
		all:verifyAll
	};

  })();

  module.exports = DomainVerification;
const util = require('util');
const dns = require('dns');
const axios = require('axios');
const metafetch = require('metafetch');

const fetchMeta = metafetch.fetch.length === 2
	? util.promisify(metafetch.fetch)
	: metafetch.fetch;

async function htmlVerification(domain_url, domain_html_name, hash_value) {
	if (arguments.length < 3) return Promise.reject('Mismatch arguments');

	const url = new URL(`${domain_html_name}.html`, domain_url).href;
	try {
		const response = await axios.get(url, { timeout: 5000 });
		return { verified: 'htmlVerification', status: response.data === hash_value };
	} catch {
		return { verified: 'htmlVerification', status: false };
	}
}

async function txtVerification(domain_url, domain_key, domain_value) {
	if (arguments.length < 3) return Promise.reject('Mismatch arguments');

	const hostname = new URL(domain_url).hostname;
	const expected = domain_key === '@' ? domain_value : `${domain_key}=${domain_value}`;

	try {
		const records = await dns.promises.resolveTxt(hostname);
		const status = records.some(r => r[0] === expected);
		return { verified: 'txtVerification', status };
	} catch {
		return { verified: 'txtVerification', status: false };
	}
}

async function metaTagVerification(domain_url, domain_key, domain_value) {
	if (arguments.length < 3) return Promise.reject('Mismatch arguments');

	try {
		const result = await fetchMeta(domain_url);
		const checkKey = result.meta?.[domain_key];
		const status = checkKey !== undefined && checkKey === domain_value;
		return { verified: 'metaTagVerification', status };
	} catch {
		return { verified: 'metaTagVerification', status: false };
	}
}

async function verifyAll(domain_url, domain_key, domain_value, domain_html_name, hash_value) {
	if (arguments.length < 5) return Promise.reject('Mismatch arguments');

	const [htmlRes, txtRes, metaRes] = await Promise.all([
		htmlVerification(domain_url, domain_html_name, hash_value),
		txtVerification(domain_url, domain_key, domain_value),
		metaTagVerification(domain_url, domain_key, domain_value)
	]);

	const success = [];
	if (htmlRes.status) success.push('htmlVerification');
	if (txtRes.status) success.push('txtVerification');
	if (metaRes.status) success.push('metaTagVerification');

	return { status: success.length > 0, verified: success };
}

module.exports = {
	html: htmlVerification,
	txt: txtVerification,
	metatag: metaTagVerification,
	all: verifyAll
};
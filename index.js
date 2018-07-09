"use strict";

var metafetch = require('metafetch');
var request = require('request');
var Promise = require("bluebird");
var dns = require("dns");

var DomainVerification = (function() {
	
  
	var htmlVerification = function(domain_url,domain_html_name,hash_value) {
		var original_args = arguments;
		return new Promise(function(resolve,reject){
			if(original_args.length == 3)
			{
				var obj = {};
				obj.verified = "Html Verification";
				var url = domain_url+'/'+domain_html_name+'.html';
				var options = {
					method: 'GET',
					url: url
				}
				request(options,function(error,response,body){
					if(error)
					{
						obj.status = false;
						resolve(obj);
					} else {
						if(hash_value == body)
						{
							obj.status = true;
							resolve(obj);
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
	}
  
	var txtVerification = function(domain_url,domain_key,domain_value) {
		var original_args = arguments;
		return new Promise(function (resolve,reject){
			if(original_args.length == 3){
				var obj = {};
				obj.verified = "Txt Verification";
				dns.resolveTxt(domain_url, function(error,records){
					if(records == undefined)
					{
						obj.status = false;
						resolve(obj);
					} else {
						records.forEach(function(record){
							var expected = domain_key+'='+domain_value;
							if(expected == record[0])
							{
								obj.status = true;
								resolve(obj);
							}
							else {
								obj.status = false;
								resolve(obj);
							}				
						});
					}
				});
			}
			else {
				reject('Mismatch arguments')
			}
	  });
	}
  
	var metaTagVerification = function(domain_url,domain_key,domain_value) {
		var original_args = arguments;
		return new Promise(function(resolve,reject){
			var obj = {};
				obj.verified = "Meta tag Verification";

			if(original_args.length == 3)
			{
				metafetch.fetch(domain_url,function(err,result){
					if(err)
					{
						obj.status = false;
						resolve(obj);
					} else {
						var check_key = result.meta[domain_key];
						if( check_key != undefined)
						{
							if(check_key === domain_value)
							{
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

	var verifyAll = function(domain_url,domain_key,domain_value,domain_html_name,hash_value)
	{
		var original_args = arguments;
		return new Promise(function(resolve,reject){
			var obj = {};
			var success = [];
			var failure = [];
			if(original_args.length == 5)
			{
				Promise.all([
					htmlVerification(domain_url,domain_html_name,hash_value),
					txtVerification(domain_url,domain_key,domain_value),
					metaTagVerification(domain_url,domain_key,domain_value)
				]).then(results_data =>{
					results_data.forEach( data=>{
						if(data.status)
						{
							success.push(data.name);
						} else {
							failure.push(data.name);
						}
					});
					if(success.length > 0)
					{
						obj.status = true;
						obj.verified = success;
					} else {
						obj.status = false;
						obj.verified = [];
					}
					resolve(obj);
				}).catch( error =>{
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
"use strict";

var metafetch = require('metafetch');
var request = require('request');
var Promise = require("bluebird");
var dns = require("dns");

var DomainVerification = (function() {
	
  
	var htmlVerification = function(domain_url,domain_value,domain_html_name,hash_value) {
		var original_args = arguments;
		return new Promise(function(resolve,reject){
			if(original_args.length == 4)
			{
				var url = domain_url+'/'+domain_html_name+'-'+domain_value+'.html';
				var options = {
					method: 'GET',
					url: url
				}
				request(options,function(error,response,body){
					if(error)
					{
						resolve(false);
					} else {

						if(hash_value == body)
						{
							resolve(true);
						} else {
							resolve(false);
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
				dns.resolveTxt(domain_url, function(error,records){
					if(records == undefined)
					{
						resolve(false);
					} else {
						records.forEach(function(record){
							var expected = domain_key+'='+domain_value;
							if(expected == record[0])
							{
								resolve(true);
							}
							else {
								resolve(false);
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
			if(original_args.length == 3)
			{
				metafetch.fetch(domain_url,function(err,result){
					if(err)
					{
						resolve(false);
					} else {
						var check_key = result.meta[domain_key];
						if( check_key != undefined)
						{
							if(check_key === domain_value)
							{
								resolve(true);
							} else {
								resolve(false);
							}
						} else {
							resolve(false);
						}
					}
				});
			} else {
				reject('Mismatch arguments');
			}
		});
	}
  
	return {
		html: htmlVerification,
		txt: txtVerification,
		metatag: metaTagVerification
	};

  })();

  module.exports = DomainVerification;
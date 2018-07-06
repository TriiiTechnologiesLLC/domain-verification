"use strict";

var metafetch = require('metafetch');
var request = require('request');
var Promise = require("bluebird");
var dns = require("dns")

var DomainVerifaction = (function() {
	
  
	var htmlVerification = function(domain_url,domain_value,domain_html_name,hash_value) {
		return new Promise(function(resolve,reject){
			if(arguments.length == 4)
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

					if(parseInt(hash_value) == parseInt(body))
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
		var originalArgs = arguments
		return new Promise(function (resolve,reject){
		if(originalArgs.length == 3){
			dns.resolveTxt(domain_url, function(error,records){
				records.forEach(function(record){
					var expected = domain_key+'='+domain_value
					if(expected == record[0])
						resolve(true)
					else
						resolve(false)
				})
			})
		}
		else {
			reject('Mismatch arguments')
		}
	  });
	}
  
	var metaTagVerification = function(domain_url,domain_key,domain_value) {
		return new Promise(function(resolve,reject){
			if(arguments.length == 3)
			{
				metafetch.fetch(domain_url,function(err,result){
					if(err)
					{
						resolve(false);
					} else {
						var checkKey = result.meta[domain_key];
						if( checkKey != undefined)
						{
							if(checkKey === domain_value)
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

  module.exports = DomainVerifaction;
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
	  return new Promise(function (resolve,reject){
		if(arguments.length == 3){
			dns.resolveTxt(domain_url, function(error,records){
				for(var i =0; i<records.length; i++) {
					record = records[i][0]
					index = record.indexOf('=')
					if(record.substring(0,index)==domain_key && (record.substring(index+1,record.length) == domain_value))
						resolve(true)
					else
						resolve(false)
				}
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
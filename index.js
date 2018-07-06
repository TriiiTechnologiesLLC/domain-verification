"use strict";

var metafetch = require('metafetch');
var request = require('request');

var DomainVerifaction = (function() {
	
  
	var htmlVerification = function(domain_url,domain_value,domain_html_name,hash_value,callback) {
		if(arguments.length == 5)
		{
			var url = domain_url+'/'+domain_html_name+'-'+domain_value+'.html';
			var options = {
				method: 'GET',
				url: url
			}
			request(options,function(error,response,body){
				if(error)
				{
					callback(null,false);
				} else { console.log('hash_value',hash_value);
				console.log('body',body);
					if(parseInt(hash_value) == parseInt(body))
					{
						callback(null,true);
					} else {
						callback(null,false);
					}
				}
			})
		} else {
			callback('Mismatch arguments',null);
		}
	}
  
	var txtVerification = function() {
	  console.log('This is a method I want to expose!');
	}
  
	var metaTagVerification = function(domain_url,domain_key,domain_value,callback) {
		if(arguments.length == 4)
		{
			metafetch.fetch(domain_url,function(err,result){
				if(err)
				{
					callback(false,null);
				} else {
					var checkKey = result.meta[domain_key];
					if( checkKey != undefined)
					{
						if(checkKey === domain_value)
						{
							callback(null,true);
						} else {
							callback(null,false);
						}
					} else {
						callback(null,false);
					}
					
					
				}
			})
		} else {
			callback('Mismatch arguments',null);
		}
	}
  
	return {
		html: htmlVerification,
		txt: txtVerification,
		metatag: metaTagVerification
	};

  })();

  module.exports = DomainVerifaction;
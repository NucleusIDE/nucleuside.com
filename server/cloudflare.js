Cloudflare = {};

Cloudflare.linkSubdomain = function(subdomain, ipAddress) {
	var cloudflare_api_interface = "https://www.cloudflare.com/api_json.html",
			cloudflare_token = "efb121eb6f63b931c15d2474cbcf8a0e1f85c",
			cloudflare_email = "jamesgillmore@gmail.com",
			domain = "nucleuside.com";
			
  HTTP.post(cloudflare_api_interface,
            {
              params: {
                tkn: cloudflare_token,
                email: cloudflare_email,
                a: "rec_new",
                z: domain,
                type: 'A',
								ttl: 120,
								name: subdomain,
								content: ipAddress
              }
            },
            function(err, res) { 
              if (err) return console.log("ERROR WHILE LINKING SUBDOMAIN ", err);
              console.log("CLOUDFLARE LINKED SUBOMDAIN SUCCESSFULLY: ", res.content);
            }
	);
};


Cloudflare = {};

CloudFlare = function CloudFlare() {
	this.cloudflare_api_interface = MasterConfig.keys.cloudflare.cloudflare_api_interface;
	this.cloudflare_token = MasterConfig.keys.cloudflare.cloudflare_token;
	this.cloudflare_email = MasterConfig.keys.cloudflare.cloudflare_email;
	this.domain = MasterConfig.keys.cloudflare.domain;
};

CloudFlare.extends(Base, {
	linkSubdomain: function(subdomain, ipAddress) {
	  var res = this.POST(this.cloudflare_api_interface, {
      params: {
        tkn: this.cloudflare_token,
        email: this.cloudflare_email,
        a: "rec_new",
        z: this.domain,
        type: 'A',
				ttl: 120,
				name: subdomain,
				content: ipAddress
      }
    });
			
		return res.data;
	}
});


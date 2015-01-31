CloudFlare = function CloudFlare() {
	this.url = MasterConfig.keys.cloudflare.url;
	this.token = MasterConfig.keys.cloudflare.token;
	this.email = MasterConfig.keys.cloudflare.email;
	this.domain = MasterConfig.keys.cloudflare.domain;
};

CloudFlare.extends(Base, {
	linkSubdomain: function(subdomain, ipAddress) {
	  var res = this.POST(this.url, {
      params: {
        tkn: this.token,
        email: this.email,
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


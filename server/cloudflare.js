Ultimate('Cloudflare').extends({
	construct: function() {
		var cloudflare = MasterConfig.cloudflare();
	
		this.url = cloudflare.url;
		this.token = cloudflare.token;
		this.email = cloudflare.email;
		this.domain = cloudflare.domain;
	},
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

Cloudflare.extendStatic({
	linkSubdomain: function(subdomain, ipAddress) {
		var cloudflare = new CloudFlare;
		cloudflare.linkSubdomain(subdomain, ipAddress);
	}
})
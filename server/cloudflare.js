Ultimate('Cloudflare').extends({
	construct: function() {
		var cloudflare = ConfigServer.cloudflare();
	
		this.url = cloudflare.url;
		this.token = cloudflare.token;
		this.email = cloudflare.email;
		this.domain = cloudflare.domain;
	},
	linkSubdomain: function(subdomain, ipAddress) {
	  var res = this.POST(this.url, {
      params: {
				a: "rec_new",
        tkn: this.token,
        email: this.email,
        z: this.domain,
        type: 'A',
				ttl: 120,
				name: subdomain,
				content: ipAddress
      }
    });
		
		
		try {
			return res.data.response.rec.obj.rec_id;
		}
		catch(e) {
			return Meteor.Error('cloudflare-error', 'failed-to-link-subdomain-to-ip-address');
		}
	},
	unLinkSubdomain: function(id) {
	  this.POST(this.url, {
      params: {
				a: "rec_delete",
        tkn: this.token,
        email: this.email,
        z: this.domain,
				id: id
      }
    });
	}
});

Cloudflare.extendStatic({
	linkSubdomain: function(subdomain, ipAddress) {
		var cloudflare = new CloudFlare;
		cloudflare.linkSubdomain(subdomain, ipAddress);
	},
	unLinkSubdomain: function(id) {
		var cloudflare = new CloudFlare;
		cloudflare.unLinkSubdomain(id);
	}
})
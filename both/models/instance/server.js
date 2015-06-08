Instance.extendServer({
	linkSubdomain: function(instanceId) {
		this.setTimeout(function() {	
			if(this.ec2.dns_record_id) Cloudflare.unLinkSubdomain(this.ec2.dns_record_id);
			this.ec2.dns_record_id = Cloudflare.linkSubdomain(this.subdomain, this.ec2.acquireIpAddress());
			this.save(); //this._ec2.ip_address also saved
		}, 5 * 1000); //wait until instance exists
	},
	unLinkSubdomain: function(instanceId) {
		Cloudflare.unLinkSubdomain(this.ec2.dns_record_id);
		this.ec2.dns_record_id = null;
		this.save();
	},
	
	
	launchApp: function() {
		var privateKeyPath = process.env.PWD.substr(0, process.env.PWD.lastIndexOf('/')) + '/nucleus_aws_key.pem';

		var commands = [
				'rm -R ' + this.githubPath(), 
				this.getCloneCommand(),
				'export ULTIMATE_IDE_PASSWORD="'+this.password+'"',
				'cd ' + this.githubPath() + ' && meteor --port 80' 
			],
			options = {
				privateKey: privateKeyPath,
				stdout: function(data) {
					if(data.indexOf('App running at') > -1) this.notifyHome('launched');
				}.bind(this),
				onFail: function(data) {
					this.notifyHome('failed');
				}.bind(this)
			};

    	UltimateExec.exec(commands, options, this.getIpAddress());
	},
	getCloneCommand: function() {
		var token = this.user().getToken('github'),
			githubPath = this.githubPath();
		
		return 'git clone https://'+token+':x-oauth-basic@github.com/' + githubPath;
	},
	githubPath: function() {
	    var githubUrl = this.github_url.replace('.git', ''),
	    	parts = githubUrl.split('/'),
	    	repo = parts.pop(),
	    	user = parts.pop();

	    return user + '/' + repo + '.git';
	},
	notifyHome: function(status) {
		console.log("APP DEPLOYMENT", status);
		this.ec2.status = status;
		this.save();
	}
});
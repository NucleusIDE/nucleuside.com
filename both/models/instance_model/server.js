Instance.extendServer({
	linkSubdomain: function(instanceId) {
		this.setTimeout(function() {
			this.ec2().getIpAddress();	
			this._ec2.dns_record_id = Cloudflare.linkSubdomain(this.subdomain, this.ec2().ip_address);
			this.save(); //this._ec2.ip_address also saved
		}, 5 * 1000); //wait until instance exists
	},
	unLinkSubdomain: function(instanceId) {
		Cloudflare.unLinkSubdomain(this._ec2.dns_record_id);
		this._ec2.dns_record_id = null;
		this.save();
	},
	
	
	launchApp: function() {
    return; //TODO: TEST UltimateExec
		var commands = [
				'rm -R ' + this.githubPath(), 
				this.getCloneCommand(),
				'cd ' + this.githubPath(), 
				'meteor --port 80'
			],
			options = {
				stdout: function(data) {
					if(data.indexOf('App running at') > -1) this.notifyHome('launched');
				}.bind(this),
				stderr: function(data) {
					this.notifyHome('failed');
				}.bind(this)
			};

    UltimateExec.exec(commands, options, this.ec2().ip_address);
	},
	getCloneCommand: function() {
		var token = this.user().getToken('github'),
			githubPath = this.getGithubPath();
		
		return 'git clone https://'+token+':x-oauth-basic@github.com/' + githubPath;
	},
	githubPath: function() {
		return this.github_url.replace('http://github.com/', '');
	},
	notifyHome: function(status) {
		this._ec2.status = 'launched';
		this.save();
	}
});
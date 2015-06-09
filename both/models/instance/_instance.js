Ultimate('Instance').extends(UltimateModel, {
  collection: 'instances',
	behaviors: ['EC2', 'ec2', 'server'],

  aggregates: {
    totalCost: {
      field: 'cost',
      operator: 'sum'
    }
  },


  displayAmount: function() {
    return Order.BILLING_METHODS[this.billing_method].display_amount;
  },


  isRunning: function() {
    return this.getStatus() === 'running';
  },
  getStatus: function() {
    return this.ec2.status;
  },


  url: function() {
    return this.subdomain + '.' + Config.hostedDomain;
  },
  getGithubUrl: function() {
      var githubUrl = this.github_url.replace('.git', ''),
        parts = githubUrl.split('/'),
        repo = parts.pop(),
        user = parts.pop();

      return 'http://github.com/' + user + '/' + repo;
  },
  githubPath: function() {
      var githubUrl = this.github_url.replace('.git', ''),
        parts = githubUrl.split('/'),
        repo = parts.pop(),
        user = parts.pop();

      return user + '/' + repo;
  },
});

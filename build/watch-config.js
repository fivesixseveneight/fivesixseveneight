module.exports = [
	{
		watch: ['../css/styles.css', '../css/reset.css', '../css/app.css', '../css/bootstrap.min.css', '../css/bootstrap-theme.min.css'],
		optimizeConfig: {
			cssIn: '../css/styles.css',
			out: '../css/styles.min.css',
			optimizeCss: "standard"
		}
	}
];
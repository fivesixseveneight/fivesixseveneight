module.exports = function(grunt){
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		
		  jshint: {
		    files: ['Gruntfile.js', 'js/**/*.js'],
		     options: {
		         // options here to override JSHint defaults
		    	  curly: true,
		    	  eqnull: true,
		    	  eqeqeq: true,
			         globals: {
			           jQuery: true,
			           console: true,
			           module: true,
			           document: true
			         }
		       }
		  },
		  
		  csslint: {
		      strict: {
		        src: ['css/app.css', 'css/ie8.css', 'css/partials/**/*.css' , 'css/modules/**/*.css']
		      },
		      lax: {
		        options: {
		          csslintrc: '.csslintrc'
		        },
		        src: ['css/app.css', 'css/ie8.css', 'css/partials/**/*.css', 'css/modules/**/*.css']
		      }
		  },
		  
		  watch:{
			  options: {
			    	livereload: true 	
			  },
			  css: {
					files: 'sass/**/*.scss',
					tasks: ['compass'],
					options: {
							sourcemap: false,
							quiet: true,
					    	livereload: true 	
					},
			  },
			  files: ['index.html','partials/**/*.html', 'js/**/*.js'],
		  },
		  
		  express: {
			  all:{
				  options: { 
					  port: 9000,
					  hostname: 'test',
					  bases: ['.'],
					  livereload: true 
				  },
			  },
		  },
		  
		  compass: {
			    dist: {
			      options:{
			    	  environment: 'development',
			    	  config: 'config.rb',
			    	  outputStyle: 'expanded',
			    	//require: [],
			    	//load: [],
			    	//importPath: []
			      },
			      files: [{
			        src: ['**/*.scss']
			      }]
			    }
		  },
		  
		  cssmin: {
			  add_banner: {
			    options: {
			      banner: '/* My minified css file */'
			    },
			    files: {
			      'dist/css/styles.min.css': ['css/styles.css']
			    }
			  }
		  },
		  
		  requirejs: {
			  compile: {
			    options: {
			    	baseUrl: 'js',
			    	mainConfigFile: 'js/main.js',
			    	name: 'main',
			    	out: 'dist/js/scripts.min.js',
			    	preserveLicenseComments: false,
		//	    	optimize: 'none',
			    	paths: {
			    		requireLib: '../lib/requirejs/require'
			    	},
			    	include: 'requireLib'
			    }
			  }
		},
		
		htmlmin: {                                 
		    dist: {                                 
		      options: {                            
		        removeComments: true,
		        collapseWhitespace: true
		      },
		      files: [{   
	    	  		expand: true,
	                src: 'index.html',
	                dest: 'dist/'
	                	
		      		},{   
		  	  		expand: true,
		            cwd: 'partials/',
		            src: '**/*.html',
		            dest: 'dist/partials/'
			      	}]
		    }
		},
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express');
	
	grunt.loadNpmTasks('grunt-contrib-compass');
	
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	
	// build for production
	grunt.registerTask('build', ['cssmin', 'requirejs' ,'htmlmin']);
	
	// checks css and js syntax
	grunt.registerTask('lint', ['jshint', 'csslint:lax']);
	
	grunt.registerTask('buildsass', ['compass']);
	
	grunt.registerTask('server', ['express','watch']);
	
	grunt.registerTask('default', ['express','watch']);
	
};
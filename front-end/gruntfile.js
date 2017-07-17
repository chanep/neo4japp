module.exports = function (grunt) {
    'use strict';

    require("matchdep").filterAll("grunt-*").forEach(grunt.loadNpmTasks);
  	var webpack = require("webpack");
  	var webpackConfig = require("./webpack.config.js");
    var path = require('path');

    grunt.initConfig({
        'pkg': grunt.file.readJSON('package.json'),
        'sass': {
            'options': {
                'outputStyle': 'compressed'
            },
            'dist': {
                'files': {
                    'dist/css/styles.css': './src/scss/main.scss'
                }
            }
        },
        'postcss': {
            'options': {
                'processors': [
                    require('precss')({ /* options */ }),
                    require('autoprefixer')({
                        'browsers': ['last 3 version']
                    })
                ]
            },
            'dist': {
                'files': {
                    'dist/css/styles.css': 'dist/css/styles.css'
                }
            }
        },
        'watch': {
            options: {
               livereload: true,
             },
            'scss': {
                'files': ['src/**/*.scss'],
                'tasks': ['sass'],
                  options: {
                     livereload: false,
                   },
            },
            'css': {
                'files': ['dist/css/*.css']
            },
            'html': {
                'files': ['src/**/*.html'],
                'tasks': ['copy']
            }
        },
        'copy': {
            'main': {
                'files': [{
                    'expand': true,
                    'cwd': 'src/',
                    'src': ['*.html',
                        'fonts/**',
                        'img/**'
                    ],
                    'dest': 'dist/'
                }]
            }
        },
        'webpack': {
          options: {
            stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
          },
          prod: Object.assign({
    				plugins:[
              new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
              }),
    					new webpack.optimize.ModuleConcatenationPlugin(),
    					new webpack.optimize.UglifyJsPlugin()
    				]}, webpackConfig),
          dev: Object.assign({ watch: true }, webpackConfig)
        },
        'webpack-dev-server': {
    			options: {
    				webpack: webpackConfig,
            publicPath: '/js/',
            contentBase: path.join(__dirname, "dist"),
            compress: true,
            port: 8282
    			},
    			start: {
    				webpack: {
    					devtool: "eval"
    				}
    			}
    		},
        concurrent: {
      		serve: {
      			tasks: ['webpack-dev-server:start', 'watch'],
      			options: {
      				logConcurrentOutput: true
      			}
      		}
      	},
        dom_munger: {
          serve: {
            options: {
                remove: ['script[data-remove="true"]', 'link[data-remove="true"]']
            },
            src: 'dist/index.html'
          }
        }
    });

    grunt.registerTask('default', ['sass', 'copy', 'concurrent:serve']);
    grunt.registerTask('build', ['sass', 'copy', 'dom_munger', 'webpack:prod']);
};

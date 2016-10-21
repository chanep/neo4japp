module.exports = function (grunt) {
    'use strict';

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
            'css': {
                'files': ['src/**/*.scss'],
                'tasks': ['sass'],
                'options': {
                    'livereload': true
                }
            },
            'js': {
                'files': ['src/**/*.js'],
                'tasks': ['sass', 'copy', 'webpack'],
                'options': {
                    'livereload': true
                }
            },
            'html': {
                'files': ['src/**/*.html'],
                'tasks': ['copy'],
                'options': {
                    'livereload': true
                }
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
            'build': {

                // webpack options
                'entry': './src/js/client.js',
                'output': {
                    'path': 'dist/js/',
                    'filename': 'client.min.js'
                },
                'module': {
                    'loaders': [{
                        'test': /\.js$/,
                        'exclude': /(node_modules)/,
                        'loader': 'babel-loader',
                        'query': {
                            'presets': ['react', 'es2015']
                        }
                    }]
                },
                'progress': false, // Don't show progress
                // Defaults to true
                'failOnError': false, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue
                'watch': false // use webpacks watcher
                // You need to keep the grunt process alive

                // // Use this when you need to fallback to poll based watching (webpack 1.9.1+ only)
                // keepalive: true, // don't finish the grunt task
                // // Use this in combination with the watch option
                // inline: true,  // embed the webpack-dev-server runtime into the bundle
                // // Defaults to false
                // hot: true, // adds the HotModuleReplacementPlugin and switch the server to hot mode
                // // Use this in combination with the inline option
            }
        },
        'http-server': {

            'dev': {

                // the server root directory
                'root': './dist',

                // the server port
                // can also be written as a function, e.g.
                // port: function() { return 8282; }
                'port': 8282,

                // the host ip address
                // If specified to, for example, "127.0.0.1" the server will
                // only be available on that ip.
                // Specify "0.0.0.0" to be available everywhere
                'host': '0.0.0.0',

                // server default file extension
                'ext': 'html',

                // run in parallel with other tasks
                'runInBackground': true,

                // Tell grunt task to open the browser
                'openBrowser': true
            }

        }
    });
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-http-server');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['http-server', 'sass', 'webpack', 'copy', 'watch']);
    grunt.registerTask('build', ['sass', 'webpack', 'copy', 'watch']);
};

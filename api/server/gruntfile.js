module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-apidoc');

    grunt.initConfig({

        apidoc: {
            myapp: {
                src: "./",
                dest: "./apidoc/",
                options: {
                    excludeFilters: ["node_modules/"]
                }
            }
        }, // apidoc

        watch:{
            apidoc:{
                files: [
                    '**/*.js',
                    '!**/node_modules/**', 
                    '!libs/**', 
                    '!apidoc/**/*'
                ],
                tasks: ['apidoc']
            }
        }

    });

    grunt.registerTask('default', [

    ]);

    grunt.registerTask('build', [
        'apidoc'
    ]);

};
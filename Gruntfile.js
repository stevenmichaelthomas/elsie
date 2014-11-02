module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
 
    sass: {
      options: {
        includePaths: ['node_modules/foundation/scss']
      },
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'www/css/foundation.css': 'scss/foundation.scss',
          'www/css/app.css': 'scss/app.scss',
          'www/css/ui-dark.min.css': 'node_modules/winjs/css/ui-dark.min.css'
        }        
      }
    },
 
    /*copy: {
      main: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular/*.js', 'angular-route/*.js', 'foundation/js/*.js', 'jquery/dist/*.js'],
        dest: 'public/js/lib'
      }
    },*/
 
    watch: {
      options: {
        livereload: true
      },
      grunt: { files: ['Gruntfile.js'] },
 
      sass: {
        files: 'scss/*.scss',
        tasks: ['sass']
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
 
  grunt.registerTask('build', ['sass']);
  grunt.registerTask('default', ['sass', 'watch']);
 
}
module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
 
    sass: {
      dist: {
        options: {
          outputStyle: 'compressed'
        },
        files: {
          'www/css/app.css': 'src/scss/app.scss'
        }         
      }
    },
 
    copy: {
      css: {
        expand: true,
        flatten: true,
        cwd: 'node_modules',
        src: ['angular-material/angular-material.css'],
        dest: 'www/css/lib'
      },
      fonts: {
        expand: true,
        flatten: true,
        cwd: 'node_modules',
        src: ['roboto-font/fonts/**/*'],
        dest: 'www/css/fonts'
      },
      img: {
        expand: true,
        flatten: true,
        cwd: 'src/img',
        src: ['*'],
        dest: 'www/img'
      },
      angular-material: {
        expand: true,
        flatten: true,
        cwd: 'node_modules',
        src: ['angular-material/*.js'],
        dest: 'www/js/lib'
      },
      angular: {
        expand: true,
        flatten: true,
        cwd: 'node_modules',
        src: ['angular/*.js'],
        dest: 'www/js/lib'
      },
      angular-animate: {
        expand: true,
        flatten: true,
        cwd: 'node_modules',
        src: ['angular-animate/*.js'],
        dest: 'www/js/lib'
      },
      angular-aria: {
        expand: true,
        flatten: true,
        cwd: 'node_modules',
        src: ['angular-aria/*.js'],
        dest: 'www/js/lib'
      },
      js: {
        expand: true,
        flatten: true,
        cwd: 'src/js',
        src: '*.js',
        dest: 'www/js'
      }
    },
 
    includes: {
      build: {
        flatten: true,
        src: 'src/jade/index.jade',
        dest: 'build/',
        options: {
          includePath: 'src/jade/partials'
        }
      }
    },

    jade: {
      build: {
        expand: true,
        flatten: true,
        src: 'src/jade/*.jade',
        dest: 'www/',
        ext: '.html'
      }
    },

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
 
  grunt.registerTask('build', ['sass', 'copy', 'includes', 'jade']);
  grunt.registerTask('default', ['build', 'watch']);
 
}
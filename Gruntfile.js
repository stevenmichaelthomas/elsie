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
          'www/css/app.css': 'src/elsie.common/styles/master.scss'
        }         
      }
    },
 
    copy: {
      css: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular-material/angular-material.css'],
        dest: 'www/css/lib'
      },
      fonts: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['roboto-fontface/fonts/*'],
        dest: 'www/css/fonts'
      },
      img: {
        expand: true,
        flatten: true,
        cwd: 'src/assets',
        src: ['*'],
        dest: 'www/img'
      },
      angularMaterial: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular-material/*.js'],
        dest: 'www/js/lib'
      },
      angular: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular/*.js'],
        dest: 'www/js/lib'
      },
      angularAnimate: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular-animate/*.js'],
        dest: 'www/js/lib'
      },
      angularAria: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular-aria/*.js'],
        dest: 'www/js/lib'
      },
      angularUiRouter: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular-ui-router/release/*.js'],
        dest: 'www/js/lib'
      },
      js: {
        expand: true,
        flatten: true,
        cwd: 'src/js',
        src: '*.js',
        dest: 'www/js'
      },
      services: {
        expand: true,
        flatten: true,
        cwd: 'src/js/services',
        src: '*.js',
        dest: 'www/js/services'
      }
    },
 
    includes: {
      build: {
        flatten: true,
        src: 'src/index.jade',
        dest: 'build/',
        options: {
          includePath: 'src/**/templates'
        }
      }
    },

    jade: {
      build: {
        expand: true,
        flatten: true,
        src: 'src/**/templates/*.jade',
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
        files: '**/styles/*.scss',
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
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

    jshint: {
      files: [
        'src/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    concat: {
      build: {
        files: {
          'build/js/elsie.js': [
            'src/elsie.common/**/*.js',
            'src/elsie.*/**/*.js',
            'src/elsie/**/*.js',
          ]
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
      angularMonkeyPatch: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular-issue-9128-patch/angular-issue-9128-patch.js'],
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
      angularVelocity: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['angular-velocity/*.js'],
        dest: 'www/js/lib'
      },
      store: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['store/dist/*.*'],
        dest: 'www/js/lib'
      },
      jquery: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['jquery/dist/*.*'],
        dest: 'www/js/lib'
      },
      velocity: {
        expand: true,
        flatten: true,
        cwd: 'bower_components',
        src: ['velocity/*.*'],
        dest: 'www/js/lib'
      },
      js: {
        expand: true,
        flatten: false,
        cwd: 'build/js',
        src: 'elsie.js',
        dest: 'www/js/'
      },
    },

    jade: {
      master: {
        expand: true,
        flatten: true,
        src: 'src/index.jade',
        dest: 'www/',
        ext: '.html'
      },
      build: {
        expand: true,
        flatten: true,
        src: 'src/**/templates/*.jade',
        dest: 'build/templates/',
        ext: '.html'
      }
    },

    ngtemplates:  {
      app: {
        cwd: 'build/',
        src: 'templates/**.html',
        dest: 'www/js/templates.js',
        options: {
          standalone: true,
          module: 'elsie.templates'
        }
      }
    },

    watch: {
      options: {
        livereload: 35730
      },
      grunt: { files: ['Gruntfile.js'] },

      scripts: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'concat', 'copy'],
      },

      templates: {
        files: ['src/**/*.jade'],
        tasks: ['jade','ngtemplates'],
      },
 
      sass: {
        files: '**/styles/*.scss',
        tasks: ['sass']
      }
    }
  });
 
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-angular-templates');

  grunt.registerTask('build', ['sass', 'jshint', 'concat', 'copy', 'jade', 'ngtemplates']);
  grunt.registerTask('default', ['build', 'watch']);
 
}
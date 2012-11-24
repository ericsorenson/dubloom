module.exports = function(grunt) {
  grunt.initConfig({
    coffee: {
      app: {
        src: 'src/**/*.coffee',
        dest: 'dist',
        options: {
          preserve_dirs: true,
          bare: false,
          base_path: 'src'
        }
      }
    },
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: {
          'dist/index.html': 'src/index.jade'
        }
      }
    },
    sass: {
      dist: {
        files: {
          'dist/style.css': 'src/style.scss'
        }
      }
    },
    server: {
      port: 8000,
      base: 'dist'
    },
    reload: {
      liveReload: true,
      proxy: {
        host: 'localhost'
      }
    },
    watch: {
      coffee: {
        files: 'src/**/*.coffee',
        tasks: 'coffee reload'
      },
      jade: {
        files: 'src/*.jade',
        tasks: 'jade reload'
      },
      sass: {
        files: 'src/*.scss',
        tasks: 'sass reload'
      }
    }
  });
  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-reload');
  grunt.registerTask('default', 'server reload watch');
  grunt.registerTask('dist', ['coffee', 'jade', 'sass']);
};
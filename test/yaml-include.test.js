(function() {
  'use strict';

  var should = require('should');
  var assert = require('assert');
  var yaml = require('js-yaml');
  var yamlinc = require('../index');
  var fs = require('fs');
  process.env.DEBUG = '*';

  function err(fn, msg) {
    try {
      fn();
      should.fail('expected an error');
    } catch (err) {
      should.equal(msg, err.message);
    }
  }

  describe('yaml-include', function() {

    var basicFixture, optionsFixture, swaggerFixture, src;

    before(function() {
      process.chdir(__dirname + '/fixtures/basic');
      src = fs.readFileSync('base.yaml', 'utf8');
      basicFixture = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });

      process.chdir(__dirname + '/fixtures/options');
      src = fs.readFileSync('base.yaml', 'utf8');
      optionsFixture = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });

      process.chdir(__dirname + '/fixtures/swagger');
      src = fs.readFileSync('spec.yaml', 'utf8');
      swaggerFixture = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });

    });

    it('should include files', function() {
      basicFixture.should.have.propertyByPath('neighbor', 'name').eql('Fred Rogers');
      basicFixture.should.have.propertyByPath('neighbor', 'dig', '/subdir', 'foo', 'indy', 'quote').eql('Why did it have to be snakes?');
    });

    it('should allow cherry-picking using an array as the first argument to inc/dir', function() {
      optionsFixture.should.have.propertyByPath('filearray', '/inc/sub', 'StillUpper').eql({hulk: 'smash'});
    });

    it('should support inclusions within included files', function() {
      optionsFixture.should.have.propertyByPath('defaults', '/', 'ToLower', 'foo', 'value').eql('bar');
    });

    describe('inc/file', function() {

      it('should include any valid yaml file specified', function() {
        optionsFixture.should.have.propertyByPath('gimme', 'ext').eql('data');
      });

    });

    describe('inc/dir', function() {

      describe('option defaults', function() {

        it('should ignore files or directories prefixed with _', function() {
          optionsFixture.should.not.have.propertyByPath('defaults', '/', '_ignored');
        });

        it('should treat directories named ~dirname as variables like {dirname}', function() {
          optionsFixture.should.have.propertyByPath('defaults', '/{alter-ego}', 'Superman', 'alias').eql('Clark Kent');
        });

        it('should ignore empty files', function() {
          optionsFixture.should.not.have.propertyByPath('defaults', '/', 'empty');
        });

        it('should ignore file extensions other than .yaml or .yml', function() {
          optionsFixture.should.not.have.propertyByPath('defaults', '/sub', 'skip');
        });

        it('should include files recursively', function() {
          optionsFixture.should.have.propertyByPath('defaults', '/sub', 'StillUpper', 'hulk').eql('smash');
        });
      });

      describe('file contents-related options', function() {

        it('should allow empty files if allowFiles is true', function() {
          optionsFixture.should.have.propertyByPath('keeptop', '/inc', 'empty').eql({});
          optionsFixture.should.have.propertyByPath('shallow', 'empty').eql({});
        });

      });

      describe('file/dir-name related options', function() {

        it('should allow custom file extensions', function() {
          optionsFixture.should.have.propertyByPath('ext', '/sub', 'skip', 'ext').eql('data');
        });

        it('should allow forcing all keys to lowercase', function() {
          optionsFixture.should.have.propertyByPath('shallow', 'tolower', 'lowered').eql('y');
        });

        it('should support whitelisting files', function() {
          optionsFixture.should.have.propertyByPath('xlist', '/_ignored', 'batman', 'sidekick').eql('Robin');
        });

        it('should support blacklisting files', function() {
          optionsFixture.should.not.have.propertyByPath('xlist', '/', 'foo');
        });

        it('should allow explicit inc/file use of inc/dir blacklisted files', function() {
          optionsFixture.should.not.have.propertyByPath('xlist', '/', 'foo');
          optionsFixture.should.have.propertyByPath('xlist', '/', 'ToLower', 'foo', 'value').eql('bar');
        });

        it('should allow exclusion of top-level separator', function() {
          optionsFixture.should.not.have.propertyByPath('notopsep', '/');
          optionsFixture.should.have.propertyByPath('notopsep', 'foo');
        });

        it('should allow custom path separators', function() {
          optionsFixture.should.have.propertyByPath('custompathsep', ':inc:sub');
        });

      });

    });

    describe('use cases', function() {

      it('should enable modular Swagger 2.0 management', function() {
        var petstore = require('./fixtures/swagger/petstore-swagger');
        swaggerFixture.should.match(petstore);
      });

    });

  });


}());

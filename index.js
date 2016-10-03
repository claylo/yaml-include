'use strict';

var yaml = require('js-yaml');
var debug = require('debug')('include-yaml');
var p = require('path');

var YAML_VISITED_FILES = [];
var YamlIncludeDirType = require('./lib/dir');
var YamlIncludeFileType = require('./lib/file');

var YAML_TYPES = [YamlIncludeDirType, YamlIncludeFileType];
var YAML_INCLUDE_SCHEMA = yaml.Schema.create(YAML_TYPES);
var basefile = '';

// so we know where to find files referenced relative to the base file
function setBaseFile(file) {
  this.YAML_VISITED_FILES.push(file);
  this.basefile = file;
}

function getBasePath() {
  debug('basefile: %s', this.basefile);

  // backwards compat
  if (this.basefile === '') {
    // before we supported base_file, we expected the included files
    // to be in the process.cwd()
    return process.cwd()
  }
  return p.dirname(this.basefile);
}

module.exports.YAML_INCLUDE_SCHEMA = YAML_INCLUDE_SCHEMA;
module.exports.YAML_TYPES = YAML_TYPES;
module.exports.YAML_VISITED_FILES = YAML_VISITED_FILES;
module.exports.basefile = basefile;
module.exports.setBaseFile = setBaseFile;
module.exports.getBasePath = getBasePath;
module.exports.YamlIncludeDirType = YamlIncludeDirType;
module.exports.YamlIncludeFileType = YamlIncludeFileType;

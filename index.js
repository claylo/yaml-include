(function() {

  'use strict';

  var yaml = require('js-yaml');

  var YamlIncludeDirType = require('./lib/dir');
  var YamlIncludeFileType = require('./lib/file');

  var YAML_TYPES = [YamlIncludeDirType, YamlIncludeFileType];
  var YAML_INCLUDE_SCHEMA = yaml.Schema.create(YAML_TYPES);

  module.exports.YAML_INCLUDE_SCHEMA = YAML_INCLUDE_SCHEMA;
  module.exports.YAML_TYPES = YAML_TYPES;
  module.exports.YamlIncludeDirType = YamlIncludeDirType;
  module.exports.YamlIncludeFileType = YamlIncludeFileType;

}());

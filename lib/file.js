'use strict';

var fs = require('fs');
var p = require('path');
var yaml = require('js-yaml');
var yamlinc = require('../index');
var debug = require('debug')('include-yaml:file');
var util = require('util');


function construct(data) {
  var src, included, basepath, fullpath;

  basepath = yamlinc.getBasePath();
  fullpath = p.join(basepath, data);

  yamlinc.YAML_VISITED_FILES.push(fullpath.replace(basepath + p.sep, ''));
  debug('resolved %s', fullpath);
  debug('incoming data %s', data);

  src = fs.readFileSync(fullpath, 'utf8');
  included = yaml.load(src, {
    schema: yamlinc.YAML_INCLUDE_SCHEMA,
    filename: fullpath
  });

  return included;
}

function resolve(data) {
  debug('in resolve');
  debug('data %s', data);
  debug('resolve this: %s', util.inspect(this, false, 20, true));
  return (typeof data === 'string');
}

module.exports = new yaml.Type('tag:yaml.org,2002:inc/file', {
  kind: 'scalar',
  resolve: resolve,
  construct: construct
});

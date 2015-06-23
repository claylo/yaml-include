'use strict';

var fs = require('fs');
var p = require('path');
var yaml = require('js-yaml');
var yamlinc = require('../index');
var assign = require('lodash.assign');
var debug = require('debug')('include-yaml:file');

function IncludedFile(obj) {
  assign(this, obj);
}

function constructIncludedFile(data) {
  var src, included;
  debug('resolved %s', p.resolve(process.cwd(), data));
  debug('incoming data %s', data);
  src = fs.readFileSync(data, 'utf8');
  included = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });
  return new IncludedFile(included);
}

function resolveIncludedFile(data) {
  return (typeof data == 'string');
}

module.exports = new yaml.Type('tag:yaml.org,2002:inc/file', {
  kind: 'scalar',
  resolve: resolveIncludedFile,
  construct: constructIncludedFile,
  instanceOf: IncludedFile
});

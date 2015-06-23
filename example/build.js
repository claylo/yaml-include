#!/usr/bin/env node

var yaml = require('js-yaml');
var yamlinc = require('../index');
var fs = require('fs');

// include paths are done from the directory of the root yaml document
process.chdir(__dirname + '/swagger');
var src = fs.readFileSync('spec.yaml', 'utf8');

var swagger = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });

console.log(JSON.stringify(swagger, null, 2));

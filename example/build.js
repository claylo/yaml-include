#!/usr/bin/env node

var yaml = require('js-yaml');
var yamlinc = require('../index');
var fs = require('fs');
var p = require('path');

yamlinc.setBaseFile(p.join(__dirname, 'swagger', 'spec.yaml'));

var src = fs.readFileSync(yamlinc.basefile, 'utf8');

var swagger = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile });

console.log(JSON.stringify(swagger, null, 2));

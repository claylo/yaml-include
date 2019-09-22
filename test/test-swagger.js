import test from 'ava';
import yaml from 'js-yaml';
import yamlinc from '..';
import fs from 'fs';
import p from 'path';

var src, obj, expected, objJson, expectedJson;

test('enable modular Swagger 2.0 management', t => {
  yamlinc.setBaseFile(p.join(__dirname, 'fixtures', 'swagger', 'spec.yaml'));
  src = fs.readFileSync(yamlinc.basefile, 'utf8');
  obj = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile });
  expected = fs.readFileSync(p.join(__dirname, 'fixtures', 'swagger', 'petstore-swagger.json'), 'utf8');
  expected = JSON.parse(expected);
  t.deepEqual(obj, expected);
});

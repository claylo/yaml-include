import test from 'ava';
import yaml from 'js-yaml';
import yamlinc from '..';
import fs from 'fs';
import p from 'path';

var src, obj, expected;

// https://github.com/claylo/yaml-include/issues/4
test('issue 4: include files with only arrays AS arrays', t => {
  yamlinc.setBaseFile(__dirname + '/fixtures/issue4/main.yaml');
  src = fs.readFileSync(yamlinc.basefile, 'utf8');
  obj = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile });
  expected = require(p.join(__dirname, 'fixtures', 'issue4', 'expected.json'));
  t.deepEqual(obj, expected);
});

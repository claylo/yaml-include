import test from 'ava';
import yaml from 'js-yaml';
import yamlinc from '..';
import fs from 'fs';
import p from 'path';

var src, obj, expected;

test.before(t => {
  yamlinc.setBaseFile(p.join(__dirname, 'fixtures', 'options', 'base.yaml'));
  src = fs.readFileSync(yamlinc.basefile, 'utf8');
  obj = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile });
});

test('allow empty files if allowFiles is true', t => {
  expected = {};
  t.deepEqual(obj.keeptop['/inc'].empty, expected);
  t.deepEqual(obj.shallow.empty, expected);
});

test('allow custom file extensions', t => {
  expected = 'data';
  t.is(obj.ext['/sub'].skip.ext, expected);
});

test('allow forcing keys to lowercase', t => {
  expected = 'y';
  t.is(obj.shallow.tolower.lowered, expected);
});

test('support whitelisting files', t => {
  expected = 'Robin';
  t.is(obj.xlist['/_ignored'].batman.sidekick, expected);
});

test('support blacklisting files', t => {
  t.falsy(obj.xlist['/'].foo);
});

test('allow explicit inc/file use of inc/dir blacklisted files', t => {
  expected = 'bar';
  t.is(obj.xlist['/'].ToLower.foo.value, expected);
});

test('allow exclusion of top-level separator', t => {
  expected = 'bar';
  t.falsy(obj.notopsep['/']);
  t.is(obj.notopsep.foo.value, expected);
});

test('allow custom path separators', t => {
  expected = ':inc:sub';
  t.truthy(obj.custompathsep[expected]);
});

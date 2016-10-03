import test from 'ava';
import yaml from 'js-yaml';
import yamlinc from '..';
import fs from 'fs';
import p from 'path';

const cwd = process.cwd();
var src, basic, options, swagger;

test.before(t => {
  process.chdir(p.join(__dirname, 'fixtures', 'basic'));
  src = fs.readFileSync('base.yaml', 'utf8');
  basic = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });

  process.chdir(p.join(__dirname, 'fixtures', 'options'));
  src = fs.readFileSync('base.yaml', 'utf8');
  options = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });

  process.chdir(cwd);
});

test('includes files properly the old way', t => {
  t.is(basic.neighbor.name, 'Fred Rogers');
  t.is(basic.neighbor.dig['/subdir'].foo.indy.quote, 'Why did it have to be snakes?');
});

test('supports inclusions within included files', t => {
  t.is(options.defaults['/'].ToLower.foo.value, 'bar');
});

test('includes any valid yaml file', t => {
  t.is(options.gimme.ext, 'data');
});

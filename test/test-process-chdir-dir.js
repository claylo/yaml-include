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

  process.chdir(p.join(__dirname, 'fixtures', 'swagger'));
  src = fs.readFileSync('spec.yaml', 'utf8');
  swagger = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });

  process.chdir(cwd);
});

test('allows cherry-picking using an array as the first argument', t => {
  t.is(options.filearray['/inc/sub'].StillUpper.hulk, 'smash');
});

test('ignores files or directories prefixed with _', t => {
  t.falsy(options.defaults['/']._ignored);
});

test('treats directories named ~dirname as variables like {dirname}', t => {
  t.is(options.defaults['/{alter-ego}'].Superman.alias, 'Clark Kent');
});

test('ignores empty files', t => {
  t.falsy(options.defaults['/'].empty);
});

test('ignores file extensions other than .yml or .yaml', t => {
  t.falsy(options.defaults['/sub'].skip);
});

test('includes files recursively', t => {
  t.is(options.defaults['/sub'].StillUpper.hulk, 'smash');
});

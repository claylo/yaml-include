# yaml-include

[![Build Status](https://travis-ci.org/claylo/yaml-include.svg?branch=master)](https://travis-ci.org/claylo/yaml-include)
[![Coverage Status](https://coveralls.io/repos/claylo/yaml-include/badge.svg)](https://coveralls.io/r/claylo/yaml-include)
[![Dependency Status](https://david-dm.org/claylo/yaml-include.svg)](https://david-dm.org/claylo/yaml-include)
[![devDependency Status](https://david-dm.org/claylo/yaml-include/dev-status.svg)](https://david-dm.org/claylo/yaml-include#info=devDependencies)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)



This package provides support custom tags in a [YAML](http://yaml.org/) document that facilitate inclusion of external `.yaml` files, or directories of `.yaml` files. This functionality is of course frowned upon by the YAML core team, but I find YAML too damn useful as a configuration format to _not_ support inclusions. If you feel the same way, these tags will be helpful to you.

## Installation

```shell
$ npm install yaml-include
```

## Usage

A very small script can be created to leverage the `yaml-include` tags. The script would look something like this:

```js
var yaml = require('js-yaml');
var yamlinc = require('yaml-include');
var fs = require('fs');
var p = require('path');

// set the base file for relative includes
yamlinc.setBaseFile(p.join(__dirname, 'yaml-dir', 'base.yaml'));

var src = fs.readFileSync(yamlinc.basefile, 'utf8');

var obj = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA, filename: yamlinc.basefile });

// use your loaded object!
```

A YAML file using these tags might look like this (this file is in `example/swagger/spec.yaml`):

```yaml
swagger: "2.0"
info:
  description: |
    This is a sample server Petstore server.

    [Learn about Swagger](http://swagger.wordnik.com) or join the IRC channel `#swagger` on irc.freenode.net.

    For this sample, you can use the api key `special-key` to test the authorization filters
  version: "1.0.0"
  title: Swagger Petstore
  termsOfService: http://helloreverb.com/terms/
  contact:
    name: apiteam@wordnik.com
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0.html
host: petstore.swagger.wordnik.com
basePath: /v2
schemes:
  - http

paths: !!inc/dir [ 'paths' ]

securityDefinitions: !!inc/file security.yaml

definitions: !!inc/dir [ 'definitions', { recursive: false, allowEmpty: false }]

```

## How It Works

Documents and files discovered during inclusion using the `!!inc/dir` tag are added to a generated YAML segment. Processing considers directory names and file names (before the `.ext`) to be keys, and the contents are mapped onto them. The easiest way to explain is with an example.

Given `base.yaml` looks like this...

```yaml
name: Include Test
included: !!inc/dir [ 'inc' ]
```

with the default settings, you'd wind up with the following:

```
Directory Structure						Resulting YAML Equivalent
-------------------                     -------------------------
somedir/								name: Include Test
|-- base.yaml							included:
`-- inc/								  /:
    |-- -alt-ignore-prefix.yaml			    foo:
    |-- ToLower.yaml                          ... YAML contents of foo.yaml
    |-- _ignored/                           ToLower:
    |   |-- batman.yaml                       ... YAML contents of ToLower.yaml
    |   `-- captain-america.yaml            '-alt-ignore-prefix':
    |-- empty.yaml                            ... YAML contents of -alt-ignore-prefix.yaml
    |-- foo.yaml                          /sub:
    |-- sub/                                StillUpper:
    |   |-- StillUpper.yaml					  ... contents of StillUpper.yaml
    |   |-- _SomeVar/					  '/{alter-ego}':
    |   |   `-- hello.yaml			        Superman:
    |   `-- skip.data						  ... contents of Superman.yaml
    `-- ~alter-ego/
        `-- Superman.yaml

```

For a bunch of different examples on each of the subdirectories in this example, look in the [test/fixtures/options](claylo/yaml-include/test/fixtures/options) directory.

## YAML API

**Please note:** There's not much an API at all within the JavaScript files. This package extends the [js-yaml](http://npmjs.com/package/js-yaml) package, and the descriptions that follow are related to usage of the custom YAML tags this package exposes.

### !!inc/dir [ path [, options]  ]

Parses `path` as a single directory pathname. `options` is a `mapping` YAML type.

options:

- `allowEmpty` _(default: false)_ - allow an empty file to appear in the generated result. When set to true, an empty file named `empty.yaml` will be represented as `empty: {}`.
- `recursive` _(default: true)_ - Specifies whether or not to recurse into subdirectories.
- `extensions` _(default: ['.yaml', '.yml'])_ - Determines file extensions to consider for inclusion.
- `lowerKeys` _(default: false)_ - Force all keys gleaned from the directory hierarchy to lower case.
- `variableIndicator` _(default: '~')_ - When a file or directory name is prefixed with this character, the representation in the generated output will be wrapped in the `variablePrefix` and `variableSuffix` strings.
- `variablePrefix` _(default: '{')_ - When representing a variable, this string will precede the variable name.
- `variableSuffix` _(default: '}')_ - When representing a variable, this string will follow the variable name.
- `ignoreIndicator` _(default: '\_')_ - When a file or directory name is prefixed with this character, it and whatever contents it may hold will be ignored. **NOTE:** A whitelisted file path overrides this setting.
- `ignoreTopLevelDir` _(default: true)_ - Specifies if the directory being included use its own name as the initial key.
- `whitelist` _(default: [])_ - An array of paths to include regardless of any other settings.
- `blacklist` _(default: [])_ - An array of paths to skip regardless of any other settings.
- `excludeTopLevelDirSeparator` _(default: false)_ - Specifies if documents in the top level of the include path should be put under a key with an empty dir separator, or be added to the top level of the returned result.
- `pathSeparator` _(default: '/')_ - Determines path separator to use when joining subdirectory include paths together.

NOTE: if you want to use an `!!inc/dir` tag within an included file, make sure the inclusion path you enter is relative to the top-level included file.


### !!inc/file path

Parses `path` as a path to a single YAML document. The contents of that document will be a mapping under the key the tag is used on.

NOTE: Files are permitted to include other files or directories. Just make sure any paths within those files are relative to the top-level document.

## License

View the [LICENSE](LICENSE) file (ISC).

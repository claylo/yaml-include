'use strict';

var fs = require('fs');
var p = require('path');
var yaml = require('js-yaml');
var yamlinc = require('../index');
var recursiveReadSync = require('recursive-readdir-sync');
var assign = require('lodash.assign');
var merge = require('lodash.merge');
var isArray = require('lodash.isarray');
var debug = require('debug')('include-yaml:dir');

function IncludedDirectory(obj) {
  assign(this, obj);
}

/**
 * options:
 *   whitelist
 *   blacklist
 *   allowEmpty (default: false)
 *   recursive (default: true)
 *   lowerKeys (default: false)
 *   variableIndicatorPrefix (default: ~)
 *   ignoreIndicatorPrefix (default: _)
 */
function constructIncludedDirectory(data) {
  var defaults, opt, files, splitDirPath, tmp, included,
    src, ext, filename, key, work;

  work = {};
  opt = {};
  defaults = {
    whitelist: [],
    blacklist: [],
    allowEmpty: false,
    recursive: true,
    extensions: ['.yaml', '.yml'],
    lowerKeys: false,
    variableIndicator: '~',
    variablePrefix: '{',
    variableSuffix: '}',
    ignoreIndicator: '_',
    ignoreTopLevelDir: true,
    excludeTopLevelDirSeparator: false,
    pathSeparator: '/'
  };

  if (isArray(data[0])) {
    files = data[0];
  } else {
    debug('reading %s', data[0]);
    files = recursiveReadSync(data[0]);
    debug('files ', files);
  }

  // sort the by length of filepath
  files.sort(function(a, b) {
    return a.length - b.length;
  });

  if (!data[1]) {
    data[1] = {};
  }

  merge(opt, defaults, data[1]);

  debug('resolved options %j', opt);

  var keepFile = function(filepath) {
    ext = p.extname(filepath);
    if (opt.extensions.indexOf(ext) === -1) {
    //if (ext !== '.yaml' && ext !== '.yml') {
      // not a yaml file
      debug('skipping disallowed file extension %s: %s', ext, filepath);
      return false;
    }

    filename = p.basename(filepath, ext);

    // check whitelist for filepath and file name
    if (opt.whitelist.indexOf(filepath) !== -1 ||
      opt.whitelist.indexOf(filename) !== -1 ||
      opt.whitelist.indexOf(filename + ext) !== -1) {
      debug('whitelisting %s', filepath);
      return true;
    }

    // if ANY part of the path has an ignorePrefix,
    // skip it
    if (filepath.indexOf('/' + opt.ignoreIndicator) !== -1) {
      debug('ignoring %s', filepath);
      return false;
    }

    // check blacklist for filepath and file name
    if (opt.blacklist.indexOf(filepath) !== -1 ||
      opt.blacklist.indexOf(filename) !== -1 ||
      opt.blacklist.indexOf(filename + ext) !== -1) {
      debug('blacklisting %s', filepath);
      return false;
    }

    // guess we're keeping it!
    debug('keepFile: keeping ' + filepath);
    return true;
  };

  files.forEach(function(filepath) {

    if (!keepFile(filepath)) {
      return;
    }

    splitDirPath = filepath.split('/');
    splitDirPath.pop();

    // we generally don't want the top dir.
    if (opt.ignoreTopLevelDir) {
      splitDirPath.shift();
    }

    if (opt.lowerKeys) {
      filename = filename.toLowerCase();
    }

    // parameterize key
    if (opt.variableIndicator) {
      splitDirPath.forEach(function(element, i, a) {
        if (element.charAt(0) === opt.variableIndicator) {
          a[i] = opt.variablePrefix + element.substr(1) + opt.variableSuffix;
        }
      });
    }

    // get the source at last
    included = {};
    src = fs.readFileSync(filepath, 'utf8');
    if (src.length > 0) {
      included = yaml.load(src, { schema: yamlinc.YAML_INCLUDE_SCHEMA });
    }

    tmp = {};
    if (opt.recursive) {

      key = opt.excludeTopLevelDirSeparator ? '' : opt.pathSeparator;
      key += splitDirPath.join(opt.pathSeparator);
      if (opt.allowEmpty) {
        tmp[key] = {};
        tmp[key][filename] = included;
      } else {
        if (Object.getOwnPropertyNames(included).length > 0) {
          if (key.length > 0) {
            tmp[key] = {};
            tmp[key][filename] = included;
          } else {
            // this implements the opt.excludeTopLevelDirSeparator option when at the top level
            tmp[filename] = included;
          }
        }
      }
    } else {
      if (opt.allowEmpty) {
        tmp[filename] = included;
      } else {
        if (Object.getOwnPropertyNames(included).length > 0) {
          tmp[filename] = included;
        }
      }
    }

    work = merge(work, tmp);
  });
  return new IncludedDirectory(work);
}

/**
 * Since this is a sequence type, `data` must be an array
 */
function resolveIncludedDirectory(data) {
  return isArray(data) && data.length > 0 && data.length < 3;
}

module.exports = new yaml.Type('tag:yaml.org,2002:inc/dir', {
  kind: 'sequence',
  resolve: resolveIncludedDirectory,
  construct: constructIncludedDirectory,
  instanceOf: IncludedDirectory
});

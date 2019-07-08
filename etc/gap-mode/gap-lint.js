// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

// Depends on gap-lint.js from https://github.com/mcmartins/gap-lint

// declare global: GAPLint

/* global GAPLint */

define([
  'require',
  'base/js/namespace',
  'notebook/js/codecell',
  'codemirror/lib/codemirror',
  'codemirror/addon/lint/lint',
  'nbextensions/gap-mode/dist/Vendors',
  'nbextensions/gap-mode/dist/index',
], function (requirejs, Jupyter, CodeCell, CodeMirror) {
  'use strict';

  let load_css = function (name) {
    let link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = requirejs.toUrl(name, 'css');
    document.getElementsByTagName("head")[0].appendChild(link);
  };

  load_css('codemirror/addon/lint/lint.css');
  load_css('codemirror/addon/fold/foldgutter.css');
  
  CodeMirror.registerHelper('lint', 'gap', function validate(text) {
    if (!text || !window.GAPLint) return [];
    let errors = GAPLint.validate(text).getErrors();
    let found = [];
    errors.forEach(function(error) {
      found.push({
          message: error.message,
          severity: error.type,
          from: CodeMirror.Pos(error.line, error.column),
          to: CodeMirror.Pos(error.line, error.column + 100)
        });
    });
    return found;
  });
  
  // Change default for new cells
  CodeMirror.defaults['lineNumbers'] = true;
  CodeMirror.defaults['gutters'] = ['CodeMirror-lint-markers'];
  CodeMirror.defaults['lint'] = true;
  // Apply to any already-existing cells
  Jupyter.notebook.get_cells().forEach(function (cell) {
    if (cell instanceof CodeCell.CodeCell) {
      cell.code_mirror.setOption('lineNumbers', true);
      cell.code_mirror.setOption('gutters', ['CodeMirror-lint-markers']);
      cell.code_mirror.setOption('lint', true);
    }
  });
  
});

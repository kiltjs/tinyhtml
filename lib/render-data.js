
var _ = require('./utils'),
    RenderApp = require('./render-app'),
    con_text = require('./con-text'),
    interpolateText = con_text.interpolate;

module.export = function createApp(options) {
  options = options || {};

  var add_directives = _.extend({
        if: true,
        repeat: true,
        on: true,
      }, options.add_directives || {}),
      directive_ns = options.directive_ns || 'data',
      render_options = {},
      app = new RenderApp(render_options),
      scope = {},
      scope_listeners = [],
      watchScope = function (onData) {
        scope_listeners.push(onData);
        onData(scope);
      };

  app.withNode(function (node) {
    if( typeof node.text === 'string' ) return {
      initNode: function (el) {
        var renderText = interpolateText(node.text);

        watchScope(function (scope) {
          var text = renderText(scope);
          if( text !== el.textContent ) el.textContent = text;
        });
      }
    };
  });

  // Data envelope for RenderApp

  var data_app = Object.create(app);

  data_app.watchScope = watchScope;

  data_app.updateScope = function (_scope) {
    if( _scope ) scope = _scope;
    scope_listeners.forEach(function (listener) {
      listener(scope);
    });
  };

  data_app.directive = function (directive, initNode, with_node) {

    app.directive(directive, function () {
      this.watchScope = watchScope;
      initNode.apply(this, arguments);
    }, with_node);

  };

  // preset directives

  if( add_directives.if ) {
    data_app.directive(directive_ns + '-if', function (close_comment, attr_value, node, _with_node, render_options) {

      // @TODO stuff

      var parent_el = close_comment.parentElement,
          start_comment = document.createComment(' [ data-repeat: ' + attr_value + ' ' ),
          if_options = Object.create(render_options),
          assertExpression = con_text.eval(attr_value),
          inserted_node = null;

      parent_el.insertBefore(start_comment, close_comment);

      if_options.insert_before = close_comment;
      if_options.skip_preprocess = true;
      if_options._skip_data_if = true;

      this.watchScope(function (scope) {
        if( assertExpression(scope) ) {
          if( inserted_node ) return;

          if_options.scope = scope;
          var inserted_nodes = app.render(parent_el, [node], if_options);
          // inserted_node = close_comment.previousElementSibling;
          inserted_node = inserted_nodes[0].el;
        } else {
          if( inserted_node ) parent_el.removeChild(inserted_node);
        }
      });

    }, function (node, attr_value) {
      return {
        replace_by_comment: ' data-if: ' + attr_value + ' ] '
      };
    });
  }

  if( add_directives.repeat ) {
    data_app.directive(directive_ns + '-repeat', function (close_comment, attr_value, node, _with_node, render_options) {

      // @TODO stuff

      var parent_el = close_comment.parentElement,
          start_comment = document.createComment(' start data-repeat: ' + attr_value + ' ' ),
          matched_expressions = attr_value.match(/(\w+?) in (.+)/);

      if( !matched_expressions ) throw new Error('data-repeat invalid expression: ' + attr_value );

      var list_key = matched_expressions[1].trim(),
          getList = con_text.eval(matched_expressions[2]);

      // parent_el.replaceChild(comment_end, el);
      parent_el.insertBefore(start_comment, close_comment);

      this.watchScope(function (scope) {
        var list = getList(scope),
            // aux_el = document.createElement('div'),
            remove_el = start_comment.nextSibling;

        while( remove_el !== close_comment ) {
          parent_el.removeChild(remove_el);
          remove_el = start_comment.nextSibling;
        }

        if( !(list instanceof Array) ) throw new Error('expression \'' + matched_expressions[2] + '\' should return an Array');

        list.forEach(function (data_item) {
          var _scope = Object.create(scope),
              repeat_options = Object.create(render_options);

          _scope[list_key] = data_item;

          repeat_options.insert_before = close_comment;
          repeat_options._skip_data_repeat = true;
          repeat_options.skip_preprocess = true;
          repeat_options.scope = _scope;

          app.render(parent_el, [node], repeat_options);
        });
      });

    }, function (node, attr) {
      return {
        replace_by_comment: ' data-repeat: ' + attr,
      };
    });
  }

  return data_app;
};
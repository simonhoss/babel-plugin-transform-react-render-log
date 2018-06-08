const template = require("babel-template");

function generateTemplate(className) {
  return template(`
console.group('${className} render');
console.log(this.props);
console.log(this.state);
console.groupEnd('render');
`)();
}
const fs = require("fs");

module.exports = function testPlugin(babel) {
  return {
    visitor: {
      ClassMethod(path, state) {
        if (!!~state.file.opts.filename.indexOf("node_modules")) {
          return;
        }

        if (path.node.key && path.node.key.name === "render") {
          const classPath = path.findParent(path => path.isClassDeclaration());
          if (
            classPath.node.superClass &&
            classPath.node.superClass.type === "Identifier" &&
            classPath.node.superClass.name === "Component"
          ) {
            const className = classPath.node.id.name;

            path
              .get("body")
              .unshiftContainer("body", generateTemplate(className));
          }
        }
      },
      FunctionExpression(path, state) {
        if (!!~state.file.opts.filename.indexOf("node_modules")) {
          return;
        }

        if (path.node.id && path.node.id.name === "render") {
          const pathLocation = path.getPathLocation();
          const callExpressionPath = path.findParent(path =>
            path.isCallExpression()
          );
          if (!callExpressionPath) {
            return;
          }
          let className = "";
          const firstArgument = callExpressionPath.node.arguments[0];
          if (firstArgument && firstArgument.type === "Identifier") {
            className = firstArgument.name;
          }
          path
            .get("body")
            .unshiftContainer("body", generateTemplate(className));
        }
      }
    }
  };
};

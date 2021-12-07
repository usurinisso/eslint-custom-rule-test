module.exports = {
  meta: {
    fixable: "code",
  },
  create(context) {

    const sourceCode = context.getSourceCode();
    return {
      MethodDefinition(node) {
        if (node.key.name?.match(/get(.)*/)) {
          context.report({ node: node, message: 'get must be obtain' , 
          fix(fixer){
            const IndetifierToken = sourceCode.getFirstToken(
              node,
              token => token.type === 'Identifier' && token.value === node.key.name
            );
            return fixer.replaceText(IndetifierToken, node.key.name.replace('get', 'obtain'))
          }
        });
        }
      },
      CallExpression(node) {
        if (node.callee.name?.match(/get(.)*/)) {
          context.report({ node: node, message: 'get must be obtain' , 
          fix(fixer){
            const IndetifierToken = sourceCode.getFirstToken(
              node,
              token => token.type === 'Identifier' && token.value === node.callee.name
            );
            return fixer.replaceText(IndetifierToken, node.callee.name.replace('get', 'obtain'))
          }
        });
        }
      },
      FunctionDeclaration(node) {
        if (node.id.name?.match(/get(.)*/)) {
          context.report({ node: node, message: 'get must be obtain' , 
            fix(fixer){
              const IndetifierToken = sourceCode.getFirstToken(
                node,
                token => token.type === 'Identifier' && token.value === node.id.name
              );
              return fixer.replaceText(IndetifierToken, node.id.name.replace('get', 'obtain'))
            }
        });
        }
      },
    };
  },
};

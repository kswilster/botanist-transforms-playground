import { transform, rule, rest, subtree, simple } from 'botanist';

const extractDefault = transform([
  rule({ default: subtree('d'), ...rest('rest') }, function({ d, rest }) {
  })
]);

const replaceRefs = transform([
  rule({ $ref: simple('ref' )})
]);

export default function transformer(tree) {
  const properties = tree.properties;
  const defs = tree['$defs'];
  console.log(JSON.stringify(extractDefault(tree)));
}
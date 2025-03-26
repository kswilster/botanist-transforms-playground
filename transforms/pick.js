import { transform, rule, rest, subtree, simple } from 'botanist';

const pick = transform([
  rule({ value: simple('value'), condition: simple('condition') }, function({value, condition}) {
    return {value, condition};
  }),

  rule({ value: simple('value'), ...rest('rest') }, function({value, rest}) {
    return {value};
  }),

  rule({ children: subtree('children'), styles: subtree('styles'), ...rest('rest') }, function({children}) {
    return {children};
  }),

  rule({ children: subtree('children'), predicates: subtree('predicates'), ...rest('rest') }, function({children, predicates}) {
    return {children, predicates};
  }),

  rule({ children: subtree('children'), ...rest('rest') }, function({children}) {
    return {children};
  }),


  rule({ styles: subtree('styles'), ...rest('rest') }, function({rest}) {
    return {...rest};
  }),

  rule({ type: simple('type'), node: subtree('node'), ...rest('rest') }, function({type, node}) {
    return {type, node};
  }),
]);

export default pick;
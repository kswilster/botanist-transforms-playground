// import grouponCollapsible from './resources/groupon-collapsible.js';
// import bottomSheet from './resources/bottom-sheet.js';
// import fragranceNet from './resources/fragrance-net-control.js';
// import fnCollapsible from './resources/fragrance-net-collapsible-benefits.js';
import settings from "./resources/outer-layout-settings.js";
//  import hybrid from './resources/bottom-sheet-hybrid.js';
import { transform, rule, subtree } from "botanist";
// import {parse, print} from '@humanwhocodes/momoa';

function containsSettings(tree) {
  const keys = Object.keys(tree);
  return keys.some((key) => {
    return tree[key] && tree[key].tag == "setting";
  });
}

const sortKeys = transform([
  rule(
    { type: "Object", members: subtree("members"), ...rest("rest") },
    function ({ members, rest }) {
      members.sort((a, b) => {
        return ORDER_INDEX_MAP[a.name.value] - ORDER_INDEX_MAP[b.name.value];
      });
      return { type: "Object", members, ...rest };
    }
  ),
]);

const escape = transform([
  rule(
    { type: "EscapeHatch", node: subtree("node") },
    function ({ type, node }) {
      return {
        type,
        node: {
          ...node,
          data: JSON.stringify(node.data),
        },
      };
    }
  ),
]);

const flatten = transform([
  rule({ default: subtree("d"), ...rest("rest") }, function ({ d, rest }) {
    if (rest && Object.keys(rest).length) {
      // console.error('unhandled leaf', rest);
    }

    const results = [];
    if (d) {
      results.push({ key: "default", value: d[0] || null });
    }

    // if (pressed) {
    //   results.push({ key: "pressed", value: pressed[0] });
    // }

    const result = {
      tag: "setting",
      results,
    };
    return result;
  }),

  rule({ ...rest("rest") }, function ({ rest }) {
    if (rest && rest.length != null) {
      return rest;
    }

    if (typeof rest != "object") {
      console.error("ERR", rest);
    }

    if (!containsSettings(rest)) {
      return rest;
    }

    const results = [];

    for (let key of Object.keys(rest)) {
      if (rest[key].tag == "setting") {
        for (let result of rest[key].results) {
          results.push({ key: `${key}.${result.key}`, value: result.value });
        }
      } else {
        results.push({ key, value: rest[key] });
      }
    }
    const result = {
      tag: "setting",
      results,
    };

    return result;
  }),
]);

export default function flattenTree(tree) {
  const final = {};

  for (let { key, value } of flatten(settings).results) {
    final[key] = value;
  }

  console.log(JSON.stringify(final));
}

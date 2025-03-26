import { transform, rule, simple, rest, subtree } from 'botanist';

import grouponCollapsible from './resources/groupon-collapsible.js';


const CONDITION_NOT_DESKTOP = 'condition-not-desktop';
const CONDITION_DESKTOP = 'condition-desktop';
const PREDICATE_NOT_DESKTOP = 'predicate-not-desktop';
const PREDICATE_DESKTOP = 'predicate-desktop';

const TARGETS = {
  DESKTOP: 'Desktop',
  NOT_DESKTOP: 'NotDesktop',
};

const REPLACEMENTS = {
  NOT_DESKTOP: {
    PREDICATE: 'NOT_DESKTOP_PREDICATE',
    WHEN_NODE: { type: 'WHEN_NODE_REPLACEMENT', target: TARGETS.NOT_DESKTOP, children: []},
  },
  DESKTOP: {
    PREDICATE: 'DESKTOP_PREDICATE',
    WHEN_NODE: { type: 'WHEN_NODE_REPLACEMENT', target: TARGETS.DESKTOP, children: []},
  }
};

const MATCHERS = {
  NOT_DESKTOP: {
    PREDICATE: {
      "type": "Breakpoint",
      "predicate": {
        "value": "desktop",
        "condition": "is-not"
      }
    },
    WHEN_NODE: {
      type: "When",
      node: {
        children: [...rest('children')],
        predicates: [REPLACEMENTS.NOT_DESKTOP.PREDICATE, ...rest('tail')],
        // TODO: figure out how to capture other predicates and promote them
        // predicates: [...rest('head'), REPLACEMENTS.NOT_DESKTOP.PREDICATE, ...rest('tail')],
      }
    },
    WHEN_PARENT: {
      ...rest('rest'),
      node: {
        ...rest('nodeRest'),
        children: [{ ...REPLACEMENTS.NOT_DESKTOP.WHEN_NODE, children: [...rest('children')] }, ...rest('tail')],
        // children: [...rest('head'), { ...REPLACEMENTS.NOT_DESKTOP.WHEN_NODE, children: [...rest('children')] }, ...rest('tail')],
      }
    }
  },
  DESKTOP: {
    PREDICATE: {
      "type": "Breakpoint",
      "predicate": {
        "value": "desktop",
        "condition": "is"
      }
    },
    WHEN_NODE: {
      type: "When",
      node: {
        children: [...rest('children')],
        predicates: [REPLACEMENTS.DESKTOP.PREDICATE, ...rest('tail')],
        // TODO: figure out how to capture other predicates and promote them
        // predicates: [...rest('head'), REPLACEMENTS.DESKTOP.PREDICATE, ...rest('tail')],
      }
    },
    // WHEN_PARENT: {
    //   ...rest('rest'),
    //   node: {
    //     ...rest('nodeRest'),
    //     children: [{ ...REPLACEMENTS.DESKTOP.WHEN_NODE, children: [...rest('head'), ...rest('children')] }, ...rest('tail')],
    //     children: [...rest('head'), { ...REPLACEMENTS.DESKTOP.WHEN_NODE, children: [...rest('children')] }, ...rest('tail')],
    //   }
    // }
  },
  WHEN_PARENT: {
    children: [...rest('children')],
    ...rest('rest'),
  }
}

const WHEN_NODE = {
  type: 'When',
  node: {
    children: [],
    predicates: [],
  }
}

const filterBreakpoint = (target) => {
    return transform([
    // NOT_DESKTOP rules: drop when node and children
    rule(MATCHERS.NOT_DESKTOP.PREDICATE, function() {
      return REPLACEMENTS.NOT_DESKTOP.PREDICATE;
    }),

    rule(MATCHERS.NOT_DESKTOP.WHEN_NODE, function({children, tail}) {
      if (tail.length && target === TARGETS.NOT_DESKTOP) {
        return {
          type: "When",
          node: {
            children,
            predicates: tail
          }
        };
      }
      return { ...REPLACEMENTS.NOT_DESKTOP.WHEN_NODE, children };
    }),

    // DESKTOP rules: drop when nodes, keep children
    rule(MATCHERS.DESKTOP.PREDICATE, function() {
      return REPLACEMENTS.DESKTOP.PREDICATE;
    }),

    rule(MATCHERS.DESKTOP.WHEN_NODE, function({children, tail}) {
      if (tail.length && target === TARGETS.DESKTOP) {
        return {
          type: "When",
          node: {
            children,
            predicates: tail
          }
        };
      }
      return { ...REPLACEMENTS.DESKTOP.WHEN_NODE, children };
    }),

    // general when parent rule
    rule(MATCHERS.WHEN_PARENT, ({children, rest}) => {
      if (!children.length) {
        return { ...rest, children};
      }

      const whenNode = children.findIndex((child) => child.type === 'WHEN_NODE_REPLACEMENT');
      if (whenNode === -1) return { ...rest, children };

      const newChildren = [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.type === 'WHEN_NODE_REPLACEMENT') {
          if (child.target === target) {
            newChildren.push(...child.children);
          } else {
            continue;
          }
        } else {
          newChildren.push(child);
        }
      }

      return { ...rest, children: newChildren};
    })
  ]);
};

const simulateDesktop = filterBreakpoint(TARGETS.DESKTOP);
const simulateMobile = filterBreakpoint(TARGETS.NOT_DESKTOP);

function findFirstParent(tree) {
  

}

// function refactor(experiencesResponse) {
//   const outerLayoutSchema = experiencesResponse.plugins[0].plugin.config.outerLayoutSchema;
//   const slots = experiencesResponse.plugins[0].plugin.config.slots;

//   experiencesResponse.plugins[0].plugin.config.outerLayoutSchema = {

//   }
// }

console.log(JSON.stringify(simulateMobile(grouponCollapsible)));
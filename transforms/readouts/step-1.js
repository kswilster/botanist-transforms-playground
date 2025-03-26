import { transform, rule, rest, subtree, simple } from "botanist";

const step1 = transform([
  rule(
    {
      bucketMetadata: subtree("bucketMetadata"),
      ...rest("rest"),
    },
    function ({ bucketMetadata }) {
      return { bucketMetadata };
    }
  ),
]);

export default step1;

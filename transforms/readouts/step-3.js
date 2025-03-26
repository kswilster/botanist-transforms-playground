import { transform, rule, rest, subtree, simple } from "botanist";

const step2 = transform([
  rule(
    { metricReports: subtree("metricReports"), ...rest("rest") },
    function ({ metricReports, ...rest }) {
      return {
        metricReports: metricReports.filter((element) => element !== null),
        ...rest,
      };
    }
  ),

  rule(
    {
      bucketMetadata: subtree("bucketMetadata"),
      reports: subtree("reports"),
    },
    function ({ bucketMetadata, reports }) {
      return { reports };
    }
  ),

  rule(
    {
      metricResult: subtree("metricResult"),
      bucketId: simple("bucketId"),
      ...rest("rest"),
    },
    function ({ metricResult, bucketId }) {
      metricResult = {
        value: metricResult.value,
        unit: metricResult.unit,
      };

      return {
        bucketId,
        metricResult,
      };
    }
  ),

  rule(
    {
      metricId: subtree("metricId"),
      bucketMetricResults: subtree("bucketMetricResults"),
      ...rest("rest"),
    },
    function ({ metricId, bucketMetricResults }) {
      if (metricId === "pageDisplayRate") {
        return { metricId, bucketMetricResults };
      }
      return null;
    }
  ),

  // TODO: get rid of baseMetricResults, bucketRecommendation, daysLive, bucketMetadata, upper, lower, variantMetricResults
  // transform probablityToBeatBaseline to probabilityToBeatBaseline

  rule(
    {
      report: subtree("report"),
      ...rest("rest"),
    },
    function ({ report }) {
      return { report };
    }
  ),
]);

export default step2;

// Step A:
// only return days live

// Step B:

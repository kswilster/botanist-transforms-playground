import { transform, rule, rest, subtree, simple } from "botanist";

const step2 = transform([
  rule(
    { metricReports: subtree("metricReports"), ...rest() },
    function ({ metricReports }) {
      return {
        metricReports: metricReports.filter((element) => element !== null),
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
      metricImprovement: subtree("metricImprovement"),
      probablityToBeatBaseline: subtree("probabilityToBeatBaseline"),
      ...rest(),
    },
    function ({
      metricResult,
      bucketId,
      metricImprovement,
      probabilityToBeatBaseline,
    }) {
      metricResult = {
        value: metricResult.value,
        unit: metricResult.unit,
      };

      metricImprovement = metricImprovement?.value
        ? {
            value: metricImprovement.value,
            unit: metricImprovement.unit,
          }
        : null;

      return {
        bucketId,
        metricImprovement,
        metricResult,
        probabilityToBeatBaseline,
      };
    }
  ),

  rule(
    {
      metricId: subtree("metricId"),
      bucketMetricResults: subtree("bucketMetricResults"),
      ...rest(),
    },
    function ({ metricId, bucketMetricResults }) {
      if (metricId === "defaultExpectedValuePerTransactions") {
        return { metricId, bucketMetricResults, ...rest };
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

import ParentSize from "@visx/responsive/lib/components/ParentSize";
import { Chart } from "../charts/bar-chart";
import { useStats } from "@/lib/swr/use-stats";
import ErrorPage from "next/error";


export default function StatsChart({documentId, totalPages = 0}: {documentId: string, totalPages?: number}) {
  const { stats, error } = useStats();

  if (error && error.status === 404) {
    return <ErrorPage statusCode={404} />;
  }

  if (!stats?.duration.data) {
    return <div>No data</div>;
  }

  let durationData = {
    data: Array.from({ length: totalPages }, (_, i) => ({
      pageNumber: (i + 1).toString(),
      avg_duration: 0,
    })),
  };

  const swrData = stats?.duration;

  durationData.data = durationData.data.map((item) => {
    const swrItem = swrData.data.find(
      (data) => data.pageNumber === item.pageNumber
    );
    return swrItem ? swrItem : item;
  });

  return (
    <div className="h-96">
      <ParentSize>
        {({ width, height }) => (
          <Chart
            width={width}
            height={height}
            documentId={documentId}
            data={durationData.data}
          />
        )}
      </ParentSize>
    </div>
  );
} 
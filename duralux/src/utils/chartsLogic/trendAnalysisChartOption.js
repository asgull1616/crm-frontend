export const trendAnalysisChartOption = (colors) => {
  return {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    colors: colors || ['#6366f1', '#a855f7'], // Indigo ve Purple tonları
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth', // Görseldeki o dalgalı efekt
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    grid: {
      borderColor: '#f1f1f1',
      strokeDashArray: 4,
    },
    xaxis: {
      categories: ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}k`,
      },
    },
    legend: { position: 'top', horizontalAlign: 'right' },
  };
};

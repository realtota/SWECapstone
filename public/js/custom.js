// custom.js
document.addEventListener('DOMContentLoaded', function () {
  stockData.forEach(function (stock) {
    const ctx = document.getElementById(chart-${stock.meta.symbol}).getContext('2d');
    const labels = stock.values.map(value => value.datetime).reverse();
    const data = stock.values.map(value => parseFloat(value.close)).reverse();

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: stock.meta.symbol,
          data: data,
          backgroundColor: 'rgba(0, 123, 255, 0.5)',
          borderColor: 'rgba(0, 123, 255, 1)',
          fill: false,
        }]
      },
      options: {
        scales: {
          xAxes: [{
            type: 'time',
            distribution: 'series',
            time: {
              unit: 'day'
            }
          }]
        }
      }
    });
  });
});
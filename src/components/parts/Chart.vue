<script>
/* global web3 */
import { Line } from 'vue-chartjs'
import { apiAddress } from '@/config'

export default {
  name: 'LineChart',
  extends: Line,
  mounted () {
    this.getLastTen()
  },
  methods: {
    getLastTen: function () {
      fetch(`${apiAddress}/market/lastten?asset=${web3.toChecksumAddress(this.$root.$data.selectedListing.asset)}`)
        .then((response) => {
          return response.json()
        })
        .then((json) => {
          this.setData(json)
        })
    },
    setData: function (json) {
      let labels = []
      let data = []
      json.data.map((listing, i) => {
        labels.push(i + 1)
        data.push((listing.value / Math.pow(10, this.$root.$data.tokens[this.$root.$data.selectedListing.asset].decimals)).toFixed(2))
      })
      data = data.reverse()
      this.data.data = {
        labels,
        datasets: [
          {
            label: 'Price (LOOT)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            data,
            fill: true,
            borderColor: '#6c66fb',
            pointHoverBorderColor: 'transparent',
            pointHitRadius: 10,
            pointBackgroundColor: '#6c66fb'
          }
        ]
      }
      this.renderChart(this.data.data, this.options)
    }
  },
  data () {
    return {
      data: {
        labels: [],
        datasets: [
          {
            label: 'Price',
            backgroundColor: '#272942',
            data: [],
            fill: false,
            borderColor: '#6c66fb',
            pointHoverBorderColor: 'transparent',
            pointRadius: 0,
            pointHitRadius: 10,
            pointBackgroundColor: '#6c66fb'
          }
        ]
      },
      options: {
        elements: {
          line: {
            tension: 0
          },
          point: {
            radius: 0,
            hoverRadius: 0
          }
        },
        legend: false,
        tooltips: {
          titleFontSize: 0,
          titleSpacing: 0,
          titleMarginBottom: 0
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: 'rgba(0,0,0,0.2)'
            },
            ticks: {
              fontColor: '#ffffff'
            },
            display: true
          }],
          yAxes: [{
            display: true,
            gridLines: {
              color: 'rgba(0,0,0,0.2)'
            },
            ticks: {
              fontColor: '#ffffff'
            }
          }]
        }
      }
    }
  }
}
</script>

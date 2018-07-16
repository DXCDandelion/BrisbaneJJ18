<template>
  <div class="container">
    <div class="Chart__list">
      <div class="Chart">
        <h2>Burndown for {{title}}</h2>
        <v-list>
          <v-btn v-for="(sprint, index) in sprints" :key="index" color="success" @click="setSprint(sprint)">
            {{sprint}}
          </v-btn>
          <v-btn v-if="selectedSprint" :key="title" color="danger" @click="storeTodaysRemainingWork()">
            Store Today's Remaining Work
          </v-btn>
        </v-list>
        <line-chart :chartData="chartData" :options="chartOptions" :key="chartKey"></line-chart>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from '@/components/LineChart.js'
import axios from 'axios'
import moment from 'moment'
import Vue from 'vue'

export default {
  name: 'burndown',

  components: {
    LineChart
  },

  data () {
    return {
      loading: false,
      githubData: [],
      sprints: [],
      selectedSprint: null,
      title: '[...select sprint...]',
      sprintDays: [],
      chartKey: '',
      chartData: {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [
          {
            label: 'Ideal',
            borderColor: '#59f442',
            data: []
          },{
            label: 'Burndown',
            backgroundColor: '#05CBE1',
            // lineTension: 0,
            data: []
          }
        ]
      },
      chartOptions: {
        responsive: true, 
        maintainAspectRatio: false,
        legend: {
          labels: {
            fontColor: '#dde500'
          }
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#dde500'
            },
            scaleLabel: {
              display: true,
              labelString: 'Remaining Work',
              fontColor: '#dde500'
            }
          }],
          xAxes: [{
            ticks: {
              fontColor: '#dde500'
            }
          }]
        }
      }
    }
  },

  mounted () {
    this.getGithubData()
  },

  methods: {
    getGithubData () {
      this.loading = true;
      axios.get('https://github.dxc.com/api/v3/repos/dandelion/BrisbaneJJ18/issues?state=all', {headers: {'Authorization': 'Bearer 41fea3d0467e159325a49a13177e0d5af10131c9'}})
      .then((response)  =>  {
        this.loading = false
        this.githubData = response.data
        this.extractSprints(this.githubData)
      }, (error)  =>  {
        this.loading = false
      })
    },

    extractSprints (data) {
      let milestones = data.map(x => x.milestone)
      // get a unique list of sprint names
      this.sprints = [...new Set(milestones.filter(x => x).map(x => x.title))]
    },

    setSprint (sprint) {
      this.title = sprint
      // get all the issues for the selected sprint
      this.selectedSprint = this.githubData.filter(x => x.milestone != null).filter(x => x.milestone.title === sprint)
      this.setDayLabels()
      this.extractEstimateTotal()
      // FOR TESTING Vue.ls.set('08-05-18', 9)
      // FOR TESTING Vue.ls.set('09-05-18', 8)
      // FOR TESTING Vue.ls.set('10-05-18', 3)
      // FOR TESTING Vue.ls.set('11-05-18', 1)
      this.getRemainingTotals()
      this.chartKey = this.title
    },

    setDayLabels () {
      let lastDay = moment(this.selectedSprint[0].milestone.due_on).add(1, 'day')
      this.sprintDays = ['','','','',''].map((x, i) => {
        return lastDay.subtract(1, 'day').format('DD-MM-YY')
      }).reverse()
      this.chartData.labels = this.sprintDays
    },

    extractLabels () {
      // grab all issues that have labels
      let withLabels = this.selectedSprint.filter(x => x.labels.length > 0)
      // extract the just the labels from the issues and flatten them into one array
      return withLabels.map(x => x.labels).reduce((a, b) => a.concat(b), [])
    },
    
    extractEstimateTotal () {
      let labels = this.extractLabels()
      // filter just the estimate labels
      let estimateLabels = labels.filter(x => x.color === 'fbca04')
      // strip the 'E' from the label name
      let estimates = estimateLabels.map(x => parseInt(x.name.replace('E', '')))
      // sum all the esitmates
      // let estimateTotal = estimates.reduce((a, b) => a + b, 0)
      let estimateTotal = 240
      //assume 5 day sprints (5th day should be zero)
      let average = estimateTotal/4
      this.chartData.datasets[0].data = [0,0,0,0,0].map((x, i) => x+i*average).reverse()
      // initialise day 1 remaining work total as estimate total
      let firstDay = moment(this.selectedSprint[0].milestone.due_on).subtract(4, 'days')
      Vue.ls.set(moment(firstDay).format('DD-MM-YY'), estimateTotal)
    },

    getRemainingTotals () {
      let lastDay = moment(this.selectedSprint[0].milestone.due_on).add(1, 'day')
      this.chartData.datasets[1].data = [0,0,0,0,0].map((x, i) => {
        return Vue.ls.get(lastDay.subtract(1, 'day').format('DD-MM-YY'))
      }).reverse()
    },

    storeTodaysRemainingWork () {
      let labels = this.extractLabels()
      let remainingWorkLabels = labels.filter(x => x.color === 'c8e871')
      // strip the 'R' from the label name
      let remainingWork = remainingWorkLabels.map(x => parseInt(x.name.replace('R', '')))
      // sum all the esitmates
      let remainingWorkTotal = remainingWork.reduce((a, b) => a + b, 0)
      // store in local storage
      Vue.ls.set(moment().format('DD-MM-YY'), remainingWorkTotal)
      // FOR TESTING Vue.ls.set('11-05-18', Math.floor((Math.random() * 10) + 1))
      this.getRemainingTotals()
      this.chartKey = 'Updated='+Date.now()
    }
  }
}
</script>

<style>
.container {
  max-width: 1000px;
  margin:  0 auto;
}
.Chart {
  background: #212733;
  border-radius: 15px;
  box-shadow: 0px 2px 15px rgba(25, 25, 25, 0.27);
  margin:  25px 0;
}

.Chart h2 {
  margin-top: 0;
  padding: 15px 0;
  color:  rgba(221, 229, 0);
  border-bottom: 1px solid #323d54;
}
</style>
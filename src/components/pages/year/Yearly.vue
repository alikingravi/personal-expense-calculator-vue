<template>
    <div class="yearly">
        <div class="container">
            <!-- Errors -->
            <div v-if="showError" class="section">
                <h1>An Error has occurred</h1>
                <p>{{ errors }}</p>
                <button type="button" class="button is-danger" @click="showError=false">Dismiss</button>
            </div>

            <div class="section">
                <h1 class="title">
                    Yearly Data Analysis
                    <button type="button" class="button" @click="filterYearlyData">Load Data</button>
                </h1>
                <highcharts :options="yearly_options" ref="yearlyChart"></highcharts>
            </div>
            <div class="section">
                <h1 class="title">
                    Savings
                    <button type="button" class="button" @click="filterSavingsData">Load Data</button>
                </h1>
                <highcharts :options="savings_options" ref="savingsChart"></highcharts>
            </div>
            <div class="section">
                <h1 class="title">
                    Yearly Categories Chart
                    <button type="button" class="button" @click="filterYearlyCategoriesData">Load Data</button>
                </h1>
                <highcharts :options="bills_options" ref="billsChart"></highcharts>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    created() {
        this.getData()
        this.getYearlyCategiesData()
    },
    data () {
        return {
            showError: false,
            errors: {},
            analysis_data: {},
            savings_data: {},
            yearly_options: {},
            savings_options: {},
            bills_options: {},
            month_names: [],
            analysis_values: {},
            savings_names: [],
            savings_values: [],
            yearly_categories: [],
            bills: [],
            groceries: [],
            restaurants: [],
            year: this.$route.params.year
        }
    },
    methods: {
        // API Calls
        getData () {
          axios.get('/api/data/get/' + this.year)
              .then (response => {
                  this.analysis_data = response.data.yearly_info;
                  this.savings_data = response.data.savings;
              })
              .catch (error => {
                  this.errors = error;
                  this.showError = true;
              })
        },
        getYearlyCategiesData () {
            axios.get('/api/data/yearly-categories/' + this.year)
                .then(response => {
                    this.yearly_categories = response.data.yearly_categories
                })
                .catch(error => {
                    this.errors = error;
                    this.showError = true;
                })
        },
        loadBillsData () {
            this.filterBillsData()
        },

        // Filter Data
        filterYearlyData () {
            // Set axis data
            this.filterData(this.analysis_data, this.month_names, this.analysis_values)
            this.loadYearlyAnalysisChart()
        },
        filterSavingsData () {
            this.savings_names = Object.keys(this.savings_data)

            let values = Object.values(this.savings_data)
            for (let i=0; i<values.length; i++) {
                this.savings_values.push(parseFloat(values[i]))
            }
            this.loadSavingsChart()
        },
        filterData (data, xAxis, yAxis) {
            // Get keys of object (January, February etc)
            let keys = Object.keys(data)

            // Store them in an array
            for (let i=0; i<keys.length; i++) {
                xAxis.push(keys[i])
            }
            // Get values of object
            let values = Object.values(data)

            // Form Analysis Data Object
            let moneyIn = [];
            let moneyOut = [];
            let savings = [];
            for (let i=0; i<values.length; i++) {
                moneyIn.push(values[i].money_in);
                moneyOut.push(values[i].money_out);
                savings.push(values[i].savings);
            }
            yAxis.money_in = moneyIn;
            yAxis.money_out = moneyOut;
            yAxis.savings = savings;
        },
        filterYearlyCategoriesData () {
            this.filterObjectData(this.yearly_categories.bills, this.bills)
            this.filterObjectData(this.yearly_categories.groceries, this.groceries)
            this.filterObjectData(this.yearly_categories.restaurants, this.restaurants)
            this.loadBillsChart()
        },
        filterObjectData (data, category) {
            // Get values of object
            let values = Object.values(data)

            // Store values in an array
            for (let i=0; i<values.length; i++) {
                category.push(parseFloat(values[i]))
            }
        },

        // Charts
        loadYearlyAnalysisChart () {
            this.yearly_options = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Yearly Data Analysis',
                    x: -20 //center
                },
                xAxis: {
                    categories: this.month_names
                },
                yAxis: {
                    max: 5000,
                    min: -5000,
                    title: {
                      text: 'Expense (£)'
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>£{point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: "Money In",
                    data: this.analysis_values.money_in
                }, {
                    name: "Money Out",
                    data: this.analysis_values.money_out
                }, {
                    name: "Savings",
                    data: this.analysis_values.savings
                }]
            };
        },
        loadSavingsChart () {
            this.savings_options = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Yearly Savings',
                    x: -20 //center
                },
                xAxis: {
                    categories: this.savings_names
                },
                yAxis: {
                    max: 3000,
                    min: -3000,
                    title: {
                      text: 'Expense (£)'
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>£{point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: "Savings",
                    data: this.savings_values
                }]
            };
        },
        loadBillsChart () {
            this.bills_options = {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Yearly Bills',
                    x: -20 //center
                },
                xAxis: {
                    categories: this.month_names
                },
                yAxis: {
                    max: 1000,
                    min: 0,
                    title: {
                      text: 'Expense (£)'
                    },
                    plotLines: [{
                      value: 0,
                      width: 1,
                      color: '#808080'
                    }]
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>£{point.y:.1f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: "Bills",
                    data: this.bills
                }, {
                    name: "Groceries",
                    data: this.groceries
                }, {
                    name: "Restaurants",
                    data: this.restaurants
                }]
            };
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
@import '../../../assets/sass/app.scss';

</style>

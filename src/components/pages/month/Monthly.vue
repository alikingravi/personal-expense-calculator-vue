<template>
    <div class="monthly">
        <div class="container">
            <!-- Errors -->
            <div v-if="showError" class="section">
                <h1>An Error has occurred</h1>
                <p>{{ errors }}</p>
                <button type="button" class="button is-danger" @click="showError=false">Dismiss</button>
            </div>

            <!-- Monthly Data -->
            <div class="section">
                <h1 class="title">
                    {{this.date.month}} {{this.date.year}} Expenses
                    <button type="button" class="button" @click="filterMonthlyExpensesData">Load Data</button>
                </h1>
                <highcharts :options="monthly_options" ref="monthlyChart"></highcharts>
            </div>

            <!-- Categories Data -->
            <div class="section">
                <h1 class="title">
                    Categories
                    <button type="button" class="button" @click="filterMonthlyCategoriesData">Load Data</button>
                </h1>
                <highcharts :options="category_options" ref="categoriesChart"></highcharts>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import HighCharts from 'vue-highcharts'

export default {
    created() {
        this.getData()
    },
    data () {
        return {
            showError: false,
            errors: {},
            monthly_options: {},
            category_options: {},
            date: {},
            monthly_data: {},
            categories_data: {},
            expense_names: [],
            expense_values: [],
            category_names: [],
            category_values: [],
            year: this.$route.params.year,
            month: this.$route.params.month
        }
    },
    methods: {
        // API Calls
        getData () {
            axios.get('/api/data/get/'+this.year+'/'+this.month)
              .then (response => {
                  this.date.month = response.data.all_data[0].month
                  this.date.year = response.data.all_data[0].year
                  this.monthly_data = response.data.all_data[0].monthly_data
                  this.categories_data = response.data.all_data[0].categories_data
              })
              .catch (e => {
                  this.errors = error;
                  this.showError = true;
              })
        },
        filterMonthlyExpensesData () {
            // Set axis data
            this.filterData(this.monthly_data, this.expense_names, this.expense_values)
            this.loadMonthlyExpenseChart()
        },
        filterMonthlyCategoriesData() {
            this.filterData(this.categories_data, this.category_names, this.category_values)
            this.loadMonthlyCategoriesChart()
        },
        filterData (data, xAxis, yAxis) {
            let json = JSON.parse(data)
            let keys = Object.keys(json)

            // Get values for x-axis
            for (let i=0; i<keys.length; i++) {
                xAxis.push(keys[i])
            }

            // Get values for y-axis
            let values = Object.values(json)
            for (let i=0; i<values.length; i++) {
                yAxis.push(parseFloat(values[i]))
            }
        },

        // Charts
        loadMonthlyExpenseChart () {
            this.monthly_options = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Monthly Expenditures',
                    x: -20 //center
                },
                xAxis: {
                categories: this.expense_names
                },
                yAxis: {
                    max: 200,
                    min: -200,
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
                    valueSuffix: '£'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    data: this.expense_values
                }]
            };
        },
        loadMonthlyCategoriesChart () {
            this.category_options = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Monthly Expenditures',
                    x: -20 //center
                },
                xAxis: {
                categories: this.category_names
                },
                yAxis: {
                    max: 2000,
                    min: -2000,
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
                    valueSuffix: '£'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    data: this.category_values
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

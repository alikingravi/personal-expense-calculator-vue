<template>
    <div class="home">
        <div class="container">
            <!-- Errors -->
            <div v-if="showError" class="section">
                <h1>An Error has occurred</h1>
                <p>{{ errors }}</p>
                <button type="button" class="button is-danger" @click="showError=false">Dismiss</button>
            </div>

            <!-- Months Buttons -->
            <div class="section">
                <h1>Monthly Expenditures</h1>
                <div v-for="(value, year) in years_and_months" class="box m-t-30">
                    <h1 class="title">{{ year }}</h1>
                    <ul>
                        <li v-for="month in value">
                            <router-link  :to="'/monthly-data/'+year+'/'+month" class="button is-warning">{{ month }}</router-link>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Years Buttons -->
            <div class="section">
                <h1>Yearly Expenditures</h1>
                <div class="m-t-30">
                    <ul>
                        <li v-for="(value, year) in years_and_months">
                            <router-link :to="'/yearly-data/'+year" class="button is-info">{{ year }}</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    created() {
        this.getYearsAndMonths();
    },
    data () {
        return {
            years_and_months: {},
            errors: {},
            showError: false
        }
    },
    methods: {
        getYearsAndMonths () {

        // API Call to microservice
        axios.get('/api/data/get/years-and-months')
            .then (response => {
                this.years_and_months = response.data.years_months;
            })
            .catch (error => {
                this.errors = error;
                showError = true;
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
@import '../../assets/sass/app.scss';

</style>

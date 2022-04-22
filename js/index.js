/* eslint-disable no-undef */
let app = Vue.createApp({
    //...
    data: function() {
        return {
            API_URL: 'https://data.covid19bharat.org/v4/min/data.min.json',
            mapEl: undefined,
            indiaEL: undefined,
            container: undefined,
            w: 953.73,
            h: 984,
            vbx: 0,
            vby: 0,
            viewBoxH: 600,
            viewBoxW: 500,
            focusedState: 'UN',
            stateWiseData: {
                'TT': 43052521,
                'AN': 10034,
                'AP': 2319653,
                'AR': 64495,
                'AS': 724204,
                'BR': 830514,
                'CH': 91976,
                'CT': 1152228,
                'DN': 11441,
                'DL': 1871657,
                'GA': 245376,
                'GJ': 1224214,
                'HR': 988156,
                'HP': 284737,
                'JK': 453966,
                'JH': 435196,
                'KA': 3946645,
                'KL': 6538674,
                'LA': 28242,
                'LD': 11402,
                'MP': 1041281,
                'MH': 7876382,
                'MN': 137205,
                'ML': 93792,
                'MZ': 226590,
                'NL': 35488,
                'OR': 1287968,
                'PY': 165777,
                'PB': 759355,
                'RJ': 1283265,
                'SK': 39148,
                'UN': 0,
                'TN': 3453351,
                'TG': 791709,
                'TR': 100876,
                'UP': 2072268,
                'UT': 437356,
                'WB': 2017900
            },
            currentPercent: 100,
            displayEl: undefined
        }
    },
    methods: {
        renderChart() {
            this.container = d3.select('#chart')
                //.append("svg:svg")
                // .attr("width", this.viewBoxW)
                // .attr("height", this.viewBoxH)
                //.attr("viewBox", `0 0 ${this.viewBoxH} ${this.viewBoxW}`)
                //let map = this.container.append("svg:g")

            this.indiaEl = d3.select('#hook').append('g')
                .attr('id', 'india')
                .style('stroke', '#000')
                .style('stroke-width', '0.5')
                // TODO refer https:/ / bl.ocks.org / almccon https: //observablehq.com/collection/@d3/

            let url = 'js/map.geojson'
            let self = this //scope magic do not touch
            Promise.resolve(d3.json(url)).then((data) => {

                let proj = d3.geoMercator()
                    .fitSize([this.viewBoxW, this.viewBoxH / 2], data)
                    // .scale(1000)
                    // .translate([-1385, 820]);
                let path = d3.geoPath().projection(proj)
                    //Put projection and path inside the promise
                    //this allows projection to act on dataset

                this.indiaEl.selectAll('path')
                    .data(data.features)
                    .enter().append('path')
                    .attr('d', path)
                    .attr('id', (d) => { return d.id }) //need function return to get value within enumeration
                    .style('fill', (d) => {
                        return this.getRandomColor(d.id)
                    })
                    .on('mouseover', function() { self.handleMouseOver(this) })
                    .on('mouseout', function() { self.handleMouseOut(this) })
                    .append('title')
                    .text((d) => {
                        return 'State : ' + d.title + '\n Here goes the state data'
                    })


                let aa = [80.9462, 26.8467]
                    // add circles to svg
                this.indiaEl.selectAll('circle')
                    .data([aa]).enter()
                    .append('circle')
                    .attr('cx', function(d) { return proj(d)[0] })
                    .attr('cy', function(d) { return proj(d)[1] })
                    .attr('r', '3px')
                    .attr('fill', 'black')
                    .on('mouseover', function() {
                        d3.select(this).attr('r', '6px').style('fill', 'orange')
                    })
                    .on('mouseout', function() {
                        d3.select(this).attr('r', '3px').style('fill', 'black')
                    })
                    .append('title')
                    .text(function(d) {
                        return 'City : ' + d.title + '\n Here goes the City data'
                    })

            })

        },
        handleMouseOver(that) {
            d3.select(that).attr('stroke-width', '1.5')
            this.focusedState = that.id;
            let percent = (this.stateWiseData[that.id] / this.stateWiseData['TT']) * 100
            this.currentPercent = percent.toFixed(2);
            console.log(percent);
        },
        handleMouseOut(that) {
            d3.select(that).attr('stroke-width', '0.5')
        },
        getRandomColor(id) {
            let totalData = this.stateWiseData['TT'];
            let currentState = this.stateWiseData[id];
            let baseColor = 'rgba(255, 7, 58,';
            let healthPercent = (currentState / totalData) * 10;
            console.log(healthPercent)
            return (baseColor + '' + healthPercent + ')')
        },
        getColor() {

        }

    },
    computed: {
        //
        viewbox() {
            // const { vbx, vby, viewBoxW, viewBoxH } = this.$data;
            // return [vbx, vby, viewBoxW, viewBoxH].join(' ');
            //Ignore above formula for now 
            return '90 -10 320 320'
                // ^Temporary JANK implementation
        }
    },
    mounted() {
        /* const rect = this.$el.getBoundingClientRect();
        console.log(rect);
        console.log(`W = ${rect.width} H = ${rect.height}`); */
        //sizing test with bounding box
        this.renderChart()
    }
})
app.mount('#app')
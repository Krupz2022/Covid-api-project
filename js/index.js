let app = Vue.createApp({
    //...
    data: function() {
        return {
            API_URL: 'https://data.covid19india.org/v4/min/data.min.json',
            viewBoxH: 650,
            viewBoxW: 650,
            mapEl: undefined,
            indiaEL: undefined,
            container: undefined
        }
    },
    methods: {
        renderChart() {
            let proj = d3.geoMercator()
                .scale(1100)
                .translate([-1250, 770]);
            let path = d3.geoPath(proj);

            this.container = d3.select('#chart')
                .append("svg:svg")
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${this.viewBoxH} ${this.viewBoxW}`)
                .classed("svg-content-responsive", true);

            //let map = this.container.append("svg:g")

            this.indiaEl = this.container.append("svg:g")
                .attr("id", "india")
                .style('stroke', '#000')
                .style('stroke-width', '0.5');

            // TODO refer https:/ / bl.ocks.org / almccon https: //observablehq.com/collection/@d3/

            let url = "js/map.geojson";
            let self = this;
            Promise.resolve(d3.json(url)).then((data) => {
                this.indiaEl.selectAll("path")
                    .data(data.features)
                    .enter().append("path")
                    .attr("d", path)
                    .attr("id", (d) => { return d.id }) //need function return to get value within enumeration
                    .style("fill", () => {
                        return this.getRandomColor();
                    })
                    .on("mouseover", function() { self.handleMouseOver(this) })
                    .on("mouseout", function() { self.handleMouseOut(this) })
                    .append("title")
                    .text((d) => {
                        return "State : " + d.id + "\n Here goes the state data";
                    });


                aa = [80.9462, 26.8467];
                // add circles to svg
                this.indiaEl.selectAll("circle")
                    .data([aa]).enter()
                    .append("circle")
                    .attr("cx", function(d) { return proj(d)[0]; })
                    .attr("cy", function(d) { return proj(d)[1]; })
                    .attr("r", "3px")
                    .attr("fill", "black")
                    .on("mouseover", function() {
                        d3.select(this).attr("r", "6px").style('fill', "orange")
                    })
                    .on("mouseout", function() {
                        d3.select(this).attr("r", "3px").style("fill", 'black')
                    })
                    .append("title")
                    .text(function(d) {
                        return "City : " + "Lucknow" + "\n Here goes the City data";
                    })

            });

        },
        handleMouseOver(that) {
            d3.select(that).attr("stroke-width", "1.5")
        },
        handleMouseOut(that) {
            d3.select(that).attr("stroke-width", "0.5")
        },
        getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },

    },
    computed: {
        //
    },
    mounted() {
        this.renderChart();
    }
});
app.mount('#app');
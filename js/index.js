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

            this.indiaEl = d3.select('#hook').append("g")
                .attr("id", "india")
                .style('stroke', '#000')
                .style('stroke-width', '0.5');

            // TODO refer https:/ / bl.ocks.org / almccon https: //observablehq.com/collection/@d3/


            let url = "js/map.geojson";
            let self = this; //scope magic do not touch
            Promise.resolve(d3.json(url)).then((data) => {

                let proj = d3.geoMercator()
                    .fitSize([this.viewBoxW, this.viewBoxH / 2], data)
                    // .scale(1000)
                    // .translate([-1385, 820]);
                let path = d3.geoPath().projection(proj);
                //Put projection and path inside the promise
                //this allows projection to act on dataset

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
                        return "State : " + d.title + "\n Here goes the state data";
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
        viewbox() {
            const { vbx, vby, viewBoxW, viewBoxH } = this.$data;
            // return [vbx, vby, viewBoxW, viewBoxH].join(' ');
            //Ignore above formula for now 
            return "100 -5 300 320";
            // ^Temporary JANK implementation
        }
    },
    mounted() {
        /* const rect = this.$el.getBoundingClientRect();
        console.log(rect);
        console.log(`W = ${rect.width} H = ${rect.height}`); */
        //sizing test with bounding box
        this.renderChart();
    }
});
app.mount('#app');
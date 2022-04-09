fetch('	https://data.covid19india.org/v4/min/data.min.json')
//.then((res) => res.text() )
//.then((res) => {
//    let result = res.split(/\r?\n|\r/).map(e =>{
//       return e.split(",")
//    })
//    console.log(result)
//})

.then((res) => res.json() )
.then((res) => console.log(res))
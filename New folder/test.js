class Chart extends HTMLElement {
  constructor () {
    super();
             this.type = this.getAttribute("type");

             this.Container = document.createElement("div");
             this.collumn = document.createElement("div");
             this.value = document.createElement("div");
             this.Title = document.createElement("div");
             this.rectangle = document.createElement("div");


             this.Container.style.height = "250px";
             this.Container.style.width = "250px";

             this.collumn.className = "Chart-Container";
             this.Container.className = 'diagram-Container';
             this.value.className = 'Chart-Title';
             this.Title.className = 'Chart-Title';
             this.rectangle.className = 'Chart'
  }
  connectedCallback() {
    var a = this
      $.get("/test.dat", function(data,status){
        var values = data.stat_values;
        var names = data.stat_names;
        var Max = values.reduce(function(a,b){return Math.max(a,b)})
        for(var i =0; i<values.length;i++)
        {
          //console.log("start");
          //console.log(a.Container);
          var c_collumn = document.createElement("div");
          c_collumn.className="Chart-Container";
          if(values[i]*100/Max>0)
          {
            if (values[i] == Max) c_collumn.className += " " + a.type;
            c_collumn.style.height=(values[i]*100/Max)+"%"
          }
          else {
            c_collumn.style.height="15.48%"
          }
          var c_value= document.createElement("div");
          c_value.className='Chart-Title';
          c_value.innerText=""+ values[i];
          console.log(c_value.innerText);
          c_collumn.appendChild(c_value);
          var c_rectangle =document.createElement("div");
          c_rectangle.className= 'Chart';
          c_rectangle.style.height= "87%"
          c_collumn.appendChild(c_rectangle);
          var c_Title = document.createElement("div");
          c_Title.className='Chart-Title';
          c_Title.innerText= names[i]
          c_collumn.appendChild(c_Title);
          console.log(c_collumn);
          a.Container.appendChild(c_collumn);
          //console.log("end");
          //console.log(a.Container);
        }
        a.appendChild(a.Container);
      })
      //console.log("d2"+names);

  }
}

window.customElements.define('x-chart', Chart);

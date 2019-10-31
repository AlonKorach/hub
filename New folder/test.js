class Chart extends HTMLElement {
  constructor () {
    super();

          this.Chart = [];

        //   for (let i= 0; i < 1; i++){
             this.s = document.createElement("div");
             this.i = document.createElement("div");
             this.t1 = document.createElement("div");
             this.t2 = document.createElement("div");
             this.v = document.createElement("div");

             this.s.style.height = "250px";
             this.s.style.width = "250px";
             this.i.style.height = "87%";
             this.t1.innerText = "500";
             this.t2.innerText = "פטל"
             this.v.style.height = 'calc(100% - 46px)';
             this.v.style.width = "100%;";

             this.i.className = "Chart-Container";
             this.s.className = 'diagram-Container';
             this.t1.className = 'Chart-Title';
             this.t2.className = 'Chart-Title';
             this.v.className = 'Chart'
             /*
             this.s.appendChild(this.i);
             this.appendChild(this.s);
             this.Chart.push(this.s);*/
          // }



/*
var xchart =
document.registerElement('x-chart');
      document.body.appendChild(new Chart());
*/
  }
connectedCallback() {
  setTimeout(() => {
    this.s.appendChild(this.i);
    this.appendChild(this.s);
    this.i.appendChild(this.t1);
    this.i.appendChild(this.v);
    this.i.appendChild(this.t2);
    this.Chart.push(this.s);
  })
}
}

window.customElements.define('x-chart', Chart);

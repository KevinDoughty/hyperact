import { activate } from "../../module/hyperact.js";

const view = {
  animationForKey: (key, value, previous, presentation) => 2.5,
  display: function() { document.body.innerHTML = this.x },
  x: 0
};

activate(view);

view.x = 1;

document.addEventListener("mousedown", function() {
	view.x++;
});
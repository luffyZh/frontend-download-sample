var canvas;
var context;
var tool;
// 窗口准备好之后进行初始化工作

if (window.addEventListener) {
  window.addEventListener('load',
    init(),
    false);
}

// 初始化canvas
function init() {
  
  canvas = document.getElementById('canvas');
  if (!canvas) {
    return;
  }
  if (!canvas.getContext) {
    return;
  }

  /**
   * get the 2D canvas context.
   */
  context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  // 绘制背景, 不然的话没有背景，transparent
  context.fillStyle = '#fff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  /**
   * pencil tool instance.
   */
  tool = new tool_pencil();

  /**
   * attach the mousedown, mousemove and mouseup event listeners.
   */
  canvas.addEventListener('mousedown', ev_canvas, false);
  canvas.addEventListener('mousemove', ev_canvas, false);
  canvas.addEventListener('mouseup', ev_canvas, false);

}

/**
 * This painting tool 
 * works like a drawing pencil 
 * which tracks the mouse movements.
 * 
 * @returns {tool_pencil}
 */
function tool_pencil() {
  var tool = this;
  this.started = false;

  /**
   * This is called when you start holding down the mouse button.
   * This starts the pencil drawing.
   */
  this.mousedown = function (ev) {
    /**
     * when you click on the canvas and drag your mouse
     * the cursor will changes to a text-selection cursor
     * the "ev.preventDefault()" can prevent this.
     */
    ev.preventDefault();
    context.beginPath();
    context.moveTo(ev._x, ev._y);
    tool.started = true;
  };

  /**
   * This is called every time you move the mouse.
   * Obviously, it only draws if the tool.started state is set to true
   */
  this.mousemove = function (ev) {
    if (tool.started) {
      context.lineTo(ev._x, ev._y);
      context.stroke();
    }
  };

  /**
   * This is called when you release the mouse button.
   */
  this.mouseup = function (ev) {
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
    }
  };
}

/**
 * general-purpose event handler.
 * determines the mouse position relative to the canvas element.
 * 
 * @param ev
 */
function ev_canvas(ev) {
  var x, y;
  if (ev.offsetX || ev.offsetY == 0) {
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  }

  /**
   * call the event handler of the tool.
   */
  var func = tool[ev.type];
  if (func) {
    func(ev);
  }
}
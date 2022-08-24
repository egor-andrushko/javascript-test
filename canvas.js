class Rectangle{
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rot = 0;
  }

  setRotation(rotDegree){
    this.rot = rotDegree;
  }

  update(x, y, width, height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  updatePos(x, y){
    this.x = x;
    this.y = y;
  }
}

class Canvas{

  constructor(id, color) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.fillStyle = color;
    this.rect = undefined;
  }

  createRect(x, y, width, height){
    if (this.rect !== undefined){
      this.deleteRect();
    }
    this.rect = new Rectangle(x, y, height, width)
    this.#drawRect();
  }

  #rotateMatrix(){
    if(this.rect.rot != 0){
      this.ctx.translate(this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height / 2);
      this.ctx.rotate((this.rect.rot) * Math.PI / 180);
      this.ctx.translate(-this.rect.x - this.rect.width / 2, -this.rect.y - this.rect.height / 2);
    }
  }

  #drawRect(){
    this.#rotateMatrix();
    this.ctx.fillRect(this.rect.x, this.rect.y, this.rect.height, this.rect.width);
    this.ctx.resetTransform();
  }

  clearRect(){
    this.#rotateMatrix();
    this.ctx.clearRect(this.rect.x - 1, this.rect.y - 1, this.rect.width + 2, this.rect.height + 2);
    this.ctx.resetTransform();
  }

  deleteRect(){
    if (this.rect === undefined) return;
    this.clearRect();
    this.rect = undefined;
  }

  moveTo(x, y){
    if (this.rect === undefined) return;
    this.clearRect();
    this.rect.updatePos(x, y);
    this.#drawRect();
  }

  rotate(rotDegree){
    if (this.rect === undefined) return;
    this.clearRect();
    this.rect.setRotation(rotDegree);
    this.#drawRect();
  }

  moveWithSpeed(moveTo){
    if (moveTo > this.canvas.width - this.rect.width - this.rect.x){
      alert(`moveTo can't be more than (${(this.canvas.width - this.rect.width - this.rect.x).toFixed(2)})`);
      return;
    }
    if (moveTo < this.rect.x){
      alert(`moveTo can't be less than current position (${this.rect.x.toFixed(2)})`);
      return;
    }
    let breakPoint = (moveTo - this.rect.x) / 2;
    let currTime = 0;
    let currSpeed = 0;
    let a = 1;

    let t = 0.025;

    let interval = 
      setInterval(()=> {
        
        if (this.rect.x >= breakPoint && a >= 0){
          a = - (currSpeed * currSpeed) / (2 * (moveTo - this.rect.x));
        }

        if (a >= 0){
          a += 1
        }
        else {
          a = - (currSpeed * currSpeed) / (2 * (moveTo - this.rect.x));
        }

        currTime += t;
        currSpeed += a * t;
        let x2 = this.rect.x + currSpeed * t + a * t * t / 2;
        if (x2 >= (moveTo - 0.01) || currSpeed <= 0) {
          clearInterval(interval);
          return;
        }
        console.log(`from: ${this.rect.x.toFixed(3)}, to: ${x2.toFixed(3)}, speed: ${currSpeed.toFixed(3)}, duration: ${currTime.toFixed(3)}s, a: ${a.toFixed(3)}`);
        this.moveTo(x2, this.rect.y);
      }, t * 1000)
  }
}

let canvas = new Canvas("myCanvas", "red");
canvas.createRect(150, 150, 100, 100);
canvas.rotate(45);
canvas.moveTo(0, 200);
canvas.rotate(0);


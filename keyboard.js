const WHITENOTEWIDTH = 40;
const WHITENOTEHEIGHT = WHITENOTEWIDTH * 5;
const BLACKNOTEHEIGHT = WHITENOTEWIDTH * 2.7;
const BLACKNOTEWIDTH = WHITENOTEWIDTH / 2;
const PRESSCOLOUR = "green";

class Note {
    constructor(name, top, left, context) {
        this.name = name;
        this.top = top;
        this.left = left;
        this.context = context;
    }
}

class BlackNote extends Note {
    constructor(name, top, left, context) {
        super(name, top, left, context);
    }

    get right(){
        return this.left + BLACKNOTEWIDTH;
    }

    get rightForTop(){
        return this.right;
    }

    press(colour){
        this.draw(colour);
    }

    draw(colour = "#EEEEEE") {
        this.context.fillStyle = colour;
        this.context.beginPath();
        this.context.moveTo(this.left, this.top);
        this.context.fillRect(this.left, this.top, BLACKNOTEWIDTH, BLACKNOTEHEIGHT);
        this.context.strokeRect(this.left, this.top, BLACKNOTEWIDTH, BLACKNOTEHEIGHT);
    }
}

class WhiteNote extends Note {
    constructor(name, top, left, context, blackNoteLeft, blackNoteRight) {
        super(name, top, left, context);
        this.blackNoteLeft = blackNoteLeft;
        this.blackNoteRight = blackNoteRight;
    }

    get right(){
        return this.left + WHITENOTEWIDTH;
    }

    get rightForTop(){
        return this.right - (this.blackNoteRight ? BLACKNOTEWIDTH / 2 : 0);
    }

    press(colour){
        this.draw(colour);
    }

    draw(colour = "white") {
        this.context.fillStyle = colour;
        this.context.beginPath();
        let leftForTop = this.blackNoteLeft ? this.left + BLACKNOTEWIDTH / 2 : this.left;
        this.context.moveTo(leftForTop, this.top);
    
        if(this.blackNoteLeft){
            this.context.lineTo(leftForTop, this.top + BLACKNOTEHEIGHT);
            this.context.lineTo(this.left, this.top + BLACKNOTEHEIGHT);
        }
    
        this.context.lineTo(this.left, this.top + WHITENOTEHEIGHT);
        this.context.lineTo(this.left + WHITENOTEWIDTH, this.top + WHITENOTEHEIGHT);
    
    
        if(this.blackNoteRight){
            this.context.lineTo(this.left + WHITENOTEWIDTH, this.top + BLACKNOTEHEIGHT);
            this.context.lineTo(this.left + WHITENOTEWIDTH - BLACKNOTEWIDTH / 2, this.top + BLACKNOTEHEIGHT);
        }
       
        this.context.lineTo(this.rightForTop, this.top);
        this.context.lineTo(leftForTop, this.top);
        this.context.fill()
        this.context.stroke();
    }
}


let canvases = document.querySelectorAll(".keyboard");

console.log(canvases);

canvases.forEach(canvas => {
    drawKeyboard(canvas);
});

function drawKeyboard(canvas) {
    canvas.style.width = '100%';
    let context = canvas.getContext("2d");

    const TOP = 0;
    const LEFT = 0;
    const NUMBEROFOCTAVES = 8;

    let topLeft = LEFT;
    let keys = [];
    context.strokeStyle = "#EEEEEE";
    for (let i = 1; i <= NUMBEROFOCTAVES; i++) {
        let c1 = new WhiteNote('c' + i, TOP, topLeft, context, false, true);
        keys.push(c1);
        let db1 = new BlackNote('db' + i, TOP, c1.rightForTop, context); 
        keys.push(db1);
        let d1 = new WhiteNote('d' + i, TOP, c1.right, context, true, true);
        keys.push(d1);
        let eb1 = new BlackNote('eb' + i, TOP, d1.rightForTop, context);
        keys.push(eb1);
        let e1 = new WhiteNote('e' + i, TOP, d1.right, context, true, false);
        keys.push(e1);
        let f1 = new WhiteNote('f' + i, TOP, e1.right, context, false, true);
        keys.push(f1);
        let gb1 = new BlackNote('gb' + i, TOP, f1.rightForTop, context);
        keys.push(gb1);
        let g1 = new WhiteNote('g' + i, TOP, f1.right, context, true, true);
        keys.push(g1);
        let ab1 = new BlackNote('ab' + i, TOP, g1.rightForTop, context);
        keys.push(ab1);
        let a1 = new WhiteNote('a' + i, TOP, g1.right, context, true, true);
        keys.push(a1);
        let bb1 = new BlackNote('bb' + i, TOP, a1.rightForTop, context);
        keys.push(bb1);
        let b1 = new WhiteNote('b' + i, TOP, a1.right, context, true, false);
        keys.push(b1);
        topLeft = b1.rightForTop;
    }
    let lowest = keys.findIndex(k => k.name == canvas.dataset.lowest);
    let highest = keys.findIndex(k => k.name == canvas.dataset.highest);
    let shownKeys = keys.slice(lowest, highest + 1);

    const lowestKey = keys[lowest];
    const highestKey = keys[highest];
    let lowestLeft = lowestKey.left;

    lowestKey.blackNoteLeft = false;
    highestKey.blackNoteRight = false;

    keys.forEach(n => {
        n.left = n.left - lowestLeft;
    });
    shownKeys.forEach(n => {      
        n.draw();
    });

    let noteSets = canvas.dataset.notes.split(';');
    context.strokeStyle = "black";
    noteSets.forEach(noteSet => {
        let noteSetSections = noteSet.split(':');
        let notes = noteSetSections.length > 0 ? noteSetSections[0].split(',') : [];
        let colour = noteSetSections.length > 1 ? noteSetSections[1] : PRESSCOLOUR;
        notes.forEach(note => {
            keys.filter(k => k.name == note)[0].press(colour);
        });
    });
}






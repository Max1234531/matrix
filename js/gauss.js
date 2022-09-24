function findGcd(a, b) {
    return b ? findGcd(b, a % b) : a;
}
function findLcm(a, b) {
    return (a*b)/findGcd(a,b);
}



class Frac {
    constructor(n, d = 1) {
        if (d == 0) {
            throw new Error("denominator cannot be zero!");
        }

        if (typeof(n) == 'string'){
            n = n.replace(',', '.');
            if (n.includes('/')) {
                this.n = parseFloat(n.slice(0, n.indexOf('/')));
                this.d = parseFloat(n.slice(n.indexOf('/')+1, n.length ));
            }
            else {
                this.n = parseFloat(n);
                this.d = d;
            }
            return;
        }

        this.n = n;
        this.d = d;
    }

    valueOf() {
        return this.n / this.d;
    }

    reduce() {
        if (typeof(this.n) == "number" && typeof(this.d) == "number") { 
            const gcd = findGcd(this.n, this.d);
            return new Frac(this.n / gcd, this.d / gcd);
        }
        else {
            return new Frac(this.n * 10, this.d * 10).reduce();
        }
    }


    add(other) {
        if (other instanceof Frac) {
            let gcd = findGcd(this.d, other.d);
            return new Frac(this.n * other.d / gcd + other.n * this.d / gcd, this.d * other.d / gcd).reduce();
        }
        else {
            return this.add(new Frac(other));
        }
    }

    mult(other) {
        if (other instanceof Frac) {
            return new Frac(this.n * other.n, this.d * other.d).reduce();
        }
        else {
            return this.mult(new Frac(other));
        }
    }

    reci() {
        return new Frac(this.d, this.n);
    }

    sub(other) {
        if (other instanceof Frac) {
            return this.add(other.mult(-1));
        }
        else {
            return this.add(-other);
        }
    }

    div(other) {
        if (other instanceof Frac) {
            return this.mult(other.reci());
        }
        else {
            return this.mult(new Frac(1, other));
        }
    }

    to_str(){
        return (this.d == 1) ? String(this.n) : (String(this.n) + '/' + String(this.d));
    }

}






var matrix = [[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0]];
const history = [];


function check_table() {
    const test = [];
    for (var i = 0; i < 8; i++){
        for (var j = 0; j < 8; j++){
            if (matrix[i][j].valueOf() != 0){
                test.push(j);
                for (var k = i+1; k < 8; k++){
                    if (matrix[k][j].valueOf()!=0) return false;
                }
                break;
            }

        }
    }
    for (var i = 0; i < test.length-1; i++){
        if (test[i+1] < test[i]) return false;
    }
    return true;
}

function generate_table() {
    document.getElementById('initialize-table').style.display = "none";
    document.getElementById('table-block').style.visibility = "visible";

    var cols_el = document.getElementById('cols-setter');
    var lines_el = document.getElementById('lines-setter');

    for (var i = 8; i > lines_el.value; i--){
        Array.from(document.getElementsByClassName('line-' + i)).forEach((element) => { element.style.display = "none";});
    }
    for (var i = 8; i > cols_el.value; i--){
        Array.from(document.getElementsByClassName('col-' + i)).forEach((element) => { element.style.display = "none";});
    }
}


function init_matrix() {
    document.getElementById('gauss-start-btn').style.display = 'none';
    document.getElementById('iteration-div').style.visibility = 'visible';
    document.getElementById('explanation-div').style.visibility = 'visible';

    var counter = 0;
    for (var i = 0; i < 8; i++){
        for (var j = 0; j < 9; j++){
            if (j == 8){
                matrix[i][j] = new Frac(document.getElementById('r' + (i+1)).value).reduce();
                continue;
            }
            counter++;
            matrix[i][j] = new Frac(document.getElementById('l' + counter).value).reduce();
        }
    }
    history.push(matrix);
    next_step();
}

function change_table(){
    var counter = 0;
        for (var i = 0; i < 8; i++){
            for (var j = 0; j < 9; j++){
                if (j == 8){
                    document.getElementById('r' + (i+1)).value = matrix[i][j].to_str();
                    continue;
                }   
                counter++;
                document.getElementById('l' + counter).value = matrix[i][j].to_str();
            }
        }
}

var iterations = 0;
var best_line = 0;
var best_col = 0;

function MySort(x, y){
    if (x[best_col].valueOf() == 0){
        return 1;
        
    }
    else if (y[best_col].valueOf() == 0){
        return -1;
    }
    else{
        return Math.abs(x[0].valueOf()) - Math.abs(y[0].valueOf());
    }
}



function next_step(){
    switch(iterations%3){
        case 0:
            document.getElementById('ex-1').style.display = 'block';
            document.getElementById('ex-2').style.display = 'none';
            document.getElementById('ex-3').style.display = 'none';
            var lcm = 1;
            for (var i = 0; i < 8; i++) {
                lcm = 1;
                for (var j = 0; j < 9; j++){
                    lcm = findLcm(matrix[i][j].valueOf() == 0 ? 1 : matrix[i][j].d, lcm);
                }
                for (var j = 0; j < 9; j++){
                    matrix[i][j] = matrix[i][j].mult(lcm);
                }
            }
            
            break;

        case 1:
            document.getElementById('ex-1').style.display = 'none';
            document.getElementById('ex-2').style.display = 'block';
            document.getElementById('ex-3').style.display = 'none';
            const temp = matrix.slice(0, best_line);
            var help = matrix.slice(best_line).sort(MySort);
            for (var i = 0; i < help.length; i++){
                temp.push(help[i]);
            }
            matrix = temp;
            
            if (check_table()){
                document.getElementById('iteration-div').style.display = 'none';
                document.getElementById('finish-div').style.visibility = 'visible';
            }
            break;

        case 2:
            document.getElementById('ex-1').style.display = 'none';
            document.getElementById('ex-2').style.display = 'none';
            document.getElementById('ex-3').style.display = 'block';

            for (var i = best_line+1; i < 8; i++){
                if (matrix[i][best_col] == 0) break;
                var multiplier = (matrix[i][best_col].mult(-1)).div(matrix[best_line][best_col]);
                for (var j = best_col; j < 9; j++){
                    matrix[i][j] = matrix[i][j].add(matrix[best_line][j].mult(multiplier));
                }
            }

            best_col++;
            best_line++;
            break;
    }
    iterations++;

    // const copy = [];
    // for (var i = 0; i < 8; i++){
    //     for (var j = 0; j<9; j++){
    //         copy.push(matrix[i][j]);
    //     }
    // }
    // history.push(copy);
    //console.log(history);
    change_table();
}

function prev_step(){
    if (history.length == 1) return;
    document.getElementById('ex-1').style.display = 'none';
    document.getElementById('ex-2').style.display = 'none';
    document.getElementById('ex-3').style.display = 'none';
    matrix = history.pop();
    change_table();
    iterations--;
}
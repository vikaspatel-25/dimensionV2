//Tabs and windowDom Manipulation

let tabCount = 1;
let closedTab = 1;

function addTab(e) {
  e.stopPropagation();
  if(tabCount == closedTab){ tabCount = 1; closedTab = 1;}
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.id = 'tab'+ tabCount;
  tab.innerHTML = `Floor ${tabCount}<div class="close-tab" onclick="closeTab(event,'tab${tabCount}')";>+</div>`;
  tab.onclick = () => updateTab(`${tab.id}`);
  
  document.getElementById('tabRow').appendChild(tab);
  tabCount++;
  addWindow(tab.id);
}


function closeTab(e,tabId){
   e.stopPropagation();
   removeWindow(tabId+'-window');
   if(document.getElementById(tabId).classList.contains('active-tab')){ updateTab('ground-floor')
}
   document.getElementById('tabRow').removeChild(document.getElementById(tabId));
   closedTab++;
}

// update tab switch
function updateTab(id){
    Array.from(document.getElementsByClassName('tab')).forEach((e)=>{
        e.classList.remove('active-tab');
    })
    document.getElementById(id).classList.add('active-tab');
    updateWindow(id+'-window')
}

function addWindow(id){
    const window = document.createElement('div');
    window.id = id+'-window';
    window.className = 'window';
    window.innerHTML = `${window.id}`;
    
    document.getElementById('window-container').appendChild(window);
    updateWindow(window.id);
    updateTab(id)
}

function updateWindow(id){
    console.log(id)
    Array.from(document.getElementsByClassName('window')).forEach((e)=>{
         e.classList.remove('active-window')
    })

    document.getElementById(id).classList.add('active-window')
}

function removeWindow(id){
    document.getElementById('window-container').removeChild(document.getElementById(id));
}

function handleDisable(dropId,input1,input2){
                // let dropDownBox = document.getElementById(dropId);
                // let inputBox1Value = document.getElementById(input1).value;
                // let inputBox2Value = document.getElementById(input2).value;
    
                // if(inputBox1Value && inputBox2Value){
                //  dropDownBox.disabled = false;
                // }else{
                // dropDownBox.disabled = true;
                // }
}

function updateMeshLength(){
    let unit = document.getElementById('unitSelect').value;
    document.getElementById('fMeshSides').value = 0;

    let gfeWallsDimensionsList = document.getElementsByClassName('gfeWallsDimensions');
    let gfeWallsDimensions = [];

    for (let e of gfeWallsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let length = inputs[0].value;

        if (length.trim() === '' || checkInvalidData(length)) {
            continue; // skip this wall if empty or invalid
        }

        gfeWallsDimensions.push({
            length: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0
        });
    }

    let gfiWallsDimensionsList = document.getElementsByClassName('gfiWallsDimensions');
    let gfiWallsDimensions = [];

    for (let e of gfiWallsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let length = inputs[0].value;

        if (length.trim() === '' || checkInvalidData(length)) {
            continue; // skip if empty or invalid
        }

        gfiWallsDimensions.push({
            length: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0
        });
    }

    let threshold = unit === 'Feet' ? 10 : unit === 'Meter' ? 3 : Infinity;

    let anyLengthExceeds = [...gfeWallsDimensions, ...gfiWallsDimensions]
        .some(wall => wall.length >= threshold);

    let sumOfLengthOfWallsEx = gfeWallsDimensions.reduce((acc, wall) => acc + wall.length, 0);
    let sumOfLengthOfWallsIn = gfiWallsDimensions.reduce((acc, wall) => acc + wall.length, 0);
    let totalLength = sumOfLengthOfWallsEx + sumOfLengthOfWallsIn;

    if (
        anyLengthExceeds ||
        sumOfLengthOfWallsEx >= threshold ||
        sumOfLengthOfWallsIn >= threshold ||
        totalLength >= threshold
    ) {
        document.getElementById('fMeshSides').value = 2;
    }
}



function roofStatus(e) {

let lMeshExternalWall = document.querySelectorAll('.lMeshExternalWall input');
let lMeshInternalWall = document.querySelectorAll('.lMeshInternalWall input');

if (e.checked) {
    lMeshExternalWall.forEach(input => { input.disabled = false;
            input.value = 1.50;
    });
    lMeshInternalWall.forEach(input => {input.disabled = false;
            input.value = 2;
    });
} else {
    lMeshExternalWall.forEach(input => {
    input.disabled = true;
    input.value = 0;
    });
    lMeshInternalWall.forEach(input => {
    input.disabled = true;
    input.value = 0;
    });
}
}

function addInputFieldsGf(parentId, dropDownId) {

    if (parentId === 'gfeWalls') {
        let inputValueL = document.getElementById('g-f-e-w-1-l').value;
        let inputValueH = document.getElementById('g-f-e-w-1-h').value;
        let number = parseInt(document.getElementById(dropDownId).value, 10);
        let parent = document.getElementById(parentId);

        if (isNaN(number) || number <= 0) {
            number = 1;
            const existing = parent.querySelectorAll('.gfeWallsDimensions');
            existing.forEach(el => parent.removeChild(el));

            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfeWallsDimensions';
                let onInputAttr =  `oninput="handleDisable('gfeWallsNum','g-f-e-w-1-l','g-f-e-w-1-h');updateMeshLength();"`;
                let id1 = i === 1 ? `id="g-f-e-w-1-l"` : '';
                let id2 = i === 1 ? `id="g-f-e-w-1-h"` : '';
                child.innerHTML = `
                    Wall ${i}: 
                    <input ${onInputAttr} ${id1} onchange="updateMeshLength();" type="number" placeholder="length" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                `;
                parent.appendChild(child);
            }
            document.getElementById('g-f-e-w-1-l').value = 0;
            document.getElementById('g-f-e-w-1-h').value = 0;
        } else {
            const existing = parent.querySelectorAll('.gfeWallsDimensions');
            existing.forEach(el => parent.removeChild(el));

            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfeWallsDimensions';
                let onInputAttr = `oninput="handleDisable('gfeWallsNum','g-f-e-w-1-l','g-f-e-w-1-h');updateMeshLength();"`;
                let id1 = i === 1 ? `id="g-f-e-w-1-l"` : '';
                let id2 = i === 1 ? `id="g-f-e-w-1-h"` : '';
                child.innerHTML = `
                    Wall ${i}: 
                    <input ${onInputAttr} ${id1} type="number" onchange="updateMeshLength();" placeholder="length" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                `;
                parent.appendChild(child);
            }
        }
    }

    if (parentId === 'gfeGates') {
        let inputValueW = document.getElementById('g-f-e-d-1-w').value;
        let inputValueH = document.getElementById('g-f-e-d-1-h').value;
        let number = parseInt(document.getElementById(dropDownId).value, 10);
        let parent = document.getElementById(parentId);

        if (isNaN(number) || number <= 0) {
            number = 1;
            const existing = parent.querySelectorAll('.gfeGatesDimensions');
            existing.forEach(el => parent.removeChild(el));

            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfeGatesDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfeGatesNum','g-f-e-d-1-w','g-f-e-d-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-e-d-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-e-d-1-h"` : '';
                child.innerHTML = `
                    Gate ${i}: 
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueW}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="0" class="input-box">
                `;
                parent.appendChild(child);
            }
            document.getElementById('g-f-e-d-1-w').value = 0;
            document.getElementById('g-f-e-d-1-h').value = 0;
        } else {
            const existing = parent.querySelectorAll('.gfeGatesDimensions');
            existing.forEach(el => parent.removeChild(el));

            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfeGatesDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfeGatesNum','g-f-e-d-1-w','g-f-e-d-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-e-d-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-e-d-1-h"` : '';
                child.innerHTML = `
                    Gate ${i}: 
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueW}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="1" class="input-box">
                `;
                parent.appendChild(child);
            }
        }
    }

    if (parentId === 'gfeWindows') {
        let inputValueW = document.getElementById('g-f-e-win-1-w').value;
        let inputValueH = document.getElementById('g-f-e-win-1-h').value;
        let number = parseInt(document.getElementById(dropDownId).value, 10);
        let parent = document.getElementById(parentId);

        if (isNaN(number) || number <= 0) {
            number = 1;
            const existing = parent.querySelectorAll('.gfeWindowsDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfeWindowsDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfeWindowsNum','g-f-e-win-1-w','g-f-e-win-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-e-win-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-e-win-1-h"` : '';
                child.innerHTML = `
                    Win ${i}: 
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueW}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="0" class="input-box">
                `;
                parent.appendChild(child);
            }
            document.getElementById('g-f-e-win-1-w').value = 0;
            document.getElementById('g-f-e-win-1-h').value = 0;
        } else {
            const existing = parent.querySelectorAll('.gfeWindowsDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfeWindowsDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfeWindowsNum','g-f-e-win-1-w','g-f-e-win-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-e-win-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-e-win-1-h"` : '';
                child.innerHTML = `
                    Win ${i}: 
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueW}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="1" class="input-box">
                `;
                parent.appendChild(child);
            }
        }
    }

    if (parentId === 'gfeVent') {
        let inputValueW = document.getElementById('g-f-e-v-1-w').value;
        let inputValueH = document.getElementById('g-f-e-v-1-h').value;
        let number = parseInt(document.getElementById(dropDownId).value, 10);
        let parent = document.getElementById(parentId);

        if (isNaN(number) || number <= 0) {
            number = 1;
            const existing = parent.querySelectorAll('.gfeVentDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfeVentDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfeVentNum','g-f-e-v-1-w','g-f-e-v-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-e-v-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-e-v-1-h"` : '';
                child.innerHTML = `
                    Vent ${i}: 
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueW}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="0" class="input-box">
                `;
                parent.appendChild(child);
            }
            document.getElementById('g-f-e-v-1-w').value = 0;
            document.getElementById('g-f-e-v-1-h').value = 0;
        } else {
            const existing = parent.querySelectorAll('.gfeVentDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfeVentDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfeVentNum','g-f-e-v-1-w','g-f-e-v-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-e-v-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-e-v-1-h"` : '';
                child.innerHTML = `
                    Vent ${i}: 
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueW}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="1" class="input-box">
                `;
                parent.appendChild(child);
            }
        }
    }

    if (parentId === 'gfiWalls') {
        let inputValueL = document.getElementById('g-f-i-w-1-l').value;
        let inputValueH = document.getElementById('g-f-i-w-1-h').value;
        let number = parseInt(document.getElementById(dropDownId).value, 10);
        let parent = document.getElementById(parentId);

        if (isNaN(number) || number <= 0) {
            number = 1;
            const existing = parent.querySelectorAll('.gfiWallsDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfiWallsDimensions';
                let onInputAttr =  `oninput="handleDisable('gfiWallsNum','g-f-i-w-1-l','g-f-i-w-1-h');updateMeshLength();"`
                let id1 = i === 1 ? `id="g-f-i-w-1-l"` : '';
                let id2 = i === 1 ? `id="g-f-i-w-1-h"` : '';
                child.innerHTML = `
                    Wall ${i}:
                    <input ${onInputAttr} ${id1} type="number" onchange="updateMeshLength()"; placeholder="length" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number"  placeholder="height" value="${inputValueH}" class="input-box">
                `;
                parent.appendChild(child);
            }
            document.getElementById('g-f-i-w-1-l').value = 0;
            document.getElementById('g-f-i-w-1-h').value = 0;
        } else {
            const existing = parent.querySelectorAll('.gfiWallsDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfiWallsDimensions';
                let onInputAttr = `oninput="handleDisable('gfiWallsNum','g-f-i-w-1-l','g-f-i-w-1-h');updateMeshLength();"`;
                let id1 = i === 1 ? `id="g-f-i-w-1-l"` : '';
                let id2 = i === 1 ? `id="g-f-i-w-1-h"` : '';
                child.innerHTML = `
                    Wall ${i}:
                    <input ${onInputAttr} ${id1} type="number" onchange="updateMeshLength()"; placeholder="length" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                `;
                parent.appendChild(child);
            }
        }
    }

    if (parentId === 'gfiGates') {
        let inputValueL = document.getElementById('g-f-i-d-1-w').value;
        let inputValueH = document.getElementById('g-f-i-d-1-h').value;
        let number = parseInt(document.getElementById(dropDownId).value, 10);
        let parent = document.getElementById(parentId);

        if (isNaN(number) || number <= 0) {
            number = 1;
            const existing = parent.querySelectorAll('.gfiGatesDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfiGatesDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfiGatesNum','g-f-i-d-1-w','g-f-i-d-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-i-d-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-i-d-1-h"` : '';
                child.innerHTML = `
                    Door ${i}:
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="0" class="input-box">
                `;
                parent.appendChild(child);
            }
            document.getElementById('g-f-i-d-1-w').value = 0;
            document.getElementById('g-f-i-d-1-h').value = 0;
        } else {
            const existing = parent.querySelectorAll('.gfiGatesDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfiGatesDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfiGatesNum','g-f-i-d-1-w','g-f-i-d-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-i-d-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-i-d-1-h"` : '';
                child.innerHTML = `
                    Door ${i}:
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="1" class="input-box">
                `;
                parent.appendChild(child);
            }
        }
    }

    if (parentId === 'gfiWindows') {
        let inputValueL = document.getElementById('g-f-i-win-1-w').value;
        let inputValueH = document.getElementById('g-f-i-win-1-h').value;
        let number = parseInt(document.getElementById(dropDownId).value, 10);
        let parent = document.getElementById(parentId);

        if (isNaN(number) || number <= 0) {
            number = 1;
            const existing = parent.querySelectorAll('.gfiWindowsDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfiWindowsDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfiWindowsNum','g-f-i-win-1-w','g-f-i-win-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-i-win-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-i-win-1-h"` : '';
                child.innerHTML = `
                    Win ${i}:
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="0" class="input-box">
                `;
                parent.appendChild(child);
            }
            document.getElementById('g-f-i-win-1-w').value = 0;
            document.getElementById('g-f-i-win-1-h').value = 0;
        } else {
            const existing = parent.querySelectorAll('.gfiWindowsDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfiWindowsDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfiWindowsNum','g-f-i-win-1-w','g-f-i-win-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-i-win-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-i-win-1-h"` : '';
                child.innerHTML = `
                    Win ${i}:
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="1" class="input-box">
                `;
                parent.appendChild(child);
            }
        }
    }

    if (parentId === 'gfiVent') {
        let inputValueL = document.getElementById('g-f-i-v-1-w').value;
        let inputValueH = document.getElementById('g-f-i-v-1-h').value;
        let number = parseInt(document.getElementById(dropDownId).value, 10);
        let parent = document.getElementById(parentId);

        if (isNaN(number) || number <= 0) {
            number = 1;
            const existing = parent.querySelectorAll('.gfiVentDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfiVentDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfiVentNum','g-f-i-v-1-w','g-f-i-v-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-i-v-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-i-v-1-h"` : '';
                child.innerHTML = `
                    Vent ${i}:
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="0" class="input-box">
                `;
                parent.appendChild(child);
            }
            document.getElementById('g-f-i-v-1-w').value = 0;
            document.getElementById('g-f-i-v-1-h').value = 0;
        } else {
            const existing = parent.querySelectorAll('.gfiVentDimensions');
            existing.forEach(el => parent.removeChild(el));
            for (let i = 1; i <= number; i++) {
                let child = document.createElement('div');
                child.className = 'input-row gfiVentDimensions';
                let onInputAttr = i === 1 ? `oninput="handleDisable('gfiVentNum','g-f-i-v-1-w','g-f-i-v-1-h')"` : '';
                let id1 = i === 1 ? `id="g-f-i-v-1-w"` : '';
                let id2 = i === 1 ? `id="g-f-i-v-1-h"` : '';
                child.innerHTML = `
                    Vent ${i}:
                    <input ${onInputAttr} ${id1} type="number" placeholder="width" value="${inputValueL}" class="input-box">
                    <input ${onInputAttr} ${id2} type="number" placeholder="height" value="${inputValueH}" class="input-box">
                    <input type="number" placeholder="No.s" value="1" class="input-box">
                `;
                parent.appendChild(child);
            }
        }
    }
}


 function checkInvalidData(data){
          if(data == '' || data < 0 || data == NaN) return true;
          else return false;
}



function calculateArea(height,width){
        return height*width;
}


function collectDataGf() {

    let gfeWallsDimensionsList = document.getElementsByClassName('gfeWallsDimensions');
    let gfeWallsDimensions = [];

    for (let e of gfeWallsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let length = inputs[0].value;
        let height = inputs[1].value;

        if (checkInvalidData(length) || checkInvalidData(height)) {
            document.getElementById('errorBoxExternalWall').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
    }

    for (let e of gfeWallsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        gfeWallsDimensions.push({
            length: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0
        });
    }
    document.getElementById('errorBoxExternalWall').innerText = '';

    let gfeGatesDimensionsList = document.getElementsByClassName('gfeGatesDimensions');
    let gfeGatesDimensions = [];

    for (let e of gfeGatesDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let width = inputs[0].value;
        let height = inputs[1].value;
        let nos = inputs[2].value;

        if (checkInvalidData(width) || checkInvalidData(height) || checkInvalidData(nos)) {
            document.getElementById('errorBoxExternalWall').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
    }

    for (let e of gfeGatesDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        gfeGatesDimensions.push({
            width: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0,
            nos: parseFloat(inputs[2].value) || 0
        });
    }
    document.getElementById('errorBoxExternalWall').innerText = '';

    let gfeWindowsDimensionsList = document.getElementsByClassName('gfeWindowsDimensions');
    let gfeWindowsDimensions = [];

    for (let e of gfeWindowsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let width = inputs[0].value;
        let height = inputs[1].value;
        let nos = inputs[2].value;

        if (checkInvalidData(width) || checkInvalidData(height) || checkInvalidData(nos)) {
            document.getElementById('errorBoxExternalWall').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
    }

    for (let e of gfeWindowsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        gfeWindowsDimensions.push({
            width: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0,
            nos: parseFloat(inputs[2].value) || 0
        });
    }
    document.getElementById('errorBoxExternalWall').innerText = '';

    let gfeVentDimensionsList = document.getElementsByClassName('gfeVentDimensions');
    let gfeVentDimensions = [];

    for (let e of gfeVentDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let width = inputs[0].value;
        let height = inputs[1].value;
        let nos = inputs[2].value;

        if (checkInvalidData(width) || checkInvalidData(height) || checkInvalidData(nos)) {
            document.getElementById('errorBoxExternalWall').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
    }

    for (let e of gfeVentDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        gfeVentDimensions.push({
            width: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0,
            nos: parseFloat(inputs[2].value) || 0
        });
    }
    document.getElementById('errorBoxExternalWall').innerText = '';

    let gfePanelInputs = document.getElementById('gfePanelArea').getElementsByTagName('input');
    let gfePanelAreaValue = gfePanelInputs[0] ? gfePanelInputs[0].value : '';

    if (checkInvalidData(gfePanelAreaValue)) {
        document.getElementById('errorBoxExternalWall').innerText = 'Invalid Panel Area in External Wall section';
        return;
    }
    document.getElementById('errorBoxExternalWall').innerText = '';
    let gfePanelArea = parseFloat(gfePanelAreaValue) || 0;


    let externalWallData = {
        wallData: gfeWallsDimensions,
        gatesData: gfeGatesDimensions,
        windowsData: gfeWindowsDimensions,
        ventData: gfeVentDimensions,
        panelArea: gfePanelArea
    };

    let gfiWallsDimensionsList = document.getElementsByClassName('gfiWallsDimensions');
    let gfiWallsDimensions = [];

    for (let e of gfiWallsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let length = inputs[0].value;
        let height = inputs[1].value;

        if (checkInvalidData(length) || checkInvalidData(height)) {
            document.getElementById('errorBoxInternalWall').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
    }

    for (let e of gfiWallsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        gfiWallsDimensions.push({
            length: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0
        });
    }
    document.getElementById('errorBoxInternalWall').innerText = '';

    let gfiGatesDimensionsList = document.getElementsByClassName('gfiGatesDimensions');
    let gfiGatesDimensions = [];

    for (let e of gfiGatesDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let width = inputs[0].value;
        let height = inputs[1].value;
        let nos = inputs[2].value;

        if (checkInvalidData(width) || checkInvalidData(height) || checkInvalidData(nos)) {
            document.getElementById('errorBoxInternalWall').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
    }

    for (let e of gfiGatesDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        gfiGatesDimensions.push({
            width: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0,
            nos: parseFloat(inputs[2].value) || 0
        });
    }
    document.getElementById('errorBoxInternalWall').innerText = '';

    let gfiWindowsDimensionsList = document.getElementsByClassName('gfiWindowsDimensions');
    let gfiWindowsDimensions = [];

    for (let e of gfiWindowsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let width = inputs[0].value;
        let height = inputs[1].value;
        let nos = inputs[2].value;

        if (checkInvalidData(width) || checkInvalidData(height) || checkInvalidData(nos)) {
            document.getElementById('errorBoxInternalWall').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
    }

    for (let e of gfiWindowsDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        gfiWindowsDimensions.push({
            width: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0,
            nos: parseFloat(inputs[2].value) || 0
        });
    }
    document.getElementById('errorBoxInternalWall').innerText = '';

    let gfiVentDimensionsList = document.getElementsByClassName('gfiVentDimensions');
    let gfiVentDimensions = [];

    for (let e of gfiVentDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        let width = inputs[0].value;
        let height = inputs[1].value;
        let nos = inputs[2].value;

        if (checkInvalidData(width) || checkInvalidData(height) || checkInvalidData(nos)) {
            document.getElementById('errorBoxInternalWall').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
    }

    for (let e of gfiVentDimensionsList) {
        let inputs = e.getElementsByTagName('input');
        gfiVentDimensions.push({
            width: parseFloat(inputs[0].value) || 0,
            height: parseFloat(inputs[1].value) || 0,
            nos: parseFloat(inputs[2].value) || 0
        });
    }

    let gfiPanelInputs = document.getElementById('gfiPanelArea').getElementsByTagName('input');
    let gfiPanelAreaValue = gfiPanelInputs[0] ? gfiPanelInputs[0].value : '';

    if (checkInvalidData(gfiPanelAreaValue)) {
        document.getElementById('errorBoxInternalWall').innerText = 'Invalid Panel Area in Internal Wall section';
        return;
    }
    document.getElementById('errorBoxInternalWall').innerText = '';
    let gfiPanelArea = parseFloat(gfiPanelAreaValue) || 0;


    let internalWallData = {
        wallData: gfiWallsDimensions,
        gatesData: gfiGatesDimensions,
        windowsData: gfiWindowsDimensions,
        ventData: gfiVentDimensions,
        panelArea: gfiPanelArea
    };

    let lMeshCornersList = document.getElementsByClassName('lMeshCorners');
    let lMeshExternalWallList = document.getElementsByClassName('lMeshExternalWall');
    let lMeshInternalWallList = document.getElementsByClassName('lMeshInternalWall');
    let lMeshLengthList = document.getElementsByClassName('lMeshLength');

    let lMeshData = {};

    for (let e of lMeshCornersList) {
        let input = e.getElementsByTagName('input')[0];
        if (checkInvalidData(input.value)) {
            document.getElementById('errorBoxOtherData').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
        lMeshData.corners = parseFloat(input.value) || 0;
    }

    for (let e of lMeshExternalWallList) {
        let input = e.getElementsByTagName('input')[0];
        if (checkInvalidData(input.value)) {
            document.getElementById('errorBoxOtherData').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
        lMeshData.externalWall = parseFloat(input.value) || 0;
    }

    for (let e of lMeshInternalWallList) {
        let input = e.getElementsByTagName('input')[0];
        if (checkInvalidData(input.value)) {
            document.getElementById('errorBoxOtherData').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
        lMeshData.internalWall = parseFloat(input.value) || 0;
    }

    for (let e of lMeshLengthList) {
        let input = e.getElementsByTagName('input')[0];
        if (checkInvalidData(input.value)) {
            document.getElementById('errorBoxOtherData').innerText = `Please fill valid data for: ${e.innerText}`;
            return;
        }
        lMeshData.length = parseFloat(input.value) || 0;
    }

    let fMeshList = document.getElementsByClassName('fMeshLength');
    let fMeshData = {};

    for (let e of fMeshList) {
        let inputs = e.getElementsByTagName('input');
        let length = inputs[0].value;
        let nos = inputs[1].value;

        if (checkInvalidData(length) || checkInvalidData(nos)) {
            document.getElementById('errorBoxOtherData').innerText = `Please fill valid data for: F-Mesh`;
            return;
        }

        fMeshData.length = parseFloat(length) || 0;
        fMeshData.nos = parseFloat(nos) || 0;
    }

    let groundFloorSlabData = {};

    let slabInputs = document.querySelector('.groundFloorSlabArea').getElementsByTagName('input');
    let slabAreaValue = slabInputs[1].value;
    let slabDeductionValue = slabInputs[2].value;

    if (checkInvalidData(slabAreaValue)) {
        document.getElementById('errorBoxOtherData').innerText = 'Invalid Slab Area in Ground Floor Slab section';
        return;
    }
    if (checkInvalidData(slabDeductionValue)) {
        document.getElementById('errorBoxOtherData').innerText = 'Invalid Deduction in Ground Floor Slab section';
        return;
    }

    groundFloorSlabData.slabArea = parseFloat(slabAreaValue) || 0;
    groundFloorSlabData.deduction = parseFloat(slabDeductionValue) || 0;

    let panelInputs = document.querySelector('.groundFloorPanelArea').getElementsByTagName('input');
    let panelAreaValue = panelInputs[0].value;

    if (checkInvalidData(panelAreaValue)) {
        document.getElementById('errorBoxOtherData').innerText = 'Invalid Panel Area in Ground Floor Slab section';
        return;
    }

    groundFloorSlabData.panelArea = parseFloat(panelAreaValue) || 0;

    document.getElementById('errorBoxOtherData').innerText = '';

    let Data = {
        internalWallData: internalWallData,
        externalWallData: externalWallData,
        lMesh: lMeshData,
        fMesh: fMeshData,
        groundFloorSlab: groundFloorSlabData
    };

    calculate(Data);

}


function calculate(data) {

    // calculation for external wall 

    let areaOfWallsEx = [];
    let sumOfAreaOfWallsEx = 0;
    let sumOfLengthOfWallsEx = 0;
    data.externalWallData.wallData.forEach((e, i) => {
        areaOfWallsEx[i] = calculateArea(e.length, e.height);
        sumOfAreaOfWallsEx += areaOfWallsEx[i];
        sumOfLengthOfWallsEx += e.length;
    });
    let wallsEx = {
        areaOfWalls: areaOfWallsEx,
        sumOfAreaOfWalls: sumOfAreaOfWallsEx,
        sumOfLengthOfWalls: sumOfLengthOfWallsEx
    };

    let areaOfGatesEx = [];
    let fMeshGatesEx = [];
    let uMeshGatesEx = [];
    let sumOfFMeshGatesEx = 0;
    let sumOfUMeshGatesEx = 0;
    let sumOfAreaOfGatesEx = 0;

    data.externalWallData.gatesData.forEach((e, i) => {
        areaOfGatesEx[i] = e.nos * calculateArea(e.width, e.height);
        sumOfAreaOfGatesEx += areaOfGatesEx[i];
        fMeshGatesEx[i] = 2 * e.nos;
        sumOfFMeshGatesEx += fMeshGatesEx[i];
        uMeshGatesEx[i] = e.nos * (2 * e.height + e.width);
        sumOfUMeshGatesEx += uMeshGatesEx[i];
    });
    let gatesEx = {
        areaOfGates: areaOfGatesEx,
        sumOfAreaOfGates: sumOfAreaOfGatesEx,
        fMesh: fMeshGatesEx,
        sumOfFMesh: sumOfFMeshGatesEx,
        uMesh: uMeshGatesEx,
        sumOfUMesh: sumOfUMeshGatesEx
    };

    let areaOfWindowsEx = [];
    let fMeshWinEx = [];
    let uMeshWinEx = [];
    let sumOfFMeshWinEx = 0;
    let sumOfUMeshWinEx = 0;
    let sumOfAreaOfWindowsEx = 0;

    data.externalWallData.windowsData.forEach((e, i) => {
        areaOfWindowsEx[i] = e.nos * calculateArea(e.width, e.height);
        sumOfAreaOfWindowsEx += areaOfWindowsEx[i];
        fMeshWinEx[i] = 4 * e.nos;
        sumOfFMeshWinEx += fMeshWinEx[i];
        uMeshWinEx[i] = e.nos * (2 * (e.width + e.height));
        sumOfUMeshWinEx += uMeshWinEx[i];
    });
    let windowsEx = {
        areaOfWindows: areaOfWindowsEx,
        sumOfAreaOfWindows: sumOfAreaOfWindowsEx,
        fMesh: fMeshWinEx,
        sumOfFMesh: sumOfFMeshWinEx,
        uMesh: uMeshWinEx,
        sumOfUMesh: sumOfUMeshWinEx
    };

    let areaOfVentEx = [];
    let fMeshVentEx = [];
    let uMeshVentEx = [];
    let sumOfFMeshVentEx = 0;
    let sumOfUMeshVentEx = 0;
    let sumOfAreaOfVentsEx = 0;

    data.externalWallData.ventData.forEach((e, i) => {
        areaOfVentEx[i] = e.nos * calculateArea(e.width, e.height);
        sumOfAreaOfVentsEx += areaOfVentEx[i];
        fMeshVentEx[i] = 4 * e.nos;
        sumOfFMeshVentEx += fMeshVentEx[i];
        uMeshVentEx[i] = e.nos * (2 * (e.height + e.width));
        sumOfUMeshVentEx += uMeshVentEx[i];
    });
    let ventsEx = {
        areaOfVent: areaOfVentEx,
        sumOfAreaOfVents: sumOfAreaOfVentsEx,
        fMesh: fMeshVentEx,
        sumOfFMesh: sumOfFMeshVentEx,
        uMesh: uMeshVentEx,
        sumOfUMesh: sumOfUMeshVentEx
    };

    let openingScheduleExternalWall = {
        totalArea: sumOfAreaOfGatesEx + sumOfAreaOfWindowsEx + sumOfAreaOfVentsEx,
        totalUMesh: sumOfUMeshGatesEx + sumOfUMeshWinEx + sumOfUMeshVentEx,
        totalFMesh: sumOfFMeshGatesEx + sumOfFMeshWinEx + sumOfFMeshVentEx
    };


    // calculation for internal wall

    let areaOfWallsInt = [];
    let sumOfAreaOfWallsInt = 0;
    let sumOfLengthOfWallsInt = 0;

    data.internalWallData.wallData.forEach((e, i) => {
        areaOfWallsInt[i] = calculateArea(e.length, e.height);
        sumOfAreaOfWallsInt += areaOfWallsInt[i];
        sumOfLengthOfWallsInt += e.length;
    });
    let wallsInt = {
        areaOfWalls: areaOfWallsInt,
        sumOfAreaOfWalls: sumOfAreaOfWallsInt,
        sumOfLengthOfWalls: sumOfLengthOfWallsInt
    };

    let areaOfGatesInt = [];
    let fMeshGatesInt = [];
    let uMeshGatesInt = [];
    let sumOfFMeshGatesInt = 0;
    let sumOfUMeshGatesInt = 0;
    let sumOfAreaOfGatesInt = 0;

    data.internalWallData.gatesData.forEach((e, i) => {
        areaOfGatesInt[i] = e.nos * calculateArea(e.width, e.height);
        sumOfAreaOfGatesInt += areaOfGatesInt[i];
        fMeshGatesInt[i] = 2 * e.nos;
        sumOfFMeshGatesInt += fMeshGatesInt[i];
        uMeshGatesInt[i] = e.nos * (2 * e.height + e.width);
        sumOfUMeshGatesInt += uMeshGatesInt[i];
    });
    let gatesInt = {
        areaOfGates: areaOfGatesInt,
        sumOfAreaOfGates: sumOfAreaOfGatesInt,
        fMesh: fMeshGatesInt,
        sumOfFMesh: sumOfFMeshGatesInt,
        uMesh: uMeshGatesInt,
        sumOfUMesh: sumOfUMeshGatesInt
    };

    let areaOfWindowsInt = [];
    let fMeshWinInt = [];
    let uMeshWinInt = [];
    let sumOfFMeshWinInt = 0;
    let sumOfUMeshWinInt = 0;
    let sumOfAreaOfWindowsInt = 0;

    data.internalWallData.windowsData.forEach((e, i) => {
        areaOfWindowsInt[i] = e.nos * calculateArea(e.width, e.height);
        sumOfAreaOfWindowsInt += areaOfWindowsInt[i];
        fMeshWinInt[i] = 4 * e.nos;
        sumOfFMeshWinInt += fMeshWinInt[i];
        uMeshWinInt[i] = e.nos * (2 * (e.width + e.height));
        sumOfUMeshWinInt += uMeshWinInt[i];
    });
    let windowsInt = {
        areaOfWindows: areaOfWindowsInt,
        sumOfAreaOfWindows: sumOfAreaOfWindowsInt,
        fMesh: fMeshWinInt,
        sumOfFMesh: sumOfFMeshWinInt,
        uMesh: uMeshWinInt,
        sumOfUMesh: sumOfUMeshWinInt
    };

    let areaOfVentInt = [];
    let fMeshVentInt = [];
    let uMeshVentInt = [];
    let sumOfFMeshVentInt = 0;
    let sumOfUMeshVentInt = 0;
    let sumOfAreaOfVentsInt = 0;

    data.internalWallData.ventData.forEach((e, i) => {
        areaOfVentInt[i] = e.nos * calculateArea(e.width, e.height);
        sumOfAreaOfVentsInt += areaOfVentInt[i];
        fMeshVentInt[i] = 4 * e.nos;
        sumOfFMeshVentInt += fMeshVentInt[i];
        uMeshVentInt[i] = e.nos * (2 * (e.height + e.width));
        sumOfUMeshVentInt += uMeshVentInt[i];
    });
    let ventsInt = {
        areaOfVent: areaOfVentInt,
        sumOfAreaOfVents: sumOfAreaOfVentsInt,
        fMesh: fMeshVentInt,
        sumOfFMesh: sumOfFMeshVentInt,
        uMesh: uMeshVentInt,
        sumOfUMesh: sumOfUMeshVentInt
    };

    let openingScheduleInternalWall = {
        totalArea: sumOfAreaOfGatesInt + sumOfAreaOfWindowsInt + sumOfAreaOfVentsInt,
        totalUMesh: sumOfUMeshGatesInt + sumOfUMeshWinInt + sumOfUMeshVentInt,
        totalFMesh: sumOfFMeshGatesInt + sumOfFMeshWinInt + sumOfFMeshVentInt
    };


    //calculation for Main walls 

    let totalAreaAfterDeductionInt = wallsInt.sumOfAreaOfWalls - openingScheduleInternalWall.totalArea;
    let panelAreaInt = data.internalWallData.panelArea || 1;
    let nosOfPanelsInt = totalAreaAfterDeductionInt / panelAreaInt;

    let mainWallInt = {
        totalArea: totalAreaAfterDeductionInt,
        nosOfPanels: nosOfPanelsInt
    }

    let totalAreaAfterDeductionEx = wallsEx.sumOfAreaOfWalls - openingScheduleExternalWall.totalArea;
    let panelAreaEx = data.externalWallData.panelArea || 1;
    let nosOfPanelsEx = totalAreaAfterDeductionEx / panelAreaEx;

    let mainWallEx = {
        totalArea: totalAreaAfterDeductionEx,
        nosOfPanels: nosOfPanelsEx
    }

    // calculation for Ground Floor Slab

    let slabArea = data.groundFloorSlab.slabArea || 0;
    let deduction = data.groundFloorSlab.deduction || 0;
    let panelArea = data.groundFloorSlab.panelArea || 1;

    let totalArea = slabArea - deduction;
    let nosOfPanels = totalArea / panelArea;

    let groundFloorSlab = {
        slabArea: slabArea,
        deduction: deduction,
        totalArea: totalArea,
        panelArea: panelArea,
        nosOfPanels: nosOfPanels
    };


    // calculation for lMesh

    let wallHeight = data.externalWallData.wallData[0]?.height || 0;
    let totalLengthCorners = wallHeight * data.lMesh.corners;
    let totalLengthExternalWall = wallsEx.sumOfLengthOfWalls * data.lMesh.externalWall;
    let totalLengthInternalWall = wallsInt.sumOfLengthOfWalls * data.lMesh.internalWall;
    let totalLengthLMesh = totalLengthCorners + totalLengthExternalWall + totalLengthInternalWall;
    let nosOfLMesh = totalLengthLMesh / (data.lMesh.length || 1);

    let lMesh = {
        totalLengthCorners: totalLengthCorners,
        totalLengthExternalWall: totalLengthExternalWall,
        totalLengthInternalWall: totalLengthInternalWall,
        totalLengthLMesh: totalLengthLMesh,
        nosOfLMesh: nosOfLMesh
    }

    //calculation for F-Mesh joints

    let length = wallsEx.sumOfLengthOfWalls + wallsInt.sumOfLengthOfWalls;
    let totalLength = length * data.fMesh.nos
    let nosOfFMesh = totalLength / (data.fMesh.length || 1);

    let fMesh = {
        length: length,
        totalLength: totalLength,
        nosJoints: nosOfFMesh,
        nosOpening: openingScheduleExternalWall.totalFMesh + openingScheduleInternalWall.totalFMesh
    }

    // calculation for u mesh 

    let uMesh = {
        externalWall: openingScheduleExternalWall.totalUMesh / data.fMesh.length,
        internalWall: openingScheduleInternalWall.totalUMesh /data.fMesh.length
    }

    calculationData = {
        wallsEx,
        gatesEx,
        windowsEx,
        ventsEx,
        openingScheduleExternalWall,
        wallsInt,
        gatesInt,
        windowsInt,
        ventsInt,
        openingScheduleInternalWall,
        mainWallInt,
        mainWallEx,
        groundFloorSlab,
        lMesh,
        fMesh,
        uMesh
    };



    paintMaterialCalculation(data, calculationData);

}


            
let explanation = ``;

function paintMaterialCalculation(inputData, calculationData) {
    let unit = document.getElementById('unitSelect').value;
    const snippetArea = document.getElementById('solutionTextAreaGroundFloor');
    let externalWallThickness = document.getElementById('externalWallThickness').value;
    let internalWallThickness = document.getElementById('internalWallThickness').value;
    let unitSelectThickIn = document.getElementById('unitSelectThickIn').value;
    let unitSelectThickEx = document.getElementById('unitSelectThickEx').value;
    let unitSelectThickSlb = document.getElementById('unitSelectThickSlb').value;
    let slabThickness = document.getElementById('slabThickness').value;

    if ((externalWallThickness < 100 || externalWallThickness > 310)  && unitSelectThickEx == 'mm') {
        document.getElementById('errorBoxExternalWall').innerText = 'Wall Thickness Cannot be smaller than 100mm or greater than 310mm';
        return;
    }
    if ((externalWallThickness < 4 || externalWallThickness > 12) && unitSelectThickEx == 'inches') {
        document.getElementById('errorBoxExternalWall').innerText = 'Wall Thickness Cannot be smaller than 4 inches or greater than 12 inches';
        return;
    } else {
        document.getElementById('errorBoxExternalWall').innerText = '';
    }

    if ((internalWallThickness < 100 || internalWallThickness > 310) && unitSelectThickIn == 'mm') {
        document.getElementById('errorBoxInternalWall').innerText = 'Wall Thickness Cannot be smaller than 100mm or greater than 310mm';
        return;
    }
    if ((internalWallThickness < 4 || internalWallThickness > 12) && unitSelectThickIn == 'inches') {
        document.getElementById('errorBoxInternalWall').innerText = 'Wall Thickness Cannot be smaller than 4 inches or greater than 12 inches';
        return;
    } else {
        document.getElementById('errorBoxInternalWall').innerText = '';
    }
    if ((slabThickness < 100 || slabThickness > 310) && unitSelectThickSlb == 'mm') {
        document.getElementById('errorBoxOtherData').innerText = 'Slab Thickness Cannot be smaller than 100mm or greater than 310mm';
        return;
    }
    if ((slabThickness < 4 || slabThickness > 12) && unitSelectThickSlb == 'inches') {
        document.getElementById('errorBoxOtherData').innerText = 'Slab Thickness Cannot be smaller than 4 inches or greater than 12 inches';
        return;
    } else {
        document.getElementById('errorBoxOtherData').innerText = '';
    }

    let explanation = `<h3><b>Material Calculation Report</b></h3>`;

    // EXTERNAL WALLS
    if (calculationData.mainWallEx.totalArea > 0) {
        explanation += `<h4><b>External Walls</b></h4>`;
        inputData.externalWallData.wallData.forEach((wall, idx) => {
            explanation += `Wall ${idx + 1}: Length = ${wall.length} ${unit}, Height = ${wall.height} ${unit}<br>`;
            explanation += `Area = ${calculationData.wallsEx.areaOfWalls[idx].toFixed(2)} sq.${unit}<br><br>`;
        });
        explanation += `Total External Wall Area = ${calculationData.wallsEx.sumOfAreaOfWalls.toFixed(2)} sq.${unit}<br>`;
        explanation += `Openings (Gates/Windows/Vents) = ${calculationData.openingScheduleExternalWall.totalArea.toFixed(2)} sq.${unit}<br>`;
        explanation += `Net Area After Deductions = ${calculationData.mainWallEx.totalArea.toFixed(2)} sq.${unit}<br>`;
        explanation += `Panels Required = ${calculationData.mainWallEx.totalArea.toFixed(2)} ÷ ${inputData.externalWallData.panelArea} = ${calculationData.mainWallEx.nosOfPanels.toFixed(2)} nos<br>`;
        explanation += `<hr>`;
    }

    // INTERNAL WALLS
    if (calculationData.mainWallInt.totalArea > 0) {
        explanation += `<h4><b>Internal Walls</b></h4>`;
        inputData.internalWallData.wallData.forEach((wall, idx) => {
            explanation += `Wall ${idx + 1}: Length = ${wall.length} ${unit}, Height = ${wall.height} ${unit}<br>`;
            explanation += `Area = ${calculationData.wallsInt.areaOfWalls[idx].toFixed(2)} sq.${unit}<br><br>`;
        });
        explanation += `Total Internal Wall Area = ${calculationData.wallsInt.sumOfAreaOfWalls.toFixed(2)} sq.${unit}<br>`;
        explanation += `Openings (Gates/Windows/Vents) = ${calculationData.openingScheduleInternalWall.totalArea.toFixed(2)} sq.${unit}<br>`;
        explanation += `Net Area After Deductions = ${calculationData.mainWallInt.totalArea.toFixed(2)} sq.${unit}<br>`;
        explanation += `Panels Required = ${calculationData.mainWallInt.totalArea.toFixed(2)} ÷ ${inputData.internalWallData.panelArea} = ${calculationData.mainWallInt.nosOfPanels.toFixed(2)} nos<br>`;
        explanation += `<hr>`;
    }

    // GROUND FLOOR SLAB
    if (calculationData.groundFloorSlab.totalArea > 0) {
        explanation += `<h4><b>Ground Floor Slab</b></h4>`;
        explanation += `Slab Area = ${calculationData.groundFloorSlab.slabArea.toFixed(2)} sq.${unit}<br>`;
        explanation += `Deduction = ${calculationData.groundFloorSlab.deduction.toFixed(2)} sq.${unit}<br>`;
        explanation += `Net Area After Deductions = ${calculationData.groundFloorSlab.totalArea.toFixed(2)} sq.${unit}<br>`;
        explanation += `Panels Required = ${calculationData.groundFloorSlab.totalArea.toFixed(2)} ÷ ${calculationData.groundFloorSlab.panelArea.toFixed(2)} = ${calculationData.groundFloorSlab.nosOfPanels.toFixed(2)} nos<br>`;
        explanation += `<hr>`;
    }

    // L-MESH
    if (calculationData.lMesh.totalLengthLMesh > 0) {
        explanation += `<h4><b>L-MESH</b></h4>`;
        explanation += `Corners: ${calculationData.lMesh.totalLengthCorners.toFixed(2)} ${unit}<br>`;
        if (document.getElementById('roofCheckbox').checked == true) {
            explanation += `External Wall: ${calculationData.lMesh.totalLengthExternalWall.toFixed(2)} ${unit}<br>`;
            explanation += `Internal Wall: ${calculationData.lMesh.totalLengthInternalWall.toFixed(2)} ${unit}<br>`;
        }
        explanation += `Total Length L-MESH = ${calculationData.lMesh.totalLengthLMesh.toFixed(2)} ${unit}<br>`;
        explanation += `Pieces Required = ${calculationData.lMesh.totalLengthLMesh.toFixed(2)} ÷ ${inputData.lMesh.length} = ${calculationData.lMesh.nosOfLMesh.toFixed(2)} nos<br>`;
        explanation += `<hr>`;
    }

    // F-MESH
    if (calculationData.fMesh.totalLength > 0 || calculationData.fMesh.nosOpening > 0) {
        explanation += `<h4><b>F-MESH</b></h4>`;
        explanation += `Wall Length for Joints = ${calculationData.fMesh.totalLength.toFixed(2)} ${unit}<br>`;
        explanation += `Total Length for Joints = ${calculationData.fMesh.totalLength.toFixed(2)} ${unit}<br>`;
        explanation += `Pieces Required (Joints) = ${calculationData.fMesh.totalLength.toFixed(2)} ÷ ${inputData.fMesh.length} = ${calculationData.fMesh.nosJoints.toFixed(2)} nos<br>`;
        explanation += `Pieces Required (Openings) = ${calculationData.openingScheduleExternalWall.totalFMesh} + ${calculationData.openingScheduleInternalWall.totalFMesh} = ${calculationData.fMesh.nosOpening.toFixed(2)} nos<br>`;
        explanation += `<hr>`;
    }

    // U-MESH
    // if (calculationData.openingScheduleExternalWall.totalUMesh > 0 || calculationData.openingScheduleInternalWall.totalUMesh > 0) {
    //     explanation += `<h4><b>U-MESH</b></h4>`;
    //     if (calculationData.openingScheduleExternalWall.totalUMesh > 0) {
    //         explanation += `Total Length for U-MESH (External Wall) = ${calculationData.openingScheduleExternalWall.totalUMesh.toFixed(2)} ${unit}<br>`;
    //     }
    //     if (calculationData.openingScheduleInternalWall.totalUMesh > 0) {
    //         explanation += `Total Length for U-MESH (Internal Wall) = ${calculationData.openingScheduleInternalWall.totalUMesh.toFixed(2)} ${unit}<br>`;
    //     }
    //     explanation += `<hr>`;
    // }

    // FINAL SUMMARY
    explanation += `<h3><b>Final Material Requirement Summary</b></h3>`;
    if (calculationData.mainWallEx.nosOfPanels > 0) {
        explanation += `External Wall Panels: ${calculationData.mainWallEx.nosOfPanels.toFixed(2)} nos<br>`;
    }
    if (calculationData.mainWallInt.nosOfPanels > 0) {
        explanation += `Internal Wall Panels: ${calculationData.mainWallInt.nosOfPanels.toFixed(2)} nos<br>`;
    }
    if (calculationData.groundFloorSlab.nosOfPanels > 0) {
        explanation += `Ground Floor Slab (${slabThickness} ${unitSelectThickSlb}): ${calculationData.groundFloorSlab.nosOfPanels.toFixed(2)} nos<br>`;
    }
    if (calculationData.lMesh.nosOfLMesh > 0) {
        explanation += `L-MESH: ${calculationData.lMesh.nosOfLMesh.toFixed(2)} nos<br>`;
    }
    if (calculationData.uMesh.externalWall > 0) {
        explanation += `U-MESH (External Wall (${externalWallThickness} ${unitSelectThickEx})): ${calculationData.uMesh.externalWall.toFixed(2)} nos<br>`;
    }
    if (calculationData.uMesh.internalWall > 0) {
        explanation += `U-MESH (Internal Wall (${internalWallThickness} ${unitSelectThickIn})): ${calculationData.uMesh.internalWall.toFixed(2)} nos<br>`;
    }
    if (calculationData.fMesh.nosOpening > 0) {
        explanation += `F-MESH (Openings): ${calculationData.fMesh.nosOpening.toFixed(2)} nos<br>`;
    }
     if (calculationData.fMesh.nosJoints > 0) {
        explanation += `F-MESH (Joints): ${calculationData.fMesh.nosJoints.toFixed(2)} nos<br>`;
    }
    

    snippetArea.innerHTML = explanation;

    // Enable download and contact elements
    let downloadButton = document.getElementById('downloadButton');
    downloadButton.disabled = false;
    downloadButton.classList.remove('disabled');
    document.getElementById('contactNo').classList.remove('disabled');
    document.getElementById('mailId').classList.remove('disabled');
    document.getElementById('companyAddress').classList.remove('disabled');
}


function downloadPdf() {

    const contactNo = document.getElementById('contactNo').value.trim();
    const mailId = document.getElementById('mailId').value.trim();
    const companyAddress = document.getElementById('companyAddress').value.trim();
    const errorBox = document.getElementById('error-box-input-data');

    function validateInputs() {
        let isValid = true;
        if (!/^\d{10}$/.test(contactNo)) {
            errorBox.innerText = 'Please enter a valid 10-digit Contact No.';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailId)) {
            errorBox.innerText = 'Please enter a valid email address.';
            isValid = false;
        } else if (companyAddress.length === 0) {
            errorBox.innerText = 'Company address cannot be empty.';
            isValid = false;
        } else {
            errorBox.innerText = '';
        }
        return isValid;
    }

    if (!validateInputs()) {
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageCenter = doc.internal.pageSize.getWidth() / 2;
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Contact: ${contactNo}`, pageCenter, y, { align: 'center' });
    y += 7;
    doc.text(`Email: ${mailId}`, pageCenter, y, { align: 'center' });
    y += 7;
    doc.text(`Address: ${companyAddress}`, pageCenter, y, { align: 'center' });
    y += 15;

    const pdfText = explanation
        .replace(/<hr\s*\/?>/gi, '\n---HR---\n')
        .replace(/<h3><b>(.*?)<\/b><\/h3>/gi, '\n---H3---$1\n')
        .replace(/<h4><b>(.*?)<\/b><\/h4>/gi, '\n---H4---$1\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/÷/g, '÷')
        .replace(/ /g, ' ');

    const lines = pdfText.split('\n');

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine.length === 0) return;


        if (trimmedLine.startsWith('---H3---Final Material Requirement Summary')) {
        doc.addPage();
        y = 20;
      }


        if (y > 280) { 
            doc.addPage();
            y = 20;
        }

        if (trimmedLine.startsWith('---H3---')) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(14);
            doc.text(trimmedLine.replace('---H3---', ''), 10, y);
            y += 8;
        } else if (trimmedLine.startsWith('---H4---')) {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.text(trimmedLine.replace('---H4---', ''), 10, y);
            y += 7;
        } else if (trimmedLine === '---HR---') {
            y += 2;
            doc.setDrawColor(180, 180, 180); 
            doc.line(10, y, pageWidth - 10, y); 
            y += 6;
        } else {
            doc.setFont('courier', 'normal');
            doc.setFontSize(10);
            const wrappedLines = doc.splitTextToSize(trimmedLine, pageWidth - 20); 
            wrappedLines.forEach(wLine => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(wLine, 10, y);
                y += 5;
            });
        }
    });

    doc.save('Material-Calculation-Report.pdf');
}

function reset(){
  let allInputs = document.getElementsByClassName('input-box');
  Array.from(allInputs).forEach((e)=>{
    if(e.disabled == false){
        e.value = '';
        explanation = ``;
    }
    const snippetArea = document.getElementById('solutionTextAreaGroundFloor');

     snippetArea.innerHTML = explanation;

    // Enable download and contact elements
    let downloadButton = document.getElementById('downloadButton');
    downloadButton.disabled = true;
    downloadButton.classList.add('disabled');
    document.getElementById('contactNo').classList.add('disabled');
    document.getElementById('mailId').classList.add('disabled');
    document.getElementById('companyAddress').classList.add('disabled');
  })
}



function changeUnit(e){

    let gfePanelAreaInputBox = document.getElementById('gfePanelAreaInputBox');
    let gfiPanelAreaInputBox = document.getElementById('gfiPanelAreaInputBox');
    let groundFloorPanelArea = document.getElementById('groundFloorPanelArea');
    let lMeshLength = document.getElementById('lMeshLength');
    let fMeshLength = document.getElementById('fMeshLength');

   if(e.value == 'Feet'){
    gfePanelAreaInputBox.value = '38.75';
    gfiPanelAreaInputBox.value = '38.75';
    groundFloorPanelArea.value   = '38.75';
    lMeshLength.value = '4';
    fMeshLength.value = '4';
   }
   if(e.value == 'Meter'){
    gfePanelAreaInputBox.value = '3.6';
    gfiPanelAreaInputBox.value = '3.6';
    groundFloorPanelArea.value = '3.6';
    lMeshLength.value = '1.2';
    fMeshLength.value = '1.2';
   }

}

function fillZero(e,id){
    let section = document.getElementById(id);
    if(e.checked == true){
        let inputBoxes = section.getElementsByClassName('input-box');
        Array.from(inputBoxes).forEach((e)=>{
            if(e.disabled == false){
                if(e.getAttribute('min')){
                   e.value = e.getAttribute('min');
                }else{
                e.value =0;
                }
            }
        })
    }
    if(e.checked == false){
        let inputBoxes = section.getElementsByClassName('input-box');
        Array.from(inputBoxes).forEach((e)=>{
            if(e.disabled == false){
                if(e.getAttribute('min')){
                   e.value = '';
                }else{
                e.value = '';
                }
               
            }
        })
    }
}

// (fillZero(
// Array.from(document.getElementsByClassName('input-box')).forEach((e)=>{
// e.value =0
// })
// ))()
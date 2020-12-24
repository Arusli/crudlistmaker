let addItemInput = document.querySelector('.addItemInput');
let addButton = document.querySelector('.addButton');
let ulelement = document.querySelector('ul'); //ul element, formerly var list
let clearButton = document.querySelector('.clearButton');
let li = document.querySelector('li');
let list = document.querySelector('.list'); //ul class = "list"
// let counter = 0;

//
let dbArray = [];

//focus input field
addItemInput.focus();

//INITIALIZE
getList();

//LISTENERS

//mouse click//
addButton.addEventListener('click', (e) => {
    if (addItemInput.value !== "" && e.type === 'click') addItem();
});

//return key//
addItemInput.addEventListener('keydown', (e) => {
    if (addItemInput.value !== "" && e.keyCode === 13) addItem();
});

 // newItem.addEventListener('click', () => {
        //     newItem.innerHTML = '<s>' + itemText + '</s>';
        //     newItem.style.color = 'grey';
        //     newItem.style.fontSize = '1.25rem';
        //     newItem.firstElementChild.style.backgroundColor = 'grey';
        // });
        // somehow this lets you check off list items with the return key... can't figure out another way.


//moved the select items listener (beneath) outside of the add items function scope using e.target
list.addEventListener('click', (e) => {
    if (e.target.tagName === 'LI' && e.target.className === 'toDo') {
        e.target.className = 'done';
        e.target.style.color = 'grey';
        e.target.style.fontSize = '1.4rem'
        e.target.firstElementChild.style.backgroundColor = 'black';
    } else if (e.target.tagName === 'LI' && e.target.className === 'done') {
        e.target.className = 'toDo';
        e.target.style.color = 'black';
        e.target.style.fontSize = '1.6rem'
        e.target.firstElementChild.style.backgroundColor = 'white';
    } else if (e.target.tagName === 'BUTTON' && e.target.parentNode.className === 'toDo') {
        e.target.parentNode.className = 'done';
        e.target.style.backgroundColor = 'black';
        e.target.parentNode.style.color = 'grey';
        e.target.parentNode.style.fontSize = '1.4rem';
    } else if (e.target.tagName === 'BUTTON' && e.target.parentNode.className === 'done') {
        e.target.parentNode.className = 'toDo';
        e.target.style.backgroundColor = 'white';
        e.target.parentNode.style.color = 'black';
        e.target.parentNode.style.fontSize = '1.6rem';
    }
});


//CLEAR// 
//somehow this works with return key even though no event listener is set for 'return' key.
//... Because it is a button?
clearButton.addEventListener('click', () => {
    let removeArray = document.getElementsByClassName("done");
    let idArray = [];
    let length = removeArray.length;
    console.log(removeArray);
    for (i=0;i<length;i++) {
        idArray.push(removeArray[0].id); 
        //I used [0] because the first [0] gets removed each iteration. 
        //Why does the removeArray get affected by the removeChild method?
        ulelement.removeChild(removeArray[0]);
        console.log(removeArray);
    }
    console.log(idArray);

    // ulelement.innerHTML = "";

    //Delete request which sends idArray as the body
    let deleteKeysObject = {};
    deleteKeysObject.toDelete = idArray;
    console.log(deleteKeysObject);
    console.log('line 88')


    //problem is this object is going through blank, I believe. ASync problem?

//    function deleteIds(obj) {
//         fetch('http://localhost:3000/list', {
//             method: 'DELETE',
//             body: JSON.stringify(obj) 
//         })
//     }

    deleteData('http://localhost:3000/list', deleteKeysObject);

    async function deleteData(url, data) {
        // Default options are marked with *
        const response = fetch(url, {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        // return response.json(); // parses JSON response into native JavaScript objects
        response.then(reply => {
            return reply.json();
         }).then(reply2 => console.log(reply2.message))
    //    console.log('line 117', reply);
        // return response.json();
  }

}); //end clearbutton event




//functions
function addItem() {
    let postObject = {};
    // counter ++;
    let itemText = addItemInput.value;
    let newItem = document.createElement('li');
    newItem.className = 'toDo';
    // newItem.id = `listitem${counter}`;
    newItem.id = create_UUID();
    newItem.innerHTML = '<button class="newButton"></button>' + itemText;
    ulelement.appendChild(newItem);
    addItemInput.value = ""; 

    postObject["newItem"] = [newItem.id, itemText];
    console.log(postObject);

    //now need to create post request with the postObject as the body.

    postData('http://localhost:3000/list', postObject);

    async function postData(url, data) {
        // Default options are marked with *
        const response = fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        // return response.json(); // parses JSON response into native JavaScript objects
       response.then(reply => {
           return reply.json(); //this is because .json returns a promise, which then resolves and can be displayed below with console.log.
        }).then( reply2 => console.log(reply2))
        
    //    console.log('line 117', reply);
        // return response.json();
      }
      
      
    } //end addItem()

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return 'listitem-' + uuid;
} //end create_uuid


//make get request to the api endpoint which contains updated database array.
//return all list values
//display list values
//add ID's to new values.
async function getList() {
    await fetch('http://localhost:3000/list')
    .then(response => response.json())
    .then(data => {
        dbValueArray = data.values; 
        dbIdArray = data.keys;
        console.log('starting id array: ' + dbIdArray);
        console.log('starting value array: ' + dbValueArray);
    });

    for (i=0;i<dbValueArray.length;i++) {
        let itemText = dbValueArray[i];
        let newItem = document.createElement('li');
        newItem.className = 'toDo';
       
        //add new item id based on dbIdArray!!
        newItem.id = dbIdArray[i];

        // newItem.id = `listitem${counter}`;
        // newItem.id = create_UUID();
        newItem.innerHTML = '<button class="newButton"></button>' + itemText;
        ulelement.appendChild(newItem);
        addItemInput.value = ""; 
    }
}

//db needs to be updated when items are 1. removed, 2. added.
//need 2 separate functions most likely: Post and Delete.

const socket = io()
let name;
let receiver;
let users=[];
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')
let userArea = document.querySelector('.users__area')

do {
    name = prompt('Please enter your name: ')
    socket.emit('create_room', `${name}`)
} while(!name)

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})
function myFunction() {
    var x = document.getElementById("mySelect").value;
    receiver = x
  }

  
function sendMessage(message) {
    let msg = {
        user: name,
        receiver:receiver,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)


}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})
socket.on('users', (msg) => {
    users.push(msg)
    let markup = '<select id="mySelect" onchange="myFunction()">'
    for (i = 0; i < users.length; i++) {    
        markup += `   
        <option value="${users[i]}">${users[i]}</option>
        `
    }  
        markup +=' </select>'
        userArea.appendChild(markup)
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}




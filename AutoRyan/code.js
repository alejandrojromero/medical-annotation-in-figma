// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
console.log(figma.currentUser.name);



const username = figma.currentUser.name;


const selection = figma.currentPage.selection["0"]
console.log(selection)

var annotations = [];


//Update selection color every 500ms so that new annotations are the same color
setInterval(function () {
  if (figma.currentPage.selection["0"] != null && annotations.includes(figma.currentPage.selection["0"]) == false && figma.currentPage.selection["0"].name.slice(-2) != "_a"
    && figma.currentPage.selection["0"].fills.type != "IMAGE"
  ) {
    const newSelection = figma.currentPage.selection["0"];
    changeColor(newSelection);

    annotations.push(newSelection)


    createLabel(newSelection)


  }
}, 1000)



async function createLabel(newSelection) {

  await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
  const label = figma.createText();

  var today = new Date();
  var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + ' ' + time;



  label.characters = username + " \n" + dateTime

  if (newSelection.name.charAt(0) != "A") {
    label.x = newSelection.x + newSelection.width
    label.y = newSelection.y + newSelection.height
  }

  if (newSelection.name.charAt(0) == "A") {
    label.x = newSelection.x
    label.y = newSelection.y
  }

  label.fills = [{
    "type": "SOLID",
    "visible": true,
    "opacity": 1,
    "blendMode": "NORMAL",
    "color": {
      "r": uniqueColorRGB[0] / 255,
      "g": uniqueColorRGB[1] / 255,
      "b": uniqueColorRGB[2] / 255
    }
  }]

  label.name = label.name + "_a"
  figma.currentPage.appendChild(label);
  annotations.push(label);
}




var stringToColour = function (str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = '';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}




function hexToRGB(h) {


  var aRgbHex = h.match(/.{1,2}/g);
  var aRgb = [
    parseInt(aRgbHex[0], 16),
    parseInt(aRgbHex[1], 16),
    parseInt(aRgbHex[2], 16)
  ];
  return aRgb;

}

  console.log(stringToColour(username))
  var uniqueColorRGB = hexToRGB(stringToColour(username))


  function changeColor(selection) {


    //Assign unique color to selected object
    if (selection != null) {
      selection.fills = [{
        "type": "SOLID",
        "visible": true,
        "opacity": 1,
        "blendMode": "NORMAL",
        "color": {
          "r": uniqueColorRGB[0] / 255,
          "g": uniqueColorRGB[1] / 255,
          "b": uniqueColorRGB[2] / 255
        }
      }]

      if (selection.name.charAt(0) != "T") {
        selection.strokes = [{
          "type": "SOLID", "visible": true, "opacity": 1, "blendMode": "NORMAL", "color": {
            "r": uniqueColorRGB[0] / 255,
            "g": uniqueColorRGB[1] / 255,
            "b": uniqueColorRGB[2] / 255
          }
        }]
      }

      selection.name = selection.name + "_a"

      annotations.push(selection);

      console.log(selection)

    }

  }


  //export { username };
  //module.exports = {username};

  // Calls to "parent.postMessage" from within the HTML page will trigger this
  // callback. The callback will be passed the "pluginMessage" property of the
  // posted message.
  figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-rectangles') {
      const nodes = [];





      var allSelectedNodes = figma.currentPage.selection
      var imageName = "";

      for (let i=0; i < allSelectedNodes.length; i++){
        console.log(allSelectedNodes[i].type)
        if(allSelectedNodes[i].fills[0].type == "IMAGE") {
          imageName = allSelectedNodes[i].name
        }
    
    }


      const newGroup = figma.group(figma.currentPage.selection, figma.currentPage.children[0].parent);

      newGroup.name = imageName;






      console.log("grouped")
      console.log(allSelectedNodes)

      var selectionArray = [newGroup]
      figma.currentPage.selection = selectionArray;

    //  figma.currentPage.selection = nodes;
      //figma.viewport.scrollAndZoomIntoView(nodes);

    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    //figma.closePlugin();
  };


  const userColor = stringToColour(username)

  figma.ui.postMessage({ "username": username, "userColor": userColor });

//本の名前　説明　表紙の画像
var network = null;
var nodes, edges;
nodes = new vis.DataSet();

nodes = new vis.DataSet();
edges = new vis.DataSet();

// create a network
var data = {
  nodes: nodes,
  edges: edges,
};

function destroy() {
  if (network !== null) {
    network.destroy();
    network = null;
  }
}

function draw() {
  destroy();
  // create a network
  var data = {
    nodes: nodes,
    edges: edges,
  };

  // create a network
  var container = document.getElementById("mynetwork");
  var options = {
    manipulation: {
      addNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerHTML = "Add Node";
        document.getElementById("node-id").value = data.id;
        document.getElementById("node-label").value = data.label;
        document.getElementById("saveButton").onclick = saveData.bind(
          this,
          data,
          callback
        );
        document.getElementById("cancelButton").onclick = clearPopUp.bind();
        document.getElementById("network-popUp").style.display = "block";
      },
      editNode: function (data, callback) {
        // filling in the popup DOM elements
        document.getElementById("operation").innerHTML = "Edit Node";
        document.getElementById("node-id").value = data.id;
        document.getElementById("node-label").value = data.label;
        document.getElementById("saveButton").onclick = saveData.bind(
          this,
          data,
          callback
        );
        document.getElementById("cancelButton").onclick = cancelEdit.bind(
          this,
          callback
        );
        document.getElementById("network-popUp").style.display = "block";
      },
      addEdge: function (data, callback) {
        if (data.from == data.to) {
          var r = confirm("Do you want to connect the node to itself?");
          if (r == true) {
            callback(data);
          }
        } else {
          callback(data);
        }
      },
    },
    configure: {
      filter: function (option, path) {
        if (path.indexOf("physics") !== -1) {
          return true;
        }
        if (path.indexOf("smooth") !== -1 || option === "smooth") {
          return true;
        }
        return false;
      },
      container: document.getElementById("config"),
    },
  };
  reload();
  network = new vis.Network(container, data, options);
}

function clearPopUp() {
  document.getElementById("saveButton").onclick = null;
  document.getElementById("cancelButton").onclick = null;
  document.getElementById("network-popUp").style.display = "none";
}

function cancelEdit(callback) {
  clearPopUp();
  callback(null);
}

function saveData(data, callback) {
  data.id = document.getElementById("node-id").value;
  data.label = document.getElementById("node-label").value;
  clearPopUp();
  callback(data);
}
function OnbuttonClick() {
  var newId = (Math.random() * 1e7).toString(32);
  nodes.add({ id: newId, label: "I'm new!" });
}
function add(title, imagepath) {
  var newId = (Math.random() * 1e7).toString(32);
  nodes.add({ id: title, shape: "image", image: "imagepath" });
}

// 本を検索して結果を返す
async function searchBooks() {
  // Google Books APIs のエンドポイント
  var endpoint = "https://www.googleapis.com/books/v1";

  // 検索 API を叩く
  var res = await fetch(`${endpoint}/volumes?q=鬼滅`);
  // JSON に変換
  var data = await res.json();

  // 必要なものだけ抜き出してわかりやすいフォーマットに変更する
  var items = data.items.map((item) => {
    var vi = item.volumeInfo;
    return {
      title: vi.title,
      description: vi.description,
      link: vi.infoLink,
      image: vi.imageLinks ? vi.imageLinks.smallThumbnail : "",
    };
  });
  console.log(items);
  return items;
}

async function reload() {
  var books = await searchBooks();
  nodes.clear();
  for (const elem of books) {
    console.log(elem.title);
    var newId = (Math.random() * 1e7).toString(32);
    nodes.add({ id: newId, shape: "image", image: elem.image, value: 20 });
  }
}

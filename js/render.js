var RENDER = {};

RENDER.duration = 0;
RENDER.width  = canvasWidth;
RENDER.height  = canvasHeight;
RENDER.time  = 0;
RENDER.exportFlg =false;
RENDER.exportStart = false;

var GUI = {};
GUI.f1_count  = 800;


var ctrl = new function() {
  this.f1_count  = 800;
  this.f1_sizeX  = 0.2;
  this.f1_sizeY  = 0.2;
  this.f1_sizeZ  = 10.0;
  this.f1_color1 = "#ffffff";
  this.f1_color2 = "#ff0000";
  
  this.f0_duration       = 120;
  this.f0_cameraSpin     = false;
  this.f0_cameraShake    = false;
  this.f0_cameraPosition = 0;

  this.shuffle = function() { shuffle()};      
  this.EXPORT = function() { makeName(); RENDER.exportFlg = true};
  
  this.save_json = function() { save()};
  this.load_json = function() { load()};
};

function renderInit() {
  RENDER.height = canvasHeight;

  // GUI ===============================================================
  var gui = new dat.GUI();
  
  var f1 = gui.addFolder('Particle');
  var f1_count  = f1.add(ctrl, 'f1_count', 0, 4000).listen();
  var f1_sizeX  = f1.add(ctrl, 'f1_sizeX', 0.1, 20).listen();
  var f1_sizeY  = f1.add(ctrl, 'f1_sizeY', 0.1, 20).listen();
  var f1_sizeZ  = f1.add(ctrl, 'f1_sizeZ', 0.1, 20).listen();
  var f1_color1 = f1.addColor(ctrl, 'f1_color1').listen();
  var f1_color2 = f1.addColor(ctrl, 'f1_color2').listen();
  
  var f0 = gui.addFolder('Camera');
  f0.open();
  f0.add(ctrl, 'f0_cameraSpin').listen();
  f0.add(ctrl, 'f0_cameraShake').listen();
  var f0_cameraPosition = f0.add(ctrl, 'f0_cameraPosition', -100, 100).listen();  
  f0.add(ctrl, 'f0_duration', 10, 600).listen();
  // f0.add(ctrl, 'EXPORT');

  var f = gui.addFolder('under construction');
  
  f.add(ctrl, 'save_json');
  f.add(ctrl, 'load_json');

//====================================================================================
// render ============================================================================
//====================================================================================

  function render(){
    requestAnimationFrame(render);     
    RENDER.duration = Math.round(ctrl.f0_duration);
    if(capTrigger == true){
      if(RENDER.duration > 300){
        RENDER.duration = Math.floor(RENDER.duration * ( 150 / RENDER.duration));
      }else{
        RENDER.duration = Math.floor(RENDER.duration / 2);
      }
    }
    if(RENDER.exportFlg == true){
      if(RENDER.exportStart == false){
        frame = 0;
        RENDER.exportStart = true;
      }
    }
    RENDER.time = (frame / RENDER.duration);  
    if(RENDER.time >= 1){
      frame = 0;
      RENDER.exportFlg = false;
      RENDER.exportStart = false;
    }
    saveFrame();
    frame++;
    if(capTrigger == true){
      capturer.capture(myCanvas);
    }
    if(frame== RENDER.duration && capTrigger == true){
      capturer.stop();
      capturer.save( function( blob ) { 
        console.log(blob);
        var url = URL.createObjectURL( blob );
        var a = document.createElement( 'a' );
        a.href = url;
        a.download = 'loop.gif';  //ファイル名設定
        document.getElementById('gif-rendering').appendChild(a);
        a.click();
        document.getElementById('gif-rendering').removeChild(a);
        URL.revokeObjectURL( url );
        document.getElementById('gif-rendering').classList.remove('active');
      });
      capturer = new CCapture({
        format: 'gif', workersPath: 'js/',
        verbose: true,
        framerate: 0,
        // name: 01,
        // timeLimit: 1,
        // width:1280,
        // height:720
      });
      capTrigger = false;
      aspect = render.width / RENDER.height;
      myCanvas.style.width = '100%';
      myCanvas.style.height = 'initial';
    }
  };
  render();

//保存処理 ______________________________________________________
  var renderA = document.createElement('a');
  // 生成する文字列に含める文字セット
  var c = "abcdefghijklmnopqrstuvwxyz";
  var cl = c.length;
  var r = "";
  function exportPng(){
    RENDER.exportFlg = true
    var txt = "";
    for(var i=0; i<4; i++){
      txt += c[Math.floor(Math.random()*cl)];
    }
    r = txt;
  }
  function saveFrame(){
    if(RENDER.exportFlg == true){
      progress();
      renderA.href = myCanvas.toDataURL();
      renderA.download = r + '_' + ( '000' + frame ).slice( -4 ) + '.png';
      renderA.click();
    }
  }
  var ctx = document.getElementById('myCanvas2').getContext('2d');
  ctx.font = "30px san-serif";
  function progress(){
    ctx.fillStyle = ("#ffffff");
    ctx.fillRect(0,0,1000,100);
    ctx.fillStyle = ("#000000");      
    ctx.fillText(frame + 1 + "/" + RENDER.duration, 10, 40 );
  }
  myCanvas.style.width = "100%";
  myCanvas.style.height = "initial";
  var data = [];
  function setData(){
    data = {
      f0 : {
        cameraSpin : ctrl.f0_cameraSpin,
        cameraShake : ctrl.f0_cameraShake,              
        cameraPosition : ctrl.f0_cameraPosition,              
        duration : ctrl.f0_duration
      },
      f1 : {
        count : ctrl.f1_count,
        sizeX : ctrl.f1_sizeX,
        sizeY : ctrl.f1_sizeY,
        sizeZ : ctrl.f1_sizeZ,
        color1 : ctrl.f1_color1,
        color2 : ctrl.f1_color2,
      }
    };
  };
  function loadData(){
    console.log(data);
    
    ctrl.f1_count = data.f1.count;
    ctrl.f1_sizeX = data.f1.sizeX;
    ctrl.f1_sizeY = data.f1.sizeY;
    ctrl.f1_sizeZ = data.f1.sizeZ;
    ctrl.f1_color1 = data.f1.color1;
    ctrl.f1_color2 = data.f1.color2;

    ctrl.f0_cameraSpin = data.f0.cameraSpin;
    ctrl.f0_cameraShake = data.f0.cameraShake;
    ctrl.f0_cameraPosition = data.f0.cameraPosition;
    ctrl.f0_duration = data.f0.duration;
        
    updatePar();
    updateRing();
    updateSpiral();
    updateCamera();
  };
  function save(){
    setData();
    data.color = ctrl.color;
    var a = document.createElement( 'a' );
    var blob = new Blob( [ JSON.stringify( data ) ], { type : "application/json" } );
    var url = URL.createObjectURL( blob );
    a.href = url;
    a.download = '' + data.title + ( +new Date() ) + '.json';  //ファイル名設定
    // a.download = 'hogahogahoga.onom';  //ファイル名設定
    a.click();
    URL.revokeObjectURL( url );
  };
  function load(){
    var input = document.createElement( 'input' );
    input.type = 'file';
    input.addEventListener( 'change', function( _e ){
      var reader = new FileReader();
      reader.readAsText( _e.target.files[ 0 ] );
      reader.onload = function( _e ){
        data = JSON.parse( reader.result );
        loadData(); 
      }
    } );
    input.click();
  };
  var capturer = new CCapture({
    format: 'gif', workersPath: 'js/',
    verbose: true,
    framerate: 0,
    // name: 01,
    // timeLimit: 1,
    // width:1280,
    // height:720
  });

  var capTrigger = false;
  function exportGif2(){
    document.getElementById('gif-rendering').classList.add('active');
    camera = new THREE.PerspectiveCamera( fov, 1, near, far );
    updateCamera();
    renderer.setSize(300, 300);
    frame = 0;
    capturer.start();
    capTrigger = true;
  }

  function exportGif(){
    document.getElementById('gif-rendering').classList.add('active');
    // renderer.setSize(400, 225);
    frame = 0;
    capturer.start();
    capTrigger = true;
  }

  document.getElementById("exportPngBtn").onclick = function() {
    exportPng();
  };
  document.getElementById("exportGifBtn").onclick = function() {
    exportGif();
  };
  document.getElementById("exportGifBtn2").onclick = function() {
    exportGif2();
  };

};
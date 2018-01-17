Math.degrees = function(radian){
  if(isNaN(radian)){
     return NaN;
  }
  return radian * 360/(2*Math.PI);
}

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

function init() {
  var scene = new THREE.Scene();
  var frame = 0;
  var canvasWidth = 1280;
  var canvasHeight = 720;
  var width  = canvasWidth;
  var height = canvasHeight;

  var time = 0;
  var duration;

  var exportFlg = false;

  // GUI ===============================================================
    var ctrl = new function() {

      this.f1_count = 1000;
      this.f1_sizeX = 1.0;
      this.f1_sizeY = 1.0;
      this.f1_sizeZ = 10.0;
      this.f1_color1 = "#ffffff";
      this.f1_color2 = "#ff0000";

      this.f2_count = 0;
      this.f2_size = 5;
      this.f2_width = 0.5;
      this.f2_color = "#ffffff";
      this.f2_segments = 8;
      
      this.f3_count = 0;
      this.f3_size = 1;
      this.f3_rotate = 0;
      this.f3_color = "#ffffff";
      
      this.f0_duration = 600;
      this.f0_cameraSpin = false;
      this.f0_cameraShake = false;
      this.f0_cameraPosition = 0;

      this.shuffle = function() { shuffle()};      
      this.EXPORT = function() { makeName(); exportFlg = true};
      
      this.save_json = function() { save()};
      this.load_json = function() { load()};
    };

    var gui = new dat.GUI();


    
    var f1 = gui.addFolder('Particle');
    f1.open();
    var f1_count = f1.add(ctrl, 'f1_count', 0, 5000).listen();
    var f1_sizeX = f1.add(ctrl, 'f1_sizeX', 0.1, 20).listen();
    var f1_sizeY = f1.add(ctrl, 'f1_sizeY', 0.1, 20).listen();
    var f1_sizeZ = f1.add(ctrl, 'f1_sizeZ', 0.1, 20).listen();
    var f1_color1 = f1.addColor(ctrl, 'f1_color1').listen();
    var f1_color2 = f1.addColor(ctrl, 'f1_color2').listen();
    
    var f2 = gui.addFolder('Ring');
    f2.open();
    var f2_count = f2.add(ctrl, 'f2_count', 0, 20).listen();
    var f2_size = f2.add(ctrl, 'f2_size', 0, 15).listen();
    var f2_width = f2.add(ctrl, 'f2_width', 0.1, 2).listen();
    var f2_segments = f2.add(ctrl, 'f2_segments', 3, 64).listen();
    var f2_color = f2.addColor(ctrl, 'f2_color').listen();
    
    var f3 = gui.addFolder('Spiral');
    f3.open();
    var f3_count = f3.add(ctrl, 'f3_count', 0, 1000).listen();
    var f3_rotate = f3.add(ctrl, 'f3_rotate', 0, 180).listen();
    var f3_size = f3.add(ctrl, 'f3_size', 0.1, 10).listen();
    var f3_color = f3.addColor(ctrl, 'f3_color').listen();
  
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

  // Renderer =========================================================
    var myCanvas = document.getElementById('myCanvas');  
    var renderer = new THREE.WebGLRenderer({
      canvas: myCanvas,
      antialias: true
    });
    
    var ctx = document.getElementById('myCanvas2').getContext('2d');
    ctx.font = "30px san-serif";
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(canvasWidth, canvasHeight);    
    // renderer.shadowMap.enabled = true;
		renderer.domElement.id = 'three';

  // Camera ===========================================================
    var fov    = 120;
    var aspect = width / height;
    var near   = 0.01;
    var far    = 4000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    
    camera.position.set( 0, 0, 10 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    scene.fog = new THREE.Fog(0x000000, 0, 50);

  // Light =============================================================
    // var topLight = new THREE.DirectionalLight(0xffffff);
    // topLight.position.set(30, 30, 100);
    // scene.add( topLight );
    // scene.add( topLight );
    
    // 部屋全体を照らすライト
    // var ambient = new THREE.AmbientLight(0xFFFFFF);
    // scene.add(ambient);
	
  // Particle========================================
    var particleMaterial1;
    var particleMaterial2;
    var particleBoxGeometry = new THREE.BoxGeometry( 1, 1, 1 );
    var particleCubeCount;
    var particleCube = [];
    updatePar();
  // Spiral==========================================
    var spiralCount;
    var spiral = [];
    var spiralGeometry;
    var spiralMaterial;    
    updateSpiral();

  // Ring ==========================================
    var ringGeometry;
    var ringMaterial;
    var ringCount;
    var ring = [];
    updateRing();
  //====================================================================================
  // Anim ==============================================================================
  //====================================================================================
    function anim(){

      for(var i = 0; i < particleCubeCount; i++) {
        particleCube[i].scale.x = ctrl.f1_sizeX;
        particleCube[i].scale.y = ctrl.f1_sizeY;
        particleCube[i].scale.z = ctrl.f1_sizeZ;
      }

      for(var i = 0; i < spiralCount; i++) {
        // spiral[i].rotation.y += i / 25000 * Math.PI;
        // spiral[i].rotation.x += i / 25000 * Math.PI;
        spiral[i].position.z = ((time + i/spiralCount)%1) * 100;
      }

      for(var i = 0; i < particleCubeCount; i++) {
        // spiralCube[i].rotation.y += i / 25000 * Math.PI;
        // spiralCube[i].rotation.x += i / 25000 * Math.PI;
        particleCube[i].position.z = ((time + i/particleCubeCount)%1) * 100;
      }

      for(var i = 0; i < ringCount; i++) {
        ring[i].position.z = ((time + i/Math.floor(ringCount))%1) * 100;
      }

      // camera shake ========
      if(ctrl.f0_cameraShake == true){
        camera.position.x = Math.sin(time * 4 * Math.PI);
        camera.position.y = Math.sin(time * 6 * Math.PI);       
      }else{
        camera.position.x = 0;
        camera.position.y = 0;   
      }
      
      if(ctrl.f0_cameraSpin == true){
        camera.rotation.z = Math.radians(time * 360);        
      }else{
        camera.rotation.z = 0;      
      }
    }

    function updatePar(){
      particleMaterial1 = new THREE.MeshBasicMaterial( {color: ctrl.f1_color1});
      particleMaterial2 = new THREE.MeshBasicMaterial( {color: ctrl.f1_color2});
      particleMaterial1.needsUpdate = true;
      particleMaterial2.needsUpdate = true;
      for(var i = 0; i < particleCubeCount; i++) {
        scene.remove(particleCube[i]);
      }
      particleCubeCount = ctrl.f1_count;　// particleの数を更新
      for(var i = 0; i < particleCubeCount; i++) {
        if(i % 2 == 0){
          particleCube[i] = new THREE.Mesh( particleBoxGeometry, particleMaterial1 );
        }else{
          particleCube[i] = new THREE.Mesh( particleBoxGeometry, particleMaterial2 );
        }
        particleCube[i].position.x = ( Math.random() - 0.5 ) * 130;
        particleCube[i].position.y = ( Math.random() - 0.5 ) * 130;
        scene.add(particleCube[i]);
      }
    }
    f1_count.onChange (function(value){ updatePar(); });
    f1_color1.onChange(function(value){ updatePar(); });
    f1_color2.onChange(function(value){ updatePar(); });

    function updateSpiral(){
      spiralMaterial = new THREE.MeshBasicMaterial( {color: ctrl.f3_color});
      spiralMaterial.needsUpdate = true;
      for(var i = 0; i < spiralCount; i++) {
        scene.remove(spiral[i]);
      }
      spiralCount = Math.floor(ctrl.f3_count);
      spiralGeometry = new THREE.BoxGeometry( 0.2, ctrl.f3_size, 0.2 );    
      for(var i = 0; i < spiralCount; i++) {
        spiral[i] = new THREE.Mesh( spiralGeometry, spiralMaterial );
        spiral[i].geometry.rotateX(Math.radians(ctrl.f3_rotate));
        spiral[i].rotation.z = Math.radians((i / (spiralCount))* 360 * 100);  
        spiral[i].translateX(5);
        scene.add(spiral[i]);
      }
    }
    f3_count.onChange (function(value){ updateSpiral(); });
    f3_rotate.onChange (function(value){ updateSpiral(); });
    f3_size.onChange (function(value){ updateSpiral(); });
    f3_color.onChange (function(value){ updateSpiral(); });

    function updateRing(){
      ringGeometry = new THREE.TorusBufferGeometry( ctrl.f2_size, ctrl.f2_width, 8, ctrl.f2_segments );
      ringMaterial = new THREE.MeshBasicMaterial( {color: ctrl.f2_color, flatShading:true});
      ringMaterial.needsUpdate = true;
      for(var i = 0; i < ringCount; i++) {
        scene.remove(ring[i]);
      }
      ringCount = ctrl.f2_count;　// particleの数を更新
      for(var i = 0; i < ringCount; i++) {
        ring[i] = new THREE.Mesh( ringGeometry, ringMaterial );
        ring[i].rotation.z = Math.radians(90);
        scene.add(ring[i]);
      }
    }
    f2_count.onChange (function(value){ updateRing(); });
    f2_size.onChange (function(value){ updateRing(); });
    f2_width.onChange (function(value){ updateRing(); });
    f2_segments.onChange (function(value){ updateRing(); });
    f2_color.onChange (function(value){ updateRing(); });
    
    function updateCamera(){
      camera.lookAt(new THREE.Vector3(0, ctrl.f0_cameraPosition, 0));
    }
    f0_cameraPosition.onChange (function(value){ updateCamera(); });
    var exportStart = false;
    scene.position.set( 0, 0, -50 );
  //====================================================================================
  // render ============================================================================
  //====================================================================================



  var gifCount = 0;
  function render(){
    requestAnimationFrame(render);     
    duration = Math.round(ctrl.f0_duration);

    if(capTrigger == true){

      if(duration > 300){
        duration = Math.floor(duration * ( 150 / duration));
      }else{
        duration = Math.floor(duration / 2);
      }
    }
    
    if(exportFlg == true){
      if(exportStart == false){
        frame = 0;
        exportStart = true;
      }
    }
    time = (frame / duration);  
    if(time >= 1){
      frame = 0;
      exportFlg = false;
      exportStart = false;
    }
    anim();    
    renderer.render(scene, camera);
    saveFrame();
    frame++;
    
    if(capTrigger == true){
      capturer.capture(myCanvas);
    }

    if(frame== duration && capTrigger == true){
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

      // renderer.setSize(canvasWidth, canvasHeight);   
       
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
      camera = new THREE.PerspectiveCamera( fov, canvasWidth / canvasHeight, near, far );
      renderer.setSize(canvasWidth, canvasHeight);
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
    exportFlg = true
    var txt = "";
    for(var i=0; i<4; i++){
      txt += c[Math.floor(Math.random()*cl)];
    }
    r = txt;
  }
  function saveFrame(){
    if(exportFlg == true){
      progress();
      var canvas  = document.getElementById('three');
      renderA.href = canvas.toDataURL();
      renderA.download = r + '_' + ( '000' + frame ).slice( -4 ) + '.png';
      renderA.click();
    }
  }


  function progress(){
    ctx.fillStyle = ("#ffffff");
    ctx.fillRect(0,0,1000,100);
    ctx.fillStyle = ("#000000");      
    ctx.fillText(frame + 1 + "/" + duration, 10, 40 );
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
      },
      f2 : {
        count : ctrl.f2_count,
        size : ctrl.f2_size,
        width : ctrl.f2_width,
        color : ctrl.f2_color,
        segments : ctrl.f2_segments,
      },
      f3 : {
        count : ctrl.f3_count,
        size : ctrl.f3_size,
        color : ctrl.f3_color,
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

    ctrl.f2_count = data.f2.count;
    ctrl.f2_size = data.f2.size;
    ctrl.f2_width = data.f2.width;
    ctrl.f2_color = data.f2.color;
    ctrl.f2_segments = data.f2.segments;

    ctrl.f3_count = data.f3.count;
    ctrl.f3_size = data.f3.size;
    ctrl.f3_color = data.f3.color;

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
    // camera = new THREE.PerspectiveCamera( fov, 1, near, far );
    renderer.setSize(400, 225);
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
window.onload = init();










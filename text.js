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
  var duration = 100;

  var exportFlg = false;

  // GUI ===============================================================
    var ctrl = new function() {
      this.TEXT = "Happy!";   
      this.size = 2;
      this.posX = -80;
      this.color = "#ff0033";
      this.color2 = "#ffffff";
      this.duration = 180;
      this.export = function() { exportFlg = true};
    };
    var gui = new dat.GUI();

    var controllerTEXT = gui.add(ctrl, 'TEXT');
    gui.add(ctrl, 'posX', -100, 0);
    gui.add(ctrl, 'size', 0.5, 2);
    var controllerCOLOR1 = gui.addColor(ctrl, 'color');
    var controllerCOLOR2 = gui.addColor(ctrl, 'color2');
    gui.add(ctrl, 'duration', 10, 600);

    gui.add(ctrl, 'export');

    textMaterial1 = new THREE.MeshStandardMaterial( { color: ctrl.color } );
    textMaterial2 = new THREE.MeshStandardMaterial( { color: ctrl.color2 } );
    textMaterials = [textMaterial1,textMaterial2];

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


  // txt =======================

    var textMaterial1 = new THREE.MeshStandardMaterial( { color: ctrl.color } );
    var textMaterial2 = new THREE.MeshStandardMaterial( { color: ctrl.color2 } );
    textMaterial1.needsUpdate = true;
    textMaterial2.needsUpdate = true;
    var textMaterials = [textMaterial1,textMaterial2];
    textMaterials.needsUpdate = true;

  // TEXTLOAD =========================================================
    var loader = new THREE.FontLoader();
    loader.load('fonts/Fugaz_One_Regular.json', function(font){
      mainFont = font;
      textGeometry = new THREE.TextGeometry(ctrl.TEXT, {
        font: font,
        size: 20,
        height: 0.2,
        curveSegments: 8,
        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true
      });
            
      textMesh = new THREE.Mesh(textGeometry, textMaterials);
      textMesh.position.x = ctrl.posX;
      scene.add(textMesh);
  
      render();
    });

  // Camera ===========================================================
    var fov    = 90;
    var aspect = width / height;
    var near   = 1;
    var far    = 4000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 100 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    scene.fog = new THREE.Fog(0x000000, 0.25, 250);

  // Light =============================================================
    var topLight = new THREE.DirectionalLight(0xffffff);
    topLight.position.set(30, 30, 100);
    scene.add( topLight ); 
    
    // 部屋全体を照らすライト
    var ambient = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambient);

  // SNOW ============================================================================
    // snow
    var snowGeometry = new THREE.Geometry();
    var snowNum = 1000;
    var snowPoints, snowMaterial;
    var snowS = [];
    // setup
    for (let i = 0; i < snowNum; i++) {
      var snow = new THREE.Vector3();
      snow.x = THREE.Math.randFloatSpread( 300 );
      snow.y = THREE.Math.randFloatSpread( 300 );
      snow.z = THREE.Math.randFloatSpread( 300 );
      snowS[i] = Math.random() * 0.05 + 0.01;
      snowGeometry.vertices.push( snow );
    }
    snowMaterial = new THREE.PointsMaterial({
      // map: new THREE.TextureLoader().load( "https://png.icons8.com/winter/win8/50/ffffff" ),
      map: new THREE.TextureLoader().load( "https://png.icons8.com/nolan/64/000000/plus.png" ),
      size: 10,
      transparent: true,
      depthTest : false,
      blending : THREE.AdditiveBlending
    });
    snowPoints = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snowPoints);

//  TEXT==========================================
  var textGeometry;
  var textMaterials;
  var textMesh;
  var mainFont;

  function updateTxt(){
    scene.remove( textMesh );
    textGeometry.dispose();
    textGeometry = new THREE.TextGeometry(ctrl.TEXT, {
      font: mainFont,
      size: 20,
      height: 0.2,
      curveSegments: 8,
      bevelThickness: 2,
      bevelSize: 1,
      bevelEnabled: true
    });

    textMaterials = [
      new THREE.MeshStandardMaterial( { color: ctrl.color } ),
      new THREE.MeshStandardMaterial( { color: ctrl.color2} )
    ];

    textMesh = new THREE.Mesh(textGeometry, textMaterials);
    textMesh.position.x = ctrl.posX;
    scene.add(textMesh);
  }
  controllerTEXT.onChange(function(value) {
    updateTxt();
  });

  controllerCOLOR1.onChange(function(value) {
    updateTxt();
  });
  controllerCOLOR2.onChange(function(value) {
    updateTxt();
  });

  //====================================================================================
  // Anim ==============================================================================
  //====================================================================================
  function anim(){
    textMesh.position.x = ctrl.posX;
    textMesh.scale.set(ctrl.size,ctrl.size,ctrl.size);
    textMesh.position.y = (ctrl.size * -10) +3;

    scene.rotation.y = Math.tween.Cubic.easeInOut(time,0,1,1) * ( Math.PI / 180 ) *360 ;    

    camera.position.x = Math.sin(time * 6.25)* 4;
    camera.position.y = Math.sin(time * 6.25)* 5;
  }


  var exportStart = false;

  //====================================================================================
  // render ============================================================================
  //====================================================================================
  function render(){
    requestAnimationFrame(render);     
    duration = Math.round( ctrl.duration);
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
  };

  //保存処理 ______________________________________________________
  var renderA = document.createElement('a');
  // 生成する文字列に含める文字セット
  var c = "abcdefghijklmnopqrstuvwxyz";
  var cl = c.length;
  var r = "";
  function makeName(){
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
}
window.onload = init();
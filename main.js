Math.degrees = function(radian){
  if(isNaN(radian)){
     return NaN;
  }
  return radian * 360/(2*Math.PI);
}

function init() {
  var scene = new THREE.Scene();
  var simplexNoise = new SimplexNoise;

  var frame = 0;
  var canvasWidth = 1280;
  var canvasHeight = 720;

  var width  = canvasWidth;
  var height = canvasHeight;


  var time = 0;
  var duration = 100;

  

  // Renderer =========================================================
    var renderer = new THREE.WebGLRenderer({
      canvas:document.getElementById('myCanvas'),
      antialias: true
    });
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.shadowMap.enabled = true;
		renderer.domElement.id = 'three';
    // document.body.appendChild( renderer.domElement );
    



  // TEXTLOAD =========================================================
  // テキストロードしてから開始
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
      textMaterials = [
        new THREE.MeshStandardMaterial( { color: 0xffffff } ),
        new THREE.MeshStandardMaterial( { color: 0xff0000} )
      ];
      textMesh = new THREE.Mesh(textGeometry, textMaterials);
      textMesh.position.x = ctrl.posX;
      scene.add(textMesh);
  
      render();
    });



  // Camera ===========================================================
    var fov    = 60;
    var aspect = width / height;
    var near   = 1;
    var far    = 4000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 100 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    scene.fog = new THREE.Fog(0x000000, 0.25, 200);

  // Light =============================================================
    var topLight = new THREE.DirectionalLight(0xffffff);
    topLight.position.set(30, 30, 100);
    scene.add( topLight ); 
    
    // 部屋全体を照らすライト
    var ambient = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambient);
	

  // GUI ________________________________________________________
    var ctrl = new function() {
      this.TEXT = "DJ hoge";   
      this.size = 1;
      this.posX = -50;
      this.color = "#ffffff";
      this.color2 = "#000000";
      // this.speed = 0.8;
      this.duration = 180;
      this.save = false;
      this.run = true;
    };

    var gui = new dat.GUI();

    var controllerTEXT = gui.add(ctrl, 'TEXT');
    var controllerPosX = gui.add(ctrl, 'posX', -100, 0);
    
    
    gui.add(ctrl, 'size', 0.5, 2);
    gui.addColor(ctrl, 'color');
    gui.addColor(ctrl, 'color2');
    // gui.add(ctrl, 'speed', 0, 2);
    gui.add(ctrl, 'duration', 30, 600);
    gui.add(ctrl, 'save');
    gui.add(ctrl, 'run');




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
  // controllerPosX.onChange(function(value) {
  //   updateTxt();
  // });





  // Object ____________________________________________________

  function anim(){

    textMesh.position.x = ctrl.posX;
    textMesh.scale.set(ctrl.size,ctrl.size,ctrl.size);
    textMesh.position.y = (ctrl.size * -10) +3;

    
    
  }



  // Run ________________________________________________________
  function render(){
    if (ctrl.run) {
      anim();
      frame++;

      duration = ctrl.duration;
      time = frame / duration;

      scene.rotation.y = time * ( Math.PI / 180 ) *360 ;;
    }
    renderer.render(scene, camera);
    saveFrame();//保存呼び出し
    requestAnimationFrame(render);    
  };

  //保存処理 ______________________________________________________
  var renderA = document.createElement('a');
  var frameCount = 0;
  function saveFrame(){
    if ( ctrl.save && ctrl.run) {
      var canvas  = document.getElementById('three');
      renderA.href = canvas.toDataURL();
      renderA.download = ( '0000' + frameCount ).slice( -5 ) + '.png';
      renderA.click();
      frameCount++;
    };
  }
}
window.onload = init();
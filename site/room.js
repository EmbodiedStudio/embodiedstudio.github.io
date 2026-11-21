import * as THREE from './vendor/three.module.js';
import { MeshoptDecoder } from './vendor/meshopt_decoder.mjs';
import { GLTFLoader } from './vendor/GLTFLoader.js';

const material = (color, roughness = .7, metalness = 0, map) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness, ...(map ? { map } : {}) });

function imageTexture(width, height, paint) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  paint(canvas.getContext('2d'));
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

function soften(w, h, d, radius = .038) {
  const r = Math.min(radius, .21 * w, .21 * h, .21 * d);
  const outline = new THREE.Shape();
  const x = w / 2 - r, y = h / 2 - r;
  outline.moveTo(-x, -y);
  outline.lineTo(x, -y);
  outline.lineTo(x, y);
  outline.lineTo(-x, y);
  outline.closePath();
  const geo = new THREE.ExtrudeGeometry(outline, {
    depth: d - 2 * r,
    bevelThickness: r,
    bevelSize: r,
    bevelSegments: 4,
    steps: 1
  });
  geo.translate(0, 0, -d / 2 + r);
  return geo;
}

export function buildHome(previewUrl, onUpdate, lifecycle = {}) {
  const loading = new THREE.LoadingManager(lifecycle.ready, lifecycle.progress, lifecycle.error);
  loading.onStart = lifecycle.start;
  if (lifecycle.resolveAsset) loading.setURLModifier(lifecycle.resolveAsset);
  const scene = new THREE.Scene();
  const dayBg = new THREE.Color(0xd8d0c3);
  const nightBg = new THREE.Color(0x141312);
  scene.background = dayBg.clone();

  const loader = new THREE.TextureLoader(loading);
  function surfaceMap(url, repeatX, repeatY, color = true) {
    const map = loader.load(url, () => onUpdate());
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeatX, repeatY);
    map.anisotropy = 8;
    if (color) map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }
  const plaster = material(0xfffaf1, .94, 0, surfaceMap('./media/study/clay_plaster-color.webp', 3, 1.5));
  plaster.normalMap = surfaceMap('./media/study/clay_plaster-normal.webp', 3, 1.5, false);
  plaster.normalScale.setScalar(.055);
  const chalk = material(0xe7dacb, .88);
  const edge = material(0xac9881, .64);
  const oak = material(0xe8c49e, .42, 0, surfaceMap('./media/study/american_walnut_veneer-color.webp', 1.2, 1));
  oak.normalMap = surfaceMap('./media/study/american_walnut_veneer-normal.webp', 1.2, 1, false);
  oak.normalScale.setScalar(.32);
  oak.roughnessMap = surfaceMap('./media/study/american_walnut_veneer-rough.webp', 1.2, 1, false);
  oak.roughness = .88;
  const paleOak = material(0xfff0d9, .86, 0, surfaceMap('./media/study/white_oak_veneer-diffuse.webp', 1, 1));
  paleOak.normalMap = surfaceMap('./media/study/white_oak_veneer-nor_gl.webp', 1, 1, false);
  paleOak.roughnessMap = surfaceMap('./media/study/white_oak_veneer-rough.webp', 1, 1, false);
  paleOak.normalScale.setScalar(.42);
  const walnut = oak.clone();
  walnut.color.setHex(0xb69a7c);
  const brass = material(0xc9a36a, .26, .78);
  const ink = material(0x232422, .30, .26);
  const aluminum = material(0xc4c8c4, .24, .72);
  const cream = material(0xf3eee3, .58);
  const ceramic = new THREE.MeshPhysicalMaterial({
    color:0xf5ede2, roughness:.31, clearcoat:.68, clearcoatRoughness:.19
  });
  const fabricColor = surfaceMap('./media/study/rough_linen-diffuse.webp', 3, 7);
  const fabricNormal = surfaceMap('./media/study/rough_linen-nor_gl.webp', 3, 7, false);
  const fabricRoughness = surfaceMap('./media/study/rough_linen-rough.webp', 3, 7, false);
  const canvasFabric = new THREE.MeshPhysicalMaterial({
    color: 0xe3d7c7, map: fabricColor, normalMap: fabricNormal, normalScale: new THREE.Vector2(.23,.23),
    roughness: 1, roughnessMap: fabricRoughness, sheen: .6, sheenColor: 0xdfd4c1, sheenRoughness: .86
  });
  const terracotta = material(0xc96442, .62, .04);
  const sage = material(0x4e665c, .84);

  const floorMat = material(0xe7d3ba, .54, 0, surfaceMap('./media/study/wood_floor-color.webp', 3.4, 4));
  floorMat.normalMap = surfaceMap('./media/study/wood_floor-normal.webp', 3.4, 4, false);
  floorMat.normalScale.setScalar(.38);
  floorMat.roughness = .93;
  floorMat.roughnessMap = surfaceMap('./media/study/wood_floor-rough.webp',3.4,4,false);

  const matTexture = surfaceMap('./media/study/woven-pad.webp',1,1);

  // Woven studio rug texture
  const rugTex = imageTexture(960, 768, ctx => {
    ctx.fillStyle = '#8b968b';
    ctx.fillRect(0, 0, 960, 768);
    for (let y = 0; y < 768; y += 3) {
      ctx.fillStyle = y % 4 ? '#b8bbac' : '#a3aa9d';
      ctx.fillRect(0, y, 960, 1);
    }
    for (let x = 0; x < 960; x += 4) {
      ctx.fillStyle = x % 3 ? '#efe5d333' : '#594d412b';
      ctx.fillRect(x, 0, 1, 768);
    }
    for (const x of [32, 48, 908, 924]) {
      ctx.fillStyle = '#b16549';
      ctx.fillRect(x, 0, 5, 768);
    }
  });
  const rugMat = canvasFabric.clone();
  rugMat.map = rugTex;
  rugMat.color.setHex(0xfff2dc);

  const dayReflection = surfaceMap('./media/study/reflection-day.webp',1,1);
  const nightReflection = surfaceMap('./media/study/reflection-night.webp',1,1);
  dayReflection.mapping = nightReflection.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = dayReflection;

  function group(x, y, z, parent = scene) {
    const node = new THREE.Group();
    node.position.set(x, y, z);
    parent.add(node);
    return node;
  }
  function add(geo, mat, x, y, z, parent = scene) {
    const piece = new THREE.Mesh(geo, mat);
    piece.position.set(x, y, z);
    piece.castShadow = piece.receiveShadow = true;
    parent.add(piece);
    return piece;
  }
  const box = (w, h, d, x, y, z, mat, parent) => add(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  const rounded = (w, h, d, x, y, z, mat, parent, radius) => add(soften(w, h, d, radius), mat, x, y, z, parent);
  const cylinder = (top, bottom, h, x, y, z, mat, parent) => add(new THREE.CylinderGeometry(top, bottom, h, 28), mat, x, y, z, parent);
  function rod(a, b, r, mat, parent) {
    const first = new THREE.Vector3(...a), second = new THREE.Vector3(...b);
    const piece = cylinder(r, r, first.distanceTo(second), 0, 0, 0, mat, parent);
    piece.position.copy(first).lerp(second, .5);
    piece.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), second.sub(first).normalize());
    return piece;
  }
  function picture(width, height, x, y, z, texture, parent = scene) {
    const plane = add(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
      x, y, z, parent
    );
    plane.castShadow = plane.receiveShadow = false;
    return plane;
  }

  // Room architecture
  box(6.9, .15, 8.1, 0, -.077, .35, floorMat).name='floor';
  box(6.86, 3.08, .12, 0, 1.54, -3.71, plaster).name='back-wall';
  box(.12, 3.08, 8.04, 3.43, 1.54, .34, plaster);
  box(6.84, .112, 8.04, 0, 3.11, .34, chalk).name='ceiling';
  box(6.84, .068, .064, 0, .034, -3.61, edge);
  box(.061, .069, 8.0, 3.35, .034, .34, edge);
  box(.13, .51, 8.04, -3.43, .255, .34, plaster);
  box(.13, .46, 8.04, -3.43, 2.84, .34, plaster);

  // A recessed garden window to the left of the monitor and a quiet plaster return behind it.
  const daySky = surfaceMap('./media/study/window-garden.webp', 1, 1);
  const nightSky = surfaceMap('./media/study/window-garden-night.webp',1,1);

  const windowPanes = [];
  for (const [i, z] of [-2.62, -.94, .74, 2.42].entries()) {
    if (i === 1) continue;
    if (i === 2) {
      box(.15,3.04,3.36,-3.39,1.52,-.10,plaster).name='desk-wall';
      box(.18,2.13,.035,-3.35,1.56,z+.83,paleOak);
      continue;
    }
    const glass = picture(1.69, 2.10, -3.40, 1.56, z, daySky);
    glass.rotateY(Math.PI / 2);
    const uv = glass.geometry.getAttribute('uv');
    for (let j = 0; j < uv.count; j++) {
      uv.setXY(j, (i===3 ? .27 : (3-i)/4) + uv.getX(j)/4, uv.getY(j));
    }
    windowPanes.push(glass);
    box(.085, 2.14, .045, -3.35, 1.56, z - .83, walnut);
    if (i !== 3) box(.05,.028,1.66,-3.34,1.73,z,walnut);
  }
  box(.29, .068, 8.04, -3.30, .52, .34, oak);
  // Deep sill and a woven Roman shade give the opening a visible reveal.
  box(.36,.036,1.70,-3.26,.795,2.42,paleOak);
  box(.14,.29,1.69,-3.40,.648,2.42,plaster);
  const shadeCloth=canvasFabric.clone();
  shadeCloth.color.setHex(0xcfb997);
  shadeCloth.transparent = true;
  shadeCloth.opacity = .69;
  shadeCloth.depthWrite = false;
  const blind=add(new THREE.PlaneGeometry(1.625,.86,40,32),shadeCloth,-3.286,2.17,2.42);
  blind.rotation.y=Math.PI/2;
  const pleats=blind.geometry.attributes.position;
  for(let i=0;i<pleats.count;i++){
    const v=(pleats.getY(i)+.43)/.86;
    pleats.setZ(i,.014*Math.cos(v*Math.PI*10)+.014*Math.pow(1-v,4));
  }
  blind.geometry.computeVertexNormals();
  box(.026,.020,1.626,-3.26,1.742,2.42,oak);
  for (const [i,cover] of [walnut,sage].entries()) {
    const volume=rounded(.148,.025,.216,-3.22,.827+i*.026,2.55,cover,scene,.003);
    volume.rotation.y=.06-i*.10;
  }
  const reflectedGlass = new THREE.MeshPhysicalMaterial({
    transparent:true, opacity:.04, color:0x81928f, roughness:.12, metalness:.76, depthWrite:false
  });
  for (const pane of windowPanes) {
    const reflection = new THREE.Mesh(pane.geometry,reflectedGlass);
    reflection.position.z=.002;
    pane.add(reflection);
  }
  // Outside the glazing, leaves interrupt the low sun before it reaches the desk.
  const leafOutline = new THREE.Shape();
  leafOutline.moveTo(-.074,0);
  leafOutline.quadraticCurveTo(-.014,.036,.079,.006);
  leafOutline.quadraticCurveTo(.013,-.035,-.074,0);
  const gardenLeaves = new THREE.InstancedMesh(new THREE.ShapeGeometry(leafOutline,6),
    new THREE.MeshStandardMaterial({color:0x70845c,side:THREE.DoubleSide}),160);
  const sprig = new THREE.Object3D();
  for (let i=0;i<gardenLeaves.count;i++) {
    const a=i*2.39996, r=Math.sqrt((i%40+.5)/40);
    const branch=Math.floor(i/40);
    sprig.position.set(-3.88-.18*Math.sin(a),2.41+.36*r*Math.sin(a)-branch*.12,
      -.15+branch*.68+.55*r*Math.cos(a));
    sprig.rotation.set(.42*Math.sin(a),1.25+.45*Math.cos(a),a);
    sprig.scale.setScalar(1.17+.28*Math.sin(i*4.7));
    sprig.updateMatrix();
    gardenLeaves.setMatrixAt(i,sprig.matrix);
  }
  gardenLeaves.castShadow=true;
  scene.add(gardenLeaves);
  const linen = canvasFabric.clone();
  linen.color.setHex(0xfff4dc);
  linen.side = THREE.DoubleSide;
  linen.vertexColors = true;
  for (const z of [-2.87, -.64, 2.85]) {
    const fabric = new THREE.PlaneGeometry(.88, 2.48, 72, 18);
    const pos = fabric.attributes.position;
    const folds = [];
    for (let j = 0; j < pos.count; j++) {
      const x = pos.getX(j), y = pos.getY(j), t = (1.24 - y) / 2.48;
      const light = .74 + .22 * (.5 + .5 * Math.cos(x * 55 + t * .32));
      folds.push(light, light * .99, light * .97);
      pos.setXYZ(j, x * (.80 + .24 * t), y + .014 * t * Math.cos(x * 57),
        (.036 + .018 * t) * Math.cos(x * 55 + t * .32));
    }
    fabric.setAttribute('color',new THREE.Float32BufferAttribute(folds,3));
    fabric.computeVertexNormals();
    add(fabric, linen, -3.20, 1.61, z).rotation.y = Math.PI / 2;
  }

  const inkPrint = surfaceMap('./media/study/circuit-study.webp',1,1);
  const printPaper=material(0xfffcf5,.99,0,inkPrint);
  // From the front, the sill plant and this smaller print flank the monitor at different heights.
  const displayLedge = group(-3.22,1.66,.62);
  box(.18,.023,.61,0,0,0,paleOak,displayLedge);
  for (const [i,cover] of [sage,cream,walnut].entries()) {
    const book=rounded(.115,.019,.19,.02,.022+.020*i,.14,cover,displayLedge,.002);
    book.rotation.y=(i-1)*.035;
  }
  const studyPrint = group(.002,.012,-.13,displayLedge);
  studyPrint.rotation.set(-.12,Math.PI/2,0,'YXZ');
  box(.205,.236,.013,0,.118,0,walnut,studyPrint);
  box(.195,.226,.002,0,.118,.007,cream,studyPrint);
  add(new THREE.PlaneGeometry(.164,.193),printPaper,0,.118,.009,studyPrint);
  // Low window joinery follows the glazing and turns into a reading seat at its far end.
  const windowSeat=group(-2.94,0,-1.71);
  box(.74,.37,2.92,0,.23,0,paleOak,windowSeat);
  for(const z of [-1.02,0,1.02]){
    box(.022,.31,.93,.38,.24,z,paleOak,windowSeat);
    box(.014,.017,.17,.395,.34,z,walnut,windowSeat);
  }
  rounded(.83,.057,2.98,.015,.44,0,paleOak,windowSeat,.014);
  rounded(.70,.105,2.52,.02,.517,-.09,canvasFabric,windowSeat,.037);
  const mossLinen=canvasFabric.clone();
  mossLinen.color.setHex(0x83947e);
  const seatPillow=rounded(.19,.39,.43,-.19,.73,-.86,mossLinen,windowSeat,.052);
  seatPillow.rotation.z=.23;

  // A recessed plinth casts a narrow shadow below the book bench at the near window.
  const bookBench = group(-2.96, 0, 2.38);
  bookBench.rotation.y = Math.PI / 2;
  box(1.08,.075,.31,0,.045,0,walnut,bookBench);
  box(1.23,.032,.38,0,.098,0,paleOak,bookBench);
  box(1.23,.032,.38,0,.475,0,paleOak,bookBench);
  box(1.21,.347,.017,0,.287,-.18,walnut,bookBench);
  for (const x of [-.60,.10,.60]) box(.029,.345,.38,x,.286,0,paleOak,bookBench);

  const binding = [mossLinen,cream,terracotta,walnut,mossLinen,cream];
  let spineX = -.405;
  for (const [i,width] of [.050,.042,.056,.040,.064,.046].entries()) {
    const height = [.272,.242,.253,.282,.233,.258][i];
    const book = group(spineX,.114,.039,bookBench);
    box(width-.006,height-.008,.219,0,height/2,-.003,cream,book);
    for (const side of [-1,1]) box(.003,height,.229,side*(width-.003)/2,height/2,0,binding[i],book);
    box(width,height,.006,0,height/2,.112,binding[i],book);
    box(width*.65,.004,.001,0,height*.76,.116,brass,book);
    spineX += width+.009;
  }
  for (const [i,cover] of [mossLinen,cream,walnut].entries()) {
    const folio = rounded(.296,.025,.236,.342,.128+i*.027,.026,cover,bookBench,.002);
    folio.rotation.y = .04-i*.029;
  }
  rounded(.92,.041,.33,-.05,.511,0,mossLinen,bookBench,.012);

  // Woven studio rug
  const rug = add(new THREE.PlaneGeometry(2.64,2.30),rugMat,-2.08,.009,.88);
  rug.name='rug';
  rug.rotation.x = -Math.PI/2;
  rug.rotation.z = Math.PI/2;
  rug.castShadow = false;
  const occlusion = imageTexture(128,128,ctx => {
    const gradient = ctx.createRadialGradient(64,64,0,64,64,64);
    gradient.addColorStop(0,'rgba(36,26,20,.82)');
    gradient.addColorStop(.48,'rgba(36,26,20,.36)');
    gradient.addColorStop(1,'rgba(36,26,20,0)');
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,128,128);
  });
  function contactShadow(x,y,z,width,depth,opacity,parent = scene) {
    const shadow = add(new THREE.PlaneGeometry(width,depth),
      new THREE.MeshBasicMaterial({map:occlusion,transparent:true,opacity,depthWrite:false}),
      x,y,z,parent);
    shadow.rotation.x = -Math.PI/2;
    shadow.castShadow = shadow.receiveShadow = false;
  }

  contactShadow(.55,.007,-1.63,1.32,1.16,.68);
  contactShadow(-3.23,.814,2.29,.28,.29,.52);


  // Furniture is loaded independently of the clickable screen.
  const furniture = new GLTFLoader(loading).setMeshoptDecoder(MeshoptDecoder);
  function placeModel(url, parent, x, y, z, height, rotation, onPlaced) {
    furniture.load(url, ({ scene: model }) => {
      model.rotation.y = rotation;
      const bounds = new THREE.Box3().setFromObject(model);
      const factor = height / (bounds.max.y - bounds.min.y);
      const middle = bounds.getCenter(new THREE.Vector3());
      model.scale.setScalar(factor);
      model.position.set(x - middle.x * factor, y - bounds.min.y * factor, z - middle.z * factor);
      model.traverse(node => {
        if (node.isMesh) node.castShadow = node.receiveShadow = true;
      });
      parent.add(model);
      if (onPlaced) onPlaced(model);
      onUpdate(true);
    });
  }
  placeModel('./media/study/potted_plant_04.glb',scene,-2.93,.56,-2.89,.30,.7);
  placeModel('./media/study/lounge-chair.glb',scene,.55,.014,-1.63,.82,-.52);

  const table = group(-.03, 0, -1.60);
  cylinder(.24, .24, .032, 0, .419, 0, paleOak, table);
  cylinder(.113, .131, .40, 0, .201, 0, chalk, table);
  rounded(.24, .026, .15, .05, .462, .035, sage, table);

  // Pleated paper glows from within at night. The lathed ribs stay in silhouette in daylight.
  const pendant = group(-2.30,2.11,-1.88);
  const profile = [];
  for (let i=0;i<=160;i++) {
    const t=i/160, rib=Math.pow(.5+.5*Math.cos(2*Math.PI*t*20),5);
    const radius=.075+.31*Math.pow(Math.sin(Math.PI*t),.74)+.004*rib;
    profile.push(new THREE.Vector2(radius,.48*(t-.5)));
  }
  const paperLantern = imageTexture(512,512,ctx=>{
    const gradient=ctx.createLinearGradient(0,0,0,512);
    gradient.addColorStop(0,'#997952');
    gradient.addColorStop(.18,'#e0cdaa');
    gradient.addColorStop(.48,'#fff6df');
    gradient.addColorStop(.82,'#eddbb6');
    gradient.addColorStop(1,'#ab916e');
    ctx.fillStyle=gradient;
    ctx.fillRect(0,0,512,512);
    for (let i=0;i<=20;i++) {
      const y=i*512/20;
      ctx.fillStyle='rgba(88,61,34,.39)';
      ctx.fillRect(0,y,512,2);
      ctx.fillStyle='rgba(255,251,227,.56)';
      ctx.fillRect(0,y+2,512,1);
    }
    for (let i=0;i<2800;i++) {
      const x=(i*257.13)%512, y=(i*131.23)%512;
      ctx.fillStyle='rgba(102,77,56,.09)';
      ctx.fillRect(x,y,1+i%5,1);
    }
  });
  const lampshade = new THREE.MeshPhysicalMaterial({
    color: 0xfffaed, map:paperLantern, side: THREE.DoubleSide,
    roughness: .96, sheen: .5, sheenColor: 0xffe4b7, emissive: 0xffcf91, emissiveMap:paperLantern
  });
  const paperLamp = add(new THREE.LatheGeometry(profile,80),lampshade,0,0,0,pendant);
  paperLamp.castShadow = false;
  cylinder(.070,.076,.017,0,.246,0,walnut,pendant);
  cylinder(.005,.005,.79,0,.645,0,ink,pendant);
  cylinder(.05,.05,.029,0,.941,0,cream,pendant);
  const pendantLight = new THREE.PointLight(0xffc98e,0,6,2);
  pendant.add(pendantLight);
  const stemware = new THREE.MeshPhysicalMaterial({ color:0x8a9d84,roughness:.19,clearcoat:.78 });
  const stemJar = [[0,0],[.065,0],[.073,.022],[.07,.11],[.035,.165],[.035,.18],[.027,.18],[.027,.16]];
  add(new THREE.LatheGeometry(stemJar.map(([r,h])=>new THREE.Vector2(r,h)),40),stemware,-.11,.444,-.04,table);
  for (let i=0;i<5;i++) {
    const theta=i*2.40, x=-.11+.095*Math.cos(theta), z=-.04+.085*Math.sin(theta), height=.74+.034*(i%3);
    rod([-.11,.59,-.04],[x,height,z],.0023,sage,table);
    for (let j=0;j<5;j++) {
      const petal=add(new THREE.SphereGeometry(.012,10,6),cream,x+.014*Math.cos(j*1.257),height,z+.014*Math.sin(j*1.257),table);
      petal.scale.set(1,.36,1);
    }
    add(new THREE.SphereGeometry(.009,10,6),brass,x,height+.005,z,table);
  }

  // A low continuous sideboard leaves room for the reading chair and the artwork above it.
  const library=group(.66,0,-3.48);
  box(3.79,.42,.43,0,.38,.12,paleOak,library);
  box(3.49,.16,.32,0,.09,.10,walnut,library);
  for (let i=0;i<4;i++) {
    const x=(i-1.5)*.94;
    box(.929,.388,.021,x,.38,.352,i===3 ? canvasFabric : paleOak,library);
  }
  box(3.82,.035,.465,0,.604,.135,chalk,library);
  const framed=group(-.68,1.61,.027,library);
  box(1.01,1.23,.035,0,0,0,walnut,framed);
  add(new THREE.PlaneGeometry(.989,1.209),printPaper,0,0,.019,framed);
  const shelfTrim=new THREE.MeshStandardMaterial({color:0xb5a493,roughness:.64,emissive:0xffc48b});
  for(const y of [1.28,1.80]) {
    box(1.35,.031,.25,1.04,y,.11,paleOak,library);
    box(1.16,.007,.009,1.04,y-.019,.16,shelfTrim,library);
  }
  const spines=[0xa09582,0x535e55,0xdfdbcc,0xa77157,0x746d5f];
  for(let i=0;i<spines.length;i++) {
    const h=.23+(i%3)*.035;
    const cloth=canvasFabric.clone();cloth.color.setHex(spines[i]);
    const volume=rounded(.045,h,.16,.55+i*.052,1.297+h/2,.16,cloth,library,.003);
    for(const y of [.27,-.30]) box(.029,.003,.002,0,y*h,.081,cream,volume);
  }
  placeModel('./media/study/ceramic_vase_03.glb',library,1.34,1.817,.12,.37,-.3);
  for(let i=0;i<2;i++) {
    const volume=rounded(.34,.03,.18,.82,.639+i*.032,.16,i ? cream : sage,library,.003);
    volume.rotation.y=.06-i*.08;
  }
  const bowlShape=[[0,0],[.084,0],[.092,.02],[.16,.074],[.158,.084],[.142,.08],[.077,.033],[0,.022]];
  add(new THREE.LatheGeometry(bowlShape.map(([r,h])=>new THREE.Vector2(r,h)),64),
    ceramic,-1.29,.623,.19,library);
  placeModel('./media/study/potted_plant_01.glb',scene,-3.23,.814,2.29,.47,-.50);

  // ==================== HERO ARCHITECT STUDIO DESK ====================
  const desk = group(-2.65, 0, .88);
  desk.rotation.y=Math.PI / 2;
  contactShadow(0,.013,.10,2.85,1.4,.42,desk);
  // Tabletop + subtle walnut apron frame underneath
  rounded(2.02, .058, .94, 0, .775, 0, paleOak, desk, .018);
  const topGeometry = new THREE.PlaneGeometry(1.997,.917);
  topGeometry.setAttribute('uv1',topGeometry.attributes.uv.clone());
  const grainUV=topGeometry.attributes.uv;
  for(let i=0;i<grainUV.count;i++) grainUV.setXY(i,grainUV.getY(i)*.48,grainUV.getX(i));
  const worktop = add(topGeometry,paleOak,0,.8044,0,desk);
  worktop.name='worktop';
  worktop.rotation.x=-Math.PI/2;
  worktop.castShadow=false;
  box(1.76, .046, .74, 0, .73, -.02, walnut, desk);

  // Two joined oak trestles and a shallow tool drawer.
  for(const x of [-.79,.78]) {
    for(const z of [-.28,.28]) {
      const leg=rounded(.054,.73,.077,x,.372,z,paleOak,desk,.009);
      leg.rotation.x=z>0 ? -.10 : .10;
    }
    box(.052,.057,.62,x,.28,0,paleOak,desk);
  }
  box(1.56,.062,.045,-.005,.29,-.10,oak,desk);
  rounded(.54,.082,.57,.48,.701,-.06,oak,desk,.009);
  box(.13,.012,.022,.48,.70,.238,brass,desk);

  // Stitched wool-felt desk mat (solid rounded base + crisp unseamed stitched top plane)
  const deskMat = rounded(.852,.003,.373,-.06,.806,.205,sage,desk,.001);
  deskMat.castShadow = false;
  const felt = canvasFabric.clone();
  felt.map = matTexture;
  felt.color.setHex(0xffffff);
  felt.sheen=.24;
  const matTop = add(new THREE.PlaneGeometry(.845,.365),felt,-.06,.8077,.205,desk);
  matTop.name='desk-felt';
  matTop.rotation.x = -Math.PI / 2;

  // Low-profile 65% board. The sculpted caps share one draw call, with a separate atlas for the legends.
  const keyRows=[
    ['Esc','1','2','3','4','5','6','7','8','9','0','−','=','Back|2','Del'],
    ['Tab|1.5','Q','W','E','R','T','Y','U','I','O','P','[',']','\\|1.5','Pg↑'],
    ['Caps|1.75','A','S','D','F','G','H','J','K','L',';',"'","Enter|2.25",'Pg↓'],
    ['Shift|2.25','Z','X','C','V','B','N','M',',','.','/','Shift|1.75','↑','End'],
    ['Ctrl|1.25','Alt|1.25','Cmd|1.25',' |6.25','Cmd','Fn','Ctrl','←','↓','→']
  ];
  const keyboard=group(-.102,.808,.209,desk);
  const pitch=.01905;
  const keys=[];
  keyRows.forEach((row,r)=>{
    let left=-8*pitch;
    row.forEach(cell=>{
      const [legend,units]=cell.split('|'), width=Number(units||1);
      keys.push({legend,width,x:left+width*pitch/2,z:(r-2)*pitch,y:.019+(4-r)*.0012});
      left+=width*pitch;
    });
  });
  rounded(.327,.018,.112,0,.009,0,aluminum,keyboard,.006);
  rounded(.312,.005,.099,0,.018,0,ink,keyboard,.005);
  const ring=[],indices=[];
  for(const [radius,y] of [[.0089,0],[.0089,.002],[.0074,.009],[.0071,.0096]]){
    for(let corner=0;corner<4;corner++) for(let arc=0;arc<=4;arc++){
      const theta=(corner+arc/4)*Math.PI/2;
      const cx=corner===0||corner===3 ? radius-.002 : -radius+.002;
      const cz=corner<2 ? radius-.002 : -radius+.002;
      ring.push(cx+.002*Math.cos(theta),y,cz+.002*Math.sin(theta));
    }
  }
  for(let r=0;r<3;r++) for(let i=0;i<20;i++){
    const a=20*r+i,b=20*r+(i+1)%20;
    indices.push(a,a+20,b,b,a+20,b+20);
  }
  for(let i=1;i<19;i++) indices.push(60,61+i,60+i);
  const capGeo=new THREE.BufferGeometry();
  capGeo.setAttribute('position',new THREE.Float32BufferAttribute(ring,3));capGeo.setIndex(indices);capGeo.computeVertexNormals();
  const caps=new THREE.InstancedMesh(capGeo,material(0xffffff,.73),keys.length);
  const transform=new THREE.Matrix4(), tint=new THREE.Color();
  const labelPositions=[],labelUV=[],labelTriangles=[];
  const letters=imageTexture(1024,512,ctx=>{
    ctx.fillStyle='#3c403c';ctx.font='500 24px Helvetica, Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    keys.forEach(({legend,width,x,z,y},i)=>{
      transform.makeScale(width,1,1);transform.setPosition(x,y,z);
      caps.setMatrixAt(i,transform);
      caps.setColorAt(i,tint.setHex(legend==='Esc'||legend==='Enter' ? 0x98aaa0 : width>1 && legend!==' ' ? 0xd7d4c9 : 0xf0eee6));
      const col=i%12,row=Math.floor(i/12),u=col/12,v=row/6;
      ctx.fillText(legend,(u+1/24)*1024,(v+1/12)*512,75);
      const xx=.0071*Math.min(width,1.8),zz=.0071,top=y+.00968;
      labelPositions.push(x-xx,top,z-zz,x+xx,top,z-zz,x+xx,top,z+zz,x-xx,top,z+zz);
      labelUV.push(u,1-v,u+1/12,1-v,u+1/12,1-v-1/6,u,1-v-1/6);
      const n=i*4;labelTriangles.push(n,n+2,n+1,n,n+3,n+2);
    });
  });
  caps.castShadow=caps.receiveShadow=true;keyboard.add(caps);
  const legends=new THREE.BufferGeometry();
  legends.setAttribute('position',new THREE.Float32BufferAttribute(labelPositions,3));
  legends.setAttribute('uv',new THREE.Float32BufferAttribute(labelUV,2));
  legends.setIndex(labelTriangles);legends.computeVertexNormals();
  const lettering=add(legends,new THREE.MeshStandardMaterial({map:letters,transparent:true,depthWrite:false,roughness:.9}),0,0,0,keyboard);
  lettering.castShadow=false;
  const mouse=group(.192,.808,.222,desk);
  // Cross sections follow the low nose, raised knuckle and full heel of a palm-grip mouse.
  const mouseSpine=new THREE.CatmullRomCurve3([
    [-.060,.001,.001],[-.056,.015,.011],[-.049,.025,.020],[-.030,.031,.028],[-.005,.033,.037],
    [.019,.035,.040],[.040,.032,.034],[.054,.023,.021],[.059,.013,.012],[.062,.001,.001]
  ].map(([z,w,h])=>new THREE.Vector3(z,w,h)));
  const mouseSkin=[],mouseFaces=[];
  for(let j=0;j<=40;j++){
    const section=mouseSpine.getPoint(j/40);
    for(let i=0;i<=32;i++){
      const a=Math.PI*i/32, arch=Math.pow(Math.sin(a),.73);
      mouseSkin.push(section.y*Math.cos(a)-.003*arch,.003+section.z*arch,section.x);
    }
  }
  for(let j=0;j<40;j++) for(let i=0;i<32;i++){
    const a=j*33+i;mouseFaces.push(a,a+1,a+33,a+1,a+34,a+33);
  }
  // Close the underside instead of exposing the hollow cross sections at the heel and nose.
  for(let j=0;j<40;j++){
    const a=j*33;
    mouseFaces.push(a,a+33,a+32,a+33,a+65,a+32);
  }
  const shell=new THREE.BufferGeometry();
  shell.setAttribute('position',new THREE.Float32BufferAttribute(mouseSkin,3));
  shell.setIndex(mouseFaces);shell.computeVertexNormals();
  const mouseFinish=material(0xdeddd5,.58);mouseFinish.side=THREE.DoubleSide;
  add(shell,mouseFinish,0,0,0,mouse);
  const foot=add(new THREE.SphereGeometry(1,40,12),ink,0,.003,0,mouse);
  foot.scale.set(.031,.003,.055);
  const buttonSeam=[];
  for(let i=0;i<=13;i++){
    const section=mouseSpine.getPoint(.018+i*.023);
    buttonSeam.push([-.003,.00312+section.z,section.x]);
  }
  cable(buttonSeam,.00057,mouse);
  rounded(.009,.002,.020,-.003,.036,-.019,ink,mouse,.0008);
  const wheel=add(new THREE.CylinderGeometry(.0072,.0072,.0055,32),walnut,-.003,.037,-.019,mouse);
  wheel.rotation.z=Math.PI/2;
  for(let i=0;i<5;i++){
    const ridge=add(new THREE.TorusGeometry(.00725,.00032,5,32),ink,-.0052+i*.0011,.037,-.019,mouse);
    ridge.rotation.y=Math.PI/2;
  }
  for(const z of [-.003,.014]) rounded(.003,.004,.013,-.031,.020,z,ink,mouse,.001);
  contactShadow(-.10,.808,.209,.40,.17,.58,desk);
  contactShadow(.192,.808,.222,.092,.15,.50,desk);
  contactShadow(.58,.807,.056,.19,.14,.66,desk);

  // Oak riser with a compact workstation and front-panel I/O underneath.
  rounded(.88,.022,.195,-.09,.889,-.197,paleOak,desk,.009);
  const riserTop=new THREE.PlaneGeometry(.868,.184);
  const riserUv=riserTop.attributes.uv;
  for(let i=0;i<riserUv.count;i++)riserUv.setXY(i,riserUv.getY(i)*.12+.12,riserUv.getX(i)*.47+.24);
  const veneer=add(riserTop,paleOak,-.09,.9003,-.197,desk);
  veneer.rotation.x=-Math.PI/2;veneer.castShadow=false;
  for(const x of [-.47,.29]) rounded(.027,.074,.162,x,.851,-.2,ink,desk,.006);
  placeModel('./media/study/circuit_board.glb',desk,.193,.903,-.169,.030,-.13);
  const computer=group(-.16,.806,-.157,desk);
  rounded(.16,.056,.157,0,.029,0,aluminum,computer,.008);
  rounded(.144,.006,.139,0,.003,0,ink,computer,.003);
  for(const x of [-.047,-.022]) rounded(.014,.004,.002,x,.027,.079,ink,computer,.0014);
  cylinder(.0015,.0015,.001, .052,.027,.0793,new THREE.MeshBasicMaterial({color:0x9ac19d}),computer).rotation.x=Math.PI/2;
  const grille=new THREE.InstancedMesh(new THREE.BoxGeometry(.0017,.018,.001),ink,23);
  for(let i=0;i<23;i++) grille.setMatrixAt(i,transform.makeTranslation(.0803,.028,-.047+i*.0042).multiply(new THREE.Matrix4().makeRotationY(Math.PI/2)));
  computer.add(grille);
  function cable(points,radius,parent) {
    const path=new THREE.CatmullRomCurve3(points.map(([x,y,z])=>new THREE.Vector3(x,y,z)));
    return add(new THREE.TubeGeometry(path,36,radius,8,false),ink,0,0,0,parent);
  }
  cable([[-.20,.839,.157],[-.23,.828,.125],[-.33,.816,.081],[-.35,.810,-.021],[-.26,.82,-.129]],.0028,desk);

  // A leather notebook sits open on the daylight side, within reach of the chair.
  placeModel('./media/study/binder_notebook.glb',desk,-.64,.806,.19,.022,.19);
  // Artisan ceramic coffee mug + latte art + walnut coaster
  const mug = group(.58, .806, .056, desk);
  cylinder(.064, .064, .010, 0, .005, 0, walnut, mug);
  const cupProfile=[[0,0],[.034,0],[.040,.005],[.044,.016],[.046,.079],
    [.0458,.087],[.0448,.089],[.0428,.089],[.042,.087],[.041,.080],[.038,.018],[.032,.013],[0,.013]];
  add(new THREE.LatheGeometry(cupProfile.map(([r,h])=>new THREE.Vector2(r,h)),72),ceramic,0,.011,0,mug);
  const coffee=imageTexture(384,384,ctx=>{
    const crema=ctx.createRadialGradient(156,170,11,192,192,187);
    crema.addColorStop(0,'#483023');crema.addColorStop(.82,'#4d3021');
    crema.addColorStop(.93,'#75482e');crema.addColorStop(.98,'#ad794d');crema.addColorStop(1,'#614332');
    ctx.fillStyle=crema;ctx.fillRect(0,0,384,384);
    for(let i=0;i<510;i++){
      const a=i*2.39996,r=149+30*Math.sin(i*2.91);
      ctx.fillStyle=i%3===0?'#d8ac7773':'#9a653745';
      ctx.beginPath();ctx.arc(192+r*Math.cos(a),192+r*Math.sin(a),1+(i%4)*.48,0,2*Math.PI);ctx.fill();
    }
  });
  const liquid=add(new THREE.CircleGeometry(.0418,72),new THREE.MeshPhysicalMaterial({
    map:coffee,roughness:.17,clearcoat:.85,clearcoatRoughness:.14
  }),0,.092,0,mug);
  liquid.rotation.x=-Math.PI/2;liquid.castShadow=false;
  const handlePath=new THREE.CatmullRomCurve3([[.042,.087,0],[.061,.082,0],[.069,.066,0],
    [.066,.046,0],[.052,.034,0],[.042,.034,0]].map(([x,y,z])=>new THREE.Vector3(x,y,z)));
  add(new THREE.TubeGeometry(handlePath,40,.0048,14,false),ceramic,0,0,0,mug);

  // A shallow tilting shade, a satin stem and a weighted clay base.
  const tableLamp=group(-.90,0,-.17,desk);
  tableLamp.rotation.y=Math.PI;
  const sand = new THREE.MeshPhysicalMaterial({color:0xe7d9c5,roughness:.57,clearcoat:.16,clearcoatRoughness:.45});
  cylinder(.081,.089,.023,0,.817,0,sand,tableLamp);
  cylinder(.010,.011,.396,0,1.021,0,brass,tableLamp);
  add(new THREE.SphereGeometry(.018,24,16),brass,0,1.223,0,tableLamp);
  const shadePivot=group(-.055,1.224,0,tableLamp);
  shadePivot.rotation.z=-.23;
  shadePivot.rotation.x=.26;
  const shellProfile=[[.012,.069],[.047,.063],[.078,.046],[.105,.020],[.129,-.016],[.141,-.049],[.142,-.056],[.138,-.060]];
  add(new THREE.LatheGeometry(shellProfile.slice().reverse().map(([r,h])=>new THREE.Vector2(r,h)),80),sand,0,0,0,shadePivot);
  const reflector=new THREE.MeshStandardMaterial({color:0xf0e9d9,roughness:.7,emissive:0xffcb8c});
  const diffuser=add(new THREE.CircleGeometry(.138,72),reflector,0,-.056,0,shadePivot);
  diffuser.rotation.x=Math.PI/2;diffuser.castShadow=false;
  const deskBeam=new THREE.SpotLight(0xffd8aa,0,3.8,Math.PI/3.15,.94,2);
  deskBeam.position.set(-.014,-.065,.01);
  shadePivot.add(deskBeam);
  deskBeam.target.position.set(-.20,.94,-.13);
  desk.add(deskBeam.target);
  deskBeam.castShadow=true;
  deskBeam.shadow.mapSize.set(768,768);
  deskBeam.shadow.camera.near=.035;
  deskBeam.shadow.normalBias=.002;
  deskBeam.shadow.bias=-.0003;
  const lampBounce=new THREE.PointLight(0xffcca0,0,1.8,2);
  lampBounce.position.set(-.39,.94,-.10);
  desk.add(lampBounce);
  // ==================== PRO STUDIO MONITOR + ANIMATED CLICK AFFORDANCE ====================
  const screenWidth = .84, screenHeight = .525;
  const monitor = group(-.06, 1.245, -.19,desk);

  // Precision anodized chassis
  rounded(screenWidth + .017, screenHeight + .022, .033, 0, 0, -.005, ink, monitor, .018);
  // Subtle status LED dot on bottom right bezel
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x4bc894 });
  add(new THREE.CircleGeometry(.0055, 14), ledMat, screenWidth * .44, -screenHeight * .5 - .014, .017, monitor);

  // Rear clamp and articulated VESA arm leave the area directly beneath the display open.
  const arm=group(.22,0,-.409,desk);
  rounded(.089,.020,.076,0,.81,0,ink,arm,.004);
  cylinder(.021,.023,.25,0,.945,0,aluminum,arm);
  rod([0,1.04,0],[-.138,1.16,-.019],.022,aluminum,arm);
  rod([-.138,1.16,-.019],[-.279,1.217,.18],.019,aluminum,arm);
  for(const [x,y,z] of [[0,1.04,0],[-.138,1.16,-.019],[-.279,1.217,.18]]) cylinder(.025,.025,.035,x,y,z,ink,arm);
  rounded(.090,.078,.015,-.28,1.23,.19,ink,arm,.006);
  cable([[-.08,1.195,-.216],[-.11,1.149,-.276],[.035,1.109,-.405],[.195,1.025,-.411],
    [.21,.83,-.429],[.22,.745,-.458],[.145,.716,-.462]],.004,desk);
  // Soft feathered Ambilight halo behind chassis (zero hard rectangular edge)
  const haloTex = imageTexture(512, 320, ctx => {
    ctx.clearRect(0, 0, 512, 320);
    const cx = 256, cy = 160;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.64);
    const g = ctx.createRadialGradient(0, 0, 120, 0, 0, 250);
    g.addColorStop(0, 'rgba(217, 119, 87, 0.85)');
    g.addColorStop(0.55, 'rgba(217, 119, 87, 0.38)');
    g.addColorStop(1, 'rgba(217, 119, 87, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 250, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  const glowMat = new THREE.MeshBasicMaterial({
    map: haloTex,
    transparent: true,
    opacity: .12,
    depthWrite: false
  });
  const monitorGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(screenWidth + .42, screenHeight + .34),
    glowMat
  );
  monitorGlow.position.set(0, 0, -.032);
  monitor.add(monitorGlow);

  // Crisp luminous rim around screen glass
  const monitorRimMat = new THREE.MeshBasicMaterial({
    color: 0xf5f0e6,
    transparent: true,
    opacity: .16,
    toneMapped: false
  });
  const monitorRim = new THREE.Mesh(
    new THREE.PlaneGeometry(screenWidth + .018, screenHeight + .018),
    monitorRimMat
  );
  monitorRim.position.set(0, .003, .0168);
  monitor.add(monitorRim);

  const placeholder = imageTexture(1320, 825, ctx => {
    ctx.fillStyle = '#f5f3ec';
    ctx.fillRect(0, 0, 1320, 825);
    ctx.fillStyle = '#141413';
    ctx.font = '600 88px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('EmbodiedStudio', 660, 390);
    ctx.fillStyle = '#c96442';
    ctx.fillRect(580, 435, 160, 6);
  });
  const glassDisplay = new THREE.MeshPhysicalMaterial({
    map:placeholder, color:0x242424, emissive:0xffffff, emissiveMap:placeholder,
    emissiveIntensity:.91, roughness:.53, specularIntensity:.30, clearcoat:.07, clearcoatRoughness:.35, toneMapped:false
  });
  const monitorSurface = add(new THREE.PlaneGeometry(screenWidth,screenHeight),glassDisplay,0,.003,.0185,monitor);
  monitorSurface.castShadow=false;

  let previewRequest = 0, currentPreview = '';
  function setPreview(url) {
    if (currentPreview === url) return;
    currentPreview = url;
    const request = ++previewRequest;
    new THREE.TextureLoader(loading).load(url, map => {
      if (request !== previewRequest) {
        map.dispose();
        return;
      }
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = 8;
      monitorSurface.material.map.dispose();
      monitorSurface.material.map = monitorSurface.material.emissiveMap = map;
      onUpdate();
    }, undefined, () => {});
  }
  setPreview(previewUrl);

  // A light ash writing chair with a continuous curved plywood back and a linen seat.
  const writingChair=group(-.59,0,.55,desk);
  writingChair.rotation.y=-.94;
  const seat=add(new THREE.SphereGeometry(1,56,24),paleOak,0,.438,0,writingChair);
  seat.scale.set(.245,.023,.222);
  const upholstery=add(new THREE.SphereGeometry(1,56,24),mossLinen,0,.461,-.005,writingChair);
  upholstery.scale.set(.234,.028,.210);
  for(const x of [-.157,.157]) for(const z of [-.125,.125]) {
    rod([x,.432,z],[x*1.22,.014,z*1.34],.015,paleOak,writingChair);
  }
  for(const x of [-.162,.162]) rod([x,.42,.145],[x,.69,.205],.012,paleOak,writingChair);
  const shellVertices=[], shellUV=[], shellTriangles=[];
  const cols=40, rows=12, sideSize=(cols+1)*(rows+1);
  for(let side=0;side<2;side++) for(let j=0;j<=rows;j++) for(let i=0;i<=cols;i++) {
    const v=j/rows, u=i/cols;
    const corner=Math.max(0,.046-Math.min(v,1-v)*.207);
    const half=.197+Math.sqrt(.046*.046-corner*corner);
    const theta=(u-.5)*1.52, r=half/Math.sin(.76)+side*.011;
    shellVertices.push(Math.sin(theta)*r,.581+.207*v,.224+(Math.cos(theta)-1)*r+.032*v+side*.011);
    shellUV.push(u,v*.50);
  }
  const quad=(a,b,c,d)=>shellTriangles.push(a,b,d,b,c,d);
  for(let j=0;j<rows;j++) for(let i=0;i<cols;i++) {
    const a=j*(cols+1)+i,b=a+1,d=a+cols+1,c=d+1;
    quad(a,d,c,b);quad(a+sideSize,b+sideSize,c+sideSize,d+sideSize);
  }
  for(let i=0;i<cols;i++) {
    const a=rows*(cols+1)+i;
    quad(i,i+1,i+1+sideSize,i+sideSize);
    quad(a,a+sideSize,a+sideSize+1,a+1);
  }
  for(let j=0;j<rows;j++) {
    const a=j*(cols+1),b=a+cols+1;
    quad(a,a+sideSize,b+sideSize,b);
    quad(a+cols,b+cols,b+cols+sideSize,a+cols+sideSize);
  }
  const chairBack=new THREE.BufferGeometry();
  chairBack.setAttribute('position',new THREE.Float32BufferAttribute(shellVertices,3));
  chairBack.setAttribute('uv',new THREE.Float32BufferAttribute(shellUV,2));
  chairBack.setIndex(shellTriangles);
  chairBack.computeVertexNormals();
  add(chairBack,paleOak,0,0,0,writingChair);

  // Lighting rig
  const sunlight = new THREE.DirectionalLight(0xfff1da, 2.55);
  sunlight.position.set(-5.8, 3.0, 1.75);
  sunlight.target.position.set(.71, .3, -1.84);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(2048, 2048);
  sunlight.shadow.normalBias = .004;
  sunlight.shadow.bias = -.00015;
  sunlight.shadow.radius = 4;
  Object.assign(sunlight.shadow.camera, { left: -4.2, right: 4.2, top: 4, bottom: -4, near: .1, far: 18 });

  const ambient = new THREE.HemisphereLight(0xf8f4e9, 0xb3a895, 1.62);
  const bounce = new THREE.DirectionalLight(0xe3ebed, .62);
  bounce.position.set(1.6, 2.82, 3.9);
  const screenGlow = new THREE.PointLight(0xf8efe2, 0, 2.6, 2);
  screenGlow.position.set(-.06,1.245,.06);
  desk.add(screenGlow);
  scene.add(sunlight,sunlight.target,ambient,bounce);

  const shelfWash = new THREE.SpotLight(0xffcf9a,0,4,1.0,.95,2);
  shelfWash.position.set(1.72,2.15,-2.91);
  shelfWash.target.position.set(1.68,1.22,-3.45);
  scene.add(shelfWash,shelfWash.target);

  let nightMode = false;

  function setHover(active) {
    glowMat.opacity = active ? .16 : .10;
    monitorRimMat.opacity = active ? .36 : .16;
    onUpdate();
  }

  function setNight(enabled) {
    nightMode = Boolean(enabled);
    scene.background.copy(nightMode ? nightBg : dayBg);
    sunlight.intensity = nightMode ? .24 : 3.65;
    sunlight.color.setHex(nightMode ? 0xa4c7ff : 0xffecd0);
    ambient.intensity = nightMode ? .33 : 1.26;
    ambient.color.setHex(nightMode ? 0x91a6c0 : 0xebf5ff);
    ambient.groundColor.setHex(nightMode ? 0x635448 : 0xe4c7a7);
    bounce.intensity = nightMode ? .12 : .62;
    bounce.color.setHex(nightMode ? 0x92aff9 : 0xffeedb);
    deskBeam.intensity = nightMode ? 3.5 : 0;
    lampBounce.intensity = nightMode ? .115 : 0;
    reflector.emissiveIntensity=nightMode ? 1.9 : .02;
    pendantLight.intensity = nightMode ? 5.4 : 0;
    lampshade.emissiveIntensity = nightMode ? 1.15 : .035;
    shelfWash.intensity = nightMode ? 1.4 : 0;
    shelfTrim.emissiveIntensity = nightMode ? .76 : 0;
    screenGlow.intensity = nightMode ? .14 : 0;
    glassDisplay.emissiveIntensity = nightMode ? .78 : .95;
    scene.environment = nightMode ? nightReflection : dayReflection;
    scene.environmentIntensity = nightMode ? .66 : .82;
    reflectedGlass.opacity = nightMode ? .17 : .045;
    const skyMap = nightMode ? nightSky : daySky;
    for (const glass of windowPanes) {
      glass.material.map = skyMap;
      glass.material.needsUpdate = true;
    }
    onUpdate();
  }

  // These visibility maps were traced against the furnished room, including the instanced keys and furniture.
  for (const [name,url] of [
    ['desk-wall','./media/study/ao-desk-wall.webp'],
    ['floor','./media/study/ao-floor.webp'],['back-wall','./media/study/ao-back-wall.webp'],
    ['ceiling','./media/study/ao-ceiling.webp'],['rug','./media/study/ao-rug.webp'],
    ['worktop','./media/study/ao-worktop.webp'],['desk-felt','./media/study/ao-desk-felt.webp']
  ]) {
    const surface=scene.getObjectByName(name);
    surface.material=surface.material.clone();
    const ao=surfaceMap(url,1,1,false);
    ao.channel=name==='worktop' ? 1 : 0;
    surface.material.aoMap=ao;
    surface.material.aoMapIntensity=.92;
  }

  scene.updateMatrixWorld(true);
  const center = monitorSurface.getWorldPosition(new THREE.Vector3());
  const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(monitor.getWorldQuaternion(new THREE.Quaternion()));
  return { scene, monitorSurface, screenWidth, screenHeight, center, normal, setPreview, setHover, setNight };
}

import * as THREE from './vendor/three.module.js';

const directLighting = THREE.ShaderChunk.lights_fragment_begin;
const directionalShadow = directLighting.split('\n')
  .find(line => line.includes('directLight.color') && line.includes('directionalShadowMap'));
// Light texture channels store indirect occlusion, window-sun visibility and desk-lamp visibility.
const pointLightInfo = directLighting.split('\n').find(line => line.includes('getPointLightInfo('));
const bakedDirectLighting = directLighting.replace(directionalShadow, `
  #if UNROLLED_LOOP_INDEX == 0
    directLight.color *= texture2D( aoMap, vAoMapUv ).g;
  #else
    ${directionalShadow}
  #endif
`).replace(pointLightInfo, `${pointLightInfo}
  #if UNROLLED_LOOP_INDEX == 0
    directLight.color *= texture2D( aoMap, vAoMapUv ).b;
  #endif
`);
function useBakedLighting(shader) {
  shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>',bakedDirectLighting);
}

const sunWindAssets = {
  floor: './media/study/sun-wind-floor.webp',
  'back-wall': './media/study/sun-wind-back-wall.webp',
  rug: './media/study/sun-wind-rug.webp',
  worktop: './media/study/sun-wind-worktop.webp'
};
const windSunLighting = bakedDirectLighting.replace(
  'directLight.color *= texture2D( aoMap, vAoMapUv ).g;',
  `vec3 canopy = texture2D( sunWindMap, vAoMapUv ).rgb;
    float movingShade = mix(canopy.g, sunCanopyBend < 0.0 ? canopy.r : canopy.b, abs(sunCanopyBend));
    directLight.color *= texture2D( aoMap, vAoMapUv ).g * movingShade;`
);
function useWindBakedLighting(shader, phaseMap, bend) {
  shader.uniforms.sunWindMap = { value: phaseMap };
  shader.uniforms.sunCanopyBend = bend;
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <common>', '#include <common>\nuniform sampler2D sunWindMap;\nuniform float sunCanopyBend;')
    .replace('#include <lights_fragment_begin>',windSunLighting);
}

const material = (color, roughness = .7, metalness = 0) =>
  new THREE.MeshStandardMaterial({ color, roughness, metalness });

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

function softenedBox(width, height, depth, radius) {
  const r = Math.min(radius, .24 * width, .24 * height, .24 * depth);
  const x = width / 2 - r, y = height / 2 - r;
  const outline = new THREE.Shape();
  outline.moveTo(-x, -y);
  outline.lineTo(x, -y);
  outline.lineTo(x, y);
  outline.lineTo(-x, y);
  outline.closePath();
  const geometry = new THREE.ExtrudeGeometry(outline, {
    depth: depth - 2 * r, bevelThickness: r, bevelSize: r, bevelSegments: 4, steps: 1
  });
  geometry.translate(0, 0, -depth / 2 + r);
  return geometry;
}

function roundRect(width, height, radius) {
  const x = width / 2, y = height / 2, r = radius;
  const shape = new THREE.Shape();
  shape.moveTo(-x + r, -y);
  shape.lineTo(x - r, -y);
  shape.quadraticCurveTo(x, -y, x, -y + r);
  shape.lineTo(x, y - r);
  shape.quadraticCurveTo(x, y, x - r, y);
  shape.lineTo(-x + r, y);
  shape.quadraticCurveTo(-x, y, -x, y - r);
  shape.lineTo(-x, -y + r);
  shape.quadraticCurveTo(-x, -y, -x + r, -y);
  return shape;
}

// Cylinder segments share one mesh for the fine twigs and structural joinery.
function taperedSegments(segments, surface, granularity = 9) {
  const geometry = new THREE.CylinderGeometry(.48, 1, 1, granularity);
  const group = new THREE.InstancedMesh(geometry, surface, segments.length);
  const axis = new THREE.Vector3(0, 1, 0), matrix = new THREE.Object3D();
  for (const [index, { start, end, radius }] of segments.entries()) {
    matrix.position.copy(start).lerp(end, .5);
    matrix.quaternion.setFromUnitVectors(axis, end.clone().sub(start).normalize());
    matrix.scale.set(radius, start.distanceTo(end), radius);
    matrix.updateMatrix();
    group.setMatrixAt(index, matrix.matrix);
  }
  group.castShadow = group.receiveShadow = true;
  return group;
}

function loftGeometry(count, sides, makeVertex) {
  const positions = [], uv = [], faces = [];
  for (let i = 0; i <= count; i++) for (let j = 0; j <= sides; j++) {
    positions.push(...makeVertex(i / count, j / sides));
    uv.push(i / count, j / sides);
  }
  for (let i = 0; i < count; i++) for (let j = 0; j < sides; j++) {
    const a = i * (sides + 1) + j, b = a + sides + 1;
    faces.push(a, a + 1, b, b, a + 1, b + 1);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();
  return geometry;
}

function plantLeaves(points, scale = 1, broad = false) {
  const outline = new THREE.Shape();
  outline.moveTo(-.020, 0);
  outline.quadraticCurveTo(broad?-.011:-.003,broad?-.025:-.010,.023,.002);
  outline.quadraticCurveTo(broad?-.004:.007,broad?.027:.014,-.020,0);
  const leaf = new THREE.ShapeGeometry(outline, 5);
  const position = leaf.attributes.position;
  for (let i = 0; i < position.count; i++) position.setZ(i, .003 * Math.cos(position.getX(i) * 95));
  leaf.computeVertexNormals();
  const finish = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .56, side: THREE.DoubleSide });
  const mesh = new THREE.InstancedMesh(leaf, finish, points.length);
  const pivot = new THREE.Object3D(), tint = new THREE.Color();
  const greens = [0x555b29, 0x617540, 0x727337, 0x88934e, 0x596344];
  for (const [index, point] of points.entries()) {
    const n = index + 1;
    pivot.position.copy(point);
    pivot.rotation.set(broad ? .37*Math.sin(n*1.731) : n*1.731,
      broad ? .91*Math.sin(n*2.091) : n*2.091,n*2.39996);
    pivot.scale.setScalar(scale * (.67 + .48 * (.5 + .5 * Math.sin(n * 2.41))));
    pivot.updateMatrix();
    mesh.setMatrixAt(index, pivot.matrix);
    mesh.setColorAt(index, tint.setHex(greens[index % greens.length]));
  }
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

export function buildHome(previewUrl, onUpdate, lifecycle = {}) {
  const loading = new THREE.LoadingManager(lifecycle.ready, lifecycle.progress, lifecycle.error);
  loading.onStart = lifecycle.start;
  const secondary = new THREE.LoadingManager();
  if (lifecycle.resolveAsset) {
    loading.setURLModifier(lifecycle.resolveAsset);
    secondary.setURLModifier(lifecycle.resolveAsset);
  }
  const loader = new THREE.TextureLoader(loading);
  const previewLoader = new THREE.TextureLoader(secondary);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb7a286);
  const lighting = !lifecycle.skipBakedLighting;
  const leafPhase = { value: 0 }, leafBreeze = { value: 0 };
  const sunCanopyBend={ value: 0 };
  let sunWindEnabled=true, canopyBend=0;

  function flexibleLeaves(mesh) {
    mesh.material.onBeforeCompile = shader => {
      shader.uniforms.leafPhase = leafPhase;
      shader.uniforms.leafBreeze = leafBreeze;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float leafPhase;\nuniform float leafBreeze;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          float tip = clamp((position.x + .020) / .043, 0.0, 1.0);
          float flutter = sin(leafPhase + float(gl_InstanceID) * 2.39996);
          transformed.z += leafBreeze * tip * tip * flutter;
        `);
    };
    return mesh;
  }

  function surfaceMap(url, isColor = true) {
    const texture = loader.load(url, () => onUpdate());
    texture.anisotropy = 8;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    if (isColor) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  const plaster = material(0xe2cdb7, .93);
  plaster.map=surfaceMap('./media/study/study-plaster-albedo.webp');
  plaster.color.multiplyScalar(1.032);
  plaster.normalMap = surfaceMap('./media/study/clay_plaster-normal.webp', false);
  plaster.normalScale.setScalar(.115);

  const oak = new THREE.MeshPhysicalMaterial({
    color:0xffead2,roughness:.71,clearcoat:.20,clearcoatRoughness:.48,
    map:surfaceMap('./media/study/white_oak_veneer-diffuse.webp'),
    normalMap:surfaceMap('./media/study/white_oak_veneer-nor_gl.webp',false),
    roughnessMap:surfaceMap('./media/study/white_oak_veneer-rough.webp',false),
    normalScale:new THREE.Vector2(.24,.24)
  });
  const frameWood=oak.clone();
  frameWood.color.setHex(0xe6bd96);
  const floorFinish = material(0xeee4d3, .92);
  floorFinish.map = surfaceMap('./media/study/wood_floor-color.webp');
  floorFinish.normalMap = surfaceMap('./media/study/wood_floor-normal.webp', false);
  floorFinish.normalScale.setScalar(.41);
  floorFinish.roughnessMap = surfaceMap('./media/study/wood_floor-rough.webp', false);
  const linen = new THREE.MeshPhysicalMaterial({
    color:0xf1e4d0, roughness: .92, sheen: .71, sheenColor: 0xe6d7bf, sheenRoughness: .83,
    map:surfaceMap('./media/study/rough_linen-diffuse.webp'),
    normalMap:surfaceMap('./media/study/rough_linen-nor_gl.webp', false),
    normalScale:new THREE.Vector2(.42,.42)
  });
  const matteBlack = material(0x282725, .47, .30);
  const anodized = new THREE.MeshPhysicalMaterial({
    color: 0x242422, roughness: .34, metalness: .70, clearcoat: .20, clearcoatRoughness: .38
  });
  const stoneMap=imageTexture(224,224,ctx=>{
    ctx.fillStyle='#eee6da';
    ctx.fillRect(0,0,224,224);
    for(let i=0;i<1400;i++) {
      const x=(i*121.739+i*i*.015)%224,y=(i*81.27+i*i*.009)%224;
      ctx.fillStyle=i%7?'rgba(104,74,43,.26)':'rgba(255,249,219,.62)';
      ctx.beginPath();ctx.ellipse(x,y,.18+(i%10)*.056,.18+(i%7)*.068,i,0,Math.PI*2);ctx.fill();
    }
  });
  const daySky = surfaceMap('./media/study/ming-courtyard-far-day.webp');
  const nightSky = surfaceMap('./media/study/ming-courtyard-far-night.webp');
  daySky.wrapS=nightSky.wrapS=THREE.ClampToEdgeWrapping;
  daySky.wrapT=nightSky.wrapT=THREE.MirroredRepeatWrapping;
  const dayReflection = lighting ? surfaceMap('./media/study/reflection-day.webp') : null;
  const nightReflection = lighting ? surfaceMap('./media/study/reflection-night.webp') : null;
  if (lighting) dayReflection.mapping = nightReflection.mapping = THREE.EquirectangularReflectionMapping;

  function group(x, y, z, parent = scene) {
    const node = new THREE.Group();
    node.position.set(x, y, z);
    parent.add(node);
    return node;
  }
  function add(geometry, finish, x, y, z, parent = scene) {
    const mesh = new THREE.Mesh(geometry, finish);
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  const box = (w, h, d, x, y, z, finish, parent) => add(new THREE.BoxGeometry(w,h,d), finish, x,y,z,parent);
  const rounded = (w, h, d, r, x, y, z, finish, parent) => add(softenedBox(w,h,d,r),finish,x,y,z,parent);
  const cylinder = (top, bottom, height, x, y, z, finish, parent, sides = 32) =>
    add(new THREE.CylinderGeometry(top,bottom,height,sides),finish,x,y,z,parent);
  const vaseShape = (profile, finish, x, y, z, parent, sides = 56) =>
    add(new THREE.LatheGeometry(profile.map(([r,h]) => new THREE.Vector2(r,h)),sides),finish,x,y,z,parent);

  function planarFace(name, w, h, x, y, z, rx, ry, finish, uvTransform) {
    const geometry = new THREE.PlaneGeometry(w,h);
    const uv = geometry.attributes.uv;
    geometry.setAttribute('uv1', uv.clone());
    if (uvTransform) for (let i=0; i<uv.count; i++) uv.setXY(i, ...uvTransform(uv.getX(i),uv.getY(i)));
    const plane = add(geometry, finish, x, y, z);
    plane.name = name;
    plane.rotation.set(rx,ry,0);
    return plane;
  }

  // The visible window is in the front-facing plaster wall. A side window lights the wall and the writing area.
  function windowWall(name, width, height, opening, x, z, rotation) {
    const outline=new THREE.Shape();
    outline.moveTo(-width/2,0); outline.lineTo(width/2,0); outline.lineTo(width/2,height);
    outline.lineTo(-width/2,height); outline.closePath();
    const [left,right,bottom,top]=opening;
    const hole=new THREE.Path();
    hole.moveTo(left,bottom); hole.lineTo(left,top); hole.lineTo(right,top); hole.lineTo(right,bottom); hole.closePath();
    outline.holes.push(hole);
    const geo=new THREE.ShapeGeometry(outline);
    const uv=geo.attributes.uv, coords=geo.attributes.position, bakeUV=[];
    for(let i=0;i<uv.count;i++) {
      const u=coords.getX(i)/width+.5, v=coords.getY(i)/height;
      uv.setXY(i,u*2.4,v*2); bakeUV.push(u,v);
    }
    geo.setAttribute('uv1',new THREE.Float32BufferAttribute(bakeUV,2));
    const mesh=add(geo,plaster,x,0,z);
    mesh.rotation.y=rotation;
    mesh.name=name;
    mesh.userData.bakeCorners=[[-width/2,0,0],[width/2,0,0],[-width/2,height,0]];
    return mesh;
  }
  const roomHeight=4.45, rearZ=-1.51;
  plaster.side=THREE.DoubleSide;
  const floor=planarFace('floor',4.60,4.83,0,0,.88,-Math.PI/2,0,floorFinish,(u,v)=>[v*2.60,(1-u)*2.54]);
  floor.castShadow=false;
  const backWall=windowWall('back-wall',4.58,roomHeight,[-1.854,-.336,.759,2.315],0,rearZ,0);
  const leftWall=windowWall('left-wall',4.83,roomHeight,[-.65,1.15,.47,3.277],-2.29,.90,Math.PI/2);
  const rightWall=planarFace('right-wall',4.83,roomHeight,2.29,roomHeight/2,.90,0,-Math.PI/2,plaster,(u,v)=>[u*2.3,v*2.3]);
  const ceiling=planarFace('ceiling',4.59,4.83,0,roomHeight,.90,Math.PI/2,0,material(0xeee1d1,.94));
  box(4.60,roomHeight,.12,0,roomHeight/2,3.33,plaster);
  const skirting=material(0xb9a992,.83);
  box(4.56,.049,.023,0,.024,rearZ+.013,skirting);
  box(.024,.049,4.79,-2.278,.024,.90,skirting);
  box(.024,.049,4.79,2.278,.024,.90,skirting);

  const windowX=-1.095, sill=.759, lintel=2.315, windowW=1.518;
  const windowGroup=group(windowX,sill,rearZ);
  const frameHeight=lintel-sill;
  const reveal=material(0xd7c2a6,.77);
  for(const x of [-windowW/2,windowW/2]) {
    box(.025,frameHeight,.13,x,frameHeight/2,-.06,reveal,windowGroup);
    const jamb=rounded(.043,frameHeight,.052,.003,x*.967,frameHeight/2,-.088,frameWood,windowGroup);
    jamb.name='window-jamb';
    box(.012,frameHeight-.04,.028,x*.932,frameHeight/2,-.105,matteBlack,windowGroup);
  }
  rounded(windowW+.09,.030,.165,.003,0,.008,-.041,oak,windowGroup);
  rounded(windowW+.02,.043,.046,.003,0,frameHeight-.020,-.084,frameWood,windowGroup);
  box(windowW-.076,.015,.029,0,.027,-.105,matteBlack,windowGroup);
  const glass=add(new THREE.PlaneGeometry(windowW-.08,frameHeight-.073),new THREE.MeshPhysicalMaterial({
    color:0xd9ded2,roughness:.16,metalness:.35,transparent:true,opacity:.045,depthWrite:false
  }),0,frameHeight/2,-.117,windowGroup);
  glass.castShadow=glass.receiveShadow=false;

  const blindFinish=linen.clone();
  blindFinish.color.setHex(0xfff0e2);
  blindFinish.emissive.setHex(0xf5e8d7);
  blindFinish.emissiveMap=linen.map;
  blindFinish.side=THREE.DoubleSide;
  blindFinish.transparent=true;
  blindFinish.opacity=.83;
  const blind=loftGeometry(28,42,(u,v)=>{
    const ripple=.0015*Math.sin(u*18+v*3)+.001*Math.cos(u*44);
    const fold=Math.exp(-(((v-.92)*13)**2))*.030+.004*Math.sin(v*12*Math.PI);
    return [(u-.5)*1.544,(1-v)*.454,fold+ripple];
  });
  const shade=add(blind,blindFinish,windowX,1.841,rearZ+.018);
  shade.name='wind-roman-shade';
  shade.castShadow=false;
  const shadePositions=blind.attributes.position.setUsage(THREE.DynamicDrawUsage);
  const shadeRest=shadePositions.array.slice();
  const shadeDrop=Float32Array.from({length:shadePositions.count},(_,i)=>blind.attributes.uv.getY(i)**1.50);
  blind.attributes.normal.setUsage(THREE.DynamicDrawUsage);
  const romanEdge=rounded(1.554,.029,.033,.006,windowX,1.833,rearZ+.04,blindFinish);
  romanEdge.name='wind-roman-hem';
  romanEdge.castShadow=false;
  rounded(1.569,.026,.032,.003,windowX,2.299,rearZ+.026,frameWood);

  // The only photographed surface is the far garden seen through the actual glazing.
  const viewMaterial=new THREE.MeshBasicMaterial({map:daySky,toneMapped:false});
  const gardenPlane=new THREE.PlaneGeometry(3.0,3.2);
  const gardenUV=gardenPlane.attributes.uv, gardenPoints=gardenPlane.attributes.position;
  for(let i=0;i<gardenUV.count;i++) gardenUV.setXY(i,gardenPoints.getX(i)/1.83+.5,gardenPoints.getY(i)/1.25+.5);
  const yard=add(gardenPlane,viewMaterial,-1.286,1.361,-2.05);
  yard.castShadow=yard.receiveShadow=false;
  const sideYard=add(new THREE.PlaneGeometry(3.0,3.4),viewMaterial,-3.40,1.59,1.62);
  sideYard.rotation.y=Math.PI/2;
  sideYard.castShadow=sideYard.receiveShadow=false;
  const outdoorStems = [], outdoorLeaves = [];
  const vec = (x,y,z) => new THREE.Vector3(x,y,z);
  function branch(stems, leaves, root, tip, turn, branchCount, radius) {
    const bend = root.clone().lerp(tip,.43).add(turn), path = [root,bend,tip];
    stems.push({start:root,end:bend,radius},{start:bend,end:tip,radius:radius*.62});
    for (let i=0; i<branchCount; i++) {
      const f = .33 + i * .64 / branchCount;
      const stem = f < .46 ? path[0].clone().lerp(path[1],f/.46) : path[1].clone().lerp(path[2],(f-.46)/.54);
      const phase = i*2.39996 + tip.y*22;
      const length = (.52-.37*f) * Math.max(.14,root.distanceTo(tip));
      const delta = vec(Math.sin(phase)*length*.64,length*.45,Math.cos(phase)*length);
      const end = stem.clone().add(delta);
      stems.push({start:stem,end,radius:radius*.30});
      for (let j=0; j<6; j++) {
        const k = .16 + j*.16;
        leaves.push(stem.clone().lerp(end,k).add(vec(Math.sin(phase+j*3)*length*.20,length*.09,Math.cos(phase+j*3)*length*.23)));
      }
    }
  }
  // Real near foliage has depth and parallax against the distant courtyard photograph.
  const nearWindow=group(-.342,1.80,-1.763);
  nearWindow.name='wind-window-branches';
  const nearStems=[], nearLeaves=[];
  branch(nearStems,nearLeaves,vec(0,0,0),vec(-.43,.057,.020),vec(-.032,.043,.041),7,.006);
  branch(nearStems,nearLeaves,vec(-.04,.009,.016),vec(-.283,-.146,.059),vec(-.027,-.034,-.018),6,.0038);
  branch(nearStems,nearLeaves,vec(-.14,.033,.032),vec(-.409,-.052,.048),vec(-.021,.046,.013),5,.0025);
  nearWindow.add(taperedSegments(nearStems,material(0x5f5538,.83),8),flexibleLeaves(plantLeaves(nearLeaves,1.32,true)));
  // Branch clusters outside the left window physically break the beam into dappled sunlight.
  const outdoorRoot=vec(-2.73,-.15,1.51);
  for(let i=0;i<19;i++) {
    const tint=i*2.39996;
    const root=outdoorRoot.clone().add(vec(0,.58+i*.12,i*.017));
    const tip=vec(-2.70-.23*Math.sin(tint),1.19+i*.081,.53+i*.109+.31*Math.sin(tint));
    branch(outdoorStems,outdoorLeaves,root,tip,vec(-.11,.031,.078*Math.sin(tint)),7,.018-.0005*i);
  }
  const canopy=[[1.03,.62,.27],[1.08,1.07,.26],[.87,1.53,.29],[1.02,1.94,.30],[1.43,.87,.32],
    [1.49,1.38,.24],[1.41,1.82,.33],[1.59,2.29,.25],[1.88,1.06,.24],[1.97,1.53,.28],[2.05,1.93,.33],
    [2.23,.64,.29],[2.33,1.23,.33],[2.46,1.71,.25],[2.53,2.20,.29],[2.78,1.33,.36],
    [.68,.79,.23],[.69,1.91,.27],[.61,2.37,.28],
    [2.67,.1,.27],[2.82,.36,.21],[2.68,.63,.22],[2.96,.61,.31],[2.72,.93,.24],
    [3.02,.12,.26],[3.14,.38,.28],[3.26,.06,.20],[3.56,.31,.25],[3.21,.69,.25]];
  for(const [index,[y,z,radius]] of canopy.entries()) for(let i=0;i<48;i++) {
    const angle=(i+index*.15)*2.39996,r=radius*Math.sqrt((i+.5)/48);
    const edge=.75+.27*Math.cos(angle*3+index);
    outdoorLeaves.push(vec(-2.56+.084*Math.sin(angle+index),y+r*Math.sin(angle)*edge,z+r*Math.cos(angle)*edge));
  }
  // The tree root stays fixed. Only this rooted exterior canopy bakes into the moving shadow layer.
  const shadowCanopy=group(-2.67,.02,1.44);
  shadowCanopy.name='wind-shadow-canopy';
  function canopyMesh(mesh) {
    mesh.position.copy(shadowCanopy.position).negate();
    shadowCanopy.add(mesh);
  }
  canopyMesh(taperedSegments(outdoorStems,material(0x61523b,.90),7));
  canopyMesh(plantLeaves(outdoorLeaves,1.95));
  // Dense sprays overlap at the aperture, while the gaps in between transmit smaller islands of sun.
  const canopySprays=[
    [3.135,.139,3.202,.378,72], [2.955,.128,3.107,.440,46], [2.799,.104,2.946,.371,72],
    [2.687,.220,2.810,.557,72], [3.193,.271,3.454,.305,84],
    [3.268,.437,3.438,.419,84], [2.967,.525,3.104,.526,84], [3.257,.536,3.406,.532,84],
    [3.406,.539,3.495,.672,49]
  ];
  const sprayLeaves=[], sprayStems=[];
  for(const [i,[ay,az,by,bz,leafCount]] of canopySprays.entries()) {
    const from=vec(-2.57-.037*i,ay,az), to=vec(-2.56-.027*i,by,bz);
    sprayStems.push({start:from,end:to,radius:.008});
    for(let j=0;j<leafCount;j++) {
      const t=(j+.5)/leafCount, angle=j*2.39996;
      const fan=(.024+.029*Math.sin(Math.PI*t))*(.75+.25*Math.cos(angle*.33));
      const point=from.clone().lerp(to,t);
      point.y+=Math.cos(angle)*fan;
      point.z+=Math.sin(angle)*fan*.78;
      point.x+=Math.sin(j*1.45)*.038;
      sprayLeaves.push(point);
    }
  }
  canopyMesh(taperedSegments(sprayStems,material(0x61523b,.90),8));
  canopyMesh(plantLeaves(sprayLeaves,2.46,true));
  // The desk keeps the rounded upright by the writing area and the open trestle below the screen side.
  const deskY=.742, deskZ=-1.115, slabHeight=.036, slabWidth=2.73, slabDepth=.69, lip=.006;
  const slab=new THREE.ExtrudeGeometry(roundRect(slabWidth-2*lip,slabDepth-2*lip,.054),{
    depth:slabHeight-2*lip,bevelSize:lip,bevelThickness:lip,bevelSegments:3,curveSegments:9
  });
  slab.rotateX(-Math.PI/2);
  slab.translate(0,lip-slabHeight/2,0);
  const slabUV=slab.attributes.uv, slabPosition=slab.attributes.position;
  for(let i=0;i<slabUV.count;i++) slabUV.setXY(i,slabPosition.getY(i)*1.74+.47,slabPosition.getX(i)*.46+.50);
  const edgeOak=oak.clone();
  edgeOak.color.setHex(0xffeddb).multiplyScalar(1.55);
  add(slab,edgeOak,0,deskY-slabHeight/2,deskZ);
  const topGeometry=new THREE.ShapeGeometry(roundRect(slabWidth-2*lip,slabDepth-2*lip,.054),10);
  const topPosition=topGeometry.attributes.position, grain=topGeometry.attributes.uv, bakeUV=[];
  for(let i=0;i<grain.count;i++) {
    const u=topPosition.getX(i)/(slabWidth-2*lip)+.5, v=topPosition.getY(i)/(slabDepth-2*lip)+.5;
    grain.setXY(i,v*.94+.12,u*1.16+.10); bakeUV.push(u,v);
  }
  topGeometry.setAttribute('uv1',new THREE.Float32BufferAttribute(bakeUV,2));
  const deskTop=add(topGeometry,oak,0,deskY+.00065,deskZ);
  deskTop.rotation.x=-Math.PI/2;
  deskTop.name='worktop';
  deskTop.castShadow=false;
  const tw=(slabWidth-2*lip)/2, td=(slabDepth-2*lip)/2;
  deskTop.userData.bakeCorners=[[-tw,-td,0],[tw,-td,0],[-tw,td,0]];
  const pedestal=loftGeometry(62,8,(u,v)=>{
    const [y,rad]=[[.015,.855],[.025,.942],[.042,.99],[.065,1],[.32,1],[.56,1],[.673,1],[.695,.985],[.714,.945]][Math.round(v*8)];
    const angle=u*2*Math.PI,c=Math.cos(angle),s=Math.sin(angle);
    return [.165*rad*Math.sign(c)*Math.abs(c)**.53,y,.301*rad*Math.sign(s)*Math.abs(s)**.67];
  });
  const pedestalPositions=pedestal.attributes.position, pedestalUV=pedestal.attributes.uv;
  let arc=0;
  for(let ring=0;ring<=62;ring++) {
    const at=ring*9+4;
    if(ring) arc+=Math.hypot(pedestalPositions.getX(at)-pedestalPositions.getX(at-9),
      pedestalPositions.getZ(at)-pedestalPositions.getZ(at-9));
    for(let level=0;level<=8;level++) {
      const vertex=ring*9+level;
      pedestalUV.setXY(vertex,.08+arc/.92,.12+pedestalPositions.getY(vertex)/1.02);
    }
  }
  const pedestalOak=oak.clone();
  pedestalOak.color.multiplyScalar(1.32);
  add(pedestal,pedestalOak,-1.177,0,deskZ-.011);
  const plinth=cylinder(.153,.15,.022,-1.177,.012,deskZ,frameWood,scene,44);
  plinth.scale.z=1.82;

  function beam(start,end,width,depth,finish,parent,radius=.004) {
    const kick=end.clone().sub(start);
    const center=start.clone().lerp(end,.5);
    const geometry=softenedBox(width,kick.length(),depth,radius);
    const uv=geometry.attributes.uv,p=geometry.attributes.position;
    for(let i=0;i<uv.count;i++) uv.setXY(i,(p.getX(i)+p.getZ(i))*.90+.46,p.getY(i)*1.45+.54);
    const wood=add(geometry,finish,center.x,center.y,center.z,parent);
    wood.quaternion.setFromUnitVectors(vec(0,1,0),kick.normalize());
    return wood;
  }
  const trestle=group(1.128,0,deskZ-.018);
  for(const side of [-1,1]) {
    beam(vec(.062,.006,side*.292),vec(-.06,.704,side*.141),.055,.057,oak,trestle,.007);
    rounded(.084,.025,.071,.003,-.058,.689,side*.141,frameWood,trestle);
    const peg=cylinder(.008,.008,.002,-.029,.676,side*.153,frameWood,trestle,14);
    peg.rotation.z=Math.PI/2;
  }
  beam(vec(.045,.253,-.233),vec(.045,.253,.233),.038,.048,oak,trestle);
  rounded(.188,.037,.433,.004,-.034,.699,0,oak,trestle);
  rounded(2.26,.043,.044,.004,-.015,.688,-1.362,frameWood);

  // Thin woven rug, supported by the actual floor. The weave has its own UV scale and a rounded edge.
  const rugFinish=new THREE.MeshPhysicalMaterial({
    color:0xffeed9,roughness:.96,sheen:.58,sheenColor:0xa69073,sheenRoughness:.92,
    map:surfaceMap('./media/study/study-jute-albedo.webp'),
    normalMap:surfaceMap('./media/study/study-jute-normal.webp',false),
    normalScale:new THREE.Vector2(.93,.93)
  });
  const rug=planarFace('rug',2.93,2.19,.08,.0072,.047,-Math.PI/2,0,rugFinish,(u,v)=>[u*19.5,v*14.6]);
  rug.castShadow=false;
  const rugEdge=rounded(2.94,.0065,2.20,.0018,.08,.0034,.047,material(0xa28b69,.94));
  rugEdge.castShadow=false;

  const ceramic = new THREE.MeshPhysicalMaterial({
    color:0xd1b99a,roughness:.47,clearcoat:.17,clearcoatRoughness:.42,
    map:stoneMap
  });
  const vase=group(.054,deskY,-1.158);
  vaseShape([[0,0],[.044,0],[.052,.01],[.061,.035],[.061,.092],[.054,.116],[.031,.137],
    [.032,.159],[.035,.168],[.031,.171],[.025,.167],[.024,.147],[.026,.127],[.044,.109],[.047,.034],[0,.009]],ceramic,0,0,0,vase);
  const stems=[], leaves=[], root=vec(0,.138,0);
  for(const [i,tip] of [vec(-.227,.335,.03),vec(-.176,.287,.02),vec(-.092,.371,-.01),vec(.078,.414,-.01),
    vec(.197,.349,.017),vec(.182,.282,.027),vec(.097,.270,.047)].entries()) {
    branch(stems,leaves,root,tip,vec(i<3?-.016:.022,.026,.019),5,i%3===0?.0035:.0021);
  }
  const deskBranches=group(0,.138,0,vase);
  deskBranches.name='wind-desk-branches';
  const deskStems=taperedSegments(stems,material(0x62553a,.82),7);
  const deskLeaves=flexibleLeaves(plantLeaves(leaves,.64));
  deskStems.position.y=deskLeaves.position.y=-deskBranches.position.y;
  deskBranches.add(deskStems,deskLeaves);

  // Satin brass base, curved stem and rolled reflector. The warm source comes from inside the shade.
  const lamp=group(-.633,deskY,-1.309);
  const brass=new THREE.MeshPhysicalMaterial({color:0xc9a477,roughness:.37,metalness:.60,clearcoat:.18,clearcoatRoughness:.49});
  const brassRim=new THREE.MeshPhysicalMaterial({color:0xd8ad75,roughness:.30,metalness:.59});
  cylinder(.065,.076,.020,0,.010,0,brass,lamp,48);
  cylinder(.048,.061,.014,0,.024,0,brassRim,lamp,44);
  const neck=new THREE.CatmullRomCurve3([vec(0,.026,0),vec(.001,.105,0),vec(.013,.201,-.007),
    vec(.052,.258,-.004),vec(.118,.287,.008),vec(.202,.310,.023)]);
  add(new THREE.TubeGeometry(neck,34,.007,10,false),brassRim,0,0,0,lamp);
  const shadeHead=group(.213,.291,.024,lamp);
  shadeHead.rotation.set(-.24,0,-.19);
  const dome=vaseShape([[.077,0],[.077,.006],[.071,.027],[.056,.057],[.036,.077],[.015,.082],[.005,.084],[0,.084],
    [.008,.080],[.021,.076],[.040,.063],[.060,.039],[.071,.013],[.072,.004],[.072,0]],brass,0,0,0,shadeHead,52);
  dome.material.side=THREE.DoubleSide;
  cylinder(.076,.076,.003,0,.002,0,brassRim,shadeHead,52);
  const diffuser=new THREE.MeshStandardMaterial({color:0xeac8a0,roughness:.63,emissive:0xffd19d});
  const bulb=add(new THREE.SphereGeometry(.014,20,13),diffuser,0,.008,0,shadeHead);
  bulb.castShadow=false;
  bulb.userData.skipBake=true;
  const deskBeam=new THREE.SpotLight(0xffcf98,0,2.82,Math.PI/3.25,.93,2);
  deskBeam.position.set(0,-.007,0);
  deskBeam.target.position.set(-.16,-.264,.142);
  deskBeam.castShadow=true;
  deskBeam.shadow.autoUpdate=false;
  deskBeam.shadow.needsUpdate=true;
  deskBeam.shadow.mapSize.set(512,512);
  deskBeam.shadow.camera.near=.028;
  deskBeam.shadow.normalBias=.0018;
  deskBeam.shadow.radius=3.25;
  shadeHead.add(deskBeam,deskBeam.target);
  const deskGlow=new THREE.PointLight(0xffd1a1,0,2.2,2);
  deskGlow.name='deskLampBounce';
  deskGlow.position.set(.145,.086,.213);
  lamp.add(deskGlow);

  const paper=material(0xe4d9be,.89), leather=material(0xa0815d,.73);
  const notebook=group(-.661,deskY,-.921);
  notebook.rotation.y=.048;
  const print=imageTexture(448,300,ctx=>{
    ctx.fillStyle='#efe6d0'; ctx.fillRect(0,0,448,300);
    ctx.fillStyle='#c5ae83'; ctx.fillRect(221,0,6,300);
    for(let column=0;column<2;column++) for(let row=0;row<18;row++) {
      const offset=column*224+25,y=39+row*10;
      for(let i=0;i<8;i++) {
        ctx.fillStyle=i%3?'rgba(85,66,47,.26)':'rgba(85,66,47,.36)';
        ctx.fillRect(offset+i*20,y,8+(row*9+i*5)%10,1.2);
      }
    }
  });
  const printed=material(0xfff4d8,.91);
  printed.map=print;
  printed.side=THREE.DoubleSide;
  for(const side of [-1,1]) {
    rounded(.189,.008,.246,.002,side*.095,.004,0,leather,notebook);
    rounded(.182,.009,.238,.002,side*.092,.011,0,paper,notebook);
    const spread=loftGeometry(15,6,(u,v)=>{
      const signed=side===1?u:1-u;
      return [side*signed*.184,.012+.021*Math.sin(signed*Math.PI)*Math.exp(-signed*.9)+.008*(1-signed),
        (v-.5)*.235];
    });
    const uv=spread.attributes.uv;
    for(let i=0;i<uv.count;i++) uv.setXY(i,.5+side*.5*(side===1?uv.getX(i):1-uv.getX(i)),uv.getY(i));
    add(spread,printed,0,.003,0,notebook);
  }
  const pencil=cylinder(.003,.003,.141,-.329,deskY+.004,-.914,frameWood,scene,12);
  pencil.rotation.set(Math.PI/2,.22,.32);

  const cup=group(-.169,deskY,-.972);
  vaseShape([[0,0],[.032,0],[.041,.007],[.046,.036],[.047,.071],[.045,.074],
    [.041,.074],[.040,.069],[.039,.026],[.033,.013],[0,.013]],ceramic,0,0,0,cup,48);
  add(new THREE.TorusGeometry(.020,.004,8,24),ceramic,.049,.043,0,cup);
  const coffee=material(0x462819,.31);
  cylinder(.039,.039,.001,0,.058,0,coffee,cup,40);
  const host=group(.293,deskY,-1.135);
  rounded(.194,.055,.147,.011,0,.027,0,new THREE.MeshPhysicalMaterial({color:0xa7a49c,roughness:.35,metalness:.64}),host);
  rounded(.181,.006,.139,.003,0,.003,0,matteBlack,host);
  for(const x of [-.065,-.044,.011,.041,.066]) rounded(.012,.004,.002,.0005,x,.023,.074,matteBlack,host);
  const mouse=rounded(.083,.027,.108,.014,1.011,deskY+.013,-.899,anodized);
  mouse.rotation.y=-.12;
  const pencilCup=group(1.239,deskY,-1.142);
  vaseShape([[0,0],[.045,0],[.047,.009],[.048,.090],[.045,.096],[.040,.093],
    [.040,.013],[0,.012]],ceramic,0,0,0,pencilCup,44);
  for(let i=0;i<5;i++) {
    const pen=cylinder(.0026,.0026,.139,Math.cos(i*2.4)*.021,.083+Math.sin(i*1.7)*.008,
      Math.sin(i*2.4)*.021,matteBlack,pencilCup,10);
    pen.rotation.set(.19*Math.sin(i),0,.27*Math.cos(i));
  }
  // Compact keyboard with individually beveled keycaps packed into one instanced draw.
  const keyboard = group(.784,deskY,-.893);
  const keyFinish = material(0xffffff,.79);
  rounded(.437,.013,.144,.003,0,.007,0,anodized,keyboard);
  const keyLayout = ['ESC1234567890-=', ' QWERTYUIOP[]', ' ASDFGHJKL;', ' ZXCVBNM,.', '    ______    '];
  const keys=[];
  for (const [row, letters] of keyLayout.entries()) for (const [col, char] of [...letters].entries()) {
    if (char !== ' ' && (char !== '_' || col === 4)) keys.push({char,row,col});
  }
  const caps = new THREE.InstancedMesh(softenedBox(.021,.004,.018,.001),keyFinish,keys.length);
  const pivot = new THREE.Object3D(), tint = new THREE.Color();
  const legends = imageTexture(768,256,ctx=>{
    ctx.font='500 17px sans-serif';
    ctx.fillStyle='#c1bdb2';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    for (const [index, {char,row,col}] of keys.entries()) {
      pivot.position.set(-.191+col*.027+(char==='_'?.065:0),.016,-.050+row*.025);
      pivot.scale.set(char==='_'?6:1,1,1);
      pivot.updateMatrix();
      caps.setMatrixAt(index,pivot.matrix);
      caps.setColorAt(index,tint.setHex(char==='E'||char==='_' ? 0x484942 : 0x282c2b));
      if (char !== '_') ctx.fillText(char,(col+.5)*51,(row+.5)*51);
    }
  });
  caps.castShadow=caps.receiveShadow=true;
  keyboard.add(caps);
  const label = add(new THREE.PlaneGeometry(.405,.125),new THREE.MeshBasicMaterial({
    map:legends,transparent:true,depthWrite:false,opacity:.72
  }),.0005,.0182,0,keyboard);
  label.rotation.x=-Math.PI/2;
  label.castShadow=label.receiveShadow=false;

  // The monitor is a separate clickable surface, with a physical frame, neck and metal stand.
  const screenWidth=.661, screenHeight=.372;
  const monitor = group(.784,1.049,-1.232);
  const stand = group(.784,deskY,-1.244);
  rounded(.251,.013,.172,.004,0,.007,0,anodized,stand);
  rounded(.066,.163,.036,.006,0,.090,-.037,anodized,stand);
  rounded(.135,.064,.022,.004,0,.157,-.034,matteBlack,stand);
  rounded(screenWidth+.013,screenHeight+.014,.029,.005,0,0,-.009,matteBlack,monitor);
  const placeholder=imageTexture(480,270,ctx=>{
    ctx.fillStyle='#e9e1d2';
    ctx.fillRect(0,0,480,270);
  });
  const display=new THREE.MeshPhysicalMaterial({
    color:0x22201e, map:placeholder, emissive:0xfff5e5, emissiveMap:placeholder,
    emissiveIntensity:.88, roughness:.53, specularIntensity:.28, clearcoat:.075, toneMapped:false
  });
  const monitorSurface=add(new THREE.PlaneGeometry(screenWidth,screenHeight),display,0,0,.006,monitor);
  monitorSurface.castShadow=false;
  // Give the daylight halo room to fall off beyond the thin black bezel.
  const rimMargin = .016;
  const monitorFeedback = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      uvScale: { value: new THREE.Vector2(1 + 2*rimMargin/screenWidth, 1 + 2*rimMargin/screenHeight) },
      breath: { value: .5 },
      daylight: { value: 1 },
      hoverAmount: { value: 0 },
      hoverUv: { value: new THREE.Vector2(.5, .5) },
      pressAge: { value: 1 },
      pressUv: { value: new THREE.Vector2(.5, .5) },
      screenAspect: { value: screenWidth / screenHeight }
    },
    vertexShader: `
      varying vec2 screenUv;
      void main() {
        screenUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec2 uvScale;
      uniform float breath;
      uniform float daylight;
      uniform float hoverAmount;
      uniform vec2 hoverUv;
      uniform float pressAge;
      uniform vec2 pressUv;
      uniform float screenAspect;
      varying vec2 screenUv;

      void main() {
        vec2 scale = vec2(screenAspect, 1.0);
        vec2 uv = (screenUv - 0.5) * uvScale + 0.5;
        vec2 edges = min(uv, 1.0 - uv) * scale;
        float distanceToRim = min(edges.x, edges.y);
        // The day highlight straddles the dark frame; its width grows with the breath.
        float radius = abs(distanceToRim + mix(0.001, 0.009, daylight));
        float width = mix(0.009, 0.014 + 0.014 * breath, daylight);
        float core = 1.0 - smoothstep(0.002, width, radius);
        float halo = 1.0 - smoothstep(0.003, mix(0.028, 0.054, daylight), radius);
        float outerFade = smoothstep(-0.042, -0.026, distanceToRim);
        vec2 fromHover = (uv - hoverUv) * scale;
        float follow = exp(-5.0 * dot(fromHover, fromHover));
        float peak = mix(0.43, 1.0, daylight);
        float strength = mix(0.09, peak, breath);
        strength = mix(strength, peak * (0.88 + 0.12 * follow), hoverAmount);
        float glow = outerFade * strength * (0.76 * core + 0.24 * halo);
        float distanceFromPress = length((uv - pressUv) * scale);
        float pressRadius = mix(0.014, 0.23, pressAge);
        float ring = 1.0 - smoothstep(0.009, 0.026, abs(distanceFromPress - pressRadius));
        float center = 1.0 - smoothstep(0.012, 0.041, distanceFromPress);
        float fade = (1.0 - pressAge) * (1.0 - pressAge);
        float pulse = min(1.0, (0.67 * ring + 0.62 * center) * fade);

        gl_FragColor = vec4(vec3(1.0), min(1.0, glow + mix(0.68, 1.0, daylight) * pulse));
        #include <colorspace_fragment>
      }
    `
  });
  const hint = add(new THREE.PlaneGeometry(screenWidth+2*rimMargin,screenHeight+2*rimMargin),monitorFeedback,0,0,.007,monitor);
  hint.castShadow=hint.receiveShadow=false;

  const hoverTarget = new THREE.Vector2(.5,.5);
  let hoveringMonitor = false, pressedAt = -Infinity, lastMonitorUpdate = performance.now();
  function updateMonitor(time, motionEnabled) {
    const uniforms = monitorFeedback.uniforms;
    const elapsed = THREE.MathUtils.clamp(time - lastMonitorUpdate, 0, 100);
    const easing = motionEnabled ? 1 - Math.exp(-elapsed / 95) : 1;
    const pressTime = time - pressedAt;
    lastMonitorUpdate = time;
    uniforms.breath.value = motionEnabled ? .5 - .5 * Math.cos(time * (2 * Math.PI / 4400)) : .5;
    uniforms.hoverAmount.value = THREE.MathUtils.lerp(uniforms.hoverAmount.value, Number(hoveringMonitor), easing);
    if (motionEnabled) uniforms.hoverUv.value.lerp(hoverTarget,easing);
    else uniforms.hoverUv.value.set(.5,.5);
    uniforms.pressAge.value = motionEnabled ? THREE.MathUtils.clamp(pressTime / 460,0,1) : 1;
  }
  function pulseMonitor(uv) {
    if (uv) monitorFeedback.uniforms.pressUv.value.copy(uv);
    else monitorFeedback.uniforms.pressUv.value.set(.5, .5);
    pressedAt = performance.now();
    onUpdate();
  }

  const panelTextures = new Map();
  let monitorRequest=0, currentPreview='';
  function setPreview(url) {
    if (currentPreview===url) return;
    currentPreview=url;
    const request=++monitorRequest;
    function update(texture) {
      if (request!==monitorRequest) return;
      display.map=display.emissiveMap=texture;
      onUpdate();
    }
    if (panelTextures.has(url)) { update(panelTextures.get(url)); return; }
    (request===1 ? loader : previewLoader).load(url,texture=>{
      texture.colorSpace=THREE.SRGBColorSpace;
      texture.anisotropy=8;
      panelTextures.set(url,texture);
      update(texture);
    },undefined,()=>{ if (request===monitorRequest) currentPreview=''; });
  }
  setPreview(previewUrl);

  // The chair faces the writing area at a shallow angle. Its dark contacts stay on the actual rug or floor.
  const chair=group(-.286,0,-.948);
  chair.scale.set(1.045,1,.958);
  chair.rotation.y=-.43;
  for(const side of [-1,1]) {
    beam(vec(side*.224,.007,.188),vec(side*.206,.464,.173),.030,.032,oak,chair,.006);
    beam(vec(side*.230,.007,-.211),vec(side*.203,.581,-.171),.030,.032,oak,chair,.005);
    beam(vec(side*.196,.398,-.173),vec(side*.191,.405,.172),.025,.041,oak,chair,.004);
    beam(vec(side*.204,.417,.165),vec(side*.181,.682,.208),.026,.026,oak,chair,.005);
  }
  beam(vec(-.186,.382,-.168),vec(.186,.382,-.168),.032,.043,oak,chair);
  beam(vec(-.189,.381,.169),vec(.189,.381,.169),.030,.040,oak,chair);
  for(const side of [-1,1]) {
    const arm=loftGeometry(26,10,(u,v)=>{
      const angle=-v*2*Math.PI;
      const end=Math.max(.48,Math.min(1,u*19,(1-u)*19));
      return [side*(.218+.019*Math.sin(u*Math.PI))+.018*Math.cos(angle)*end,
        .589+.047*Math.sin(u*Math.PI/2)+.009*Math.sin(angle)*end,-.200+u*.405];
    });
    const armUV=arm.attributes.uv;
    for(let i=0;i<armUV.count;i++) armUV.setXY(i,armUV.getY(i)*.20,armUV.getX(i)*.64);
    const armFinish=oak.clone(); armFinish.side=THREE.DoubleSide;
    add(arm,armFinish,0,0,0,chair);
  }
  const cushion=loftGeometry(52,10,(u,v)=>{
    const layers=[[.393,.65],[.398,.88],[.407,.96],[.418,1],[.436,1],[.451,.976],[.463,.92],[.472,.79],[.478,.52],[.480,.26],[.481,.001]];
    const [y,radius]=layers[Math.round(v*10)], a=u*2*Math.PI,c=Math.cos(a),s=Math.sin(a);
    return [radius*.206*Math.sign(c)*Math.abs(c)**.58,y,radius*.205*Math.sign(s)*Math.abs(s)**.65-.028];
  });
  const seatUV=cushion.attributes.uv, seatVertices=cushion.attributes.position;
  for(let i=0;i<seatUV.count;i++) seatUV.setXY(i,.5+seatVertices.getX(i)*2.8,.5+seatVertices.getZ(i)*2.8);
  add(cushion,linen,0,0,0,chair);
  const backProfile=[[0,.7],[.01,.90],[.024,.96],[.042,.995],[.063,1],[.090,1],[.118,1],[.149,1],
    [.172,.994],[.194,.97],[.211,.936],[.225,.893],[.236,.80],[.242,.59],[.245,.001]];
  function backPoint(angle,height,radius) {
    const c=Math.cos(angle), s=Math.sin(angle);
    return vec(c*.202*radius,.487+height+.003*c*c,.188+.069*height/.245+s*.026*radius-.036*c*c);
  }
  const backCushion=loftGeometry(48,14,(u,v)=>{
    const [height,radius]=backProfile[Math.round(v*14)];
    return backPoint(u*2*Math.PI,height,radius).toArray();
  });
  const textile=linen.clone(); textile.side=THREE.DoubleSide;
  const backUV=backCushion.attributes.uv, backVertices=backCushion.attributes.position;
  for(let i=0;i<backUV.count;i++) backUV.setXY(i,.5+backVertices.getX(i)*2.65,backVertices.getY(i)*2.68);
  add(backCushion,textile,0,0,0,chair);
  const seam=new THREE.CatmullRomCurve3(Array.from({length:64},(_,i)=>{
    const phase=i*Math.PI/32,c=Math.cos(phase),s=Math.sin(phase);
    const height=.123+.102*Math.sign(s)*Math.abs(s)**.68;
    const upper=backProfile.findIndex(([y])=>y>=height);
    const [aY,aRadius]=backProfile[upper-1], [bY,bRadius]=backProfile[upper];
    const radius=THREE.MathUtils.lerp(aRadius,bRadius,(height-aY)/(bY-aY));
    const angle=Math.acos(.968*Math.sign(c)*Math.abs(c)**.53);
    const point=backPoint(angle,height,radius);
    point.z+=.00036;
    return point;
  }),true);
  add(new THREE.TubeGeometry(seam,66,.00145,6,true),linen,0,0,0,chair);

  // A shallow solid-oak shelf with a framed landscape, clothbound books, and a trailing plant.
  const shelving=group(.997,1.518,-1.447);
  const shelf=rounded(1.375,.037,.205,.006,0,0,0,oak,shelving);
  shelf.name='wall-shelf';
  for(const x of [-.47,.47]) rounded(.020,.025,.111,.002,x,-.013,-.061,frameWood,shelving);
  const frame=group(-.305,.188,-.016,shelving);
  const woodFrame=rounded(.389,.348,.026,.003,0,0,0,frameWood,frame);
  woodFrame.rotation.x=-.015;
  const mat=rounded(.353,.312,.003,.0006,0,0,.014,material(0xe3d4bb,.91),frame);
  mat.castShadow=false;
  const printFinish=material(0xe2d2b7,.93);
  const printMap=surfaceMap('./media/study/study-mountain-art.webp');
  printMap.wrapS=printMap.wrapT=THREE.ClampToEdgeWrapping;
  printFinish.map=printMap;
  const picture=add(new THREE.PlaneGeometry(.245,.199),printFinish,0,.015,.017,frame);
  picture.castShadow=false;
  const books=[['#a99372',.229,.048],['#7f745f',.251,.038],['#ada08b',.255,.036],
    ['#c7b797',.259,.046],['#d4c3a3',.276,.051],['#7f7561',.264,.035],['#5b5548',.279,.049]];
  let bookX=.080;
  for(const [i,[color,height,width]] of books.entries()) {
    const book=group(bookX+width/2,.018,-.028,shelving);
    book.rotation.z=i===0?-.15:(i===1?-.06:0);
    const cover=material(color,.89);
    rounded(width,height,.102,.0028,0,height/2,0,cover,book);
    rounded(width*.73,height-.009,.094,.002,0,height/2,-.007,paper,book);
    rounded(width,.006,.103,.0015,0,height-.004,0,cover,book);
    for(let row=0;row<7;row++) box(.0036+(row%3)*.001,.0022,.001,0,height-.043-row*.007,.052,frameWood,book);
    bookX+=width+.006;
  }
  const shrub=group(.548,.019,.016,shelving);
  vaseShape([[0,0],[.038,0],[.045,.011],[.051,.063],[.051,.099],[.046,.102],[.042,.099],
    [.041,.085],[.038,.019],[0,.014]],ceramic,0,0,0,shrub,40);
  const hangingVines=group(0,.092,0,shrub);
  hangingVines.name='wind-shelf-vines';
  const vines=[], vineLeaves=[];
  for(let k=0;k<5;k++) {
    const points=[vec(0,.092,0),vec(.016*k-.05,.155+.018*Math.cos(k),.035),
      vec(.072+.016*k,.085-.018*k,.079),vec(.06+.041*Math.sin(k),-.065*k,.102+.009*k),
      vec(.048+.093*Math.sin(k+1),-.19-.047*k,.120+.018*k)];
    const stem=new THREE.CatmullRomCurve3(points);
    add(new THREE.TubeGeometry(stem,26,.0013,7,false),material(0x626238,.84),0,-hangingVines.position.y,0,hangingVines);
    for(let i=0;i<12;i++) {
      const at=stem.getPoint((i+.48)/13);
      const leaf=at.clone().add(vec(.017*Math.sin(i*2.2+k),.008*Math.cos(i*2.1),.008+.017*Math.sin(i*2.13)));
      vines.push({start:at,end:leaf,radius:.00062});
      vineLeaves.push(leaf);
    }
  }
  const vineTwigs=taperedSegments(vines,material(0x5d562f,.84),6);
  const trailingLeaves=flexibleLeaves(plantLeaves(vineLeaves,1.31,true));
  vineTwigs.position.y=trailingLeaves.position.y=-hangingVines.position.y;
  hangingVines.add(vineTwigs,trailingLeaves);
  const sun = new THREE.DirectionalLight(0xffe7c6,2.9);
  sun.name='windowSun';
  sun.position.set(-4.52,3.75,2.18);
  sun.target.position.set(.22,.52,-1.25);
  sun.castShadow=true;
  // Keep the live map at the rest pose. Wind shades the baked receivers separately.
  sun.shadow.autoUpdate=false;
  sun.shadow.needsUpdate=true;
  sun.shadow.mapSize.set(1792,1792);
  sun.shadow.normalBias=.003;
  sun.shadow.bias=-.00011;
  sun.shadow.radius=3.4;
  Object.assign(sun.shadow.camera,{left:-2.9,right:2.9,top:2.95,bottom:-2.95,near:.25,far:14});
  const fill = new THREE.HemisphereLight(0xfcf7ef,0xd4b794,1.08);
  const windowBounce = new THREE.DirectionalLight(0xeef4ff,.31);
  windowBounce.position.set(-2.84,1.88,-2.73);
  windowBounce.target.position.set(.40,.75,-.48);
  const frontBounce = new THREE.DirectionalLight(0xffecd8,.37);
  frontBounce.position.set(.25,2.01,1.90);
  const writingBounce=new THREE.SpotLight(0xffeed9,0,2.9,Math.PI/2.7,.96,2);
  writingBounce.position.set(-1.71,1.19,-.49);
  writingBounce.target.position.set(-1.03,.44,-1.02);
  scene.add(sun,sun.target,fill,windowBounce,windowBounce.target,frontBounce,writingBounce,writingBounce.target);

  scene.userData.bakeReceivers={
    floor:[0,1,0,352,416,1.18], 'back-wall':[0,0,1,384,270,1.08],
    'right-wall':[-1,0,0,352,245,1.15], 'left-wall':[1,0,0,304,128,1.05], ceiling:[0,-1,0,256,244,1.43], worktop:[0,1,0,448,130,.42], rug:[0,1,0,348,248,.76]
  };
  scene.userData.sunWindReceivers=Object.keys(sunWindAssets);
  if (lighting) {
    for (const [surface, url] of [[floor,'./media/study/ao-floor.webp'],[backWall,'./media/study/ao-back-wall.webp'],
      [rightWall,'./media/study/ao-right-wall.webp'],[leftWall,'./media/study/ao-left-wall.webp'],[ceiling,'./media/study/ao-ceiling.webp'],[deskTop,'./media/study/ao-worktop.webp'],[rug,'./media/study/ao-rug.webp']]) {
      surface.material=surface.material.clone();
      const ao=surfaceMap(url,false);
      ao.channel=1;
      surface.material.aoMap=ao;
      surface.material.aoMapIntensity=.92;
      const windAsset=sunWindAssets[surface.name];
      if (windAsset) {
        const phaseMap=surfaceMap(windAsset,false);
        phaseMap.wrapS=phaseMap.wrapT=THREE.ClampToEdgeWrapping;
        surface.material.onBeforeCompile=shader=>useWindBakedLighting(shader,phaseMap,sunCanopyBend);
      } else surface.material.onBeforeCompile=useBakedLighting;
    }
  }

  function setHover(uv) {
    const active = Boolean(uv);
    if (active) {
      hoverTarget.copy(uv);
      if (monitorFeedback.uniforms.hoverAmount.value < .01) monitorFeedback.uniforms.hoverUv.value.copy(uv);
    }
    if (active === hoveringMonitor) return;
    hoveringMonitor = active;
    onUpdate();
  }
  function setNight(enabled) {
    const night=Boolean(enabled);
    monitorFeedback.uniforms.daylight.value = night ? 0 : 1;
    sunWindEnabled=!night;
    sunCanopyBend.value=night ? 0 : canopyBend;
    scene.background.setHex(night ? 0x191b24 : 0xb7a286);
    scene.environment=night ? nightReflection : dayReflection;
    scene.environmentIntensity=night ? .64 : .72;
    sun.color.setHex(night ? 0xa8c4ff : 0xffe5be);
    sun.intensity=night ? .044 : 4.28;
    fill.color.setHex(night ? 0xa7b9d8 : 0xf6f3ed);
    fill.groundColor.setHex(night ? 0x8c7565 : 0xd9bfa4);
    fill.intensity=night ? .70 : .98;
    windowBounce.color.setHex(night ? 0xa5bfdf : 0xeef4ff);
    windowBounce.intensity=night ? .37 : .56;
    frontBounce.intensity=night ? .27 : .42;
    // The short, warm bounce reaches the upholstered chair and the adjacent desk edge.
    writingBounce.color.setHex(night ? 0xffdeb7 : 0xffeed9);
    writingBounce.position.set(...(night ? [-.75,.87,-.39] : [-1.71,1.19,-.49]));
    writingBounce.target.position.set(...(night ? [-.26,.57,-.74] : [-1.03,.44,-1.02]));
    writingBounce.distance=night ? .89 : 2.9;
    writingBounce.angle=night ? .66 : Math.PI/2.7;
    writingBounce.intensity=night ? .24 : .91;
    blindFinish.emissiveIntensity=night ? .02 : .43;
    deskGlow.intensity=night ? .38 : .045;
    const beamAngle=night ? Math.PI/4.9 : Math.PI/3.25;
    const movedLamp=deskBeam.angle!==beamAngle;
    deskBeam.target.position.set(...(night ? [-.17,-.373,.293] : [-.16,-.264,.142]));
    deskBeam.angle=beamAngle;
    if (movedLamp) deskBeam.shadow.needsUpdate=true;
    deskBeam.intensity=night ? 2.78 : .49;
    diffuser.emissiveIntensity=night ? 1.50 : .53;
    display.emissive.setHex(night ? 0xf7faff : 0xfff5e5);
    display.emissiveIntensity=night ? .68 : .84;
    viewMaterial.map=night ? nightSky : daySky;
    if (night) viewMaterial.color.setRGB(.46,.52,.84);
    else viewMaterial.color.setScalar(1.03);
    glass.material.opacity=night ? .10 : .07;
    onUpdate(movedLamp);
  }
  function setCanopyBend(amount) {
    canopyBend=amount;
    shadowCanopy.rotation.set(.022*amount,.035*amount,-.043*amount);
    sunCanopyBend.value=sunWindEnabled ? amount : 0;
  }
  let previousWindPhase=0;
  function updateWind(timeSeconds) {
    if (!Number.isFinite(timeSeconds)) return;
    const phase=(timeSeconds%16)*Math.PI/8;
    if (phase===previousWindPhase) return;
    previousWindPhase=phase;
    const easing=.65*Math.sin(phase)+.24*Math.sin(3*phase)+.11*Math.sin(5*phase);
    const ripple=Math.sin(8*phase)*(.47+.32*Math.sin(phase));
    leafPhase.value=phase*8;
    leafBreeze.value=.0064*(.56*easing+.44*ripple);
    setCanopyBend(THREE.MathUtils.clamp(1.43*easing,-1,1));
    for(let i=0;i<shadePositions.count;i++) {
      const offset=i*3, x=shadeRest[offset], drop=shadeDrop[i];
      shadePositions.setXYZ(i,x+drop*.013*easing,shadeRest[offset+1]+drop*.007*easing**2,
        shadeRest[offset+2]+drop*(.044*easing+.010*ripple*Math.cos(x*9)));
    }
    shadePositions.needsUpdate=true;
    blind.computeVertexNormals();
    romanEdge.position.set(windowX+.013*easing,1.833+.007*easing**2,rearZ+.04+.044*easing);
    romanEdge.rotation.y=.014*ripple;
    deskBranches.rotation.set(.067*easing+.026*ripple,.034*easing,-.168*easing);
    hangingVines.rotation.set(.052*easing-.023*ripple,.027*easing,.106*easing);
    nearWindow.rotation.set(.049*easing,.086*easing,.092*easing+.029*ripple);
  }

  setNight(false);
  scene.updateMatrixWorld(true);
  const center=monitorSurface.getWorldPosition(new THREE.Vector3());
  const normal=new THREE.Vector3(0,0,1).applyQuaternion(monitor.getWorldQuaternion(new THREE.Quaternion()));
  return {scene,monitorSurface,screenWidth,screenHeight,center,normal,setPreview,setHover,setNight,updateWind,updateMonitor,pulseMonitor,setCanopyBend};
}

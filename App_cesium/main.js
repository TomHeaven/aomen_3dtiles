// Construct the viewer with just what we need for this base application
var viewer = new Cesium.Viewer('cesiumContainer', {
	timeline:false,
	animation:false,
	vrButton:true,
	sceneModePicker:false,
	infoBox:true,
	scene3DOnly:true,
	terrainProvider: Cesium.createWorldTerrainAsync(),
	// imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
	// 	url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'   
	// })  
});
// 加载3dtiles函数（推荐）
async function addThreeDTiles(url, option) {
	viewer.scene.globe.depthTestAgainstTerrain = false;
	let tileset = {}
	if (typeof url == 'number') {
	  tileset = await Cesium.Cesium3DTileset.fromIonAssetId(url, option);
	} else {
	  tileset = await Cesium.Cesium3DTileset.fromUrl(url, option);
	}
	
	viewer.scene.primitives.add(tileset);
  
	return tileset; // 返回模型对象
}
// 加载3DTiles模型
const modelPromise = addThreeDTiles('../AOMEN-3DTILES/tileset.json') 
// 设置光照
viewer.scene.light = new Cesium.DirectionalLight({
	direction: viewer.scene.camera.directionWC,
});
viewer.scene.preRender.addEventListener(function (scene, time) {
	viewer.scene.light.direction = Cesium.Cartesian3.clone(
		viewer.scene.camera.directionWC,
		viewer.scene.light.direction
	);
});

// Override behavior of home button
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(commandInfo) {
	// Fly to tileset
	// viewer.flyTo(tileset);
	// 恢复初始视点
	viewer.camera.flyTo({
		destination:Cesium.Cartesian3.fromDegrees(113.54, 22.20, 50000.0),
		orientation: {
			heading: Cesium.Math.toRadians(0.0),
			pitch: Cesium.Math.toRadians(-90.0),
			roll: 0.0
		}
	});
	// Tell the home button not to do anything
	commandInfo.cancel = true;
});

var longitude_show = document.getElementById('longitude_show');
var latitude_show = document.getElementById('latitude_show');
var altitude_show = document.getElementById('altitude_show');
	
// 获取坐标转经纬度
let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
handler.setInputAction(function (event) {
	console.log(event.position);
	let earthPosition = viewer.scene.pickPosition(event.position);
	if (Cesium.defined(earthPosition)) {
		let cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
		console.log(cartographic);
		let lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(7);
		let lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(7);
		let height = cartographic.height.toFixed(2);
		console.log(earthPosition, {
			lon: lon,
			lat: lat,
			height: height,
		});
		longitude_show.innerHTML = lon;
		latitude_show.innerHTML = lat;
		altitude_show.innerHTML = height;
	}
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// 设置初始视点
viewer.camera.flyTo({
	destination:Cesium.Cartesian3.fromDegrees(113.54, 22.20, 50000.0),
	orientation: {
		heading: Cesium.Math.toRadians(0.0),
		pitch: Cesium.Math.toRadians(-90.0),
		roll: 0.0
	}
});
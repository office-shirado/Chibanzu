//レイヤ設定
function setLayers() {
	var zoomlv = map.getZoom();

	// 地番図【ポリゴン】
        map.addLayer({
       	          'id': 'Chibanzu-fill',
               	  'type': 'fill',
                  'source': 'Chibanzu',
       	          'source-layer': 'chibanzu',
               	  'paint': {
                    "fill-color": "#0000ff",
       	            "fill-opacity": 0
                  },
       	          'minzoom': 15,
	          'maxzoom': 24,
		});
		if( zoomlv > 17) {
			map.setPaintProperty('Chibanzu-fill', 'fill-opacity', 0);
			}
			else
			{
			map.setPaintProperty('Chibanzu-fill', 'fill-opacity', 0.2);
			};

	// 地番図【ライン】
        map.addLayer({
       	          'id': 'Chibanzu-line',
               	  'type': 'line',
                  'source': 'Chibanzu',
       	          'source-layer': 'chibanzu',
               	  'paint': {
                    "line-color": "#0000ff",
       	          },
       	          'minzoom': 15,
	          'maxzoom': 24,
	});
	if( zoomlv > 16) {
		map.setPaintProperty('Chibanzu-line', 'line-opacity', 1.0);
		}
		else
		{
		map.setPaintProperty('Chibanzu-line', 'line-opacity', 0.1);
	};

	//地番表示
        map.addLayer({
		'id': 'Chibanzu_Chiban',
		'type': 'symbol',
		'source': 'Chibanzu_Chiban',
		'source-layer': 'chiban',
		'layout': {
			'text-field': ['get', '地番'],
		},
		'paint': {
			'text-color': 'rgba(0, 0, 255, 1)',
			'text-halo-color': 'rgba(255,255,255,1)', // ラベルの外枠の色を白に設定
			'text-halo-width': 1 // ラベルの外枠の幅を2に設定
		},
		'minzoom': 18,
		'maxzoom': 24,
	});
	
	
	// PLATEAU
	var hoveredStateId = null;
	var hovered_PLATEAU_Flg = false;
	map.addLayer({
	  'id': 'PLATEAU',
	  'source': 'PLATEAU',
	  'source-layer': 'PLATEAU',
	  'minzoom': 15,
	  'maxzoom': 24,
	  'layout': {
	    'visibility': 'visible',
	  },
	  'type': 'fill-extrusion',
	  'paint': {
	    "fill-extrusion-color": [
	      'case',
	      ['boolean', ['feature-state', 'hover'], false],
	      '#0000ff',
	      '#aaa'
	    ],
	  'fill-extrusion-opacity': 0.7,
	  'fill-extrusion-height': ['get', 'measuredHeight']
	  }
	});

	// PLATEAU（ホバー効果）
	const hover_ID = 'PLATEAU';
	const sourceName = 'PLATEAU';
	const sourceLayerName = 'PLATEAU';
	map.on('mousemove', hover_ID, function (e) {
	  if (e.features.length > 0) {
	    hovered_PLATEAU_Flg = true;	//PLATEAUホバーフラグ
	    PopUp_PLATEAU_Flg = true;		//PLATEAU ポップアップフラグ
	    map.getCanvas().style.cursor = 'pointer'
	    if (hoveredStateId) {
	      map.setFeatureState(
	        { source: sourceName, sourceLayer: sourceLayerName, id: hoveredStateId },
	        { hover: false }
	      );
	    }
	    hoveredStateId = e.features[0].id;
	    map.setFeatureState(
	      { source: sourceName, sourceLayer: sourceLayerName, id: hoveredStateId },
	      { hover: true }
	    );
	  }
	});

	map.on('mouseleave', hover_ID, function () {
	  if (hoveredStateId) {
	    hovered_PLATEAU_Flg = false;	//PLATEAU ホバーフラグ
	    PopUp_PLATEAU_Flg = false;		//PLATEAU ポップアップフラグ
	    map.getCanvas().style.cursor = ''
	    map.setFeatureState(
	      { source: sourceName, sourceLayer: sourceLayerName, id: hoveredStateId },
	      { hover: false }
	    );
	  }
	  hoveredStateId = null;
	});

};





//ジャンプ（現在地）
function getLocation(getLatLng) {
	map.flyTo({
	  center: [135.758484, 34.985307], 
//	  center: [getLatLng.coords.longitude, getLatLng.coords.latitude], 
	  zoom: 17,
	  speed: 2.5,
	  curve: 1
	});

	// 3.0秒遅延して傾ける
	setTimeout(function(){
	  var easeOptions = {
	      pitch: 50,
	      duration: 1000,
	  };
	  map.easeTo(easeOptions);
	  setLayers();
	},3000);
};


// マップ設定
    const map = new maplibregl.Map({
	    container: 'map',
	    hash: true,
	    style: {
	      "version": 8,
	      "name": "Offce-Shirado.com",
	      "sprite": "https://demotiles.maplibre.org/styles/osm-bright-gl-style/sprite",
	      "glyphs": "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
	      "sources": {
	        // シームレス空中写真
	        GSI_seamlessphoto : {
	            type: 'raster',
	            tiles: [ 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg' ],
	            tileSize: 256,
	            attribution:"<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	        }
	      },
	      "layers": [
	        {
	          // シームレス空中写真
	          id: 'GSI_seamlessphoto',
	          type: 'raster',
	          source: 'GSI_seamlessphoto',
	          minzoom: 0,
	          maxzoom: 24,
	        }
	      ]
	    },
	    center: [139.75417,36.50], // 日本全体
	    zoom: 4, // ズームレベル
	    minZoom: 4,
	    maxZoom: 23,
//	    pitch: 50,
	    maxPitch: 70,
    });


// ロードアクション
map.on('load', async function () {

	//PMTiles初期設定
	//PMTilesプラグインをMapLibre GL JSに入れる。
	let protocol = new pmtiles.Protocol();
        maplibregl.addProtocol("pmtiles",protocol.tile);

	//【ベクトル】
	//PLATEAU(IPFS)
	let PMTILES_URL01 = "https://smb.optgeo.org/ipfs/QmTGRcYNmCmka5S8wARPaVz1S5mF3vvtx8SJKNJBThiZiV";
	//地番図(Github)【ズームレベル１５のみ】
	let PMTILES_URL02 = "https://office-shirado.github.io/Chibanzu/PMTiles/Chibanzu_26100_Kyoto_2023.pmtiles";
	//地番図＜地番ポイント＞(Github)【ズームレベル１５のみ】
	let PMTILES_URL03 = "https://office-shirado.github.io/Chibanzu/PMTiles/Chibanzu_Point_26100_Kyoto_2023.pmtiles";

        const PMTiles01 = new pmtiles.PMTiles(PMTILES_URL01)
        const PMTiles02 = new pmtiles.PMTiles(PMTILES_URL02)
        const PMTiles03 = new pmtiles.PMTiles(PMTILES_URL03)

        // this is so we share one instance across the JS code and the map renderer
        protocol.add(PMTiles01);
        protocol.add(PMTiles02);
        protocol.add(PMTiles03);

        // ＰＬＡＴＥＡＵ
	map.addSource('PLATEAU',{
		type: "vector",
		//office-shirado.comのMaps参照
                url: "pmtiles://" + PMTILES_URL01,
                generateId: true,
                attribution:"<a href='https://www.geospatial.jp/ckan/dataset/plateau/' target='_blank'>PLATEAU</a>"
	});

        // 地番図（京都市）
	map.addSource('Chibanzu',{
		type: "vector",
		//Github参照
                url: "pmtiles://" + PMTILES_URL02,
                generateId: true,
                attribution:"<a href='https://data.city.kyoto.lg.jp/dataset/00652/' target='_blank'>京都市</a>"
	});

        // 地番図【地番】（京都市）
	map.addSource('Chibanzu_Chiban',{
		type: "vector",
                url: "pmtiles://" + PMTILES_URL03,
                generateId: true,
                attribution:"<a href='https://data.city.kyoto.lg.jp/dataset/00652/' target='_blank'>京都市</a>"
	});


        // 標高タイル（国土地理院）
	map.addSource("gsidem", {
	      type: 'raster-dem',
	      tiles: [
	          'https://optgeo.github.io/10b256/zxy/{z}/{x}/{y}.webp',
	      ],
	      tileSize: 256,
	      attribution:"<a href='https://maps.gsi.go.jp/development/ichiran.html' target='_blank'>地理院タイル</a>"
	});

	// 現在地取得
	var ZoomLv = map.getZoom();
	//初期ズームレベルの時は、現在地ジャンプ
	if (ZoomLv == 4){

	// 0.5秒遅延してジャンプ
	  setTimeout(function(){
	    navigator.geolocation.getCurrentPosition(getLocation);
	  },500
	);
	}else{
	  setLayers();
	}

	// ３Ｄ表示（標高タイル）
	map.setTerrain({ 'source': 'gsidem', 'exaggeration': 1 });

});

//#################ロード時アクション#################



//#################マップコントロール（画面制御）#################
//ダブルクリックズーム制御（しない）
map.doubleClickZoom.disable();

//ドラッグ回転制御（する）
//map.dragRotate.disable();

//ピッチ回転制御（する）
//map.pitchWithRotate.disable();

//タッチズーム回転制御（する）
//map.touchZoomRotate.disableRotation();

//#################マップコントロール（画面制御）#################

//#################マップコントロール（ツール）#################
//ジオコーダー（国土地理院）
var geocoder_api = {
	forwardGeocode: async (config) => {
		const features = [];

		const Text_Prefix = config.query.substr(0, 3);

		try {
		  let request ='https://msearch.gsi.go.jp/address-search/AddressSearch?q=' +config.query;
			const response = await fetch(request);
			const geojson = await response.json();

		  for (var i = 0; i < geojson.length; i++) {
			if (geojson[i].properties.title.indexOf(Text_Prefix) !== -1){
			  let point = {
				  type: 'Feature',
				  geometry: {
				  type: 'Point',
				  coordinates: geojson[i].geometry.coordinates
			  	  },
			  place_name: geojson[i].properties.title,
			  properties: geojson[i].properties,
			  text: geojson[i].properties.title,
			  place_type: ['place'],
			  center: geojson[i].geometry.coordinates
			  };
			  features.push(point);
			}
		 }
		} catch (e) {
			console.error(`Failed to forwardGeocode with error: ${e}`);
		}

		return {
			features: features
		};
	}
};
map.addControl(new MaplibreGeocoder(geocoder_api, {maplibregl: maplibregl}));


// 現在位置表示
map.addControl(new maplibregl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    fitBoundsOptions: { maxZoom: 20 },
    trackUserLocation: true,
    showUserLocation: true
    }), 
    'top-right');

// マップコントロール（拡大・縮小・方位）
map.addControl(new maplibregl.NavigationControl(), 'top-right');


//#################マップコントロール（ツール）#################



var PopUp_PLATEAU_Flg = false;
//#################クリックイベント（地番図）#################
//クリック属性表示（地番図）
var popup_Chibanzu = new maplibregl.Popup();
// 情報ポップアップ
function Chibanzu_Popup_Fnc(e) {
    var CB_Shozai = e.features[0].properties['所在'];
    var CB_Chiban = e.features[0].properties['地番'];


    if( CB_Shozai === undefined ) { CB_Shozai = "" };
    if( CB_Chiban === undefined ) { CB_Chiban = "" };

    var zoomlv = map.getZoom();

    popup_Chibanzu.remove();	// 地番図のポップアップ削除
    popup_Chibanzu = new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
			'<b>' + '<big>' + '【地番図】' +  '</big>' + '</b>' + '<br>' +
			'<b>' + '<big>' + CB_Shozai + ' ' + CB_Chiban + '</big>' + '</b>' + '<br>' +
			"所在：" +  CB_Shozai + '<br>' +
			"地番：" + CB_Chiban + '<br>' +
			"※市区町村のオープンデータです" + '<br>' +
			'<hr>'+
			"<a href='https://www.google.com/maps/@?api=1&map_action=pano&parameters&viewpoint=" + e.lngLat.lat + ",%20" + e.lngLat.lng + "' target='_blank'>ストリートビュー</a>　" +
			"<a href='https://www.google.co.jp/maps?q=" + e.lngLat.lat + "," + e.lngLat.lng + "&hl=ja' target='_blank'>GoogleMap</a>　"
	).addTo(map);
}
// クリックイベント
map.on('click', 'Chibanzu-fill', (e) => {
	if( PopUp_PLATEAU_Flg === false ){
	  Chibanzu_Popup_Fnc(e);
	};
});
//#################クリックイベント（地番図）#################


//#################クリックイベント（ＰＬＡＴＥＡＵ）#################
//クリック属性表示（PLATEAU）
var popup_PLATEAU = new maplibregl.Popup();
// 情報ポップアップ
function PLATEAU_Popup_Fnc(e){
      var lng = e.lngLat.lng;
      var lat = e.lngLat.lat;

      // 建築物(bldg)
      var bldg_ID = e.features[0].properties['buildingID'];	// 建築物ID
      var bldg_Name = e.features[0].properties['name']; // 建築物名称
      var bldg_YearOfConstruction = e.features[0].properties['yearOfConstruction']; // 建築年
      var bldg_Usage = e.features[0].properties['usage']; // 建築物用途
      var bldg_MeasuredHeight = e.features[0].properties['measuredHeight']; // 計測高さ
      var bldg_StoreysAboveGround = e.features[0].properties['storeysAboveGround']; // 地上階数
      var bldg_StoreysBelowGround = e.features[0].properties['storeysBelowGround']; // 地下階数
      var bldg_Address = e.features[0].properties['address'];	// 建築物の所在（住所）

      if (bldg_ID === undefined) { bldg_ID = "-" };
      if (bldg_Name === undefined) { bldg_Name = "-" };
      if (bldg_YearOfConstruction === undefined) { bldg_YearOfConstruction = "-" };
      if (bldg_Usage === undefined) { bldg_Usage = "-" };
      if (bldg_MeasuredHeight === undefined) { bldg_MeasuredHeight = "-" };
      if (bldg_StoreysAboveGround === undefined) { bldg_StoreysAboveGround = "-" };
      if (bldg_StoreysBelowGround === undefined) { bldg_StoreysBelowGround = "-" };
      if (bldg_Address === undefined) { bldg_Address = "-" };

      //ポップアップ
      popup_PLATEAU.remove();
      popup_PLATEAU = new maplibregl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          // 表形式
          '<b>【ＰＬＡＴＥＡＵ：建築物】</b><br> ' +
          '<hr>' +
          'Ｉ　Ｄ：' + bldg_ID + '<br> ' +
          '名　称：' + bldg_Name + '<br> ' +
          '建築年：' + bldg_YearOfConstruction + ' 年<br> ' +
          '用　途：' + bldg_Usage + '<br> ' +
          '高　さ：' + bldg_MeasuredHeight + ' ｍ<br> ' +
          '地　上：' + bldg_StoreysAboveGround + ' 階<br> ' +
          '地　下：' + bldg_StoreysBelowGround + ' 階<br> ' +
          '所　在：' + bldg_Address + '<br> ' +
          '<hr>' +
          '【<a href="https://www.google.co.jp/maps?q=' + lat + ',' + lng + '&hl=ja" target="_blank">GoogleMap</a>】'
        );
        popup_PLATEAU.addTo(map);
};
// クリックイベント
map.on('click', 'PLATEAU', (e) => {
	PLATEAU_Popup_Fnc(e);
});
//#################クリックイベント（ＰＬＡＴＥＡＵ）#################
//マウスイベント【ムーブスタート】
map.on('movestart', function () {
	//Popup削除
      popup_PLATEAU.remove();
      popup_Chibanzu.remove();
});


//マウスイベント【ドラッグ】
map.on('drag', function () {
	//グラッビングに変更（つかむ）
	map.getCanvas().style.cursor = 'grabbing';
});

//マウスイベント【Chibanzu-fill上で動いている場合】
map.on('mousemove', 'Chibanzu-fill', (e) => {
	if (e.features.length > 0) {map.getCanvas().style.cursor = 'pointer'}	//ポインター
				   else
				   {map.getCanvas().style.cursor = ''};
});

//マウスアウトイベント（地番図）【元に戻す】
map.on('mouseleave','Chibanzu-fill', function() {
	map.getCanvas().style.cursor = '';
});



//マウスイベント【ムーブ】
map.on('move', function () {
	var zoomlv = map.getZoom();
	var Pitch = map.getPitch();
	if( Pitch > 30) {
			map.setLayoutProperty("PLATEAU", "visibility" ,"visible");
			}
			else
			map.setLayoutProperty("PLATEAU", "visibility" ,"none");
			{
	};

	if( Pitch > 60) {
			map.setLayoutProperty("Chibanzu_Chiban", "visibility" ,"none");
			}
			else
			map.setLayoutProperty("Chibanzu_Chiban", "visibility" ,"visible");
			{
	};

	if( zoomlv > 16) {
			if (map.getLayer('Chibanzu-line'))		{map.setPaintProperty('Chibanzu-line', 'line-opacity', 1.0)};
			}
			else
			{
			if (map.getLayer('Chibanzu-line'))		{map.setPaintProperty('Chibanzu-line', 'line-opacity', 0.1)};
			};

	if( zoomlv > 17) {
			if (map.getLayer('Chibanzu-fill'))		{map.setPaintProperty('Chibanzu-fill', 'fill-opacity', 0)};
			}
			else
			{
			if (map.getLayer('Chibanzu-fill'))		{map.setPaintProperty('Chibanzu-fill', 'fill-opacity', 0.2)};
			};
});


import alt from 'alt';
import game from 'natives';

//{x: 0, y: 0, z: 70.175};
const after_spawn = {x: 386.20220947265625, y: -1026.883544921875, z: 28.63151};
const real_spawn = {x: 402.8571777, y: -996.513427, z: -100, heading: 180.0 };

let camera = null;

let mainView2 = null;
let current_properties = {//key: value pairs initialized with default values
	"nose_peak_hight":0,
	"neck_thikness":0,
	"nose_width":0,
	"torso_variation":{"texture_id":0,"model_id":0},
	"moles_freckles":{"opacity":0,"color2":0,"index":0,"color1":0},
	"makeup":{"opacity":0,"color2":0,"index":0,"color1":0},
	"jaw_bone_back_lenght":0,
	"lipstick":{"opacity":0,"color2":0,"index":0,"color1":0},
	"hair_variation":{"texture_id":0,"model_id":0},
	"nose_bone_high":0,
	"hands_variation":{"texture_id":0,"model_id":0},
	"legs_variation":{"texture_id":0,"model_id":0},
	"hair_color":{"col2":0,"col1":0},
	"cheeks_bone_width":0,
	"chimp_hole":0,
	"blush":{"opacity":0,"color2":0,"index":0,"color1":0},
	"nose_peak_lenght":0.2,
	"feet_variation":{"texture_id":0,"model_id":0},
	"chest_hair":{"opacity":0,"index":0},
	"jaw_bone_width":0,
	"textures_variation":{"texture_id":0,"model_id":0},
	//"surname":"Props",
	"skin_color":0,
	"blemishes":{"opacity":0,"color2":0,"index":0,"color1":0},
	"eyebrown_forward":0,
	"lips_thickness":0,
	"ageing":{"opacity":0,"color2":0,"index":0,"color1":0},
	"body_blemishes":{"opacity":0,"color2":0,"index":0,"color1":0},
	"sun_damage":{"opacity":0,"color2":0,"index":0,"color1":0},
	//"birth_date":"12-12-2012",
	"eyebrows":{"opacity":0,"color2":0,"index":0,"color1":0},
	"eyes_variation":{"texture_id":0,"model_id":0},
	"nose_peak_lowering":0,
	"cheeks_bone_high":0,
	"add_body_blemishes":{"opacity":0,"index":0},
	"torso2_variation":{"texture_id":0,"model_id":0},
	"cheeks_width":0,
	"head_variation":{"texture_id":0,"model_id":0},
	"eyes_openning":0,
	"complexion":{"opacity":0,"color2":0,"index":0,"color1":0},
	"accesories_variation":{"texture_id":0,"model_id":0},
	"chimp_bone_width":0,
	"gender":"male",
	"chimp_bone_lowering":0,
	"eyebrown_high":0,
	"face_variation":{"texture_id":0,"model_id":0},
	"nose_bone_twist":0,
	"facial_hair":{"opacity":0,"color2":0,"index":0,"color1":0},
	"chimp_bone_lenght":0,
	//"firstname":"All"
};
let account_id = 0;

const ignored_properties = [
	'general_error', 'firstname', 'surname', 'birth_date'
];

const close_camera_categories = ['Głowa', 'Kształt głowy', 'Twarz', 'Makijaż'];

const variations = {//component variations
	'face_variation': 	0,
	'head_variation': 	1,
	'hair_variation': 	2,
	'torso_variation': 	3,
	'legs_variation': 	4,
	'hands_variation': 	5,
	'feet_variation': 	6,
	'eyes_variation': 	7,
	//NOTE - NO TASKS INCLUDED
	'accesories_variation': 8,
	'textures_variation': 	10,
	'torso2_variation': 	11
};

const face_features = {
	'nose_width': 			0,
	'nose_peak_hight': 		1,
	'nose_peak_lenght': 	2,
	'nose_bone_high': 		3,
	'nose_peak_lowering': 	4,
	'nose_bone_twist': 		5,
	'eyebrown_high': 		6,
	'eyebrown_forward': 	7,
	'cheeks_bone_high': 	8,
	'cheeks_bone_width': 	9,
	'cheeks_width': 		10,
	'eyes_openning': 		11,
	'lips_thickness': 		12,
	'jaw_bone_width': 		13, //Bone size to sides
	'jaw_bone_back_lenght': 14, //Bone size to back
	'chimp_bone_lowering': 	15, //Go Down
	'chimp_bone_lenght': 	16, //Go forward
	'chimp_bone_width': 	17,
	'chimp_hole': 			18,
	'neck_thikness': 		19
};

const head_overlays = {
	'blemishes': 		[0, 0],
	'facial_hair': 		[1, 1],
	'eyebrows': 		[2, 1],
	'ageing': 			[3, 0],
	'makeup': 			[4, 0],
	'blush': 			[5, 2],
	'complexion': 		[6, 0],
	'sun_damage': 		[7, 0],
	'lipstick': 		[8, 2],
	'moles_freckles': 	[9, 0],
	'chest_hair': 		[10, 1],
	'body_blemishes': 	[11, 0],
	'add_body_blemishes':[12, 0]
};

function updateProperty(name, value, curr_props, in_creator) {
	if(value === undefined || value === null)
		return;
	
	const ped = game.playerPedId();
	switch(name) {
		case 'gender':
			switchPlayerModel(value === 'female' ? 1 : 0, false, in_creator);
			break;
		case 'category':
			if(!camera)
				break;
			if(close_camera_categories.includes(value))
				setCameraView(true);
			else
				setCameraView(false);
			break;
		case 'hair_color':
			//alt.log('hair_color:', JSON.stringify(value));
			game.setPedHairColor(ped, value['col1'], value['col2']);
			break;
		case 'skin_color': {
			let fv = curr_props['face_variation'];
			let f_id = fv === undefined ? 0 : (fv['model_id'] || 0);
			let sk = value;
			//alt.log('setting skin color:', f_id, sk);
			game.setPedHeadBlendData(ped, f_id, f_id, f_id,  sk, sk, sk,  0.0, 0.0, 0.0, false);
		}	break;
		default:
			//variation
			if(typeof variations[name] === 'number') {
				let component_id = variations[name];
				if(component_id === 0) {
					let m_id = value['model_id'];
					let sk = curr_props['skin_color'] || 0;
					//alt.log('setting face variation', m_id, sk);
					game.setPedHeadBlendData(ped, 
						m_id, m_id, m_id,  sk, sk, sk,  0.0, 0.0, 0.0, false);
				}
				else
					game.setPedComponentVariation(ped, component_id, 
						value['model_id'], value['texture_id'], 0);
			}
			if(typeof face_features[name] === 'number') 
				game.setPedFaceFeature(ped, face_features[name], value);
			
			//index: number;
			//opacity: number;
			if(head_overlays[name] !== undefined) {
				//alt.log(name, JSON.stringify(value));
				let ii = head_overlays[name];
				game.setPedHeadOverlay(ped, ii[0], 
					value['index'], value['opacity']);
				if(value['color1'] !== undefined || value['color2'] !== undefined)
					game.setPedHeadOverlayColor(ped, ii[0], ii[1], value['color1'], value['color2']);
			}
			break;
	}
}

function refreshProps(props_data) {
	for(let prop in props_data) {//reassign every property to new gender model
    	if(prop !== 'gender' && ignored_properties.indexOf(prop) === -1)
    		updateProperty(prop, props_data[prop], props_data, false);
    }
}

const switchPlayerModel = (gender, keep_face, in_creator) => {
	let sk = current_properties['skin_color'];
	if(gender === 0) {
        //alt.loadModel('mp_m_freemode_01');
        alt.setModel('mp_m_freemode_01');
        
        if(keep_face !== true) {
        	current_properties['face_variation'] = {'model_id': 0, 'texture_id': 0};
	     	alt.setTimeout(() => {
	     		const ped = game.playerPedId();
			 	game.setPedHeadBlendData(ped, 0, 0, 0,  sk, sk, sk, 0.0, 0.0, 0.0, false);

			 	refreshProps(current_properties);
			 	setPlayerPos(real_spawn);

			 	if(in_creator === true)
    				alt.nextTick(createBoard);
			}, 100);
	     }
    } else {
        //alt.loadModel('mp_f_freemode_01');
        alt.setModel('mp_f_freemode_01');
        
        if(keep_face !== true) {
        	current_properties['face_variation'] = {'model_id': 45, 'texture_id': 0};
	        alt.setTimeout(() => {
	        	const ped = game.playerPedId();
			 	game.setPedHeadBlendData(ped, 45, 45, 45,  sk, sk, sk, 0.0, 0.0, 0.0, false);

			 	refreshProps(current_properties);
			 	setPlayerPos(real_spawn);
			 	lockPlayer(true);

			 	if(in_creator === true)
    				alt.nextTick(createBoard);
			}, 100);
	    }
    }
}

function lockPlayer(lock) {
	const ped = game.playerPedId();
	if(lock === true) {
		game.freezeEntityPosition(ped, true);
		game.taskStandStill(ped, 1000 * 30);
		alt.toggleGameControls(false);
		for(let i=0; i<=2; i++)
			game.disableAllControlActions(i);
		if(current_properties['category'] === 'Ubiór')
			boardAnim(true);
		else
			boardAnim(false);
	}
	else {
		game.freezeEntityPosition(ped, false);
		game.taskStandStill(ped, 0);
		alt.toggleGameControls(true);
		for(let i=0; i<=2; i++)
			game.enableAllControlActions(i);
	}
}

function setPlayerPos(pos) {
	const ped = game.playerPedId();
	game.setEntityCoords(ped, pos.x, pos.y, pos.z, 1, 0, 0, 1);
	game.setEntityHeading(ped, pos.heading);
}

function setCameraView(close) {
	if(!camera)
		return;
	if(close) {
		game.setCamCoord(camera, real_spawn.x+0.125, real_spawn.y - 0.55, real_spawn.z + 1.76);
		game.setCamRot(camera, -18, 0, 0, 2);
	}
	else {
		game.setCamCoord(camera, real_spawn.x+0.5, real_spawn.y - 1.75, real_spawn.z + 1.5);
		game.setCamRot(camera, -18, 0, 0, 2);
	}
}

function loadWebView() {
	if(mainView2) {
		mainView2.emit('toogle_display', true);
		alt.emitServer('loginViewLoaded');
		return;
	}
	mainView2 = new alt.WebView('http://resources/game_mode/character_creator_html/index.html');
	mainView2.on('CC_viewLoaded', () => {
		if(!mainView2)
			return;
		hideGui(true);
		alt.showCursor(true);
		mainView2.focus();
		alt.nextTick(() => setCameraView(false));
	});

	mainView2.on('confirmCharacterCreation', (properties) => {
		if(!mainView2)
			return;
		destroyCam(true);
		lockPlayer(false);

		for(let name in current_properties)//override clientside changes
			properties[name] = current_properties[name];

		alt.emitServer('onConfirmCharacterCreation', account_id, JSON.stringify(properties));
		alt.setTimeout(() => game.renderFirstPersonCam(true, 0.0, 1), 1000);
	});

	mainView2.on('characterPropertyChanged', (property_name, value) => {
		if(!mainView2)
			return;
		if(value === undefined || value === null)
			return;
		current_properties[property_name] = value;
		if(ignored_properties.indexOf(property_name) !== -1){
			updateBoardText(current_properties['firstname'], current_properties['surname'],
				current_properties['birth_date']);
			return;
		}
		
		//alt.log(property_name + ' ' + value);
		
		updateProperty(property_name, value, current_properties, true);

		lockPlayer(true);
	});
}

/**************************************************************/

alt.onServer('loadCharacter', (account_data_id, character_properties, character_id) => {
	const ped = game.playerPedId();
	game.setPedDefaultComponentVariation(ped, true);
	game.setPedHeadBlendData(ped, 0, 0, 0,  0, 0, 0, 0.0, 0.0, 0.0, false);
	game.clearAllPedProps(ped);

	game.setEntityCoords(ped, after_spawn.x, after_spawn.y, after_spawn.z, 1, 0, 0, 1);

	character_properties = JSON.parse(character_properties);
	
	if(character_properties['gender'] === 'female')
		alt.setModel('mp_f_freemode_01');
	else
		alt.setModel('mp_m_freemode_01');

	alt.nextTick(() => {
		refreshProps(character_properties);

		moveFromAir(() => {
			closeCreator();
			alt.emitServer('onCharacterLoaded', account_data_id, character_properties, character_id);
			alt.setTimeout(() => {
				game.renderFirstPersonCam(true, 0.0, 1);
			}, 100);
		});
	});
});

function createCam() {
    destroyCam(false);

    //alt.nextTick(() => {
    try {
    	if(camera)
    		game.destroyCam(camera, true);
        camera = game.createCam("DEFAULT_SCRIPTED_CAMERA", true);
        setCameraView(false);
        game.setCamFov(camera, 65);
        game.setCamActive(camera, true);
        game.renderScriptCams(true, false, 0, true, false);
    }
    catch(e) {
    	alt.log('cannot create cam');
    }
    //});
}

function destroyCam(force) {
	try {
		if(!camera) {
			game.destroyAllCams(false);
			return;
		}
	    
	    if(!game.doesCamExist(camera)) return;
	    game.setCamActive(camera, false);
	    game.destroyCam(camera, true);
	    camera = null;
	    
	    game.renderScriptCams(false, true, 0, true, true);
	    if(force === true) {
	    	//game.destroyAllCams(false);
	    	alt.nextTick(() => game.renderFirstPersonCam(true, 0.0, 1));
	    }
	}
	catch(e) {
		alt.log('cannot destroy camera');
	}
}

alt.onServer('cleanUp', (player) => {
	destroyCam(false);
	scaleformHandle = null;
	renderTargetID = -1;
	boardHandle = null;
	boardRenderTargetHandle = null;
});

function showCharacterCreator(account_data_id) {
	game.setPedDefaultComponentVariation(game.playerPedId(), true);
	alt.setModel('mp_m_freemode_01');

	account_id = account_data_id;
	
	let moved = false;
	moveFromAir(() => {
		if(moved) return;
		moved = true;
		showCreator();
	});

	alt.setTimeout(() => {
		if(moved) return;
		moved = true;
		moveFromAir(() => {});
		showCreator();
	}, 12000);
}

alt.onServer('showCharacterCreator', showCharacterCreator);

alt.onServer('showCharacterSelector', (account_data_id, slots, character_datas) => {
	alt.log('selecting character test', account_data_id, slots, character_datas.length);

	let choicerView = new alt.WebView('http://resources/game_mode/character_creator_html/index.html');
	choicerView.on('CC_viewLoaded', () => {
		if(!choicerView)
			return;
		choicerView.focus();
		hideGui(true);
		alt.showCursor(true);
		choicerView.emit('toogle_display', true);
		let character_props = [];
		for(let row of character_datas)
			character_props.push( JSON.parse(decodeURI(row['appearance'])) );
		alt.log('showing choicer');
		alt.nextTick(() => {
			choicerView.emit('show_choicer', slots, character_props);
		});
	});

	choicerView.on('character_choice', (index) => {
		if(!choicerView)
			return;
		alt.log('chosen character index:', index);//index >= character_datas.length means empty slot

		if(index >= character_datas.length) {
			alt.log('Opening character creator');
			choicerView.emit('toogle_display', false);
			choicerView.destroy();
			choicerView = null;
			hideGui(true);
			alt.showCursor(true);
			alt.setTimeout(() => showCharacterCreator(account_data_id), 1);
		}
		else {
			alt.log('Loading chosen character');
			choicerView.emit('toogle_display', false);
			choicerView.destroy();
			choicerView = null;
			hideGui(false);
			alt.showCursor(false);
			destroyCam(true);
			alt.emitServer( 'onCharacterChosen', account_data_id, 
				decodeURI(character_datas[index]['appearance']), character_datas[index]['id'] );
		}
	});
});

alt.onServer('closeCharacterCreator', (account_id, properties, character_id) => {
	closeCreator();
	alt.emitServer('onCharacterCreatorClosed', account_id, properties, character_id);
});

var scaleformHandle = null;
var renderTargetID = -1;
var boardHandle = null;
var boardRenderTargetHandle = null;
alt.on('update', () => {
	if(scaleformHandle === null)
		return;
    if (game.hasScaleformMovieLoaded(scaleformHandle) && renderTargetID !== -1){
        game.setTextRenderId(renderTargetID);
        game.drawScaleformMovie(scaleformHandle, 0.405, 0.37, 0.81, 0.74, 255, 255, 255, 255);
        game.setTextRenderId(1);
    }
});

function updateBoardText(firstname, surname, birthdate) {
	if(scaleformHandle === null)
		return;
	//alt.log('update board text', firstname, surname, birthdate);
	game.beginScaleformMovieMethod(scaleformHandle, "SET_BOARD");
	game.addScaleformMovieMethodParameterString('');
	game.addScaleformMovieMethodParameterString(
		(firstname||'') + ' ' + (surname||'')
	);
	game.addScaleformMovieMethodParameterString(birthdate || '');
	game.addScaleformMovieMethodParameterString("Obywatel");
	game.addScaleformMovieMethodParameterInt(0);
	//if (rank > -1) game.addScaleformMovieMethodParameterInt(rank);
	game.endScaleformMovieMethod();
}

function createBoard() {
	scaleformHandle = game.requestScaleformMovie("mugshot_board_01");

	var boardModel = -1623189257;
	if(boardHandle !== null)
		game.deleteObject(boardHandle);
	if(boardRenderTargetHandle !== null)
		game.deleteObject(boardRenderTargetHandle);

	// rendertarget variables
	var renderTargetName = "ID_Text";
	var renderTargetModel = -955488312;
	//renderTargetID = -1;

	game.callScaleformMovieFunctionMixedParams(scaleformHandle, "SET_BOARD", "Title", "Middle", "Bottom", "Top", 0, 6);

	let offset = {x: 0, y: 0, z: 0};

	//create and attach objects
	const ped = game.playerPedId();
	boardHandle = game.createObject(boardModel, real_spawn.x, real_spawn.y, real_spawn.z, false, false, false);
	game.attachEntityToEntity(boardHandle, ped, game.getPedBoneIndex(ped, 28422), offset.x, offset.y, offset.z, 0.0, 0.0, 0.0, false, false, false, -1, false);

	boardRenderTargetHandle = game.createObject(renderTargetModel, real_spawn.x, real_spawn.y, real_spawn.z, false, false, false);
	game.attachEntityToEntity(boardRenderTargetHandle, ped, game.getPedBoneIndex(ped, 28422), offset.x, offset.y, offset.z, 0.0, 0.0, 0.0, false, false, false, -1, false);


	// register & link the rendertarget
	game.registerNamedRendertarget(renderTargetName);
	game.linkNamedRendertarget(renderTargetModel);
	renderTargetID = game.getNamedRendertargetRenderId(renderTargetName);

	alt.nextTick(() => updateBoardText(current_properties['firstname'], current_properties['surname'],
		current_properties['birth_date']));

	boardAnim();
}

function boardAnim(stop = false) {
	let anim = 'mp_character_creation@lineup@male_a';

	if(stop) {
		game.clearPedTasks(game.playerPedId());
		//game.stopAnimTask(game.playerPedId(), anim, false);
		return;
	}
	//holding box animation
	
	game.requestAnimDict(anim);

	function checkLoaded() {
		if(game.hasAnimDictLoaded(anim))
			game.taskPlayAnim(game.playerPedId(), anim, 'loop', 8.0, 0.0, 10**9, 9, 0, 0, 0, 0);
		else
			alt.setTimeout(checkLoaded, 400);
	}
	checkLoaded();
}

function showCreator() {
	hideGui(true);
	alt.showCursor(true);

	destroyCam(false);
	alt.nextTick(() => {
		createCam();
		loadWebView();
	});

	const ped = game.playerPedId();
	game.clearAllPedProps(ped);
	game.setPedHeadBlendData(ped, 0, 0, 0,  0, 0, 0, 0.0, 0.0, 0.0, false);

	//place player at some proper position
	setPlayerPos(real_spawn);
	lockPlayer(true);

	createBoard();
}

function closeCreator() {
	if(mainView2) {
		mainView2.emit('toogle_display', false);
		mainView2.destroy();
		mainView2 = null;
	}
	hideGui(false);
	alt.showCursor(false);
	lockPlayer(false);
	game.clearPedTasks(game.playerPedId());

	alt.log('closing creator');
	const ped = game.playerPedId();
	game.setEntityCoords(ped, after_spawn.x, after_spawn.y, after_spawn.z, 1, 0, 0, 1);
	game.setEntityHeading(ped, 0);

	destroyCam(true);
	if(boardHandle !== null) {
		game.detachEntity(boardHandle, false, false);
		game.deleteObject(boardHandle);
		boardHandle = null;
	}
	if(boardRenderTargetHandle !== null) {
		game.detachEntity(boardRenderTargetHandle, false, false);
		game.deleteObject(boardRenderTargetHandle);
		boardRenderTargetHandle = null;
	}
	scaleformHandle = null;
	renderTargetID = -1;
}

function hideGui(toogle) {
    game.displayHud(!toogle);
    alt.toggleGameControls(!toogle);
    game.displayRadar(!toogle);
}

function checkCamInAir(callback) {
    if (game.isPlayerSwitchInProgress()) {
        alt.setTimeout(() => {
            checkCamInAir(callback);
        }, 400);
    } else if(typeof callback === 'function')
        callback();
}

function moveFromAir(callback) {  
	const ped = game.playerPedId();
	game.switchInPlayer(ped);
    alt.nextTick(() => checkCamInAir(callback));
}
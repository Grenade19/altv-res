import alt from 'alt'

const weapons = [
  "WEAPON_KNIFE", "WEAPON_KNUCKLE", "WEAPON_NIGHTSTICK", "WEAPON_HAMMER", "WEAPON_BAT", "WEAPON_GOLFCLUB", "WEAPON_CROWBAR", "WEAPON_BOTTLE", "WEAPON_DAGGER", "WEAPON_HATCHET", "WEAPON_MACHETE", "WEAPON_FLASHLIGHT", "WEAPON_SWITCHBLADE" , "WEAPON_POOLCUE", "WEAPON_WRENCH",
  "WEAPON_PISTOL", "WEAPON_COMBATPISTOL", "WEAPON_APPISTOL", "WEAPON_PISTOL50", "WEAPON_SNSPISTOL", "WEAPON_HEAVYPISTOL", "WEAPON_VINTAGEPISTOL", "WEAPON_STUNGUN", "WEAPON_FLAREGUN", "WEAPON_MARKSMANPISTOL", "WEAPON_REVOLVER",
  "WEAPON_MICROSMG", "WEAPON_SMG", "WEAPON_ASSAULTSMG", "WEAPON_MG", "WEAPON_COMBATMG", "WEAPON_COMBATPDW", "WEAPON_GUSENBERG", "WEAPON_MACHINEPISTOL",
  "WEAPON_ASSAULTRIFLE", "WEAPON_CARBINERIFLE", "WEAPON_ADVANCEDRIFLE", "WEAPON_SPECIALCARBINE", "WEAPON_BULLPUPRIFLE", "WEAPON_COMPACTRIFLE",
  "WEAPON_SNIPERRIFLE", "WEAPON_HEAVYSNIPER", "WEAPON_MARKSMANRIFLE",
  "WEAPON_FIREWORK",
  "WEAPON_GRENADE", "WEAPON_BZGAS", "WEAPON_SMOKEGRENADE", "WEAPON_MOLOTOV", "WEAPON_PETROLCAN", "WEAPON_SNOWBALL", "WEAPON_FLARE", "WEAPON_BALL", "WEAPON_PIPEBOMB",
  "WEAPON_PUMPSHOTGUN", "WEAPON_SAWNOFFSHOTGUN", "WEAPON_ASSAULTSHOTGUN", "WEAPON_BULLPUPSHOTGUN"
];


let driftEnabled = false;

function switchDrift(state) {
  if (driftEnabled != state) {
    let ped = alt.PlayerPedId();

    if (alt.IsPedInAnyVehicle(ped)) {
      let veh = alt.GetVehiclePedIsUsing(alt.PlayerPedId());

      alt.SetVehicleReduceGrip(veh, state);
    }

    driftEnabled = state;
  }
}

function giveWeapons() {
  let ped = alt.PlayerPedId();

  for (const weapon of weapons) {
    alt.GiveWeaponToPed(ped, alt.GetHashKey(weapon), 9999, false, false);
  }
}

let engineMod = -1;

function tuneVehicle() {
  let ped = alt.PlayerPedId();

  if (alt.IsPedInAnyVehicle(ped)) {
    let veh = alt.GetVehiclePedIsUsing(alt.PlayerPedId());

    if (engineMod == -1) {
      engineMod = 0;
      alt.SetVehicleModKit(veh, 0);
    } else {
      alt.SetVehicleMod(veh, 11, engineMod++, true);
    }
  }
}

alt.on('keydown', (key) => {
  if (key === 0x10) {
    switchDrift(true);
  }
})

function generateRandomNumber(min_value , max_value) 
{
    return Math.random() * (max_value-min_value) + min_value ;
} 

let myVeh = null;
let myPeds = [];

let drift_vehs = ["FUTO", "ELEGY2", "COMET2", "SULTANRS", "FELTZER", "TAMPA2", "KURUMA", "POLICE2"];

alt.on('keyup', (key) => {
  if (key === 0x10) {
    // let cam = alt.CreateCam("DEFAULT_SCRIPTED_CAMERA", false);
    // alt.LoadScene(2226.316, 1672.03, 82.85455);
    // alt.SetEntityCoordsNoOffset(alt.PlayerPedId(), 2226.316, 1672.03, 82.85455, false, false, false);
    // alt.SetCamCoord(cam, 2427.636, 1251.201, 198.1247);
    // alt.PointCamAtCoord(cam, 2226.316, 1672.03, 82.85455);
    // alt.SetCamActive(cam, true);
    // alt.RenderScriptCams(true, false, 0, true, false);
    switchDrift(false);
  //} else if (key === 0x60) {
  //  repairCar()
  } else if (key === 0x11) {
    //giveWeapons();



    let LocalPlayerPos = alt.GetEntityCoords(alt.PlayerPedId(),true)
     LocalPlayerPos.x += generateRandomNumber(5 , 10);
     LocalPlayerPos.y += generateRandomNumber(5 , 10);

	let randomPed = alt.CreateRandomPed(LocalPlayerPos.x, LocalPlayerPos.y, LocalPlayerPos.z)

    for (const weapon of weapons) {
      alt.GiveWeaponToPed(randomPed, alt.GetHashKey(weapon), 9999, false, false);
    }

    alt.log(myPeds);
    myPeds.push(randomPed);
  }
  else if (key == 0x12) {

    if(myPeds.length > 0) {
      alt.DeletePed(myPeds.pop());
      alt.log(myPeds);
    }

    if(myVeh == null) {
   	let LocalPlayerPos = alt.GetEntityCoords(alt.PlayerPedId(),true)
     LocalPlayerPos.x += generateRandomNumber(5 , 10);
     LocalPlayerPos.y += generateRandomNumber(5 , 10);

    alt.loadModel(alt.GetHashKey('m2'));
    myVeh = alt.CreateVehicle(alt.GetHashKey('m2'), LocalPlayerPos.x, LocalPlayerPos.y, LocalPlayerPos.z, 0, false, false);


    alt.SetVehicleNumberPlateText(myVeh, "Grenade");
    alt.SetPedIntoVehicle(alt.PlayerPedId(), myVeh, -1);

	}
	else {
		alt.DeleteVehicle(myVeh);
		
		myVeh = null;
	}

  }
})

alt.onServer('changeskin', (idx) => {
  let skin = {
    drawable: []
  };

  switch (idx) {
    case 1:
      skin = {
        drawable: [31, 0, 2, 15, 62, 0, 13, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        texture: [0, 0, 1, 0, 2, 0, 3, 0, 240, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
      break
    case 2:
      skin = {
        drawable: [21, 0, 11, 31, 34, 0, 0, 0, 3, 0, 0, 48, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        texture: [0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
      break
    case 3:
      skin = {
        drawable: [21, 0, 11, 31, 5, 0, 0, 0, 3, 0, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        texture: [0, 0, 3, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      };
      break
  }

  alt.SetPedComponentVariation(alt.PlayerPedId(), 11, 0, 240, 0);
  alt.SetPedComponentVariation(alt.PlayerPedId(), 8, 0, 240, 0);

  for (let i in skin.drawable) {
    alt.SetPedComponentVariation(alt.PlayerPedId(), i, skin.drawable[i], skin.texture[i], 0);
  }
})

alt.onServer('ipl', (state, name) => {
  if (state) {
    alt.RequestIpl(name);
  } else {
    alt.RemoveIpl(name);
  }
})

alt.RequestIpl('chop_props');
alt.RequestIpl('FIBlobby');
alt.RemoveIpl('FIBlobbyfake');
alt.RequestIpl('FBI_colPLUG');
alt.RequestIpl('FBI_repair');
alt.RequestIpl('v_tunnel_hole');
alt.RequestIpl('TrevorsMP');
alt.RequestIpl('TrevorsTrailer');
alt.RequestIpl('TrevorsTrailerTidy');
alt.RemoveIpl('farm_burnt');
alt.RemoveIpl('farm_burnt_lod');
alt.RemoveIpl('farm_burnt_props');
alt.RemoveIpl('farmint_cap');
alt.RemoveIpl('farmint_cap_lod');
alt.RequestIpl('farm');
alt.RequestIpl('farmint');
alt.RequestIpl('farm_lod');
alt.RequestIpl('farm_props');
alt.RequestIpl('facelobby');
alt.RemoveIpl('CS1_02_cf_offmission');
alt.RequestIpl('CS1_02_cf_onmission1');
alt.RequestIpl('CS1_02_cf_onmission2');
alt.RequestIpl('CS1_02_cf_onmission3');
alt.RequestIpl('CS1_02_cf_onmission4');
alt.RequestIpl('v_rockclub');
alt.RequestIpl('v_janitor');
alt.RemoveIpl('hei_bi_hw1_13_door');
alt.RequestIpl('bkr_bi_hw1_13_int');
alt.RequestIpl('ufo');
alt.RequestIpl('ufo_lod');
alt.RequestIpl('ufo_eye');
alt.RemoveIpl('v_carshowroom');
alt.RemoveIpl('shutter_open');
alt.RemoveIpl('shutter_closed');
alt.RemoveIpl('shr_int');
alt.RequestIpl('csr_afterMission');
alt.RequestIpl('v_carshowroom');
alt.RequestIpl('shr_int');
alt.RequestIpl('shutter_closed');
alt.RequestIpl('smboat');
alt.RequestIpl('smboat_distantlights');
alt.RequestIpl('smboat_lod');
alt.RequestIpl('smboat_lodlights');
alt.RequestIpl('cargoship');
alt.RequestIpl('railing_start');
alt.RemoveIpl('sp1_10_fake_interior');
alt.RemoveIpl('sp1_10_fake_interior_lod');
alt.RequestIpl('sp1_10_real_interior');
alt.RequestIpl('sp1_10_real_interior_lod');
alt.RemoveIpl('id2_14_during_door');
alt.RemoveIpl('id2_14_during1');
alt.RemoveIpl('id2_14_during2');
alt.RemoveIpl('id2_14_on_fire');
alt.RemoveIpl('id2_14_post_no_int');
alt.RemoveIpl('id2_14_pre_no_int');
alt.RemoveIpl('id2_14_during_door');
alt.RequestIpl('id2_14_during1');
alt.RemoveIpl('Coroner_Int_off');
alt.RequestIpl('coronertrash');
alt.RequestIpl('Coroner_Int_on');
alt.RemoveIpl('bh1_16_refurb');
alt.RemoveIpl('jewel2fake');
alt.RemoveIpl('bh1_16_doors_shut');
alt.RequestIpl('refit_unload');
alt.RequestIpl('post_hiest_unload');
alt.RequestIpl('Carwash_with_spinners');
alt.RequestIpl('KT_CarWash');
alt.RequestIpl('ferris_finale_Anim');
alt.RemoveIpl('ch1_02_closed');
alt.RequestIpl('ch1_02_open');
alt.RequestIpl('AP1_04_TriAf01');
alt.RequestIpl('CS2_06_TriAf02');
alt.RequestIpl('CS4_04_TriAf03');
alt.RemoveIpl('scafstartimap');
alt.RequestIpl('scafendimap');
alt.RemoveIpl('DT1_05_HC_REMOVE');
alt.RequestIpl('DT1_05_HC_REQ');
alt.RequestIpl('DT1_05_REQUEST');
alt.RequestIpl('FINBANK');
alt.RemoveIpl('DT1_03_Shutter');
alt.RemoveIpl('DT1_03_Gr_Closed');
alt.RequestIpl('golfflags');
alt.RequestIpl('airfield');
alt.RequestIpl('v_garages');
alt.RequestIpl('v_foundry');
alt.RequestIpl('hei_yacht_heist');
alt.RequestIpl('hei_yacht_heist_Bar');
alt.RequestIpl('hei_yacht_heist_Bedrm');
alt.RequestIpl('hei_yacht_heist_Bridge');
alt.RequestIpl('hei_yacht_heist_DistantLights');
alt.RequestIpl('hei_yacht_heist_enginrm');
alt.RequestIpl('hei_yacht_heist_LODLights');
alt.RequestIpl('hei_yacht_heist_Lounge');
alt.RequestIpl('hei_carrier');
alt.RequestIpl('hei_Carrier_int1');
alt.RequestIpl('hei_Carrier_int2');
alt.RequestIpl('hei_Carrier_int3');
alt.RequestIpl('hei_Carrier_int4');
alt.RequestIpl('hei_Carrier_int5');
alt.RequestIpl('hei_Carrier_int6');
alt.RequestIpl('hei_carrier_LODLights');
alt.RequestIpl('bkr_bi_id1_23_door');
alt.RequestIpl('lr_cs6_08_grave_closed');
alt.RequestIpl('hei_sm_16_interior_v_bahama_milo_');
alt.RequestIpl('CS3_07_MPGates');
alt.RequestIpl('cs5_4_trains');
alt.RequestIpl('v_lesters');
alt.RequestIpl('v_trevors');
alt.RequestIpl('v_michael');
alt.RequestIpl('v_comedy');
alt.RequestIpl('v_cinema');
alt.RequestIpl('V_Sweat');
alt.RequestIpl('V_35_Fireman');
alt.RequestIpl('redCarpet');
alt.RequestIpl('triathlon2_VBprops');
alt.RequestIpl('jetstealtunnel');
alt.RequestIpl('Jetsteal_ipl_grp1');
alt.RequestIpl('v_hospital');
alt.RemoveIpl('RC12B_Default');
alt.RemoveIpl('RC12B_Fixed');
alt.RequestIpl('RC12B_Destroyed');
alt.RequestIpl('RC12B_HospitalInterior');
alt.RequestIpl('canyonriver01');

// ======================================================
// SURPLUS-TO-SHELTER API
// FINAL VERSION
// ======================================================


// ======================================================
// SETTINGS
// ======================================================

const USE_FAKE = false;

const BASE =
  "http://127.0.0.1:5000";

const API_BASE =
  BASE;


// ======================================================
// STATUS CONSTANTS
// ======================================================

const S = {

  MATCHED:
    "matched",

  ACCEPTED:
    "accepted",

  PICKED_UP:
    "picked_up",

  DELIVERED:
    "delivered",

  REJECTED:
    "rejected",

  POSTED:
    "posted",

  EXPIRED:
    "expired"

};


// ======================================================
// FAKE DATA
// Only used if USE_FAKE = true
// ======================================================

const FAKE_ORGS = [

  {
    id:1,
    name:"Hope Shelter",
    address:"Malviya Nagar, Jaipur",
    lat:26.8560,
    lng:75.8130,
    capacity_portions:60,
    need_level:3
  },

  {
    id:2,
    name:"Asha Kiran Food Bank",
    address:"Mansarovar, Jaipur",
    lat:26.8500,
    lng:75.7600,
    capacity_portions:80,
    need_level:2
  },

  {
    id:3,
    name:"Seva Sadan",
    address:"Raja Park, Jaipur",
    lat:26.9030,
    lng:75.8330,
    capacity_portions:40,
    need_level:3
  }

];


// ======================================================
// LOCAL FAKE STORAGE
// ======================================================

const load = () => {

  try {

    return JSON.parse(
      localStorage.getItem(
        "donations"
      )
      ||
      "[]"
    );

  }
  catch(error){

    return [];

  }

};


const save = data => {

  localStorage.setItem(
    "donations",
    JSON.stringify(
      data
    )
  );

};


// ======================================================
// DISTANCE HELPER
// ======================================================

function km(
  lat1,
  lng1,
  lat2,
  lng2
){

  const toRad =
    value =>
      value
      *
      Math.PI
      /
      180;


  const deltaLat =
    toRad(
      lat2 - lat1
    );


  const deltaLng =
    toRad(
      lng2 - lng1
    );


  const a =

    Math.sin(
      deltaLat / 2
    ) ** 2

    +

    Math.cos(
      toRad(lat1)
    )

    *

    Math.cos(
      toRad(lat2)
    )

    *

    Math.sin(
      deltaLng / 2
    ) ** 2;


  return (

    6371
    *
    2
    *
    Math.asin(
      Math.sqrt(a)
    )

  );

}


// ======================================================
// MAIN API CALL
//
// IMPORTANT:
// credentials:"include"
// keeps Flask login session working.
// ======================================================

async function call(
  path,
  opts = {}
){

  const response =
    await fetch(

      BASE + path,

      {
        ...opts,

        credentials:
          "include"
      }

    );


  let data = {};


  try {

    data =
      await response.json();

  }
  catch(error){

    data = {};

  }


  if(
    !response.ok
  ){

    throw new Error(

      data.error
      ||
      data.message
      ||
      `Request failed (${response.status})`

    );

  }


  return data;

}


// ======================================================
// POST HELPER
// ======================================================

const post =
body => ({

  method:
    "POST",

  headers:{
    "Content-Type":
      "application/json"
  },

  body:
    JSON.stringify(
      body
    )

});


// ======================================================
// GET SHELTERS
// ======================================================

async function getOrgs(){

  if(
    USE_FAKE
  ){

    return FAKE_ORGS;

  }


  return call(
    "/api/orgs"
  );

}


// ======================================================
// CREATE DONATION
// ======================================================

async function postDonation(
  donation
){

  if(
    USE_FAKE
  ){

    const eligible =
      FAKE_ORGS

      .filter(
        org =>
          Number(
            org.capacity_portions
          )
          >=
          Number(
            donation.quantity_portions
          )
      )

      .map(
        org => ({

          org,

          distance:
            km(
              donation.lat,
              donation.lng,
              org.lat,
              org.lng
            )

        })
      )

      .sort(
        (a,b) =>
          a.distance
          -
          b.distance
      );


    const best =
      eligible[0];


    const record = {

      ...donation,

      id:
        Date.now(),

      created_at:
        localISO(
          new Date()
        ),

      status:
        best
        ?
        S.MATCHED
        :
        S.POSTED,

      matched_org_id:
        best
        ?
        best.org.id
        :
        null,

      matched_org_name:
        best
        ?
        best.org.name
        :
        null,

      matched_org_need_level:
        best
        ?
        best.org.need_level
        :
        null,

      distance_km:
        best
        ?
        Number(
          best.distance.toFixed(1)
        )
        :
        null

    };


    save([
      ...load(),
      record
    ]);


    return record;

  }


  return call(
    "/api/donations",
    post(
      donation
    )
  );

}


// ======================================================
// GET DONATIONS
// orgId optional
// ======================================================

async function getDonations(
  orgId
){

  if(
    USE_FAKE
  ){

    const items =
      load();


    if(
      !orgId
    ){

      return items;

    }


    return items.filter(
      donation =>
        String(
          donation.matched_org_id
        )
        ===
        String(
          orgId
        )
    );

  }


  let path =
    "/api/donations";


  if(
    orgId
  ){

    path +=
      "?org_id="
      +
      encodeURIComponent(
        orgId
      );

  }


  return call(
    path
  );

}


// ======================================================
// STATUS UPDATE
// ======================================================

async function setStatus(
  id,
  status
){

  if(
    USE_FAKE
  ){

    const updated =
      load().map(
        donation =>
          donation.id === id

          ?

          {
            ...donation,
            status
          }

          :

          donation
      );


    save(
      updated
    );


    return {
      id,
      status
    };

  }


  return call(

    `/api/donations/${id}/status`,

    post({
      status
    })

  );

}


// ======================================================
// UPDATE SHELTER NEED
// ======================================================

async function updateOrgNeed(
  orgId,
  needLevel
){

  return call(

    `/api/orgs/${orgId}/need`,

    post({

      need_level:
        Number(
          needLevel
        )

    })

  );

}


// ======================================================
// STATS
// ======================================================

async function getStats(){

  return call(
    "/api/stats"
  );

}


// ======================================================
// NOTIFICATIONS
// ======================================================

async function getNotifications(
  limit = 50
){

  return call(

    `/api/notifications?limit=${encodeURIComponent(limit)}`

  );

}


async function markNotificationRead(
  notificationId
){

  return call(

    `/api/notifications/${notificationId}/read`,

    post({})

  );

}


async function markAllNotificationsRead(){

  return call(

    "/api/notifications/read-all",

    post({})

  );

}


// ======================================================
// LIVE DRIVER LOCATION
// ======================================================

async function updateDriverLocation(
  lat,
  lng
){

  return call(

    "/api/driver/location",

    post({

      lat:
        Number(lat),

      lng:
        Number(lng)

    })

  );

}


async function getDriverLocation(){

  return call(
    "/api/driver/location"
  );

}


// ======================================================
// OPTIMIZED ROUTE
// ======================================================

async function getOptimizedRoute(
  donationId,
  driverLat,
  driverLng
){

  let path =
    `/api/route/${donationId}`;


  if(
    driverLat !== undefined
    &&
    driverLng !== undefined
  ){

    path +=

      `?driver_lat=${encodeURIComponent(driverLat)}`

      +

      `&driver_lng=${encodeURIComponent(driverLng)}`;

  }


  return call(
    path
  );

}


// ======================================================
// LOCAL DATE FORMAT
// Example:
// 2026-09-25T03:40:00
// ======================================================

function localISO(
  date
){

  const pad =
    number =>
      String(
        number
      )
      .padStart(
        2,
        "0"
      );


  return (

    `${date.getFullYear()}-`

    +

    `${pad(
      date.getMonth() + 1
    )}-`

    +

    `${pad(
      date.getDate()
    )}T`

    +

    `${pad(
      date.getHours()
    )}:`

    +

    `${pad(
      date.getMinutes()
    )}:`

    +

    `${pad(
      date.getSeconds()
    )}`

  );

}


// ======================================================
// MINUTES UNTIL EXPIRY
// ======================================================

function minutesUntilExpiry(
  expiresAt
){

  const expiry =
    new Date(
      expiresAt
    ).getTime();


  if(
    !Number.isFinite(
      expiry
    )
  ){

    return 0;

  }


  return Math.ceil(

    (
      expiry
      -
      Date.now()
    )

    /

    60000

  );

}


// ======================================================
// OLD TIME LEFT HELPER
// Used by older pages
// ======================================================

function timeLeft(
  expiresAt
){

  const minutes =
    minutesUntilExpiry(
      expiresAt
    );


  if(
    minutes <= 0
  ){

    return {

      text:
        "Expired",

      cls:
        "bad"

    };

  }


  const text =

    minutes >= 60

    ?

    `${Math.floor(minutes / 60)}h ${minutes % 60}m left`

    :

    `${minutes}m left`;


  let cls = "";


  if(
    minutes < 45
  ){

    cls =
      "bad";

  }
  else if(
    minutes < 120
  ){

    cls =
      "warn";

  }


  return {
    text,
    cls
  };

}


// ======================================================
// FOOD EXPIRY RISK
//
// Used by new driver.html
// ======================================================

function riskInfo(
  expiresAt
){

  const minutes =
    minutesUntilExpiry(
      expiresAt
    );


  if(
    minutes <= 0
  ){

    return {

      level:
        "EXPIRED",

      cls:
        "risk-expired",

      icon:
        "⚫",

      minutes

    };

  }


  if(
    minutes < 30
  ){

    return {

      level:
        "CRITICAL",

      cls:
        "risk-critical",

      icon:
        "🚨",

      minutes

    };

  }


  if(
    minutes < 60
  ){

    return {

      level:
        "HIGH",

      cls:
        "risk-high",

      icon:
        "🔥",

      minutes

    };

  }


  if(
    minutes < 120
  ){

    return {

      level:
        "MEDIUM",

      cls:
        "risk-medium",

      icon:
        "⚠️",

      minutes

    };

  }


  return {

    level:
      "LOW",

    cls:
      "risk-low",

    icon:
      "✅",

    minutes

  };

}


// ======================================================
// PRIORITY SCORE
//
// Higher score = higher urgency
// Used for Driver rescue queue.
// ======================================================

function priorityScore(
  expiresAt
){

  const minutes =
    minutesUntilExpiry(
      expiresAt
    );


  if(
    minutes <= 0
  ){

    return 100;

  }


  if(
    minutes < 30
  ){

    return 90;

  }


  if(
    minutes < 60
  ){

    return 70;

  }


  if(
    minutes < 120
  ){

    return 50;

  }


  return 20;

}


// ======================================================
// BASIC NAVBAR HELPER
// Old pages compatibility
// ======================================================

function navbar(
  active
){

  const links = [

    [
      "donor.html",
      "Donate food"
    ],

    [
      "shelter.html",
      "Shelter"
    ],

    [
      "driver.html",
      "Driver"
    ],

    [
      "dashboard.html",
      "Impact"
    ]

  ];


  document.write(

    `<nav>
      <b>Surplus-to-Shelter</b>

      ${
        links.map(
          ([href,text]) =>
            `
            <a
              href="${href}"
              class="${href === active ? "on" : ""}">
              ${text}
            </a>
            `
        )
        .join("")
      }

    </nav>`

  );

}
from datetime import datetime, timedelta
from functools import wraps
import json
import math
import os
import sqlite3
from urllib.request import urlopen
from urllib.error import URLError, HTTPError

from flask import Flask, jsonify, request, session
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)


# =========================================================
# APP / SESSION CONFIG
# =========================================================

app.secret_key = os.environ.get(
    "SECRET_KEY",
    "surplus-to-shelter-hackathon-secret"
)

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False,
    PERMANENT_SESSION_LIFETIME=timedelta(days=7),
)


DB_PATH = "donations.db"

AVG_SPEED_KMPH = 25
SAFETY_BUFFER_MIN = 15

KG_PER_PORTION = 0.4
CO2E_PER_KG = 2.5

OSRM_BASE_URL = os.environ.get(
    "OSRM_BASE_URL",
    "https://router.project-osrm.org"
)


# =========================================================
# USER ROLES
# =========================================================

ALLOWED_ROLES = {
    "donor",
    "driver",
    "shelter",
}


# =========================================================
# DEMO SHELTERS
# =========================================================

SEED_ORGS = [
    ("Hope Shelter", "Malviya Nagar, Jaipur", 26.8560, 75.8130, 60, 3),
    ("Asha Kiran Food Bank", "Mansarovar, Jaipur", 26.8500, 75.7600, 80, 2),
    ("Seva Sadan", "Raja Park, Jaipur", 26.9030, 75.8330, 40, 3),
    ("Anna Daan Kendra", "Bani Park, Jaipur", 26.9310, 75.7930, 50, 2),
    ("Sahara Night Shelter", "Sindhi Camp, Jaipur", 26.9195, 75.7995, 35, 3),
    ("Jyoti Children's Home", "Vaishali Nagar, Jaipur", 26.9100, 75.7300, 30, 2),
    ("Karuna Community Kitchen", "Jagatpura, Jaipur", 26.8270, 75.8590, 100, 1),
    ("Amar Ashray Old-Age Home", "Amer Road, Jaipur", 26.9535, 75.8420, 25, 3),
]


DEFAULT_NEED_LEVELS = {
    "Hope Shelter": 3,
    "Asha Kiran Food Bank": 2,
    "Seva Sadan": 3,
    "Anna Daan Kendra": 2,
    "Sahara Night Shelter": 3,
    "Jyoti Children's Home": 2,
    "Karuna Community Kitchen": 1,
    "Amar Ashray Old-Age Home": 3,
}


# =========================================================
# STATUS FLOW
# =========================================================

TRANSITIONS = {
    "matched": {"accepted"},
    "accepted": {"picked_up"},
    "picked_up": {"delivered"},
}


# =========================================================
# COMMON DONATION SELECT
# =========================================================

DONATION_SELECT = """
SELECT
    d.id,
    d.donor_name,
    d.donor_user_id,
    d.food_description,
    d.quantity_portions,
    d.pickup_address,
    d.lat,
    d.lng,
    d.expires_at,
    d.status,
    d.matched_org_id,
    o.name AS matched_org_name,
    o.need_level AS matched_org_need_level,
    d.distance_km,
    d.created_at,
    d.driver_name,
    d.match_score,
    d.eta_minutes,
    d.safety_margin_min,
    d.rejected_org_ids
FROM donations d
LEFT JOIN orgs o
    ON o.id = d.matched_org_id
"""


# =========================================================
# DATABASE
# =========================================================

def get_db():

    conn = sqlite3.connect(DB_PATH)

    conn.row_factory = sqlite3.Row

    return conn


def ensure_columns(conn, table, columns):

    existing = {
        row["name"]
        for row in conn.execute(
            f"PRAGMA table_info({table})"
        )
    }

    for name, declaration in columns.items():

        if name not in existing:

            conn.execute(
                f"""
                ALTER TABLE {table}
                ADD COLUMN {name} {declaration}
                """
            )


def init_db():

    conn = get_db()


    # =====================================================
    # USERS
    # =====================================================

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )


    # =====================================================
    # SHELTERS
    # =====================================================

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS orgs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            address TEXT,
            lat REAL,
            lng REAL,
            capacity_portions INTEGER,
            need_level INTEGER DEFAULT 2
        )
        """
    )


    # =====================================================
    # DONATIONS
    # =====================================================

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS donations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donor_name TEXT,
            donor_user_id INTEGER,
            food_description TEXT,
            quantity_portions INTEGER,
            pickup_address TEXT,
            lat REAL,
            lng REAL,
            expires_at TEXT,
            status TEXT,
            matched_org_id INTEGER,
            distance_km REAL,
            created_at TEXT,
            driver_name TEXT,
            match_score REAL,
            eta_minutes INTEGER,
            safety_margin_min INTEGER,
            rejected_org_ids TEXT
        )
        """
    )


    # =====================================================
    # NOTIFICATIONS
    # =====================================================

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            donation_id INTEGER,
            audience TEXT,
            event_type TEXT,
            title TEXT,
            message TEXT,
            created_at TEXT,
            is_read INTEGER DEFAULT 0
        )
        """
    )


    # =====================================================
    # LIVE DRIVER LOCATION
    # One latest location per driver.
    # =====================================================

    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS driver_locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            driver_user_id INTEGER NOT NULL UNIQUE,
            driver_name TEXT,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            updated_at TEXT NOT NULL
        )
        """
    )


    ensure_columns(
        conn,
        "orgs",
        {
            "address": "TEXT",
            "lat": "REAL",
            "lng": "REAL",
            "capacity_portions": "INTEGER",
            "need_level": "INTEGER DEFAULT 2",
        },
    )


    ensure_columns(
        conn,
        "donations",
        {
            "donor_user_id": "INTEGER",
            "matched_org_id": "INTEGER",
            "distance_km": "REAL",
            "driver_name": "TEXT",
            "match_score": "REAL",
            "eta_minutes": "INTEGER",
            "safety_margin_min": "INTEGER",
            "rejected_org_ids": "TEXT",
        },
    )


    ensure_columns(
        conn,
        "notifications",
        {
            "donation_id": "INTEGER",
            "audience": "TEXT",
            "event_type": "TEXT",
            "title": "TEXT",
            "message": "TEXT",
            "created_at": "TEXT",
            "is_read": "INTEGER DEFAULT 0",
        },
    )


    if conn.execute(
        "SELECT COUNT(*) FROM orgs"
    ).fetchone()[0] == 0:

        conn.executemany(
            """
            INSERT INTO orgs (
                name,
                address,
                lat,
                lng,
                capacity_portions,
                need_level
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            SEED_ORGS,
        )


    for org_name, level in DEFAULT_NEED_LEVELS.items():

        conn.execute(
            """
            UPDATE orgs

            SET need_level = ?

            WHERE name = ?

            AND (
                need_level IS NULL
                OR
                need_level NOT BETWEEN 1 AND 3
            )
            """,
            (
                level,
                org_name,
            ),
        )


    conn.execute(
        """
        UPDATE orgs

        SET need_level = 2

        WHERE
            need_level IS NULL
            OR
            need_level NOT BETWEEN 1 AND 3
        """
    )


    conn.commit()

    conn.close()


# =========================================================
# CORS
# =========================================================

@app.after_request
def add_cors_headers(response):

    origin = request.headers.get(
        "Origin"
    )

    if origin:

        response.headers[
            "Access-Control-Allow-Origin"
        ] = origin

        response.headers[
            "Vary"
        ] = "Origin"


    response.headers[
        "Access-Control-Allow-Credentials"
    ] = "true"


    response.headers[
        "Access-Control-Allow-Headers"
    ] = "Content-Type"


    response.headers[
        "Access-Control-Allow-Methods"
    ] = "GET, POST, OPTIONS"


    return response


# =========================================================
# ERROR
# =========================================================

def error(message, code=400):

    return jsonify(
        {
            "error": message
        }
    ), code


# =========================================================
# USER HELPERS
# =========================================================

def user_json(row):

    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "role": row["role"],
        "created_at": row["created_at"],
    }


def get_current_user():

    user_id = session.get(
        "user_id"
    )

    if not user_id:

        return None


    conn = get_db()


    user = conn.execute(
        """
        SELECT
            id,
            name,
            email,
            role,
            created_at

        FROM users

        WHERE id = ?
        """,
        (
            user_id,
        ),
    ).fetchone()


    conn.close()


    return user


# =========================================================
# AUTH MIDDLEWARE
# =========================================================

def login_required(view):

    @wraps(view)
    def wrapped(*args, **kwargs):

        user = get_current_user()

        if not user:

            return error(
                "Authentication required",
                401
            )

        return view(
            *args,
            **kwargs
        )

    return wrapped


def role_required(*allowed_roles):

    def decorator(view):

        @wraps(view)
        def wrapped(*args, **kwargs):

            user = get_current_user()

            if not user:

                return error(
                    "Authentication required",
                    401
                )


            if user["role"] not in allowed_roles:

                return error(
                    "Access denied",
                    403
                )


            return view(
                *args,
                **kwargs
            )

        return wrapped

    return decorator


# =========================================================
# REGISTER
# =========================================================

@app.route(
    "/api/auth/register",
    methods=["POST"]
)
def register():

    data = (
        request.get_json(
            silent=True
        )
        or
        {}
    )


    name = str(
        data.get(
            "name",
            ""
        )
    ).strip()


    email = str(
        data.get(
            "email",
            ""
        )
    ).strip().lower()


    password = str(
        data.get(
            "password",
            ""
        )
    )


    role = str(
        data.get(
            "role",
            ""
        )
    ).strip().lower()


    if not name:

        return error(
            "Name is required"
        )


    if not email or "@" not in email:

        return error(
            "Enter a valid email address"
        )


    if len(password) < 6:

        return error(
            "Password must be at least 6 characters"
        )


    if role not in ALLOWED_ROLES:

        return error(
            "Role must be donor, driver, or shelter"
        )


    conn = get_db()


    existing = conn.execute(
        """
        SELECT id
        FROM users
        WHERE email = ?
        """,
        (
            email,
        ),
    ).fetchone()


    if existing:

        conn.close()

        return error(
            "An account with this email already exists",
            409
        )


    password_hash = generate_password_hash(
        password
    )


    created_at = datetime.now().isoformat(
        timespec="seconds"
    )


    try:

        cursor = conn.execute(
            """
            INSERT INTO users (
                name,
                email,
                password_hash,
                role,
                created_at
            )

            VALUES (?, ?, ?, ?, ?)
            """,
            (
                name,
                email,
                password_hash,
                role,
                created_at,
            ),
        )


        user_id = cursor.lastrowid


        conn.commit()


        user = conn.execute(
            """
            SELECT
                id,
                name,
                email,
                role,
                created_at

            FROM users

            WHERE id = ?
            """,
            (
                user_id,
            ),
        ).fetchone()


    except sqlite3.IntegrityError:

        conn.rollback()

        conn.close()

        return error(
            "An account with this email already exists",
            409
        )


    conn.close()


    session.clear()

    session.permanent = True

    session["user_id"] = user_id
    session["name"] = name
    session["role"] = role


    return jsonify(
        {
            "ok": True,
            "message": "Account created successfully",
            "user": user_json(user),
        }
    ), 201


# =========================================================
# LOGIN
# =========================================================

@app.route(
    "/api/auth/login",
    methods=["POST"]
)
def login():

    data = (
        request.get_json(
            silent=True
        )
        or
        {}
    )


    email = str(
        data.get(
            "email",
            ""
        )
    ).strip().lower()


    password = str(
        data.get(
            "password",
            ""
        )
    )


    if not email:

        return error(
            "Email is required"
        )


    if not password:

        return error(
            "Password is required"
        )


    conn = get_db()


    user = conn.execute(
        """
        SELECT
            id,
            name,
            email,
            password_hash,
            role,
            created_at

        FROM users

        WHERE email = ?
        """,
        (
            email,
        ),
    ).fetchone()


    conn.close()


    if not user:

        return error(
            "Invalid email or password",
            401
        )


    if not check_password_hash(
        user["password_hash"],
        password
    ):

        return error(
            "Invalid email or password",
            401
        )


    session.clear()

    session.permanent = True

    session["user_id"] = user["id"]
    session["name"] = user["name"]
    session["role"] = user["role"]


    return jsonify(
        {
            "ok": True,
            "message": "Login successful",
            "user": user_json(user),
        }
    )


# =========================================================
# CURRENT USER
# =========================================================

@app.route(
    "/api/auth/me",
    methods=["GET"]
)
def auth_me():

    user = get_current_user()


    if not user:

        return jsonify(
            {
                "authenticated": False,
                "user": None,
            }
        ), 401


    return jsonify(
        {
            "authenticated": True,
            "user": user_json(user),
        }
    )


# =========================================================
# LOGOUT
# =========================================================

@app.route(
    "/api/auth/logout",
    methods=["POST"]
)
def logout():

    session.clear()


    return jsonify(
        {
            "ok": True,
            "message": "Logged out successfully",
        }
    )


# =========================================================
# TIME
# =========================================================

def parse_time(value):

    dt = datetime.fromisoformat(
        str(value).replace(
            "Z",
            "+00:00"
        )
    )


    if dt.tzinfo:

        dt = (
            dt
            .astimezone()
            .replace(
                tzinfo=None
            )
        )


    return dt.replace(
        microsecond=0
    )


# =========================================================
# COORDINATE VALIDATION
# =========================================================

def valid_lat_lng(lat, lng):

    try:

        lat = float(lat)
        lng = float(lng)

    except (
        TypeError,
        ValueError
    ):

        return False


    return (
        -90 <= lat <= 90
        and
        -180 <= lng <= 180
    )


# =========================================================
# DISTANCE
# =========================================================

def haversine_km(
    lat1,
    lng1,
    lat2,
    lng2
):

    lat1_rad = math.radians(
        lat1
    )

    lat2_rad = math.radians(
        lat2
    )


    delta_lat = (
        lat2_rad
        -
        lat1_rad
    )


    delta_lng = math.radians(
        lng2 - lng1
    )


    a = (
        math.sin(
            delta_lat / 2
        ) ** 2

        +

        math.cos(
            lat1_rad
        )

        *

        math.cos(
            lat2_rad
        )

        *

        math.sin(
            delta_lng / 2
        ) ** 2
    )


    return (
        6371
        *
        2
        *
        math.asin(
            math.sqrt(a)
        )
    )


# =========================================================
# NEED LEVEL
# =========================================================

def normalize_need_level(value):

    try:

        level = int(
            value
        )

    except (
        TypeError,
        ValueError
    ):

        level = 2


    return max(
        1,
        min(
            3,
            level
        )
    )


# =========================================================
# SMART RESCUE SCORE
# =========================================================

def calculate_rescue_score(
    qty,
    capacity,
    distance_km,
    expires,
    need_level,
    now=None
):

    now = (
        now
        or
        datetime.now()
    )


    drive_minutes = (
        distance_km
        /
        AVG_SPEED_KMPH
        *
        60
    )


    eta_minutes = math.ceil(
        drive_minutes
        +
        SAFETY_BUFFER_MIN
    )


    minutes_until_expiry = (
        expires
        -
        now
    ).total_seconds() / 60


    safety_margin = (
        minutes_until_expiry
        -
        eta_minutes
    )


    distance_score = max(
        0,

        40
        *
        (
            1
            -
            min(
                distance_km,
                20
            )
            /
            20
        )
    )


    capacity_score = (
        min(
            qty / capacity,
            1
        )
        *
        25
    )


    safety_score = max(
        0,

        min(
            15,

            (
                safety_margin
                /
                120
            )
            *
            15
        )
    )


    normalized_need = (
        normalize_need_level(
            need_level
        )
    )


    need_score = (
        normalized_need
        /
        3
        *
        20
    )


    total_score = round(
        distance_score
        +
        capacity_score
        +
        safety_score
        +
        need_score,
        1
    )


    return {
        "score": total_score,

        "eta_minutes": int(
            eta_minutes
        ),

        "safety_margin_min": max(
            0,
            int(
                math.floor(
                    safety_margin
                )
            )
        ),

        "need_level": normalized_need,
    }


# =========================================================
# EXPIRY PRIORITY
# =========================================================

def expiry_priority(expires_at):

    try:

        expires = parse_time(
            expires_at
        )

    except ValueError:

        return {
            "level": "UNKNOWN",
            "minutes_remaining": 0,
            "score": 0,
        }


    minutes = math.ceil(
        (
            expires
            -
            datetime.now()
        ).total_seconds()
        /
        60
    )


    if minutes <= 0:

        return {
            "level": "EXPIRED",
            "minutes_remaining": 0,
            "score": 100,
        }


    if minutes < 30:

        level = "CRITICAL"

    elif minutes < 60:

        level = "HIGH"

    elif minutes < 120:

        level = "MEDIUM"

    else:

        level = "LOW"


    score = min(
        100,
        round(
            6000 / max(
                minutes,
                1
            ),
            1
        )
    )


    return {
        "level": level,
        "minutes_remaining": minutes,
        "score": score,
    }


# =========================================================
# REJECTED SHELTER HELPERS
# =========================================================

def parse_rejected_org_ids(value):

    if not value:

        return set()


    result = set()


    for part in str(value).split(","):

        part = part.strip()


        if part.isdigit():

            result.add(
                int(part)
            )


    return result


def serialize_rejected_org_ids(ids):

    return ",".join(

        str(org_id)

        for org_id in sorted(
            ids
        )

    )


# =========================================================
# NOTIFICATION
# =========================================================

def add_notification(
    conn,
    donation_id,
    audience,
    event_type,
    title,
    message
):

    conn.execute(
        """
        INSERT INTO notifications (
            donation_id,
            audience,
            event_type,
            title,
            message,
            created_at,
            is_read
        )

        VALUES (?, ?, ?, ?, ?, ?, 0)
        """,
        (
            donation_id,
            audience,
            event_type,
            title,
            message,

            datetime.now().isoformat(
                timespec="seconds"
            ),
        ),
    )


# =========================================================
# SMART MATCH ENGINE
# =========================================================

def find_match(
    conn,
    qty,
    lat,
    lng,
    expires,
    exclude_org_ids=None
):

    excluded = set(
        exclude_org_ids
        or
        []
    )


    now = datetime.now()


    minutes_until_expiry = (
        expires
        -
        now
    ).total_seconds() / 60


    if minutes_until_expiry <= 0:

        return None


    best = None


    for org in conn.execute(
        "SELECT * FROM orgs"
    ):

        org_id = org["id"]


        if org_id in excluded:

            continue


        if (
            org["lat"] is None
            or
            org["lng"] is None
        ):

            continue


        capacity = (
            org["capacity_portions"]
            or
            0
        )


        if capacity < qty:

            continue


        distance_km = haversine_km(
            lat,
            lng,
            org["lat"],
            org["lng"]
        )


        drive_minutes = (
            distance_km
            /
            AVG_SPEED_KMPH
            *
            60
        )


        eta_minutes = math.ceil(
            drive_minutes
            +
            SAFETY_BUFFER_MIN
        )


        if (
            eta_minutes
            >
            minutes_until_expiry
        ):

            continue


        score_info = calculate_rescue_score(
            qty=qty,
            capacity=capacity,
            distance_km=distance_km,
            expires=expires,
            need_level=org["need_level"],
            now=now,
        )


        candidate = {
            "org": org,

            "distance_km":
                distance_km,

            "match_score":
                score_info["score"],

            "eta_minutes":
                score_info["eta_minutes"],

            "safety_margin_min":
                score_info[
                    "safety_margin_min"
                ],

            "need_level":
                score_info["need_level"],
        }


        if best is None:

            best = candidate

            continue


        better_score = (
            candidate["match_score"]
            >
            best["match_score"]
        )


        same_score_but_closer = (
            candidate["match_score"]
            ==
            best["match_score"]

            and

            candidate["distance_km"]
            <
            best["distance_km"]
        )


        if (
            better_score
            or
            same_score_but_closer
        ):

            best = candidate


    return best


# =========================================================
# EXPIRE OLD FOOD
# =========================================================

def expire_old(conn):

    conn.execute(
        """
        UPDATE donations

        SET status = 'expired'

        WHERE status IN (
            'posted',
            'matched',
            'accepted'
        )

        AND expires_at < ?
        """,
        (
            datetime.now().isoformat(
                timespec="seconds"
            ),
        ),
    )


    conn.commit()


# =========================================================
# ROUTING FALLBACK
# =========================================================

def fallback_route(points):

    total_distance_km = 0

    legs = []


    for index in range(
        len(points) - 1
    ):

        first = points[index]
        second = points[index + 1]


        distance = haversine_km(
            first["lat"],
            first["lng"],
            second["lat"],
            second["lng"]
        )


        total_distance_km += distance


        duration_seconds = (
            distance
            /
            AVG_SPEED_KMPH
            *
            3600
        )


        legs.append(
            {
                "distance":
                    distance
                    *
                    1000,

                "duration":
                    duration_seconds,
            }
        )


    total_duration_seconds = sum(
        leg["duration"]
        for leg in legs
    )


    return {
        "source": "fallback",

        "distance":
            total_distance_km
            *
            1000,

        "duration":
            total_duration_seconds,

        "legs":
            legs,

        "geometry": {
            "type": "LineString",

            "coordinates": [
                [
                    point["lng"],
                    point["lat"]
                ]

                for point in points
            ]
        },
    }


# =========================================================
# OSRM ROUTING
# =========================================================

def get_road_route(points):

    coordinates = ";".join(

        f"{point['lng']},{point['lat']}"

        for point in points
    )


    url = (
        f"{OSRM_BASE_URL.rstrip('/')}"
        f"/route/v1/driving/"
        f"{coordinates}"
        f"?overview=full"
        f"&geometries=geojson"
        f"&steps=false"
    )


    try:

        with urlopen(
            url,
            timeout=8
        ) as response:

            payload = json.loads(
                response.read().decode(
                    "utf-8"
                )
            )


        routes = payload.get(
            "routes",
            []
        )


        if (
            payload.get("code") == "Ok"
            and
            routes
        ):

            route = routes[0]

            return {
                "source": "osrm",

                "distance":
                    route.get(
                        "distance",
                        0
                    ),

                "duration":
                    route.get(
                        "duration",
                        0
                    ),

                "legs":
                    route.get(
                        "legs",
                        []
                    ),

                "geometry":
                    route.get(
                        "geometry"
                    ),
            }


    except (
        URLError,
        HTTPError,
        TimeoutError,
        ValueError,
        json.JSONDecodeError,
    ):

        pass


    # Internet / OSRM down?
    # Demo still works.

    return fallback_route(
        points
    )


# =========================================================
# HEALTH
# =========================================================

@app.route("/")
def health():

    return jsonify(
        {
            "ok": True,

            "message":
                "Surplus-to-Shelter API is running",

            "matching":
                "distance + capacity + safety + recipient need",

            "authentication":
                "Flask session authentication enabled",

            "rbac":
                "donor + shelter + driver role protection enabled",

            "routing":
                "OSRM route optimization with fallback enabled",

            "live_tracking":
                "Driver location tracking enabled",
        }
    )


# =========================================================
# LIVE DRIVER LOCATION
# POST
# DRIVER ONLY
# =========================================================

@app.route(
    "/api/driver/location",
    methods=["POST"]
)
@role_required("driver")
def update_driver_location():

    user = get_current_user()


    data = (
        request.get_json(
            silent=True
        )
        or
        {}
    )


    lat = data.get(
        "lat"
    )

    lng = data.get(
        "lng"
    )


    if not valid_lat_lng(
        lat,
        lng
    ):

        return error(
            "Valid lat and lng are required"
        )


    lat = float(lat)
    lng = float(lng)


    updated_at = datetime.now().isoformat(
        timespec="seconds"
    )


    conn = get_db()


    existing = conn.execute(
        """
        SELECT id

        FROM driver_locations

        WHERE driver_user_id = ?
        """,
        (
            user["id"],
        ),
    ).fetchone()


    if existing:

        conn.execute(
            """
            UPDATE driver_locations

            SET
                driver_name = ?,
                lat = ?,
                lng = ?,
                updated_at = ?

            WHERE driver_user_id = ?
            """,
            (
                user["name"],
                lat,
                lng,
                updated_at,
                user["id"],
            ),
        )

    else:

        conn.execute(
            """
            INSERT INTO driver_locations (
                driver_user_id,
                driver_name,
                lat,
                lng,
                updated_at
            )

            VALUES (?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                user["name"],
                lat,
                lng,
                updated_at,
            ),
        )


    conn.commit()

    conn.close()


    return jsonify(
        {
            "ok": True,

            "driver_user_id":
                user["id"],

            "driver_name":
                user["name"],

            "lat":
                lat,

            "lng":
                lng,

            "updated_at":
                updated_at,
        }
    )


# =========================================================
# LIVE DRIVER LOCATION
# GET
# =========================================================

@app.route(
    "/api/driver/location",
    methods=["GET"]
)
@login_required
def get_driver_location():

    user = get_current_user()

    conn = get_db()


    # Driver sees their own location.
    # Donor/Shelter sees latest active demo driver.

    if user["role"] == "driver":

        row = conn.execute(
            """
            SELECT
                driver_user_id,
                driver_name,
                lat,
                lng,
                updated_at

            FROM driver_locations

            WHERE driver_user_id = ?
            """,
            (
                user["id"],
            ),
        ).fetchone()

    else:

        row = conn.execute(
            """
            SELECT
                driver_user_id,
                driver_name,
                lat,
                lng,
                updated_at

            FROM driver_locations

            ORDER BY updated_at DESC

            LIMIT 1
            """
        ).fetchone()


    conn.close()


    if not row:

        return error(
            "No live driver location available yet",
            404
        )


    return jsonify(
        dict(row)
    )


# =========================================================
# OPTIMIZED ROUTE
# DRIVER -> DONOR -> SHELTER
# =========================================================

@app.route(
    "/api/route/<int:donation_id>",
    methods=["GET"]
)
@role_required("driver")
def optimized_route(
    donation_id
):

    user = get_current_user()

    conn = get_db()


    donation = conn.execute(
        """
        SELECT
            d.id,
            d.donor_name,
            d.food_description,
            d.pickup_address,
            d.lat AS donor_lat,
            d.lng AS donor_lng,
            d.expires_at,
            d.status,
            d.matched_org_id,
            d.driver_name,

            o.name AS shelter_name,
            o.address AS shelter_address,
            o.lat AS shelter_lat,
            o.lng AS shelter_lng

        FROM donations d

        LEFT JOIN orgs o
            ON o.id = d.matched_org_id

        WHERE d.id = ?
        """,
        (
            donation_id,
        ),
    ).fetchone()


    if not donation:

        conn.close()

        return error(
            "Donation not found",
            404
        )


    if donation["status"] not in (
        "accepted",
        "picked_up"
    ):

        conn.close()

        return error(
            "Route is available only for accepted or picked-up donations"
        )


    if not valid_lat_lng(
        donation["donor_lat"],
        donation["donor_lng"]
    ):

        conn.close()

        return error(
            "Donor coordinates are missing"
        )


    if not valid_lat_lng(
        donation["shelter_lat"],
        donation["shelter_lng"]
    ):

        conn.close()

        return error(
            "Shelter coordinates are missing"
        )


    # -----------------------------------------------------
    # DRIVER COORDINATES
    #
    # Frontend may send:
    # ?driver_lat=...&driver_lng=...
    #
    # Otherwise use saved live position.
    # -----------------------------------------------------

    query_driver_lat = request.args.get(
        "driver_lat"
    )

    query_driver_lng = request.args.get(
        "driver_lng"
    )


    if (
        query_driver_lat is not None
        or
        query_driver_lng is not None
    ):

        if not valid_lat_lng(
            query_driver_lat,
            query_driver_lng
        ):

            conn.close()

            return error(
                "Both valid driver_lat and driver_lng are required"
            )


        driver_lat = float(
            query_driver_lat
        )

        driver_lng = float(
            query_driver_lng
        )

        driver_updated_at = (
            datetime.now().isoformat(
                timespec="seconds"
            )
        )

    else:

        driver_location = conn.execute(
            """
            SELECT
                lat,
                lng,
                updated_at

            FROM driver_locations

            WHERE driver_user_id = ?
            """,
            (
                user["id"],
            ),
        ).fetchone()


        if not driver_location:

            conn.close()

            return error(
                "Driver live location not available. "
                "Start location tracking first.",
                404
            )


        driver_lat = float(
            driver_location["lat"]
        )

        driver_lng = float(
            driver_location["lng"]
        )

        driver_updated_at = (
            driver_location[
                "updated_at"
            ]
        )


    donor_point = {
        "lat":
            float(
                donation["donor_lat"]
            ),

        "lng":
            float(
                donation["donor_lng"]
            ),
    }


    shelter_point = {
        "lat":
            float(
                donation["shelter_lat"]
            ),

        "lng":
            float(
                donation["shelter_lng"]
            ),
    }


    driver_point = {
        "lat":
            driver_lat,

        "lng":
            driver_lng,
    }


    # =====================================================
    # STATUS AWARE ROUTING
    # accepted:
    # Driver -> Donor -> Shelter
    #
    # picked_up:
    # Driver -> Shelter
    # =====================================================

    if donation["status"] == "accepted":

        points = [
            driver_point,
            donor_point,
            shelter_point,
        ]

        stage = (
            "en_route_to_pickup"
        )

    else:

        points = [
            driver_point,
            shelter_point,
        ]

        stage = (
            "en_route_to_shelter"
        )


    route = get_road_route(
        points
    )


    legs = route.get(
        "legs",
        []
    )


    # =====================================================
    # ETA
    # =====================================================

    if donation["status"] == "accepted":

        donor_leg = (
            legs[0]
            if len(legs) >= 1
            else
            {}
        )


        shelter_leg = (
            legs[1]
            if len(legs) >= 2
            else
            {}
        )


        eta_to_donor_min = math.ceil(
            donor_leg.get(
                "duration",
                0
            )
            /
            60
        )


        eta_to_shelter_min = math.ceil(
            shelter_leg.get(
                "duration",
                0
            )
            /
            60
        )


        distance_to_donor_km = round(
            donor_leg.get(
                "distance",
                0
            )
            /
            1000,
            2
        )


        donor_to_shelter_km = round(
            shelter_leg.get(
                "distance",
                0
            )
            /
            1000,
            2
        )

    else:

        shelter_leg = (
            legs[0]
            if len(legs) >= 1
            else
            {}
        )


        eta_to_donor_min = None


        eta_to_shelter_min = math.ceil(
            shelter_leg.get(
                "duration",
                0
            )
            /
            60
        )


        distance_to_donor_km = None


        donor_to_shelter_km = round(
            shelter_leg.get(
                "distance",
                0
            )
            /
            1000,
            2
        )


    total_route_time_min = math.ceil(
        route.get(
            "duration",
            0
        )
        /
        60
    )


    total_distance_km = round(
        route.get(
            "distance",
            0
        )
        /
        1000,
        2
    )


    priority = expiry_priority(
        donation["expires_at"]
    )


    route_safe = (
        priority[
            "minutes_remaining"
        ]
        >
        total_route_time_min
    )


    conn.close()


    return jsonify(
        {
            "donation_id":
                donation["id"],

            "status":
                donation["status"],

            "stage":
                stage,

            "routing_source":
                route["source"],

            "driver": {
                "user_id":
                    user["id"],

                "name":
                    user["name"],

                "lat":
                    driver_lat,

                "lng":
                    driver_lng,

                "updated_at":
                    driver_updated_at,
            },

            "donor": {
                "name":
                    donation["donor_name"],

                "address":
                    donation["pickup_address"],

                "lat":
                    donor_point["lat"],

                "lng":
                    donor_point["lng"],
            },

            "shelter": {
                "id":
                    donation["matched_org_id"],

                "name":
                    donation["shelter_name"],

                "address":
                    donation[
                        "shelter_address"
                    ],

                "lat":
                    shelter_point["lat"],

                "lng":
                    shelter_point["lng"],
            },

            "eta": {
                "to_donor_min":
                    eta_to_donor_min,

                "donor_to_shelter_min":
                    eta_to_shelter_min,

                "total_route_time_min":
                    total_route_time_min,
            },

            "distance": {
                "to_donor_km":
                    distance_to_donor_km,

                "donor_to_shelter_km":
                    donor_to_shelter_km,

                "total_km":
                    total_distance_km,
            },

            "expiry": {
                "expires_at":
                    donation[
                        "expires_at"
                    ],

                "priority":
                    priority["level"],

                "priority_score":
                    priority["score"],

                "minutes_remaining":
                    priority[
                        "minutes_remaining"
                    ],

                "route_safe":
                    route_safe,
            },

            "route": {
                "type":
                    "Feature",

                "properties": {
                    "source":
                        route["source"]
                },

                "geometry":
                    route["geometry"],
            },
        }
    )


# =========================================================
# CREATE DONATION
# DONOR ONLY
# =========================================================

@app.route(
    "/api/donations",
    methods=["POST"]
)
@role_required("donor")
def create_donation():

    user = get_current_user()


    data = (
        request.get_json(
            silent=True
        )
        or
        {}
    )


    required = [
        "food_description",
        "quantity_portions",
        "pickup_address",
        "lat",
        "lng",
        "expires_at",
    ]


    missing = [
        field

        for field in required

        if data.get(field)
        in (
            None,
            ""
        )
    ]


    if missing:

        return error(
            "Missing fields: "
            +
            ", ".join(
                missing
            )
        )


    try:

        qty = int(
            data[
                "quantity_portions"
            ]
        )

        lat = float(
            data["lat"]
        )

        lng = float(
            data["lng"]
        )

    except (
        TypeError,
        ValueError
    ):

        return error(
            "quantity_portions must be a whole number, "
            "and lat/lng must be numbers"
        )


    if qty <= 0:

        return error(
            "quantity_portions must be at least 1"
        )


    if not valid_lat_lng(
        lat,
        lng
    ):

        return error(
            "Invalid donation coordinates"
        )


    try:

        expires = parse_time(
            data[
                "expires_at"
            ]
        )

    except ValueError:

        return error(
            "expires_at must look like "
            "2026-09-24T18:00:00"
        )


    if expires <= datetime.now():

        return error(
            "expires_at is in the past"
        )


    donor_name = user["name"]

    donor_user_id = user["id"]


    conn = get_db()


    match = find_match(
        conn=conn,
        qty=qty,
        lat=lat,
        lng=lng,
        expires=expires,
    )


    if match:

        org_id = (
            match[
                "org"
            ]["id"]
        )

        matched_org_name = (
            match[
                "org"
            ]["name"]
        )

        distance_km = round(
            match[
                "distance_km"
            ],
            1
        )

        match_score = (
            match[
                "match_score"
            ]
        )

        eta_minutes = (
            match[
                "eta_minutes"
            ]
        )

        safety_margin_min = (
            match[
                "safety_margin_min"
            ]
        )

        status = "matched"

    else:

        org_id = None
        matched_org_name = None
        distance_km = None
        match_score = None
        eta_minutes = None
        safety_margin_min = None
        status = "posted"


    cur = conn.execute(
        """
        INSERT INTO donations (
            donor_name,
            donor_user_id,
            food_description,
            quantity_portions,
            pickup_address,
            lat,
            lng,
            expires_at,
            status,
            matched_org_id,
            distance_km,
            created_at,
            match_score,
            eta_minutes,
            safety_margin_min,
            rejected_org_ids
        )

        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?, ?
        )
        """,
        (
            donor_name,

            donor_user_id,

            str(
                data[
                    "food_description"
                ]
            ).strip(),

            qty,

            str(
                data[
                    "pickup_address"
                ]
            ).strip(),

            lat,

            lng,

            expires.isoformat(
                timespec="seconds"
            ),

            status,

            org_id,

            distance_km,

            datetime.now().isoformat(
                timespec="seconds"
            ),

            match_score,

            eta_minutes,

            safety_margin_min,

            "",
        ),
    )


    donation_id = (
        cur.lastrowid
    )


    if match:

        need_level = normalize_need_level(
            match["org"]["need_level"]
        )


        need_text = {
            1: "Low",
            2: "Medium",
            3: "High",
        }[
            need_level
        ]


        add_notification(
            conn,
            donation_id,
            "all",
            "matched",
            "Smart Match Found",
            (
                f"{qty} portions from "
                f"{donor_name} "
                f"matched with "
                f"{matched_org_name} "
                f"({need_text} recipient need)."
            ),
        )

    else:

        add_notification(
            conn,
            donation_id,
            "all",
            "posted",
            "Donation Posted",
            (
                f"{qty} portions from "
                f"{donor_name} "
                f"are waiting for an "
                f"eligible shelter."
            ),
        )


    conn.commit()


    row = conn.execute(
        DONATION_SELECT
        +
        " WHERE d.id = ?",
        (
            donation_id,
        ),
    ).fetchone()


    conn.close()


    return jsonify(
        dict(row)
    )


# =========================================================
# GET DONATIONS
# =========================================================

@app.route(
    "/api/donations",
    methods=["GET"]
)
def list_donations():

    conn = get_db()

    expire_old(
        conn
    )


    sql = (
        DONATION_SELECT
        +
        " WHERE 1=1"
    )


    params = []


    org_id = request.args.get(
        "org_id"
    )


    status = request.args.get(
        "status"
    )


    if org_id:

        sql += (
            " AND d.matched_org_id = ?"
        )

        params.append(
            org_id
        )


    if status:

        sql += (
            " AND d.status = ?"
        )

        params.append(
            status
        )


    sql += (
        " ORDER BY d.id DESC"
    )


    rows = conn.execute(
        sql,
        params,
    ).fetchall()


    conn.close()


    return jsonify(
        [
            dict(row)
            for row in rows
        ]
    )


# =========================================================
# UPDATE STATUS
# =========================================================

@app.route(
    "/api/donations/<int:donation_id>/status",
    methods=["POST"],
)
@role_required(
    "shelter",
    "driver"
)
def update_status(
    donation_id
):

    user = get_current_user()


    data = (
        request.get_json(
            silent=True
        )
        or
        {}
    )


    new_status = data.get(
        "status"
    )


    if not new_status:

        return error(
            "Missing field: status"
        )


    conn = get_db()


    row = conn.execute(
        """
        SELECT *

        FROM donations

        WHERE id = ?
        """,
        (
            donation_id,
        ),
    ).fetchone()


    if not row:

        conn.close()

        return error(
            "Donation not found",
            404
        )


    current_status = row[
        "status"
    ]


    # =====================================================
    # ROLE SECURITY
    # =====================================================

    if (
        current_status == "matched"
        and
        new_status in {
            "accepted",
            "rejected"
        }
    ):

        if user["role"] != "shelter":

            conn.close()

            return error(
                "Only a shelter account can accept or reject a matched donation",
                403
            )


    elif (
        current_status == "accepted"
        and
        new_status == "picked_up"
    ):

        if user["role"] != "driver":

            conn.close()

            return error(
                "Only a driver account can mark food as picked up",
                403
            )


    elif (
        current_status == "picked_up"
        and
        new_status == "delivered"
    ):

        if user["role"] != "driver":

            conn.close()

            return error(
                "Only a driver account can mark food as delivered",
                403
            )


        existing_driver = row[
            "driver_name"
        ]


        if (
            existing_driver
            and
            existing_driver != user["name"]
        ):

            conn.close()

            return error(
                "This rescue is assigned to another driver",
                403
            )


    if new_status == current_status:

        conn.close()

        return jsonify(
            {
                "id": donation_id,
                "status": current_status,
            }
        )


    # =====================================================
    # AUTO REMATCH
    # =====================================================

    if (
        current_status == "matched"
        and
        new_status == "rejected"
    ):

        rejected_ids = parse_rejected_org_ids(
            row["rejected_org_ids"]
        )


        current_org_id = row[
            "matched_org_id"
        ]


        current_org_name = None


        if current_org_id is not None:

            current_org = conn.execute(
                """
                SELECT name
                FROM orgs
                WHERE id = ?
                """,
                (
                    current_org_id,
                ),
            ).fetchone()


            if current_org:

                current_org_name = (
                    current_org[
                        "name"
                    ]
                )


            rejected_ids.add(
                int(
                    current_org_id
                )
            )


        try:

            expires = parse_time(
                row[
                    "expires_at"
                ]
            )

        except ValueError:

            conn.close()

            return error(
                "Donation expiry time is invalid"
            )


        if (
            row["lat"] is None
            or
            row["lng"] is None
        ):

            conn.close()

            return error(
                "Donation location is missing"
            )


        match = find_match(
            conn=conn,

            qty=int(
                row[
                    "quantity_portions"
                ]
            ),

            lat=float(
                row["lat"]
            ),

            lng=float(
                row["lng"]
            ),

            expires=expires,

            exclude_org_ids=
                rejected_ids,
        )


        rejected_text = serialize_rejected_org_ids(
            rejected_ids
        )


        if match:

            new_org = match[
                "org"
            ]


            conn.execute(
                """
                UPDATE donations

                SET
                    status = 'matched',
                    matched_org_id = ?,
                    distance_km = ?,
                    match_score = ?,
                    eta_minutes = ?,
                    safety_margin_min = ?,
                    rejected_org_ids = ?

                WHERE id = ?
                """,
                (
                    new_org["id"],

                    round(
                        match[
                            "distance_km"
                        ],
                        1
                    ),

                    match[
                        "match_score"
                    ],

                    match[
                        "eta_minutes"
                    ],

                    match[
                        "safety_margin_min"
                    ],

                    rejected_text,

                    donation_id,
                ),
            )


            need_level = normalize_need_level(
                new_org[
                    "need_level"
                ]
            )


            need_text = {
                1: "Low",
                2: "Medium",
                3: "High",
            }[
                need_level
            ]


            add_notification(
                conn,
                donation_id,
                "all",
                "rematched",
                "Donation Auto Re-Matched",
                (
                    f"{current_org_name or 'Previous shelter'} "
                    f"rejected the donation. "
                    f"It was automatically reassigned to "
                    f"{new_org['name']} "
                    f"({need_text} recipient need)."
                ),
            )


            conn.commit()


            updated = conn.execute(
                DONATION_SELECT
                +
                " WHERE d.id = ?",
                (
                    donation_id,
                ),
            ).fetchone()


            conn.close()


            result = dict(
                updated
            )


            result["rematched"] = True

            result["message"] = (
                "Donation was automatically rematched "
                "to the next-best eligible shelter."
            )


            return jsonify(
                result
            )


        conn.execute(
            """
            UPDATE donations

            SET
                status = 'rejected',
                matched_org_id = NULL,
                distance_km = NULL,
                match_score = NULL,
                eta_minutes = NULL,
                safety_margin_min = NULL,
                rejected_org_ids = ?

            WHERE id = ?
            """,
            (
                rejected_text,
                donation_id,
            ),
        )


        add_notification(
            conn,
            donation_id,
            "all",
            "unmatched",
            "No Alternate Shelter",
            (
                f"{current_org_name or 'The matched shelter'} "
                f"rejected the donation and no other "
                f"eligible shelter is currently available."
            ),
        )


        conn.commit()

        conn.close()


        return jsonify(
            {
                "id": donation_id,

                "status":
                    "rejected",

                "rematched":
                    False,

                "message":
                    "No other eligible shelter was found.",
            }
        )


    # =====================================================
    # NORMAL FLOW
    # =====================================================

    allowed = TRANSITIONS.get(
        current_status,
        set()
    )


    if new_status not in allowed:

        conn.close()

        return error(
            f"Cannot change status from "
            f"'{current_status}' "
            f"to '{new_status}'"
        )


    driver_name_to_set = None


    if new_status == "picked_up":

        driver_name_to_set = user[
            "name"
        ]


    conn.execute(
        """
        UPDATE donations

        SET
            status = ?,

            driver_name =
                COALESCE(
                    ?,
                    driver_name
                )

        WHERE id = ?
        """,
        (
            new_status,
            driver_name_to_set,
            donation_id,
        ),
    )


    org_name = None


    if row[
        "matched_org_id"
    ] is not None:

        org = conn.execute(
            """
            SELECT name

            FROM orgs

            WHERE id = ?
            """,
            (
                row[
                    "matched_org_id"
                ],
            ),
        ).fetchone()


        if org:

            org_name = org[
                "name"
            ]


    qty = row[
        "quantity_portions"
    ]


    donor_name = row[
        "donor_name"
    ]


    if new_status == "accepted":

        add_notification(
            conn,
            donation_id,
            "all",
            "accepted",
            "Donation Accepted",
            (
                f"{org_name or 'The shelter'} "
                f"accepted {qty} portions from "
                f"{donor_name}. "
                f"A driver can now pick it up."
            ),
        )


    elif new_status == "picked_up":

        add_notification(
            conn,
            donation_id,
            "all",
            "picked_up",
            "Food Picked Up",
            (
                f"{qty} portions from "
                f"{donor_name} have been picked up "
                f"by {user['name']} "
                f"and are on the way to "
                f"{org_name or 'the shelter'}."
            ),
        )


    elif new_status == "delivered":

        add_notification(
            conn,
            donation_id,
            "all",
            "delivered",
            "Rescue Completed",
            (
                f"{qty} portions from "
                f"{donor_name} were successfully delivered "
                f"to {org_name or 'the shelter'}."
            ),
        )


    conn.commit()

    conn.close()


    return jsonify(
        {
            "id":
                donation_id,

            "status":
                new_status,
        }
    )


# =========================================================
# GET SHELTERS
# =========================================================

@app.route(
    "/api/orgs",
    methods=["GET"]
)
def list_orgs():

    conn = get_db()


    rows = conn.execute(
        """
        SELECT
            id,
            name,
            address,
            lat,
            lng,
            capacity_portions,
            need_level

        FROM orgs

        ORDER BY id
        """
    ).fetchall()


    conn.close()


    return jsonify(
        [
            dict(row)
            for row in rows
        ]
    )


# =========================================================
# UPDATE SHELTER NEED
# =========================================================

@app.route(
    "/api/orgs/<int:org_id>/need",
    methods=["POST"],
)
@role_required("shelter")
def update_org_need(
    org_id
):

    data = (
        request.get_json(
            silent=True
        )
        or
        {}
    )


    try:

        need_level = int(
            data.get(
                "need_level"
            )
        )

    except (
        TypeError,
        ValueError
    ):

        return error(
            "need_level must be 1, 2, or 3"
        )


    if need_level not in (
        1,
        2,
        3
    ):

        return error(
            "need_level must be 1, 2, or 3"
        )


    conn = get_db()


    org = conn.execute(
        """
        SELECT
            id,
            name

        FROM orgs

        WHERE id = ?
        """,
        (
            org_id,
        ),
    ).fetchone()


    if not org:

        conn.close()

        return error(
            "Shelter not found",
            404
        )


    conn.execute(
        """
        UPDATE orgs

        SET need_level = ?

        WHERE id = ?
        """,
        (
            need_level,
            org_id,
        ),
    )


    conn.commit()

    conn.close()


    return jsonify(
        {
            "id":
                org_id,

            "name":
                org["name"],

            "need_level":
                need_level,

            "need_label":
                {
                    1: "Low",
                    2: "Medium",
                    3: "High",
                }[
                    need_level
                ],
        }
    )


# =========================================================
# STATS
# =========================================================

@app.route(
    "/api/stats",
    methods=["GET"]
)
def stats():

    conn = get_db()

    expire_old(
        conn
    )


    meals = conn.execute(
        """
        SELECT
            COALESCE(
                SUM(
                    quantity_portions
                ),
                0
            )

        FROM donations

        WHERE status = 'delivered'
        """
    ).fetchone()[0]


    active = conn.execute(
        """
        SELECT COUNT(*)

        FROM donations

        WHERE status IN (
            'matched',
            'accepted',
            'picked_up'
        )
        """
    ).fetchone()[0]


    orgs = conn.execute(
        """
        SELECT COUNT(*)
        FROM orgs
        """
    ).fetchone()[0]


    unread_notifications = conn.execute(
        """
        SELECT COUNT(*)

        FROM notifications

        WHERE is_read = 0
        """
    ).fetchone()[0]


    live_drivers = conn.execute(
        """
        SELECT COUNT(*)

        FROM driver_locations
        """
    ).fetchone()[0]


    conn.close()


    return jsonify(
        {
            "total_meals_saved":
                meals,

            "active_donations":
                active,

            "total_orgs":
                orgs,

            "live_drivers":
                live_drivers,

            "co2_saved_kg":
                round(
                    meals
                    *
                    KG_PER_PORTION
                    *
                    CO2E_PER_KG,
                    1
                ),

            "unread_notifications":
                unread_notifications,
        }
    )


# =========================================================
# NOTIFICATIONS
# =========================================================

@app.route(
    "/api/notifications",
    methods=["GET"]
)
@login_required
def list_notifications():

    conn = get_db()


    audience = request.args.get(
        "audience"
    )


    try:

        limit = int(
            request.args.get(
                "limit",
                50
            )
        )

    except ValueError:

        limit = 50


    limit = max(
        1,
        min(
            limit,
            100
        )
    )


    sql = """
        SELECT
            id,
            donation_id,
            audience,
            event_type,
            title,
            message,
            created_at,
            is_read

        FROM notifications

        WHERE 1=1
    """


    params = []


    if audience:

        sql += (
            " AND "
            "(audience = ? OR audience = 'all')"
        )

        params.append(
            audience
        )


    sql += (
        " ORDER BY id DESC LIMIT ?"
    )


    params.append(
        limit
    )


    rows = conn.execute(
        sql,
        params,
    ).fetchall()


    conn.close()


    return jsonify(
        [
            dict(row)
            for row in rows
        ]
    )


@app.route(
    "/api/notifications/<int:notification_id>/read",
    methods=["POST"],
)
@login_required
def mark_notification_read(
    notification_id
):

    conn = get_db()


    row = conn.execute(
        """
        SELECT id

        FROM notifications

        WHERE id = ?
        """,
        (
            notification_id,
        ),
    ).fetchone()


    if not row:

        conn.close()

        return error(
            "Notification not found",
            404
        )


    conn.execute(
        """
        UPDATE notifications

        SET is_read = 1

        WHERE id = ?
        """,
        (
            notification_id,
        ),
    )


    conn.commit()

    conn.close()


    return jsonify(
        {
            "id":
                notification_id,

            "is_read":
                True,
        }
    )


@app.route(
    "/api/notifications/read-all",
    methods=["POST"]
)
@login_required
def mark_all_notifications_read():

    conn = get_db()


    conn.execute(
        """
        UPDATE notifications

        SET is_read = 1

        WHERE is_read = 0
        """
    )


    conn.commit()

    conn.close()


    return jsonify(
        {
            "ok": True
        }
    )


# =========================================================
# DEMO RESET
# =========================================================

@app.route(
    "/api/demo-reset",
    methods=["POST"]
)
@login_required
def demo_reset():

    data = (
        request.get_json(
            silent=True
        )
        or
        {}
    )


    confirm = str(
        data.get(
            "confirm",
            ""
        )
    ).strip()


    if confirm != "RESET_DEMO":

        return error(
            "Reset blocked. "
            "Send confirm='RESET_DEMO' "
            "to clear demo data.",
            400
        )


    conn = get_db()


    donation_count = conn.execute(
        """
        SELECT COUNT(*)
        FROM donations
        """
    ).fetchone()[0]


    notification_count = conn.execute(
        """
        SELECT COUNT(*)
        FROM notifications
        """
    ).fetchone()[0]


    shelter_count = conn.execute(
        """
        SELECT COUNT(*)
        FROM orgs
        """
    ).fetchone()[0]


    try:

        conn.execute(
            "BEGIN"
        )


        conn.execute(
            """
            DELETE FROM notifications
            """
        )


        conn.execute(
            """
            DELETE FROM donations
            """
        )


        conn.execute(
            """
            DELETE FROM driver_locations
            """
        )


        conn.execute(
            """
            DELETE FROM sqlite_sequence

            WHERE name IN (
                'donations',
                'notifications',
                'driver_locations'
            )
            """
        )


        conn.commit()


    except Exception:

        conn.rollback()

        conn.close()


        return error(
            "Demo reset failed.",
            500
        )


    conn.close()


    return jsonify(
        {
            "ok":
                True,

            "message":
                "Demo data reset successfully.",

            "deleted_donations":
                donation_count,

            "deleted_notifications":
                notification_count,

            "shelters_preserved":
                shelter_count,

            "next_step":
                "Post a fresh donation to start a clean demo.",
        }
    )


# =========================================================
# INITIALIZE
# =========================================================

init_db()


# =========================================================
# RUN
# =========================================================

if __name__ == "__main__":

    app.run(
        port=5000,
        debug=True
    )
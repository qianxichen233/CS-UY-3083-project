from dateutil import parser


def convertDatetime(time):
    return parser.parse(time).strftime("%Y-%m-%d %H:%M:%S")


def convertDate(date):
    return parser.parse(date).strftime("%Y-%m-%d")


def convertBody(body, format, **kwargs):
    result = {}

    for item in format.keys():
        path = format[item].split(".")

        optional = False
        if item[-1] == "?":
            optional = True
            item = item[:-1]

        value = body
        for subpath in path:
            if subpath in value.keys():
                value = value[subpath]
            elif optional:
                value = None
                break
            else:
                return False

        if kwargs.get("auto_date", None) == True and value is not None:
            if "date_time" in item:
                value = convertDatetime(value)
            elif "date" in item:
                value = convertDate(value)

        result[item] = value

    return result


def convertParams(params, format, **kwargs):
    result = {}

    for item in format.keys():
        path = format[item]

        optional = False
        if item[-1] == "?":
            optional = True
            item = item[:-1]

        if params.get(path) == None:
            if optional:
                continue
            else:
                return False
        else:
            if kwargs.get("auto_date", None) == True:
                if "date_time" in item:
                    result[item] = convertDatetime(params.get(path))
                elif "date" in item:
                    result[item] = convertDate(params.get(path))
                else:
                    result[item] = params.get(path)
            else:
                result[item] = params.get(path)

    return result


def createSqlQuery(scheme: list, fields: dict):
    sql = ""

    for item in scheme:
        if item["name"] not in fields:
            continue

        selector = item["selector"].replace("%s", f"%({item['name']})s")
        sql += " AND " + selector

    return sql


def getStaff(cursor, username, *args):
    select = ""
    if len(args) == 0:
        select = "*"
    else:
        for item in args:
            select += item + ", "
        select = select[:-2]

    cursor.execute(
        """
        SELECT {select}
            FROM airline_staff
            WHERE username = %(username)s
    """.format(
            select=select
        ),
        {"username": username},
    )

    return cursor.fetchall()[0]


def getFlight(cursor, airline, flight_number, departure_date_time):
    cursor.execute(
        """
            SELECT flight.airline_name,flight_number,departure_date_time,departure_airport_code,
                    arrival_date_time,arrival_airport_code,base_price,status,id, seat_number,
                    manufacturing_company,manufacturing_date, age
                    FROM flight JOIN airplane
                    WHERE flight.airline_name=%(airline_name)s
                        AND flight_number=%(flight_number)s
                        AND departure_date_time=%(departure_date_time)s
                        AND airplane.ID = airplane_ID
        """,
        {"airline_name": airline, "flight_number": flight_number, "departure_date_time": departure_date_time},
    )

    result = cursor.fetchall()[0]

    return {
        "airline_name": result[0],
        "flight_number": result[1],
        "departure_date_time": result[2],
        "departure_airport_code": result[3],
        "arrival_date_time": result[4],
        "arrival_airport_code": result[5],
        "base_price": result[6],
        "status": result[7],
        "airplane": {
            "id": result[8],
            "seat_number": result[9],
            "manufacturing_company": result[10],
            "manufacturing_date": result[11],
            "age": result[12],
        },
    }

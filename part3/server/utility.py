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

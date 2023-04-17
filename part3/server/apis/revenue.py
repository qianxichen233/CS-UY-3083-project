from flask import Blueprint, request, jsonify
import utility
from database import getdb
from flask_jwt_extended import get_jwt_identity, jwt_required

revenue_api = Blueprint("revenue_api", __name__)


@revenue_api.route("/", methods=["GET"])
@jwt_required(locations="cookies")
def get_revenue():
    try:
        params = utility.convertParams(
            request.args,
            {
                "airline": "airline",
                "start_month": "start_date",
                "end_month": "end_date",
            },
            auto_date=True,
        )
    except:
        return {"msg": "invalid field"}, 422

    if params == False:
        return {"msg": "missing field"}, 422

    identity = get_jwt_identity()
    if identity["type"] != "staff":
        return {"msg": "Staff Only"}, 403

    with getdb() as mydb:
        cursor = mydb.cursor()

        if utility.getStaff(cursor, get_jwt_identity()["username"], "airline_name")[0] != params["airline"]:
            return {"msg": "airline staff is not authorized to get other airline's information "}, 403

        cursor.execute(
            """
                    SELECT EXTRACT(YEAR_MONTH FROM ticket.purchased_date_time) AS yearmonth,
                        SUM(calculated_price) AS sum
                    FROM ticket
                    WHERE airline_name = %(airline)s
                    HAVING
                        yearmonth >= %(start_month)s
                        AND yearmonth <= %(end_month)s
                """,
            params,
        )

        result = cursor.fetchall()
        cursor.close()

        if len(result) == 0:
            response = {"revenue": 0}
        else:
            response = {"revenue": result[0][1]}

    return response

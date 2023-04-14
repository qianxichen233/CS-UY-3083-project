from flask import Blueprint, request, jsonify
import utility
from database import getdb

revenue_api = Blueprint("revenue_api", __name__)


@revenue_api.route("/", methods=["GET"])
def get_revenue():
    params = utility.convertParams(
        request.args,
        {
            "airline": "airline",
            "start_month": "start_date",
            "end_month": "end_date",
        },
        auto_date=True,
    )

    if params == False:
        return {"msg": "missing field"}, 422

    with getdb() as mydb:
        cursor = mydb.cursor()

        cursor.execute(
            """
                    SELECT EXTRACT(YEAR_MONTH FROM ticket.purchased_date_time) AS yearmonth,
                        Sum(calculated_price) AS count
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
        response = {}
        response["revenue"] = result[0][1]

    return response

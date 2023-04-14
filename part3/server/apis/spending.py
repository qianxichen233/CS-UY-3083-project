from flask import Blueprint, request, jsonify
import utility
from database import getdb

spending_api = Blueprint("spending_api", __name__)


@spending_api.route("/", methods=["GET"])
def get_spending():
    params = utility.convertParams(
        request.args,
        {
            "email": "email",
            "from_month": "from",
            "to_month": "to",
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
                WHERE email = %(email)s
                GROUP BY yearmonth
                HAVING
                    yearmonth >= %(from_month)s
                    AND yearmonth <= %(to_month)s
            """,
            params,
        )

        result = cursor.fetchall()
        cursor.close()

    response = {"costs": []}

    current_date = params["from_month"]
    end_date = utility.nextMonth(params["to_month"])
    while current_date != end_date:
        response["costs"].append(
            {
                "month": current_date,
                "cost": 0,
            }
        )
        current_date = utility.nextMonth(current_date)

    for item in result:
        for month in response["costs"]:
            if month["month"] == str(item[0]):
                month["cost"] = item[1]
                break

    return response

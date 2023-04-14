from flask import Blueprint, request, jsonify
import utility
from database import getdb
import json

airplane_api = Blueprint("airplane_api", __name__)


@airplane_api.route("/", methods=["PUT"])
def create_airplanes():
    body = utility.convertBody(
        json.loads(request.data.decode("UTF-8")),
        {
            "airline_name": "airline_name",
            "seat_number": "seat_number",
            "manufacturing_company": "manufacturing_company",
            "manufacturing_date": "manufacturing_date",
            "age": "age",
        },
        auto_date=True,
    )

    if body == False:
        return {"msg": "missing field"}, 422

    with getdb() as mydb:
        cursor = mydb.cursor()

        try:
            cursor.execute(
                """
                    INSERT INTO airplane(airline_name, seat_number,manufacturing_company,manufacturing_date,age)
                        VALUES ( %(airline_name)s, %(seat_number)s,
                                %(manufacturing_company)s, %(manufacturing_date)s, %(age)s
                                )
                """,
                body,
            )
        except:
            cursor.close()
            return {"msg": "invalid field"}, 409
        mydb.commit()
        cursor.close()

    return {"msg": "success"}

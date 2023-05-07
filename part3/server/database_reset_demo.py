from database import mydb_raw
import re
import sys


def main():
    cursor = mydb_raw.cursor()

    cursor.execute(
        """CREATE DATABASE
                        IF NOT EXISTS
                        air_ticket_reservation""",
        multi=True,
    )

    cursor.execute("USE air_ticket_reservation", multi=True)

    executeSQLFile(cursor, "./database_init/clear.sql")  # delete all tables
    executeSQLFile(cursor, "./database_init/DDL.sql")  # create tables

    mydb_raw.commit()

    executeSQLFile(cursor, "./database_init/demo_inserts/inserts.sql")

    mydb_raw.commit()

    cursor.close()
    mydb_raw.close()


def executeSQLFile(cursor, filename):
    ignorestatement = False  # by default each time we get a ';' that's our cue to execute.
    statement = ""

    for line in open(filename):
        if line.startswith("DELIMITER"):
            if not ignorestatement:
                ignorestatement = True  # disable executing when we get a ';'
                continue
            else:
                ignorestatement = False  # re-enable execution of sql queries on ';'
                line = " ;"  # Rewrite the DELIMITER command to allow the block of sql to execute
        if re.match(r"--", line):  # ignore sql comment lines
            continue
        if (
            not re.search(r"[^-;]+;", line) or ignorestatement
        ):  # keep appending lines that don't end in ';' or DELIMITER has been called
            statement = statement + line
        else:  # when you get a line ending in ';' then exec statement and reset for next statement providing the DELIMITER hasn't been set
            statement = statement + line
            # print("\n\n[DEBUG] Executing SQL statement:\n%s" % (statement))
            try:
                cursor.execute(statement)
                statement = ""
            except cursor.Error as e:
                print(filename + " - Error applying (" + str(e) + ")\nTerminating.")
                sys.exit(1)


if __name__ == "__main__":
    main()

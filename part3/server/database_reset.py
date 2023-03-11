from database import mydb_raw

def main():
    cursor = mydb_raw.cursor()

    cursor.execute("""CREATE DATABASE
                        IF NOT EXISTS
                        air_ticket_reservation""", multi = True)
    
    cursor.execute("USE air_ticket_reservation", multi = True)

    executeSQLFile(cursor, './database_init/clear.sql')
    executeSQLFile(cursor, './database_init/DDL.sql')
    executeSQLFile(cursor, './database_init/inserts.sql')
    
    mydb_raw.commit()

    cursor.close()
    mydb_raw.close()

def executeSQLFile(cursor, filename):
    fd = open(filename, 'r')
    sqlFile = fd.read()
    fd.close()
    sqlCommands = sqlFile.split(';')

    for command in sqlCommands:
        try:
            if command.strip() != '':
                cursor.execute(command)
        except IOError as msg:
            print("Command skipped: ", msg)

if __name__ == '__main__':
    main()
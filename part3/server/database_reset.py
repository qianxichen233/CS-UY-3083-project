from database import mydb

def main():
    cursor = mydb.cursor()

    cursor.execute("""CREATE DATABASE
                        IF NOT EXISTS
                        air_ticket_reservation""", multi = True)
    
    cursor.execute("USE air_ticket_reservation", multi = True)

    executeSQLFile(cursor, './database_init/clear.sql')
    executeSQLFile(cursor, './database_init/DDL.sql')
    executeSQLFile(cursor, './database_init/inserts.sql')
    
    mydb.commit()

    cursor.close()
    mydb.close()

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
/* databaseManager.c
 *
 *
 *
*/

#include <stdio.h>
#include <stdlib.h>
#include <libpq-fe.h>


PGconn *conn;

void dbManager_init()
{
    conn = PQconnectdb("user=admin_433 dbname=vending_machine password=teambato");

     if (PQstatus(conn) == CONNECTION_BAD) {
         fprintf(stderr, "Connection to database failed: %s\n", PQerrorMessage(conn));
     }
}
void dbManager_stop()
{
    PQfinish(conn);
}

void dbManager_insertPurchase(int button)
{
    char drinkCommand[256];
    char purchaseCommand[256];

    //update drinks table
    sprintf(drinkCommand, "UPDATE drinks SET count = count + 1 WHERE col_num =%d", button);
    PGresult *res = PQexec(conn, drinkCommand);


    if (PQresultStatus(res) != PGRES_COMMAND_OK) {
        printf("Error updating drinks table in vending machine database\n");
    }
    PQclear(res);

    //update purchases table
    sprintf(purchaseCommand, "INSERT INTO purchases (col_num) VALUES(%d)", button);
    res = PQexec(conn, purchaseCommand);

    PQclear(res);

    if (PQresultStatus(res) != PGRES_COMMAND_OK) {
        printf("Error updating purchases table in vending machine database\n");
    }
}

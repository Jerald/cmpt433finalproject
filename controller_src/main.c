#include "threadManager.h"
#include "databaseManager.h"

int main(int argc, char **argv)
{
	dbManager_init();

	ThreadManager_init();
    ThreadManager_joinAll();

    dbManager_stop();

	return 0;
}

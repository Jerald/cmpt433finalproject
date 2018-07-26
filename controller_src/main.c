#include "threadManager.h"

int main(int argc, char **argv)
{
	ThreadManager_init();
    ThreadManager_joinAll();
	return 0;
}
